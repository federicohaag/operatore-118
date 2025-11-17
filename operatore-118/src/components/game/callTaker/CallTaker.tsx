import { useState, useEffect } from 'react';
import styles from './CallTaker.module.css';
import { useAppSelector, useAppDispatch } from '../../../core/redux/hooks';
import { selectCalls, removeCall, markCallAsProcessed } from '../../../core/redux/slices/calls';
import { addEvent } from '../../../core/redux/slices/events';
import { generateUuid } from '../../../core/utils';
import type { Event } from '../../../model/event';
import type { EventDetails } from '../../../model/eventDetails';
import LiveCall from './LiveCall';
import CallTakerForm from './CallTakerForm';
import type { VirtualClock } from '../../../core/VirtualClock';

interface CallTakerProps {
    clock: VirtualClock;
    onCallSelect?: (location: [number, number]) => void;
    onSpeak?: (text: string) => void;
}

export default function CallTaker({ clock, onCallSelect: onCallSelect, onSpeak }: CallTakerProps) {
    const dispatch = useAppDispatch();
    const calls = useAppSelector(selectCalls);
    const [selectedCall, setSelectedCall] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(clock.now());

    // Update current time for elapsed time calculations
    useEffect(() => {
        setCurrentTime(clock.now());
        
        const unsubscribe = clock.onChange(() => {
            setCurrentTime(clock.now());
        });

        const interval = setInterval(() => {
            if (!clock.paused) {
                setCurrentTime(clock.now());
            }
        }, 100);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, [clock]);

    const handleCallClick = (callId: string) => {
        setSelectedCall(callId);
        
        // Center map on call location
        const call = calls.find(c => c.id === callId);
        if (call) {
            if (onCallSelect) {
                onCallSelect([call.location.address.latitude, call.location.address.longitude]);
            }
            
            // Speak call text if TTS is enabled
            if (onSpeak) {
                onSpeak(call.text);
            }
        }
    };

    const handleEventCreated = (eventDetails: EventDetails) => {
        if (!selectedCall) return;
        
        // Create event with generated UUID and reference to originating call
        const newEvent: Event = {
            id: generateUuid(),
            callId: selectedCall,
            details: eventDetails,
        };

        // Dispatch to Redux store (persisted to localStorage and synced across tabs)
        dispatch(addEvent(newEvent));
        
        console.log('New event created and dispatched:', newEvent);
        
        // Mark the call as processed (will be filtered out from active calls)
        dispatch(markCallAsProcessed(selectedCall));
        setSelectedCall(null);
        
        // Clear map marker
        if (onCallSelect) {
            onCallSelect(undefined as any);
        }
    };

    const handleCallAborted = () => {
        if (selectedCall) {
            dispatch(removeCall(selectedCall));
            setSelectedCall(null);
            // Clear map marker
            if (onCallSelect) {
                onCallSelect(undefined as any);
            }
        }
    };

    const currentCall = selectedCall ? calls.find(call => call.id === selectedCall) : null;

    const formatSimulationTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles['call-taker-container']}>
            <div className={styles['two-column-layout']}>
                <div className={styles['left-column']}>
                    {currentCall ? (
                        <LiveCall call={currentCall} />
                    ) : (
                        <div className={styles['calls-list']}>
                            {calls.length === 0 ? (
                                <p>No active calls</p>
                            ) : (
                                <ul>
                                    {calls.map((call) => {
                                        const elapsedMs = currentTime - call.receivedAt;
                                        const elapsedSeconds = Math.floor(elapsedMs / 1000);
                                        const minutes = Math.floor(elapsedSeconds / 60);
                                        const seconds = elapsedSeconds % 60;
                                        const receivedTime = formatSimulationTime(call.receivedAt);

                                        return (
                                            <li key={call.id} className={styles['call-item']}>
                                                <div 
                                                    className={styles['call-header']} 
                                                    onClick={() => handleCallClick(call.id)}
                                                >
                                                    <span className={styles['call-icon']}>📞</span>
                                                    <div className={styles['call-info']}>
                                                        <div className={styles['call-time']}>{receivedTime}</div>
                                                        <div className={styles['call-elapsed']}>
                                                            +{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                                                        </div>
                                                        <div className={styles['call-address']}>
                                                            {call.location.address.city.name}, {call.location.address.street} {call.location.address.number}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
                <div className={styles['right-column']}>
                    {currentCall ? (
                        <CallTakerForm 
                            callId={currentCall.id}
                            onEventCreated={handleEventCreated}
                            onCallAborted={handleCallAborted}
                        />
                    ) : (
                        <div className={styles['empty-state']}>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}