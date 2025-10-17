import { useAppSelector } from '../../../../redux/hooks';
import { selectRegion } from '../../../../redux/slices/localization';
import { REGIONS } from '../../../../model/aggregates';
import { HospitalClassification, HospitalTraumaLevel } from '../../../../model/hospital';
import { useState, useMemo, useEffect, useRef } from 'react';
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
    const selectedRegionId = useAppSelector(selectRegion);
    const selectedRegion = REGIONS.find(r => r.id === selectedRegionId);
    
    // Filter states
    const [nameFilter, setNameFilter] = useState('');
    const [classificationFilter, setClassificationFilter] = useState<string>('all');
    const [traumaFilter, setTraumaFilter] = useState<string>('all');
    const [specialtyFilters, setSpecialtyFilters] = useState<string[]>([]);
    const [specialtyDropdownOpen, setSpecialtyDropdownOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Filtered hospitals
    const filteredHospitals = useMemo(() => {
        if (!selectedRegion) return [];
        
        return selectedRegion.hospitals.filter(hospital => {
            // Name filter
            if (nameFilter && !hospital.name.toLowerCase().includes(nameFilter.toLowerCase())) {
                return false;
            }
            
            // Classification filter
            if (classificationFilter !== 'all' && hospital.classification !== classificationFilter) {
                return false;
            }
            
            // Trauma level filter
            if (traumaFilter !== 'all') {
                if (traumaFilter === 'none' && hospital.traumaLevel !== null) {
                    return false;
                }
                if (traumaFilter !== 'none' && hospital.traumaLevel !== traumaFilter) {
                    return false;
                }
            }
            
            // Specialty filters (multiple selections)
            if (specialtyFilters.length > 0) {
                const hasAllSelectedSpecialties = specialtyFilters.every(specialty => 
                    hospital.specialties.includes(specialty as any)
                );
                if (!hasAllSelectedSpecialties) {
                    return false;
                }
            }
            
            return true;
        });
    }, [selectedRegion, nameFilter, classificationFilter, traumaFilter, specialtyFilters]);

    const handleSpecialtyToggle = (specialty: string) => {
        setSpecialtyFilters(prev => {
            if (prev.includes(specialty)) {
                return prev.filter(s => s !== specialty);
            } else {
                return [...prev, specialty];
            }
        });
    };

    const handleDropdownToggle = () => {
        setSpecialtyDropdownOpen(!specialtyDropdownOpen);
    };

    const clearAllFilters = () => {
        setNameFilter('');
        setClassificationFilter('all');
        setTraumaFilter('all');
        setSpecialtyFilters([]);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (specialtyDropdownOpen) {
                const dropdown = document.querySelector(`.${styles.specialtyDropdown}`);
                const button = buttonRef.current;
                
                const target = event.target as Node;
                const isClickInsideButton = button && button.contains(target);
                const isClickInsideDropdown = dropdown && dropdown.contains(target);
                
                if (!isClickInsideButton && !isClickInsideDropdown) {
                    setSpecialtyDropdownOpen(false);
                }
            }
        };

        if (specialtyDropdownOpen) {
            // Add delay to prevent immediate closing when opening
            setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 0);
            
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [specialtyDropdownOpen]);

    const hasActiveFilters = nameFilter || classificationFilter !== 'all' || traumaFilter !== 'all' || specialtyFilters.length > 0;

    if (!selectedRegion) {
        return (
            <div className={styles.container}>
                <div className={styles.noData}>
                    Seleziona una regione
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {filteredHospitals.length === 0 && selectedRegion.hospitals.length > 0 ? (
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
                            <tr className={styles.filterRow}>
                                <th>
                                    <input
                                        type="text"
                                        placeholder="Cerca..."
                                        value={nameFilter}
                                        onChange={(e) => setNameFilter(e.target.value)}
                                        className={styles.headerFilterInput}
                                    />
                                </th>
                                <th>
                                    <select
                                        value={classificationFilter}
                                        onChange={(e) => setClassificationFilter(e.target.value)}
                                        className={styles.headerFilterSelect}
                                    >
                                        <option value="all">Tutti</option>
                                        <option value={HospitalClassification.ps}>PS</option>
                                        <option value={HospitalClassification.dea}>DEA</option>
                                        <option value={HospitalClassification.eas}>EAS</option>
                                    </select>
                                </th>
                                <th>
                                    <select
                                        value={traumaFilter}
                                        onChange={(e) => setTraumaFilter(e.target.value)}
                                        className={styles.headerFilterSelect}
                                    >
                                        <option value="all">Tutti</option>
                                        <option value={HospitalTraumaLevel.cts}>CTS</option>
                                        <option value={HospitalTraumaLevel.ctz}>CTZ</option>
                                        <option value={HospitalTraumaLevel.pst}>PST</option>
                                        <option value={HospitalTraumaLevel.ott}>OTT</option>
                                        <option value="none">Nessuno</option>
                                    </select>
                                </th>
                                <th>
                                    <span className={styles.postsFilterPlaceholder}>-</span>
                                </th>
                                <th>
                                    <div className={styles.specialtyFilterContainer}>
                                        <button
                                            ref={buttonRef}
                                            className={styles.specialtyFilterButton}
                                            onClick={handleDropdownToggle}
                                        >
                                            {specialtyFilters.length === 0 
                                                ? 'Tutte' 
                                                : `${specialtyFilters.length} sel.`
                                            }
                                            <span className={styles.dropdownArrow}>▼</span>
                                        </button>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={5} className={styles.noResultsCell}>
                                    Nessun ospedale corrisponde ai filtri selezionati
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearAllFilters}
                                            className={styles.clearFiltersBtn}
                                        >
                                            Cancella filtri
                                        </button>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
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
                            <tr className={styles.filterRow}>
                                <th>
                                    <input
                                        type="text"
                                        placeholder="Cerca..."
                                        value={nameFilter}
                                        onChange={(e) => setNameFilter(e.target.value)}
                                        className={styles.headerFilterInput}
                                    />
                                </th>
                                <th>
                                    <select
                                        value={classificationFilter}
                                        onChange={(e) => setClassificationFilter(e.target.value)}
                                        className={styles.headerFilterSelect}
                                    >
                                        <option value="all">Tutti</option>
                                        <option value={HospitalClassification.ps}>PS</option>
                                        <option value={HospitalClassification.dea}>DEA</option>
                                        <option value={HospitalClassification.eas}>EAS</option>
                                    </select>
                                </th>
                                <th>
                                    <select
                                        value={traumaFilter}
                                        onChange={(e) => setTraumaFilter(e.target.value)}
                                        className={styles.headerFilterSelect}
                                    >
                                        <option value="all">Tutti</option>
                                        <option value={HospitalTraumaLevel.cts}>CTS</option>
                                        <option value={HospitalTraumaLevel.ctz}>CTZ</option>
                                        <option value={HospitalTraumaLevel.pst}>PST</option>
                                        <option value={HospitalTraumaLevel.ott}>OTT</option>
                                        <option value="none">Nessuno</option>
                                    </select>
                                </th>
                                <th>
                                    <span className={styles.postsFilterPlaceholder}>-</span>
                                </th>
                                <th>
                                    <div className={styles.specialtyFilterContainer}>
                                        <button
                                            ref={buttonRef}
                                            className={styles.specialtyFilterButton}
                                            onClick={handleDropdownToggle}
                                        >
                                            {specialtyFilters.length === 0 
                                                ? 'Tutte' 
                                                : `${specialtyFilters.length} sel.`
                                            }
                                            <span className={styles.dropdownArrow}>▼</span>
                                        </button>
                                        {specialtyDropdownOpen && (
                                            <div className={styles.specialtyDropdown}>
                                                {[
                                                    { value: 'punto-nascita', label: 'PN - Punto Nascita' },
                                                    { value: 'pediatria', label: 'PED - Pediatria' },
                                                    { value: 'emodinamica', label: 'EMO - Emodinamica' },
                                                    { value: 'trauma', label: 'TRA - Trauma' },
                                                    { value: 'stroke-unit', label: 'STR - Stroke Unit' },
                                                    { value: 'neurochirurgia', label: 'NCH - Neurochirurgia' },
                                                    { value: 'rianimazione', label: 'RIA - Rianimazione' },
                                                    { value: 'psichiatria', label: 'PSI - Psichiatria' }
                                                ].map(specialty => (
                                                    <label key={specialty.value} className={styles.specialtyCheckboxLabel}>
                                                        <input
                                                            type="checkbox"
                                                            checked={specialtyFilters.includes(specialty.value)}
                                                            onChange={() => handleSpecialtyToggle(specialty.value)}
                                                            className={styles.specialtyCheckbox}
                                                        />
                                                        {specialty.label}
                                                    </label>
                                                ))}
                                                {specialtyFilters.length > 0 && (
                                                    <button
                                                        onClick={() => setSpecialtyFilters([])}
                                                        className={styles.clearSpecialtiesBtn}
                                                    >
                                                        Cancella selezioni
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHospitals.map((hospital) => (
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
            )}
        </div>
    );
}