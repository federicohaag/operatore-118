import { useState } from 'react';
import styles from './Logistica.module.css';
import { useAppSelector } from '../../../core/redux/hooks';
import { selectEvents } from '../../../core/redux/slices/events';

export default function Logistica() {
    const events = useAppSelector(selectEvents);
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

    return (
        <div className={styles['logistica-container']}>
            <h3>Eventi Creati</h3>
            {events.length === 0 ? (
                <p className={styles['empty-message']}>Nessun evento creato</p>
            ) : (
                <div className={styles['events-list']}>
                    {events.map((event) => {
                        const isExpanded = expandedEventId === event.id;
                        const toggleExpand = () => {
                            setExpandedEventId(isExpanded ? null : event.id);
                        };

                        return (
                            <div key={event.id} className={styles['event-card']} onClick={toggleExpand}>
                                <div className={styles['event-header']}>
                                    <span className={styles['expand-icon']}>{isExpanded ? '▼' : '▶'}</span>
                                    <span className={styles['event-icon']}>📋</span>
                                    <span className={styles['event-code']} style={{ 
                                        backgroundColor: getColoreCodice(event.details.codice),
                                        color: 'white'
                                    }}>
                                        {event.details.codice}
                                    </span>
                                    <span className={styles['event-location']}>
                                        {event.details.luogo}
                                    </span>
                                </div>
                                {isExpanded && (
                                    <div className={styles['event-body']}>
                                        {Object.entries(event.details).map(([key, value]) => {
                                            if (value === undefined || value === null || value === "") return null;
                                            if (key === "vvf" || key === "ffo") return null;
                                            // Label mapping for better display
                                            const labels: Record<string, string> = {
                                                codice: "Codice",
                                                luogo: "Luogo",
                                                dettLuogo: "Dettaglio Luogo",
                                                motivo: "Motivo",
                                                dettMotivo: "Dettaglio Motivo",
                                                coscienza: "Coscienza",
                                                noteEvento: "Note",
                                                noteEvento2: "Note aggiuntive",
                                                altroEvento: "Altro"
                                            };
                                            return (
                                                <div key={key} className={styles['event-row']}>
                                                    <strong>{labels[key] || key}:</strong> {value}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
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