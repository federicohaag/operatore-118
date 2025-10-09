import styles from './Game.module.css';
import Map from '../map/Map';
import { useAppSelector, useAppDispatch } from '../../global-state/hooks';
import { selectRegion, selectDispatchCenter, resetState } from '../../global-state/slices/localization';
import { REGIONS } from '../../model/aggregates';

export default function Game() {
    const dispatch = useAppDispatch();
    const selectedRegionId = useAppSelector(selectRegion);
    const selectedDispatchCenterId = useAppSelector(selectDispatchCenter);

    const selectedRegion = REGIONS.find(r => r.id === selectedRegionId);
    const selectedDispatchCenter = selectedRegion?.dispatchCenters?.find(dc => dc.id === selectedDispatchCenterId);

    // Calculate initial center for map
    const getInitCenter = (): [number, number] => {
        if (selectedDispatchCenter?.latitude && selectedDispatchCenter?.longitude) {
            return [selectedDispatchCenter.latitude, selectedDispatchCenter.longitude];
        }
        // Default to Rome if no dispatch center coordinates are available
        return [41.8719, 12.5674];
    };

    const handleReset = () => {
        dispatch(resetState()); // resetState will sync across windows via localStorage
    };

    return (
        <div className={styles['game-container']}>
            <div className={styles['left-column']}>
                <Map initCenter={getInitCenter()} />
            </div>
            <div className={styles['right-column']}>
                <h1>{selectedRegion?.label || 'Region not found'}</h1>
                <h2>{selectedDispatchCenter?.label || 'Dispatch center not found'}</h2>
                <div className={styles['buttons-container']}>
                    <button 
                        className={styles['button']} 
                        onClick={() => window.open('/hospitals', '_blank', 'width=800,height=600')}
                    >
                        Open Hospitals View
                    </button>
                    <button className={styles['button-reset']} onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}