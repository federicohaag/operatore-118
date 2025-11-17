import { useState } from 'react';
import styles from './Logistica.module.css';
import { useAppSelector } from '../../../core/redux/hooks';
import { selectEvents } from '../../../core/redux/slices/events';
import { selectCallById } from '../../../core/redux/slices/calls';
import { Luogo, LUOGO_ICON_MAP, Motivo, MOTIVO_ICON_MAP } from '../../../model/eventDetails';

export default function Logistica() {
    const events = useAppSelector(selectEvents);
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

    return (
        <div className={styles['logistica-container']}>
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
                                    <span className={styles['event-code']} style={{ 
                                        backgroundColor: getColoreCodice(event.details.codice),
                                        color: 'white'
                                    }}>
                                        {getCodiceInitial(event.details.codice)}
                                    </span>
                                    <span className={styles['location-icon']} title="Luogo">{getLuogoIcon(event.details.luogo)}</span>
                                    <span className={styles['motivo-icon']} title="Motivo">{getMotivoIcon(event.details.motivo)}</span>
                                    {(() => {
                                        const call = useAppSelector(selectCallById(event.callId));
                                        if (!call) return null;
                                        const fullAddress = `${call.location.address.street} ${call.location.address.number}`.toUpperCase();
                                        const truncatedAddress = fullAddress.length > 50 ? fullAddress.substring(0, 50) + '...' : fullAddress;
                                        return (
                                            <>
                                                <span className={styles['event-city']}>{call.location.address.city.name.toUpperCase()}</span>
                                                <span className={styles['event-address']} title={fullAddress}>{truncatedAddress}</span>
                                            </>
                                        );
                                    })()}
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

function getCodiceInitial(codice: string): string {
    switch (codice) {
        case 'ROSSO': return 'R';
        case 'GIALLO': return 'G';
        case 'VERDE': return 'V';
        default: return '?';
    }
}

function getLuogoIcon(luogo: Luogo): string {
    return LUOGO_ICON_MAP[luogo];
}

function getMotivoIcon(motivo: Motivo): string {
    return MOTIVO_ICON_MAP[motivo];
}