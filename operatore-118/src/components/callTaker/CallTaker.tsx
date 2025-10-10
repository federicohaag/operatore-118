import styles from './CallTaker.module.css';

export default function CallTaker() {
    return (
        <div className={styles['call-taker-container']}>
            <h3>Call Taker</h3>
            <p>Contenuto delle chiamate in arrivo...</p>
        </div>
    );
}