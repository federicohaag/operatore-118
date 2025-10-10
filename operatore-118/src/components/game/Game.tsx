import { useState, useMemo, useEffect, useRef } from 'react';
import styles from './Game.module.css';
import Map from '../map/Map';
import CallTaker from './callTaker/CallTaker';
import Sanitario from './sanitario/Sanitario';
import Logistica from './logistica/Logistica';
import GameClock from './gameClock/GameClock';
import { VirtualClock } from '../../utils/VirtualClock';
import { Scheduler } from '../../utils/Scheduler';
import { CallGenerator } from '../../utils/CallGenerator';
import type { SimContext } from '../../utils/EventQueue';
import { useAppSelector, useAppDispatch } from '../../global-state/hooks';
import { selectRegion, selectDispatchCenter, resetState } from '../../global-state/slices/localization';
import { REGIONS } from '../../model/aggregates';

export default function Game() {
    const [activeTab, setActiveTab] = useState<'chiamate' | 'sanitario' | 'logistica'>('chiamate');
    const dispatch = useAppDispatch();
    
    // Create simulation infrastructure once - initialize immediately
    const infrastructureRef = useRef<{
        virtualClock: VirtualClock;
        simContext: SimContext;
        scheduler: Scheduler;
        callGenerator: CallGenerator;
    } | undefined>(undefined);
    
    // Initialize infrastructure immediately if not exists
    if (!infrastructureRef.current) {
        const virtualClock = new VirtualClock(1.0, true, 0);
        
        const simContext: SimContext = {
            now: () => virtualClock.now(),
            dispatch: dispatch
        };
        
        const scheduler = new Scheduler(virtualClock, simContext);
        const callGenerator = new CallGenerator(scheduler);
        
        infrastructureRef.current = {
            virtualClock,
            simContext,
            scheduler,
            callGenerator
        };
    }
    
    // Update dispatch in simContext
    infrastructureRef.current.simContext.dispatch = dispatch;
    
    const { virtualClock, scheduler, callGenerator } = infrastructureRef.current;
    
    // Manage call generator lifecycle
    useEffect(() => {
        // Only start if not already started
        callGenerator.start();
        
        return () => {
            // Stop but don't dispose scheduler - it will be reused
            callGenerator.stop();
        };
    }, [callGenerator]);
    
    // Cleanup scheduler only on final component unmount
    useEffect(() => {
        const currentScheduler = scheduler;
        return () => {
            // Delay disposal to allow React Strict Mode to remount
            setTimeout(() => {
                currentScheduler.dispose();
            }, 100);
        };
    }, []);
    
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
        dispatch(resetState()); // resetState will sync across windows via localStorage
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
                    {activeTab === 'chiamate' && <CallTaker scheduler={scheduler} />}
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