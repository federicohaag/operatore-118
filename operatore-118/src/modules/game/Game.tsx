import styles from './Game.module.css';
import { useAppSelector, useAppDispatch } from '../shared-state/hooks';
import { REGIONS } from '../../configurations/regions';
import { resetState } from '../shared-state/sharedStateSlice';

export default function Game() {
    const dispatch = useAppDispatch();
    const selectedRegionId = useAppSelector((state: { sharedState: { selectedRegion: string | null } }) => state.sharedState.selectedRegion);
    const selectedDispatchCenterId = useAppSelector((state: { sharedState: { selectedDispatchCenter: string | null } }) => state.sharedState.selectedDispatchCenter);

    const selectedRegion = REGIONS.find(r => r.id === selectedRegionId);
    const selectedDispatchCenter = selectedRegion?.dispatchCenters?.find(dc => dc.id === selectedDispatchCenterId);

    const handleReset = () => {
        dispatch(resetState());
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