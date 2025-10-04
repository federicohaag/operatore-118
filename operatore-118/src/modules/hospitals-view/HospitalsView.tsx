import { useAppSelector, selectSelectedRegion } from '../shared-state';
import { REGIONS } from '../../model/aggregates';
import { HospitalClassification, HospitalTraumaLevel } from '../../model/types';
import styles from './HospitalsView.module.css';

function getClassificationLabel(classification: HospitalClassification): string {
    switch (classification) {
        case HospitalClassification.ps: return 'PS';
        case HospitalClassification.dea: return 'DEA';
        case HospitalClassification.eas: return 'EAS';
        default: return '';
    }
}

function getTraumaLevelLabel(traumaLevel: HospitalTraumaLevel | null): string {
    if (!traumaLevel) return '-';
    switch (traumaLevel) {
        case HospitalTraumaLevel.cts: return 'CTS';
        case HospitalTraumaLevel.ctz: return 'CTZ';
        case HospitalTraumaLevel.pst: return 'PST';
        case HospitalTraumaLevel.ott: return 'OTT';
        default: return '-';
    }
}

function SpecialtiesDisplay({ hospitalSpecialties }: { hospitalSpecialties: string[] }) {
    const allSpecialties = [
        'punto-nascita',
        'pediatria', 
        'emodinamica',
        'trauma',
        'stroke-unit',
        'neurochirurgia',
        'rianimazione',
        'psichiatria'
    ];
    
    const labels: { [key: string]: string } = {
        'punto-nascita': 'PN',
        'pediatria': 'PED',
        'emodinamica': 'EMO',
        'trauma': 'TRA',
        'stroke-unit': 'STR',
        'neurochirurgia': 'NCH',
        'rianimazione': 'RIA',
        'psichiatria': 'PSI'
    };

    return (
        <div className={styles.specialtiesContainer}>
            {allSpecialties.map((specialty, index) => {
                const hasSpecialty = hospitalSpecialties.includes(specialty);
                const label = labels[specialty];
                return (
                    <span key={specialty}>
                        <span 
                            className={hasSpecialty ? styles.specialtyActive : styles.specialtyInactive}
                            title={specialty.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        >
                            {label}
                        </span>
                        {index < allSpecialties.length - 1 && <span className={styles.separator}>, </span>}
                    </span>
                );
            })}
        </div>
    );
}

export default function HospitalsView() {
    const selectedRegionId = useAppSelector(selectSelectedRegion);
    const selectedRegion = REGIONS.find(r => r.id === selectedRegionId);

    if (!selectedRegion || selectedRegion.hospitals.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.noData}>
                    {selectedRegion ? 'Nessun ospedale disponibile per questa regione' : 'Seleziona una regione'}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Ospedale</th>
                            <th>Tipo</th>
                            <th>Trauma</th>
                            <th>Posti</th>
                            <th>Specialità</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedRegion.hospitals.map((hospital) => (
                            <tr key={hospital.id}>
                                <td className={styles.hospitalName}>{hospital.name}</td>
                                <td className={styles.classification}>
                                    <span className={`${styles.badge} ${styles[hospital.classification]}`}>
                                        {getClassificationLabel(hospital.classification)}
                                    </span>
                                </td>
                                <td className={styles.traumaLevel}>
                                    <span className={`${styles.badge} ${styles.trauma} ${hospital.traumaLevel ? styles[hospital.traumaLevel] : styles.noTrauma}`}>
                                        {getTraumaLevelLabel(hospital.traumaLevel)}
                                    </span>
                                </td>
                                <td className={styles.maxPatients}>{hospital.maxPatients}</td>
                                <td className={styles.specialties}>
                                    <SpecialtiesDisplay hospitalSpecialties={hospital.specialties} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}