import { useState } from 'react';
import styles from './Logistica.module.css';
import { useAppSelector } from '../../../core/redux/hooks';
import { selectEvents } from '../../../core/redux/slices/events';
import { selectCallById } from '../../../core/redux/slices/calls';
import { selectVehicles } from '../../../core/redux/slices/settings';
import { Luogo, LUOGO_ICON_MAP, Motivo, MOTIVO_ICON_MAP } from '../../../model/eventDetails';
import type { Vehicle } from '../../../model/vehicle';

type LogisticaProps = {
    onStationSelect?: (coordinates: [number, number]) => void;
};

export default function Logistica({ onStationSelect }: LogisticaProps) {
    const events = useAppSelector(selectEvents);
    const vehicles = useAppSelector(selectVehicles);
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
    const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');

    const filteredVehicles = vehicleTypeFilter === 'all' 
        ? vehicles 
        : vehicles.filter(v => v.vehicleType === vehicleTypeFilter);

    const handleVehicleCheckbox = (radioName: string) => {
        setSelectedVehicles(prev => {
            const newSet = new Set(prev);
            if (newSet.has(radioName)) {
                newSet.delete(radioName);
            } else {
                newSet.add(radioName);
            }
            return newSet;
        });
    };

    const handleStationClick = (vehicle: Vehicle) => {
        if (onStationSelect) {
            const coords: [number, number] = [
                vehicle.station.coordinates.latitude,
                vehicle.station.coordinates.longitude
            ];
            onStationSelect(coords);
        }
    };

    return (
        <div className={styles['logistica-container']}>
            {events.length === 0 ? (
                <p className={styles['empty-message']}>Nessun evento creato</p>
            ) : (
                <div className={styles['events-list']}>
                    {events.map((event) => {
                        const isExpanded = expandedEventId === event.id;
                        const toggleExpand = () => {
                            if (!isExpanded) {
                                // Reset checkboxes when expanding
                                setSelectedVehicles(new Set());
                            }
                            setExpandedEventId(isExpanded ? null : event.id);
                        };

                        return (
                            <div key={event.id} className={`${styles['event-card']} ${event.missions.length === 0 ? styles['no-missions'] : ''}`}>
                                <div className={styles['event-header']} onClick={toggleExpand}>
                                    <span className={styles['event-code']} style={{ 
                                        backgroundColor: getColoreCodice(event.details.codice),
                                        color: 'white'
                                    }}>
                                        {getCodiceInitial(event.details.codice)}
                                    </span>
                                    <span className={styles['location-icon']} title="Luogo">{getLuogoIcon(event.details.luogo)}</span>
                                    <span className={styles['motivo-icon']} title="Motivo">{getMotivoIcon(event.details.motivo)}</span>
                                    {(() => {
                                        const call = useAppSelector(selectCallById(event.callId));
                                        if (!call) return null;
                                        const fullAddress = `${call.location.address.street} ${call.location.address.number}`.toUpperCase();
                                        const truncatedAddress = fullAddress.length > 50 ? fullAddress.substring(0, 50) + '...' : fullAddress;
                                        return (
                                            <>
                                                <span className={styles['event-city']}>{call.location.address.city.name.toUpperCase()}</span>
                                                <span className={styles['event-address']} title={fullAddress}>{truncatedAddress}</span>
                                            </>
                                        );
                                    })()}
                                    <button 
                                        className={`${styles['toggle-button']} ${isExpanded ? styles['expanded'] : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpand();
                                        }}
                                        title={isExpanded ? "Chiudi" : "Espandi"}
                                    >
                                        ►
                                    </button>
                                </div>
                                {isExpanded && (
                                    <div className={styles['event-body']}>
                                        {Object.entries(event.details).map(([key, value]) => {
                                            if (value === undefined || value === null || value === "") return null;
                                            if (key === "vvf" || key === "ffo") return null;
                                            // Label mapping for better display
                                            const labels: Record<string, string> = {
                                                codice: "Codice",
                                                luogo: "Luogo",
                                                dettLuogo: "Dettaglio Luogo",
                                                motivo: "Motivo",
                                                dettMotivo: "Dettaglio Motivo",
                                                coscienza: "Coscienza",
                                                noteEvento: "Note",
                                                noteEvento2: "Note aggiuntive",
                                                altroEvento: "Altro"
                                            };
                                            return (
                                                <div key={key} className={styles['event-row']}>
                                                    <strong>{labels[key] || key}:</strong> {value}
                                                </div>
                                            );
                                        })}

                                        <div className={styles['vehicles-section']}>
                                            <div className={styles['vehicles-header']}>
                                                <div className={styles['vehicle-filter']}>
                                                    <button 
                                                        className={`${styles['filter-button']} ${vehicleTypeFilter === 'all' ? styles['filter-active'] : ''}`}
                                                        onClick={() => setVehicleTypeFilter('all')}
                                                    >
                                                        Tutti
                                                    </button>
                                                    <button 
                                                        className={`${styles['filter-button']} ${vehicleTypeFilter === 'MSB' ? styles['filter-active'] : ''}`}
                                                        onClick={() => setVehicleTypeFilter('MSB')}
                                                    >
                                                        MSB
                                                    </button>
                                                    <button 
                                                        className={`${styles['filter-button']} ${vehicleTypeFilter === 'MSA1' ? styles['filter-active'] : ''}`}
                                                        onClick={() => setVehicleTypeFilter('MSA1')}
                                                    >
                                                        MSA1
                                                    </button>
                                                    <button 
                                                        className={`${styles['filter-button']} ${vehicleTypeFilter === 'MSA2' ? styles['filter-active'] : ''}`}
                                                        onClick={() => setVehicleTypeFilter('MSA2')}
                                                    >
                                                        MSA2
                                                    </button>
                                                </div>
                                            </div>
                                            {vehicles.length === 0 ? (
                                                <p className={styles['empty-message']}>Nessun mezzo disponibile</p>
                                            ) : filteredVehicles.length === 0 ? (
                                                <p className={styles['empty-message']}>Nessun mezzo di questo tipo</p>
                                            ) : (
                                                <div className={styles['vehicles-list']}>
                                                    {filteredVehicles.map((vehicle, index) => (
                                                        <div key={`${vehicle.radioName}-${index}`} className={styles['vehicle-item']}>
                                                            <input
                                                                type="checkbox"
                                                                id={`vehicle-${vehicle.radioName}-${index}`}
                                                                checked={selectedVehicles.has(vehicle.radioName)}
                                                                onChange={() => handleVehicleCheckbox(vehicle.radioName)}
                                                                className={styles['vehicle-checkbox']}
                                                            />
                                                            <label htmlFor={`vehicle-${vehicle.radioName}-${index}`} className={styles['vehicle-label']}>
                                                                <span className={styles['vehicle-type']}>{vehicle.vehicleType}</span>
                                                                <span className={styles['vehicle-radio-name']}>{vehicle.radioName}</span>
                                                                <span className={styles['vehicle-station-container']}>
                                                                    <span 
                                                                        className={styles['vehicle-station']} 
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handleStationClick(vehicle);
                                                                        }}
                                                                        title="Clicca per centrare sulla mappa"
                                                                    >
                                                                        📍 {vehicle.station.name}
                                                                    </span>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function getColoreCodice(codice: string): string {
    switch (codice) {
        case 'ROSSO': return '#e53935';
        case 'GIALLO': return '#ffb300';
        case 'VERDE': return '#4caf50';
        default: return '#888';
    }
}

function getCodiceInitial(codice: string): string {
    switch (codice) {
        case 'ROSSO': return 'R';
        case 'GIALLO': return 'G';
        case 'VERDE': return 'V';
        default: return '?';
    }
}

function getLuogoIcon(luogo: Luogo): string {
    return LUOGO_ICON_MAP[luogo];
}

function getMotivoIcon(motivo: Motivo): string {
    return MOTIVO_ICON_MAP[motivo];
}
