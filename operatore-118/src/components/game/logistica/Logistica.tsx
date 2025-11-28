import { useState } from 'react';
import styles from './Logistica.module.css';
import { useAppSelector, useAppDispatch } from '../../../core/redux/hooks';
import { selectEvents, removeMissionFromEvent, selectAllCalls, selectVehicles } from '../../../core/redux/slices/game';
import type { Vehicle } from '../../../model/vehicle';
import type { Event } from '../../../model/event';
import type { VirtualClock } from '../../../core/simulation/VirtualClock';
import type { Scheduler } from '../../../core/scheduling/Scheduler';
import { createMission } from '../../../core/actions/missionActions';
import { calculateVehicleCurrentLocation } from '../../../utils/vehiclePosition';
import { calculateDistance } from '../../../utils/distance';
import { findVehicleMission, getVehicleMissionStatus, getMissionStatusLabel } from '../../../utils/missionHelpers';
import { sortEventsByPriority, getColorForCodice, getCodiceInitial } from '../../../utils/eventHelpers';

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

    const sortedEvents = sortEventsByPriority(events);

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
                getCall: (id) => calls.find(c => c.id === id),
                getMission: (evtId, msnId) => {
                    const evt = events.find(e => e.id === evtId);
                    if (!evt) return null;
                    const mission = evt.missions.find(m => m.id === msnId);
                    return mission ? { mission, event: evt } : null;
                }
            });
        } else {
            // Remove mission when deselecting
            dispatch(removeMissionFromEvent({ eventId, vehicleId: vehicle.id }));
        }
    };

    // Sort vehicles by distance to event location and return with computed distances
    const getSortedVehiclesWithDistance = (eventLat: number, eventLon: number): Array<{ vehicle: Vehicle; distance: number }> => {
        const currentSimTime = clock.now();
        
        return filteredVehicles.map(vehicle => {
            const vehicleMission = findVehicleMission(vehicle.id, events);
            const currentPos = calculateVehicleCurrentLocation(vehicle, vehicleMission, currentSimTime);
            const distance = calculateDistance(
                eventLat,
                eventLon,
                currentPos.latitude,
                currentPos.longitude
            );
            
            return { vehicle, distance };
        }).sort((a, b) => a.distance - b.distance);
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
                                                backgroundColor: getColorForCodice(event.details.codice),
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
                        const missionInfo = getVehicleMissionStatus(vehicle.id, allEvents);
                        
                        // Disable vehicle if it's on a mission with status other than traveling_to_scene or returning_to_station
                        const isUnavailable = !!(event && missionInfo && 
                            missionInfo.status !== 'traveling_to_scene' && 
                            missionInfo.status !== 'returning_to_station');
                        
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
                                            <div className={styles['mission-status-badge']} title={getMissionStatusLabel(missionInfo.status)}>
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
