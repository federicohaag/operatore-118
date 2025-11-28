import { useState, useEffect, useCallback } from 'react';
import styles from './CallTaker.module.css';
import { useAppSelector, useAppDispatch } from '../../../core/redux/hooks';
import { selectCalls, removeCall, markCallAsProcessed, addEvent } from '../../../core/redux/slices/game';
import type { Event } from '../../../model/event';
import type { EventDetails } from '../../../model/eventDetails';
import LiveCall from './LiveCall';
import CallTakerForm from './CallTakerForm';
import type { VirtualClock } from '../../../core/simulation/VirtualClock';

interface CallTakerProps {
    clock: VirtualClock;
    onCallSelect?: (location: [number, number]) => void;
    onSpeak?: (text: string) => void;
    /** External trigger for call selection (e.g., from map marker clicks) */
    externalCallSelection?: string | null;
}

export default function CallTaker({ clock, onCallSelect: onCallSelect, onSpeak, externalCallSelection }: CallTakerProps) {
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
    
    const handleCallClick = useCallback((callId: string) => {
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
    }, [calls, onCallSelect, onSpeak]);
    
    // Handle external call selection (e.g., from map marker clicks)
    useEffect(() => {
        if (externalCallSelection) {
            handleCallClick(externalCallSelection);
        }
    }, [externalCallSelection, handleCallClick]);

    const handleEventCreated = (eventDetails: EventDetails) => {
        if (!selectedCall) return;
        
        const call = calls.find(c => c.id === selectedCall);
        if (!call) return;
        
        // Create event with generated UUID and call ID reference
        const newEvent: Event = {
            id: crypto.randomUUID(),
            callId: call.id,
            details: eventDetails,
            missions: [],
            createdAt: clock.now(),
            vehiclesOnScene: 0,
        };

        // Dispatch to Redux store (persisted to localStorage and synced across tabs)
        dispatch(addEvent(newEvent));
        
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
                                        
                                        // Determine elapsed time styling
                                        const isBold = elapsedSeconds >= 5;
                                        const isRed = elapsedSeconds >= 10;
                                        const elapsedClasses = [
                                            styles['call-elapsed'],
                                            isBold ? styles['elapsed-bold'] : '',
                                            isRed ? styles['elapsed-red'] : ''
                                        ].filter(Boolean).join(' ');

                                        return (
                                            <li key={call.id} className={styles['call-item']}>
                                                <div 
                                                    className={styles['call-header']} 
                                                    onClick={() => handleCallClick(call.id)}
                                                >
                                                    <span className={styles['call-label']}>Nuova chiamata!</span>
                                                    <div className={elapsedClasses}>
                                                        +{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
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