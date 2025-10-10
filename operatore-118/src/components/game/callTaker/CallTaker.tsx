import styles from './CallTaker.module.css';
import { useAppSelector } from '../../../global-state/hooks';
import { selectCalls } from '../../../global-state/slices/calls';

export default function CallTaker() {
    const calls = useAppSelector(selectCalls);

    return (
        <div className={styles['call-taker-container']}>
            <div className={styles['calls-list']}>
                {calls.length === 0 ? (
                    <p>No active calls</p>
                ) : (
                    <ul>
                        {calls.map((call, index) => (
                            <li key={index}>Call ID: {call.id}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}