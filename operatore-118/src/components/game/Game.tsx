import { useState, useMemo, useEffect, useRef } from 'react';
import styles from './Game.module.css';
import Map from '../map/Map';
import CallTaker from './callTaker/CallTaker';
import Sanitario from './sanitario/Sanitario';
import Logistica from './logistica/Logistica';
import GameClock from './gameClock/GameClock';
import { VirtualClock } from '../../core/VirtualClock';
import { Scheduler } from '../../core/Scheduler';
import { CallGenerator } from '../../core/CallGenerator';
import type { SimContext } from '../../core/EventQueue';
import { useAppSelector, useAppDispatch } from '../../global-state/hooks';
import { selectRegion, selectDispatchCenter, clearLocalization } from '../../global-state/slices/localization';
import { clearCalls } from '../../global-state/slices/calls';
import { STORAGE_STATE_KEY } from '../../global-state/constants';
import { REGIONS } from '../../model/aggregates';

export default function Game() {
    const [activeTab, setActiveTab] = useState<'chiamate' | 'sanitario' | 'logistica'>('chiamate');
    const dispatch = useAppDispatch();
    
    // Track if component is truly mounted to prevent disposal during Strict Mode
    const isMountedRef = useRef(false);
    
    // Create simulation infrastructure using useState for true stability
    // useState initialization function only runs once, even in Strict Mode
    const [infrastructure] = useState(() => {
        const virtualClock = new VirtualClock(1.0, true, 0);
        
        const simContext: SimContext = {
            now: () => virtualClock.now(),
            dispatch: dispatch
        };
        
        const scheduler = new Scheduler(virtualClock, simContext);
        const callGenerator = new CallGenerator(scheduler);
        
        return {
            virtualClock,
            simContext,
            scheduler,
            callGenerator
        };
    });
    
    const { virtualClock, simContext, scheduler, callGenerator } = infrastructure;
    
    // Keep dispatch in simContext up to date
    useEffect(() => {
        simContext.dispatch = dispatch;
    }, [dispatch, simContext]);
    
    // Manage simulation lifecycle
    useEffect(() => {
        isMountedRef.current = true;
        
        // Start call generator
        callGenerator.start();
        
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
    }, [callGenerator, scheduler]);
    
    const selectedRegionId = useAppSelector(selectRegion);
    const selectedDispatchCenterId = useAppSelector(selectDispatchCenter);

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

    const handleReset = () => {
        // Clear localStorage completely
        localStorage.removeItem(STORAGE_STATE_KEY);
        
        // Reset Redux state to initial values
        dispatch(clearLocalization());
        dispatch(clearCalls());
    };

    return (
        <div className={styles['game-container']}>
            <div className={styles['clock-row']}>
                <GameClock clock={virtualClock} />
            </div>
            <div className={styles['content-row']}>
                <div className={styles['left-column']}>
                    <Map initCenter={initCenter} />
                </div>
                <div className={styles['right-column']}>
                <div className={styles['tabs-header']}>
                    <button 
                        className={`${styles['tab']} ${activeTab === 'chiamate' ? styles['tab-active'] : ''}`}
                        onClick={() => setActiveTab('chiamate')}
                    >
                        Chiamate
                    </button>
                    <button 
                        className={`${styles['tab']} ${activeTab === 'sanitario' ? styles['tab-active'] : ''}`}
                        onClick={() => setActiveTab('sanitario')}
                    >
                        Sanitario
                    </button>
                    <button 
                        className={`${styles['tab']} ${activeTab === 'logistica' ? styles['tab-active'] : ''}`}
                        onClick={() => setActiveTab('logistica')}
                    >
                        Logistica
                    </button>
                </div>

                <div className={styles['tab-content']}>
                    {activeTab === 'chiamate' && <CallTaker />}
                    {activeTab === 'sanitario' && <Sanitario />}
                    {activeTab === 'logistica' && <Logistica />}
                </div>

                <div className={styles['buttons-container']}>
                    <button className={styles['button-reset']} onClick={handleReset}>
                        Reset
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}