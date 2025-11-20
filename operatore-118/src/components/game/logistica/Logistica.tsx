import { useState } from 'react';
import styles from './Logistica.module.css';
import { useAppSelector, useAppDispatch } from '../../../core/redux/hooks';
import { selectEvents, addMissionToEvent, removeMissionFromEvent } from '../../../core/redux/slices/events';
import { selectVehicles } from '../../../core/redux/slices/settings';
import { Luogo, LUOGO_ICON_MAP, Motivo, MOTIVO_ICON_MAP } from '../../../model/eventDetails';
import type { Vehicle } from '../../../model/vehicle';
import type { Event } from '../../../model/event';
import type { VirtualClock } from '../../../core/VirtualClock';

type LogisticaProps = {
    clock: VirtualClock;
    onStationSelect?: (coordinates: [number, number]) => void;
};

export default function Logistica({ clock, onStationSelect }: LogisticaProps) {
    const events = useAppSelector(selectEvents);
    const vehicles = useAppSelector(selectVehicles);
    const dispatch = useAppDispatch();
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
    const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');

    const filteredVehicles = vehicleTypeFilter === 'all' 
        ? vehicles 
        : vehicles.filter(v => v.vehicleType === vehicleTypeFilter);

    // Sort events by color priority (ROSSO > GIALLO > VERDE) and then by timestamp (oldest first)
    const sortedEvents = [...events].sort((a, b) => {
        const colorPriority = { 'ROSSO': 0, 'GIALLO': 1, 'VERDE': 2 };
        const priorityA = colorPriority[a.details.codice as keyof typeof colorPriority] ?? 999;
        const priorityB = colorPriority[b.details.codice as keyof typeof colorPriority] ?? 999;
        
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }
        
        return a.createdAt - b.createdAt;
    });

    const handleVehicleCheckbox = (radioName: string, eventId: string) => {
        const vehicle = vehicles.find(v => v.radioName === radioName);
        if (!vehicle) return;

        // Check if vehicle is already selected
        const wasSelected = selectedVehicles.has(radioName);
        
        setSelectedVehicles(prev => {
            const newSet = new Set(prev);
            if (newSet.has(radioName)) {
                newSet.delete(radioName);
            } else {
                newSet.add(radioName);
            }
            return newSet;
        });

        if (!wasSelected) {
            // Create mission when selecting
            const mission = {
                id: crypto.randomUUID(),
                vehicle: vehicle,
                createdAt: clock.now()
            };
            
            dispatch(addMissionToEvent({ eventId, mission }));
        } else {
            // Remove mission when deselecting
            dispatch(removeMissionFromEvent({ eventId, vehicleRadioName: radioName }));
        }
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

    // Calculate distance between two coordinates using Haversine formula
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Sort vehicles by distance to event location
    const getSortedVehicles = (eventLat: number, eventLon: number): Vehicle[] => {
        return [...filteredVehicles].sort((a, b) => {
            const distA = calculateDistance(
                eventLat, 
                eventLon,
                a.station.coordinates.latitude,
                a.station.coordinates.longitude
            );
            const distB = calculateDistance(
                eventLat,
                eventLon,
                b.station.coordinates.latitude,
                b.station.coordinates.longitude
            );
            return distA - distB;
        });
    };

    return (
        <div className={styles['logistica-container']}>
            {events.length === 0 ? (
                <p className={styles['empty-message']}>Nessun evento creato</p>
            ) : (
                <div className={styles['events-list']}>
                    {sortedEvents.map((event) => {
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
                                    <span className={styles['event-city']}>{event.call.location.address.city.name.toUpperCase()}</span>
                                    <span className={styles['event-address']} title={`${event.call.location.address.street} ${event.call.location.address.number}`.toUpperCase()}>
                                        {(() => {
                                            const fullAddress = `${event.call.location.address.street} ${event.call.location.address.number}`.toUpperCase();
                                            return fullAddress.length > 50 ? fullAddress.substring(0, 50) + '...' : fullAddress;
                                        })()}
                                    </span>
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
                                    <EventBody 
                                        event={event}
                                        eventLocation={{
                                            lat: event.call.location.address.latitude,
                                            lon: event.call.location.address.longitude
                                        }}
                                        vehicleTypeFilter={vehicleTypeFilter}
                                        setVehicleTypeFilter={setVehicleTypeFilter}
                                        vehicles={vehicles}
                                        filteredVehicles={filteredVehicles}
                                        selectedVehicles={selectedVehicles}
                                        handleVehicleCheckbox={handleVehicleCheckbox}
                                        eventId={event.id}
                                        handleStationClick={handleStationClick}
                                        getSortedVehicles={getSortedVehicles}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

type EventBodyProps = {
    event: Event;
    eventLocation: { lat: number; lon: number };
    vehicleTypeFilter: string;
    setVehicleTypeFilter: (filter: string) => void;
    vehicles: Vehicle[];
    filteredVehicles: Vehicle[];
    selectedVehicles: Set<string>;
    handleVehicleCheckbox: (radioName: string, eventId: string) => void;
    eventId: string;
    handleStationClick: (vehicle: Vehicle) => void;
    getSortedVehicles: (lat: number, lon: number) => Vehicle[];
};

function EventBody({ 
    event, 
    eventLocation,
    vehicleTypeFilter, 
    setVehicleTypeFilter, 
    vehicles, 
    filteredVehicles,
    selectedVehicles, 
    handleVehicleCheckbox,
    eventId,
    handleStationClick,
    getSortedVehicles 
}: EventBodyProps) {
    return (
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
                        {getSortedVehicles(eventLocation.lat, eventLocation.lon).map((vehicle, index) => (
                            <div key={`${vehicle.radioName}-${index}`} className={styles['vehicle-item']}>
                                <input
                                    type="checkbox"
                                    id={`vehicle-${vehicle.radioName}-${index}`}
                                    checked={selectedVehicles.has(vehicle.radioName)}
                                    onChange={() => handleVehicleCheckbox(vehicle.radioName, eventId)}
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
