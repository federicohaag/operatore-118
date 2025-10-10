import { useState } from 'react';
import styles from './CallTaker.module.css';
import { useAppSelector } from '../../../global-state/hooks';
import { selectCalls } from '../../../global-state/slices/calls';
import LiveCall from './LiveCall';

export default function CallTaker() {
    const calls = useAppSelector(selectCalls);
    const [selectedCall, setSelectedCall] = useState<string | null>(null);

    const handleCallClick = (callId: string) => {
        setSelectedCall(callId);
    };

    const handleCloseCall = () => {
        setSelectedCall(null);
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
                    {/* Empty column for future content */}
                </div>
            </div>
        </div>
    );
}