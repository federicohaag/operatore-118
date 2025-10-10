import styles from './CallTaker.module.css';
import type { Scheduler } from '../../../utils/Scheduler';

interface CallTakerProps {
    scheduler: Scheduler;
}

export default function CallTaker({ scheduler }: CallTakerProps) {
    return (
        <div className={styles['call-taker-container']}>
            <h3>Call Taker</h3>
            <p>Contenuto delle chiamate in arrivo...</p>
            <p>Scheduler events in queue: {scheduler.size()}</p>
        </div>
    );
}