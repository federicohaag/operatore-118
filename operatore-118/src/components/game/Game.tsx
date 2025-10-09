import { useState, useMemo } from 'react';
import styles from './Game.module.css';
import Map from '../map/Map';
import Chiamate from '../chiamate/Chiamate';
import Sanitario from '../sanitario/Sanitario';
import Logistica from '../logistica/Logistica';
import { useAppSelector, useAppDispatch } from '../../global-state/hooks';
import { selectRegion, selectDispatchCenter, resetState } from '../../global-state/slices/localization';
import { REGIONS } from '../../model/aggregates';

export default function Game() {
    const [activeTab, setActiveTab] = useState<'chiamate' | 'sanitario' | 'logistica'>('chiamate');
    const dispatch = useAppDispatch();
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
                    {activeTab === 'chiamate' && <Chiamate />}
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
    );
}