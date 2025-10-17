import { useState } from 'react';
import styles from './CallTaker.module.css';
import { useAppSelector } from '../../../core/redux/hooks';
import { selectCalls } from '../../../core/redux/slices/calls';
import LiveCall from './LiveCall';
import CallTakerForm from './CallTakerForm';
import type { Event } from '../../../model/event';

export default function CallTaker() {
    const calls = useAppSelector(selectCalls);
    const [selectedCall, setSelectedCall] = useState<string | null>(null);

    const handleCallClick = (callId: string) => {
        setSelectedCall(callId);
    };

    const handleCloseCall = () => {
        setSelectedCall(null);
    };

    const handleEventCreated = (event: Event) => {
        console.log('New event created:', event);
        // TODO: Handle the created event (e.g., add to state, send to server, etc.)
    };

    const currentCall = selectedCall ? calls.find(call => call.id === selectedCall) : null;

    return (
        <div className={styles['call-taker-container']}>
            <div className={styles['two-column-layout']}>
                <div className={styles['left-column']}>
                    {currentCall ? (
                        <LiveCall call={currentCall} onClose={handleCloseCall} />
                    ) : (
                        <div className={styles['calls-list']}>
                            {calls.length === 0 ? (
                                <p>No active calls</p>
                            ) : (
                                <ul>
                                    {calls.map((call) => (
                                        <li key={call.id} className={styles['call-item']}>
                                            <div 
                                                className={styles['call-header']} 
                                                onClick={() => handleCallClick(call.id)}
                                            >
                                                <span>Call ID: {call.id}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
                <div className={styles['right-column']}>
                    {currentCall ? (
                        <CallTakerForm onEventCreated={handleEventCreated} />
                    ) : (
                        <div className={styles['empty-state']}>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}