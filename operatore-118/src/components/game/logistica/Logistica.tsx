import styles from './Logistica.module.css';
import { useAppSelector } from '../../../core/redux/hooks';
import { selectEvents } from '../../../core/redux/slices/events';

export default function Logistica() {
    const events = useAppSelector(selectEvents);

    return (
        <div className={styles['logistica-container']}>
            <h3>Eventi Creati</h3>
            {events.length === 0 ? (
                <p className={styles['empty-message']}>Nessun evento creato</p>
            ) : (
                <div className={styles['events-list']}>
                    {events.map((event) => (
                        <div key={event.id} className={styles['event-card']}>
                            <div className={styles['event-header']}>
                                <span className={styles['event-icon']}>📋</span>
                                <span className={styles['event-code']} style={{ 
                                    backgroundColor: getColoreCodice(event.details.codice),
                                    color: 'white'
                                }}>
                                    {event.details.codice}
                                </span>
                            </div>
                            <div className={styles['event-body']}>
                                <div className={styles['event-row']}>
                                    <strong>Luogo:</strong> {event.details.luogo}
                                    {event.details.dettLuogo && ` - ${event.details.dettLuogo}`}
                                </div>
                                <div className={styles['event-row']}>
                                    <strong>Motivo:</strong> {event.details.motivo}
                                    {event.details.dettMotivo && ` - ${event.details.dettMotivo}`}
                                </div>
                                <div className={styles['event-row']}>
                                    <strong>Coscienza:</strong> {event.details.coscienza}
                                </div>
                                <div className={styles['event-row']}>
                                    <strong>Note:</strong> {event.details.noteEvento}
                                    {event.details.noteEvento2 && ` - ${event.details.noteEvento2}`}
                                </div>
                                {event.details.altroEvento && (
                                    <div className={styles['event-row']}>
                                        <strong>Altro:</strong> {event.details.altroEvento}
                                    </div>
                                )}
                                <div className={styles['event-footer']}>
                                    {event.details.vvf && (
                                        <span className={styles['badge']}>🚒 VVF</span>
                                    )}
                                    {event.details.ffo && (
                                        <span className={styles['badge']}>👮 Forze Ordine</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function getColoreCodice(codice: string): string {
    switch (codice) {
        case 'ROSSO': return '#e53935';
        case 'GIALLO': return '#ffb300';
        case 'VERDE': return '#4caf50';
        default: return '#888';
    }
}