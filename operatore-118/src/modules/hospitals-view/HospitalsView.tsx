import { useAppSelector } from '../shared-state/hooks';
import { REGIONS } from '../../model/aggregates';
import styles from './HospitalsView.module.css';

export default function HospitalsView() {
    const selectedRegionId = useAppSelector((state: { sharedState: { selectedRegion: string | null } }) => state.sharedState.selectedRegion);
    const region = REGIONS.find(r => r.id === selectedRegionId);

    return (
        <div className={styles.container}>
            <ul>
                {region?.hospitals.map((hospital, index) => (
                    <li key={index}>{hospital.name}</li>
                ))}
            </ul>
        </div>
    );
}