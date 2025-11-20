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
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
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

    // Sort vehicles by distance to event location and return with computed distances
    const getSortedVehiclesWithDistance = (eventLat: number, eventLon: number): Array<{ vehicle: Vehicle; distance: number }> => {
        return filteredVehicles.map(vehicle => ({
            vehicle,
            distance: calculateDistance(
                eventLat,
                eventLon,
                vehicle.station.coordinates.latitude,
                vehicle.station.coordinates.longitude
            )
        })).sort((a, b) => a.distance - b.distance);
    };

    const handleEventClick = (eventId: string) => {
        // If clicking the same event, deselect it
        if (selectedEventId === eventId) {
            setSelectedEventId(null);
            setSelectedVehicles(new Set());
            setVehicleTypeFilter('all');
        } else {
            // Select new event and pre-populate vehicles from missions
            const event = events.find(e => e.id === eventId);
            if (event) {
                setSelectedEventId(eventId);
                const missionVehicles = new Set(event.missions.map(m => m.vehicle.radioName));
                setSelectedVehicles(missionVehicles);
                setVehicleTypeFilter('all');
            }
        }
    };

    const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

    // Get vehicles assigned to other events (not the selected one)
    const vehiclesInOtherEvents = new Set(
        events
            .filter(e => e.id !== selectedEventId)
            .flatMap(e => e.missions.map(m => m.vehicle.radioName))
    );

    return (
        <div className={styles['logistica-container']}>
            <div className={styles['two-column-layout']}>
                <div className={styles['left-column']}>
                    {events.length === 0 ? (
                        <p className={styles['empty-message']}>Nessun evento creato</p>
                    ) : (
                        <div className={styles['events-list']}>
                            {sortedEvents.map((event) => (
                                <div 
                                    key={event.id} 
                                    className={`${styles['event-card']} ${event.missions.length === 0 ? styles['no-missions'] : ''} ${selectedEventId === event.id ? styles['event-selected'] : ''}`}
                                    onClick={() => handleEventClick(event.id)}
                                >
                                    <div className={styles['event-header']}>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles['right-column']}>
                    {selectedEvent ? (
                        <VehiclesList
                            event={selectedEvent}
                            vehicleTypeFilter={vehicleTypeFilter}
                            setVehicleTypeFilter={setVehicleTypeFilter}
                            filteredVehicles={filteredVehicles}
                            selectedVehicles={selectedVehicles}
                            handleVehicleCheckbox={handleVehicleCheckbox}
                            handleStationClick={handleStationClick}
                            getSortedVehiclesWithDistance={getSortedVehiclesWithDistance}
                            vehiclesInOtherEvents={vehiclesInOtherEvents}
                        />
                    ) : (
                        <div className={styles['empty-state']}>
                            <p className={styles['empty-message']}>Seleziona un evento per assegnare mezzi</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

type VehiclesListProps = {
    event: Event;
    vehicleTypeFilter: string;
    setVehicleTypeFilter: (filter: string) => void;
    filteredVehicles: Vehicle[];
    selectedVehicles: Set<string>;
    handleVehicleCheckbox: (radioName: string, eventId: string) => void;
    handleStationClick: (vehicle: Vehicle) => void;
    getSortedVehiclesWithDistance: (lat: number, lon: number) => Array<{ vehicle: Vehicle; distance: number }>;
    vehiclesInOtherEvents: Set<string>;
};

function VehiclesList({ 
    event,
    vehicleTypeFilter, 
    setVehicleTypeFilter, 
    filteredVehicles,
    selectedVehicles, 
    handleVehicleCheckbox,
    handleStationClick,
    getSortedVehiclesWithDistance,
    vehiclesInOtherEvents
}: VehiclesListProps) {
    const eventLocation = {
        lat: event.call.location.address.latitude,
        lon: event.call.location.address.longitude
    };

    return (
        <div className={styles['vehicles-section']}>
            <div className={styles['filter-section']}>
                <div className={styles['filter-buttons']}>
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
            {filteredVehicles.length === 0 ? (
                <p className={styles['empty-message']}>Nessun mezzo di questo tipo</p>
            ) : (
                <div className={styles['vehicles-list']}>
                    {getSortedVehiclesWithDistance(eventLocation.lat, eventLocation.lon).map(({ vehicle, distance }, index) => {
                        const isInOtherEvent = vehiclesInOtherEvents.has(vehicle.radioName);
                        return (
                            <div 
                                key={`${vehicle.radioName}-${index}`} 
                                className={`${styles['vehicle-item']} ${isInOtherEvent ? styles['vehicle-disabled'] : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    id={`vehicle-${vehicle.radioName}-${index}`}
                                    checked={selectedVehicles.has(vehicle.radioName)}
                                    onChange={() => handleVehicleCheckbox(vehicle.radioName, event.id)}
                                    className={styles['vehicle-checkbox']}
                                    disabled={isInOtherEvent}
                                />
                                <label htmlFor={`vehicle-${vehicle.radioName}-${index}`} className={styles['vehicle-label']}>
                                    <div className={styles['vehicle-info']}>
                                        <span className={styles['vehicle-type']}>{vehicle.vehicleType}</span>
                                        <span className={styles['vehicle-radio-name']}>
                                            {vehicle.radioName} <span className={styles['vehicle-distance']}>({distance.toFixed(1)} km)</span>
                                        </span>
                                    </div>
                                </label>
                                <div 
                                    className={styles['vehicle-station-area']} 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleStationClick(vehicle);
                                    }}
                                    title={vehicle.station.name}
                                >
                                    <span className={styles['vehicle-station']}>⌖</span>
                                </div>
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
