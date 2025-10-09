import styles from './Game.module.css';
import { useAppSelector, useAppDispatch } from '../../global-state/hooks';
import { selectRegion, selectDispatchCenter, resetState } from '../../global-state/slices/localization';
import { REGIONS } from '../../model/aggregates';

export default function Game() {
    const dispatch = useAppDispatch();
    const selectedRegionId = useAppSelector(selectRegion);
    const selectedDispatchCenterId = useAppSelector(selectDispatchCenter);

    const selectedRegion = REGIONS.find(r => r.id === selectedRegionId);
    const selectedDispatchCenter = selectedRegion?.dispatchCenters?.find(dc => dc.id === selectedDispatchCenterId);

    const handleReset = () => {
        dispatch(resetState()); // resetState will sync across windows via localStorage
    };

    return (
        <div className={styles['game-container']}>
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
    );
}