import { useState } from 'react';
import styles from './Logistica.module.css';
import { useAppSelector, useAppDispatch } from '../../../core/redux/hooks';
import { selectEvents, removeMissionFromEvent, selectAllCalls, selectVehicles } from '../../../core/redux/slices/game';
import type { Vehicle } from '../../../model/vehicle';
import type { Event } from '../../../model/event';
import type { VirtualClock } from '../../../core/simulation/VirtualClock';
import type { Scheduler } from '../../../core/scheduling/Scheduler';
import { createMission } from '../../../core/actions/missionActions';

type LogisticaProps = {
    clock: VirtualClock;
    scheduler: Scheduler;
    onStationSelect?: (coordinates: [number, number]) => void;
};

export default function Logistica({ clock, scheduler, onStationSelect }: LogisticaProps) {
    const events = useAppSelector(selectEvents);
    const calls = useAppSelector(selectAllCalls);
    const vehicles = useAppSelector(selectVehicles);
    const dispatch = useAppDispatch();
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');

    // Helper function to get call from event
    const getCallForEvent = (event: Event) => {
        return calls.find(c => c.id === event.callId);
    };

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
            // Find the event to get its priority code
            const event = events.find(e => e.id === eventId);
            if (!event) return;
            
            // Get the call associated with this event to access location
            const call = getCallForEvent(event);
            if (!call) return;
            
            // Create mission using core game action
            createMission({
                eventId,
                vehicle,
                call,
                priorityCode: event.details.codice,
                clock,
                scheduler,
                dispatch,
                getVehicle: (id) => vehicles.find(v => v.id === id),
                getCall: (id) => calls.find(c => c.id === id)
            });
        } else {
            // Remove mission when deselecting
            dispatch(removeMissionFromEvent({ eventId, vehicleId: vehicle.id }));
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
                vehicle.currentLocation.latitude,
                vehicle.currentLocation.longitude
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
            if (event && onStationSelect) {
                setSelectedEventId(eventId);
                // Get vehicle radio names from mission vehicleIds
                const missionVehicleRadioNames = new Set(
                    event.missions
                        .map(m => vehicles.find(v => v.id === m.vehicleId))
                        .filter((v): v is Vehicle => v !== undefined)
                        .map(v => v.radioName)
                );
                setSelectedVehicles(missionVehicleRadioNames);
                setVehicleTypeFilter('all');
                
                // Center map on event location
                const call = getCallForEvent(event);
                if (call) {
                    const coords: [number, number] = [
                        call.location.address.latitude,
                        call.location.address.longitude
                    ];
                    onStationSelect(coords);
                }
            }
        }
    };

    const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

    // Get vehicles assigned to other events (not the selected one)
    const vehiclesInOtherEvents = new Set(
        events
            .filter(e => e.id !== selectedEventId)
            .flatMap(e => e.missions
                .map(m => vehicles.find(v => v.id === m.vehicleId))
                .filter((v): v is Vehicle => v !== undefined)
                .map(v => v.radioName)
            )
    );

    // Get all vehicles currently on any mission
    const vehiclesOnMissions = new Set(
        events.flatMap(e => e.missions
            .map(m => vehicles.find(v => v.id === m.vehicleId))
            .filter((v): v is Vehicle => v !== undefined)
            .map(v => v.radioName)
        )
    );

    // Sort vehicles alphabetically, with those on missions first
    const getSortedVehiclesAlphabetically = (): Vehicle[] => {
        return [...filteredVehicles].sort((a, b) => {
            const aOnMission = vehiclesOnMissions.has(a.radioName);
            const bOnMission = vehiclesOnMissions.has(b.radioName);
            
            // Vehicles on missions come first
            if (aOnMission && !bOnMission) return -1;
            if (!aOnMission && bOnMission) return 1;
            
            // Otherwise, sort alphabetically by radio name
            return a.radioName.localeCompare(b.radioName);
        });
    };

    return (
        <div className={styles['logistica-container']}>
            <div className={styles['two-column-layout']}>
                <div className={styles['left-column']}>
                    {events.length === 0 ? (
                        <p className={styles['empty-message']}>Nessun evento creato</p>
                    ) : (
                        <div className={styles['events-list']}>
                            {sortedEvents.map((event) => {
                                const call = getCallForEvent(event);
                                if (!call) return null;
                                
                                return (
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
                                            <span className={styles['event-city']}>{call.location.address.city.name.toUpperCase()}</span>
                                            <span className={styles['event-address']} title={`${call.location.address.street} ${call.location.address.number}`.toUpperCase()}>
                                                {(() => {
                                                    const fullAddress = `${call.location.address.street} ${call.location.address.number}`.toUpperCase();
                                                    return fullAddress.length > 50 ? fullAddress.substring(0, 50) + '...' : fullAddress;
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className={styles['right-column']}>
                    <VehiclesList
                        event={selectedEvent ?? null}
                        allEvents={events}
                        vehicleTypeFilter={vehicleTypeFilter}
                        setVehicleTypeFilter={setVehicleTypeFilter}
                        filteredVehicles={filteredVehicles}
                        selectedVehicles={selectedVehicles}
                        handleVehicleCheckbox={handleVehicleCheckbox}
                        getSortedVehiclesWithDistance={getSortedVehiclesWithDistance}
                        getSortedVehiclesAlphabetically={getSortedVehiclesAlphabetically}
                        vehiclesInOtherEvents={vehiclesInOtherEvents}
                        vehiclesOnMissions={vehiclesOnMissions}
                        getCallForEvent={getCallForEvent}
                    />
                </div>
            </div>
        </div>
    );
}

type VehiclesListProps = {
    event: Event | null;
    allEvents: Event[];
    vehicleTypeFilter: string;
    setVehicleTypeFilter: (filter: string) => void;
    filteredVehicles: Vehicle[];
    selectedVehicles: Set<string>;
    handleVehicleCheckbox: (radioName: string, eventId: string) => void;
    getSortedVehiclesWithDistance: (lat: number, lon: number) => Array<{ vehicle: Vehicle; distance: number }>;
    getSortedVehiclesAlphabetically: () => Vehicle[];
    vehiclesInOtherEvents: Set<string>;
    vehiclesOnMissions: Set<string>;
    getCallForEvent: (event: Event) => any;
};

function VehiclesList({ 
    event,
    allEvents,
    vehicleTypeFilter, 
    setVehicleTypeFilter, 
    filteredVehicles,
    selectedVehicles, 
    handleVehicleCheckbox,
    getSortedVehiclesWithDistance,
    getSortedVehiclesAlphabetically,
    vehiclesInOtherEvents,
    vehiclesOnMissions,
    getCallForEvent
}: VehiclesListProps) {
    const call = event ? getCallForEvent(event) : null;
    const eventLocation = call ? {
        lat: call.location.address.latitude,
        lon: call.location.address.longitude
    } : null;

    // Helper function to get mission status for a vehicle
    const getMissionStatus = (vehicleId: string): { status: string; statusNumber: number } | null => {
        for (const evt of allEvents) {
            const mission = evt.missions.find(m => m.vehicleId === vehicleId);
            if (mission) {
                const statusNumber = getStatusNumber(mission.status);
                return { status: mission.status, statusNumber };
            }
        }
        return null;
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
                    {(event 
                        ? getSortedVehiclesWithDistance(eventLocation!.lat, eventLocation!.lon).map(({ vehicle, distance }) => ({ vehicle, distance }))
                        : getSortedVehiclesAlphabetically().map(vehicle => ({ vehicle, distance: null }))
                    ).map(({ vehicle, distance }, index) => {
                        const isInOtherEvent = vehiclesInOtherEvents.has(vehicle.radioName);
                        const isOnMission = vehiclesOnMissions.has(vehicle.radioName);
                        const missionInfo = getMissionStatus(vehicle.id);
                        
                        // Disable vehicle if it's on a mission with status other than traveling_to_scene or returning_to_station
                        const isUnavailable = event && missionInfo && 
                            missionInfo.status !== 'traveling_to_scene' && 
                            missionInfo.status !== 'returning_to_station';
                        
                        const isDisabled = isInOtherEvent || isUnavailable;
                        
                        return (
                            <div 
                                key={`${vehicle.radioName}-${index}`} 
                                className={`${styles['vehicle-item']} ${isInOtherEvent ? styles['vehicle-disabled'] : ''} ${isUnavailable ? styles['vehicle-unavailable'] : ''} ${!event && isOnMission ? styles['vehicle-on-mission'] : ''}`}
                            >
                                {event && (
                                    <input
                                        type="checkbox"
                                        id={`vehicle-${vehicle.radioName}-${index}`}
                                        checked={selectedVehicles.has(vehicle.radioName)}
                                        onChange={() => handleVehicleCheckbox(vehicle.radioName, event.id)}
                                        className={styles['vehicle-checkbox']}
                                        disabled={isDisabled}
                                    />
                                )}
                                <label htmlFor={event ? `vehicle-${vehicle.radioName}-${index}` : undefined} className={styles['vehicle-label']}>
                                    <div className={styles['vehicle-info']}>
                                        <span className={styles['vehicle-type']}>{vehicle.vehicleType}</span>
                                        <span className={styles['vehicle-radio-name']}>
                                            {vehicle.radioName} {distance !== null && <span className={styles['vehicle-distance']}>({distance.toFixed(1)} km)</span>}
                                        </span>
                                        {missionInfo && (
                                            <div className={styles['mission-status-badge']} title={getStatusLabel(missionInfo.status)}>
                                                {missionInfo.statusNumber}
                                            </div>
                                        )}
                                    </div>
                                </label>
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

function getStatusNumber(status: string): number {
    switch (status) {
        case 'mission_received': return 0;
        case 'traveling_to_scene': return 1;
        case 'on_scene': return 2;
        case 'traveling_to_hospital': return 3;
        case 'on_hospital': return 4;
        case 'free_on_hospital': return 5;
        case 'returning_to_station': return 6;
        case 'completed': return 7;
        default: return 0;
    }
}

function getStatusLabel(status: string): string {
    switch (status) {
        case 'mission_received': return '0: Missione ricevuta';
        case 'traveling_to_scene': return '1: In viaggio verso il luogo';
        case 'on_scene': return '2: Sul luogo';
        case 'traveling_to_hospital': return '3: In viaggio verso ospedale';
        case 'on_hospital': return '4: In ospedale';
        case 'free_on_hospital': return '5: Libero in ospedale';
        case 'returning_to_station': return '6: Ritorno alla base';
        case 'completed': return '7: Completata';
        default: return 'Sconosciuto';
    }
}
