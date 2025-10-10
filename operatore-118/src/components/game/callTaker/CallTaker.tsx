import styles from './CallTaker.module.css';
import type { Scheduler } from '../../../utils/Scheduler';
import { useAppSelector } from '../../../global-state/hooks';
import { selectCalls, selectCallsCount } from '../../../global-state/slices/calls';

interface CallTakerProps {
    scheduler: Scheduler;
}

export default function CallTaker({ scheduler }: CallTakerProps) {
    const calls = useAppSelector(selectCalls);
    const callsCount = useAppSelector(selectCallsCount);

    return (
        <div className={styles['call-taker-container']}>
            <h3>Call Taker</h3>
            <div className={styles['stats']}>
                <p>Total calls: {callsCount}</p>
                <p>Scheduler events in queue: {scheduler.size()}</p>
            </div>
            
            <div className={styles['calls-list']}>
                <h4>Active Calls:</h4>
                {calls.length === 0 ? (
                    <p>No active calls</p>
                ) : (
                    <ul>
                        {calls.map((call, index) => (
                            <li key={index}>Call ID: {call}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}