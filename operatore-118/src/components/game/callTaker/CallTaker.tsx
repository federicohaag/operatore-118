import styles from './CallTaker.module.css';
import type { Scheduler } from '../../../utils/Scheduler';
import { useAppSelector } from '../../../global-state/hooks';
import { selectCalls } from '../../../global-state/slices/calls';

interface CallTakerProps {
    scheduler: Scheduler;
}

export default function CallTaker({ scheduler }: CallTakerProps) {
    const calls = useAppSelector(selectCalls);

    return (
        <div className={styles['call-taker-container']}>
            <div className={styles['calls-list']}>
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