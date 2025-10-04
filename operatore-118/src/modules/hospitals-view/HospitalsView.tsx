import { useAppSelector, selectSelectedRegion } from '../shared-state';
import { REGIONS } from '../../model/aggregates';
import styles from './HospitalsView.module.css';

export default function HospitalsView() {
    const selectedRegionId = useAppSelector(selectSelectedRegion);
    const selectedRegion = REGIONS.find(r => r.id === selectedRegionId);

    return (
        <>
        <h1>{selectedRegion?.label || 'Region not found'}</h1>
        <div className={styles.container}>
            <ul>
                {selectedRegion?.hospitals.map((hospital, index) => (
                    <li key={index}>{hospital.name}</li>
                ))}
            </ul>
        </div>
        </>
    );
}