import { useState, useMemo, useEffect, useRef } from 'react';
import styles from './Game.module.css';
import Map from '../map/Map';
import CallTaker from './callTaker/CallTaker';
import Sanitario from './sanitario/Sanitario';
import Logistica from './logistica/Logistica';
import GameClock from './gameClock/GameClock';
import TextToSpeech, { useTextToSpeech } from '../textToSpeech/TextToSpeech';
import { VirtualClock } from '../../core/VirtualClock';
import { Scheduler } from '../../core/Scheduler';
import { CallGenerator } from '../../core/CallGenerator';
import { AddressGenerator } from '../../core/AddressGenerator';
import { CALL_GENERATOR_CONFIG } from '../../core/config';
import type { SimContext } from '../../core/EventQueue';
import { useAppSelector, useAppDispatch } from '../../core/redux/hooks';
import { selectRegion, selectDispatchCenter, selectCities, selectVehicles, clearSettings, selectTtsEnabled, setTtsEnabled, selectCallEmissionEnabled, setCallEmissionEnabled } from '../../core/redux/slices/settings';
import { clearCalls, selectCalls } from '../../core/redux/slices/calls';
import { selectEvents, clearEvents } from '../../core/redux/slices/events';
import { STORAGE_STATE_KEY } from '../../core/redux/constants';
import { REGIONS } from '../../model/aggregates';
import { extractStations } from '../../model/vehicle';
import type { Station } from '../map/Map';
import phoneRingSound from '../../assets/phone_ring.mp3';

export default function Game() {
    const [activeTab, setActiveTab] = useState<'chiamate' | 'sanitario' | 'logistica'>('chiamate');
    const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
    const dispatch = useAppDispatch();
    const cities = useAppSelector(selectCities);
    const vehicles = useAppSelector(selectVehicles);
    const unprocessedCalls = useAppSelector(selectCalls);
    const events = useAppSelector(selectEvents);
    const ttsEnabled = useAppSelector(selectTtsEnabled);
    const callEmissionEnabled = useAppSelector(selectCallEmissionEnabled);
    const selectedRegionId = useAppSelector(selectRegion);
    const selectedDispatchCenterId = useAppSelector(selectDispatchCenter);
    
    // Text-to-speech functionality (only the speak function, state is in Redux)
    const { speak } = useTextToSpeech();
    
    // Phone ring sound management (independent of active tab)
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const previousCallIdsRef = useRef<Set<string>>(new Set());
    const isInitialMountRef = useRef(true);
    
    // Play phone ring sound when a new call is added (works regardless of active tab)
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(phoneRingSound);
            audioRef.current.loop = false;
        }

        // Detect new calls by comparing call IDs
        const currentCallIds = new Set(unprocessedCalls.map(call => call.id));
        
        // On initial mount, initialize previousCallIdsRef without playing sound
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
            previousCallIdsRef.current = currentCallIds;
            return;
        }
        
        const newCalls = unprocessedCalls.filter(call => !previousCallIdsRef.current.has(call.id));
        
        if (newCalls.length > 0) {
            // A new call arrived, play the sound
            // Stop any currently playing sound first to avoid conflicts
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            audioRef.current.play().catch(err => console.error('Error playing phone ring:', err));
        }
        
        // Update the previous call IDs
        previousCallIdsRef.current = currentCallIds;
    }, [unprocessedCalls]);
    
    const handleTtsToggle = (enabled: boolean) => {
        dispatch(setTtsEnabled(enabled));
    };
    
    const handleCallEmissionToggle = () => {
        const newState = !callEmissionEnabled;
        dispatch(setCallEmissionEnabled(newState));
        
        if (newState) {
            callGenerator.start();
        } else {
            callGenerator.stop();
        }
    };
    
    // Track if component is truly mounted to prevent disposal during Strict Mode
    const isMountedRef = useRef(false);
    const isInitializedRef = useRef(false);
    
    // Create simulation infrastructure using useState to survive React Strict Mode double-mounting
    // This ensures the same instances persist across the unmount/remount cycle in development
    const [infrastructure] = useState(() => {
        const virtualClock = new VirtualClock(1.0, true, 0);
        
        const simContext: SimContext = {
            now: () => virtualClock.now(),
            dispatch: dispatch
        };
        
        const scheduler = new Scheduler(virtualClock, simContext);
        
        // Find selected region and dispatch center
        const selectedRegion = REGIONS.find(r => r.id === selectedRegionId);
        const selectedDispatchCenter = selectedRegion?.dispatchCenters?.find(dc => dc.id === selectedDispatchCenterId);
        
        if (!selectedRegion || !selectedDispatchCenter) {
            throw new Error('Region and dispatch center must be selected before creating AddressGenerator');
        }
        
        // Get cities from dispatch center (not from Redux state which may not be loaded yet)
        const dispatchCenterCities = selectedDispatchCenter.cities || [];
        
        // Address files are now in a global addresses folder
        const addressesPath = '../data/addresses';
        
        const addressGenerator = new AddressGenerator({ 
            cities: dispatchCenterCities,
            addressesPath: addressesPath
        });
        const callGenerator = new CallGenerator(scheduler, CALL_GENERATOR_CONFIG, addressGenerator);
        
        return {
            virtualClock,
            simContext,
            scheduler,
            addressGenerator,
            callGenerator
        };
    });
    
    const { virtualClock, simContext, scheduler, callGenerator, addressGenerator } = infrastructure;
    
    // Expose to window for debugging (development only)
    useEffect(() => {
        if (import.meta.env.DEV) {
            (window as any).__addressGenerator = addressGenerator;
            (window as any).__scheduler = scheduler;
            (window as any).__virtualClock = virtualClock;
        }
        
        return () => {
            if (import.meta.env.DEV) {
                delete (window as any).__addressGenerator;
                delete (window as any).__scheduler;
                delete (window as any).__virtualClock;
            }
        };
    }, [addressGenerator, scheduler, virtualClock]);
    
    // Keep dispatch in simContext up to date
    useEffect(() => {
        simContext.dispatch = dispatch;
    }, [dispatch, simContext]);
    
    // Manage simulation lifecycle
    useEffect(() => {
        isMountedRef.current = true;
        
        // Use queueMicrotask to delay start until after React Strict Mode's double-mount
        // This ensures we only start once, not during the first mount that gets immediately unmounted
        queueMicrotask(async () => {
            if (isMountedRef.current && !isInitializedRef.current) {
                isInitializedRef.current = true;
                
                // Only start call generator if cities are configured
                if (cities.length > 0) {
                    try {
                        // Initialize address generator before starting call generator
                        await addressGenerator.initialize();
                        callGenerator.start();
                    } catch (error) {
                        console.error('Failed to initialize AddressGenerator:', error);
                    }
                } else {
                    console.warn('CallGenerator not started: no cities configured.');
                }
            }
        });
        
        // Cleanup function
        return () => {
            // Stop call generator
            callGenerator.stop();
            
            // Only dispose scheduler if component is truly unmounting
            // Set mounted to false and check after a tick
            isMountedRef.current = false;
            
            // Use queueMicrotask to check after React finishes its work
            queueMicrotask(() => {
                // If still not mounted after microtask, we're truly unmounting
                if (!isMountedRef.current) {
                    scheduler.dispose();
                }
            });
        };
    }, [callGenerator, scheduler, cities]);

    const selectedRegion = REGIONS.find(r => r.id === selectedRegionId);
    const selectedDispatchCenter = selectedRegion?.dispatchCenters?.find(dc => dc.id === selectedDispatchCenterId);

    // Memoize initial center for map to prevent re-renders
    const initCenter = useMemo((): [number, number] => {
        if (selectedDispatchCenter?.latitude && selectedDispatchCenter?.longitude) {
            return [selectedDispatchCenter.latitude, selectedDispatchCenter.longitude];
        }
        // Default to Rome if no dispatch center coordinates are available
        return [41.8719, 12.5674];
    }, [selectedDispatchCenter?.latitude, selectedDispatchCenter?.longitude]);

    // Extract unique stations from vehicles for map display
    const stations = useMemo((): Station[] => {
        const extractedStations = extractStations(vehicles).map(station => ({
            name: station.name,
            coordinates: [station.coordinates.latitude, station.coordinates.longitude] as [number, number]
        }));
        return extractedStations;
    }, [vehicles]);

    const handleReset = () => {
        // Clear localStorage completely
        localStorage.removeItem(STORAGE_STATE_KEY);
        
        // Reset Redux state to initial values
        dispatch(clearSettings());
        dispatch(clearCalls());
        dispatch(clearEvents());
    };

    return (
        <div className={styles['game-container']}>
            <div className={styles['clock-row']}>
                <GameClock clock={virtualClock} />
                <button 
                    className={`${styles['toggle-button']} ${callEmissionEnabled ? styles['enabled'] : ''}`}
                    onClick={handleCallEmissionToggle}
                    title={callEmissionEnabled ? 'Stop new calls' : 'Resume new calls'}
                >
                    <span className={styles['toggle-icon']}>
                        {callEmissionEnabled ? '📞' : '🚫'}
                    </span>
                    <span className={styles['toggle-label']}>Calls</span>
                </button>
                <TextToSpeech enabled={ttsEnabled} onToggle={handleTtsToggle} />
                <button className={styles['button-reset']} onClick={handleReset}>
                    Reset
                </button>
            </div>
                        <div className={styles['content-row']}>
                <div className={styles['left-column']}>
                    <Map initCenter={initCenter} center={mapCenter} stations={stations} />
                </div>
                <div className={styles['right-column']}>
                <div className={styles['tabs-header']}>
                    <button 
                        className={`${styles['tab']} ${activeTab === 'chiamate' ? styles['tab-active'] : ''}`}
                        onClick={() => setActiveTab('chiamate')}
                    >
                        Call Taker <span className={styles['counter-badge']}>{unprocessedCalls.length}</span>
                    </button>
                    <button 
                        className={`${styles['tab']} ${activeTab === 'sanitario' ? styles['tab-active'] : ''}`}
                        onClick={() => setActiveTab('sanitario')}
                    >
                        Sanitario <span className={styles['counter-badge']}>0</span>
                    </button>
                    <button 
                        className={`${styles['tab']} ${activeTab === 'logistica' ? styles['tab-active'] : ''}`}
                        onClick={() => setActiveTab('logistica')}
                    >
                        Logistica <span className={styles['counter-badge']}>{events.length}</span>
                    </button>
                </div>

                <div className={styles['tab-content']}>
                    {activeTab === 'chiamate' && <CallTaker clock={virtualClock} onCallSelect={setMapCenter} onSpeak={ttsEnabled ? speak : undefined} />}
                    {activeTab === 'sanitario' && <Sanitario />}
                    {activeTab === 'logistica' && <Logistica />}
                </div>
                </div>
            </div>
        </div>
    );
}