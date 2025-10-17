import { useState, useEffect } from 'react';
import styles from './CallTakerForm.module.css';
import type { DettLuogo, DettMotivo, NoteEvento2 } from '../../../model/eventDetails';
import {
    Codice,
    Luogo,
    Motivo,
    Coscienza,
    NoteEvento,
    LUOGO_DETAILS_MAP,
    MOTIVO_DETAILS_MAP,
    NOTE_EVENTO_DETAILS_MAP
} from '../../../model/eventDetails';

interface CallTakerFormProps {
    onEventCreated?: () => void;
}

export default function CallTakerForm({ onEventCreated }: CallTakerFormProps) {
    const [codice, setCodice] = useState<Codice | ''>('');
    const [luogo, setLuogo] = useState<Luogo | ''>('');
    const [dettLuogo, setDettLuogo] = useState<DettLuogo | ''>('');
    const [motivo, setMotivo] = useState<Motivo | ''>('');
    const [dettMotivo, setDettMotivo] = useState<DettMotivo | ''>('');
    const [coscienza, setCoscienza] = useState<Coscienza | ''>('');
    const [noteEvento, setNoteEvento] = useState<NoteEvento | ''>('');
    const [noteEvento2, setNoteEvento2] = useState<NoteEvento2 | ''>('');
    const [altroEvento, setAltroEvento] = useState<string>('');
    const [vvf, setVvf] = useState<boolean>(false);
    const [ffo, setFfo] = useState<boolean>(false);

    // Get detailed options based on parent selection
    const getDettLuogoOptions = (luogo: Luogo | ''): readonly string[] => {
        if (!luogo) return [];
        return LUOGO_DETAILS_MAP[luogo] || [];
    };

    const getDettMotivoOptions = (motivo: Motivo | ''): readonly string[] => {
        if (!motivo) return [];
        return MOTIVO_DETAILS_MAP[motivo] || [];
    };

    const getNoteEvento2Options = (noteEvento: NoteEvento | ''): readonly string[] => {
        if (!noteEvento) return [];
        return NOTE_EVENTO_DETAILS_MAP[noteEvento] || [];
    };

    // Update dependent fields when parent selection changes
    useEffect(() => {
        const options = getDettLuogoOptions(luogo);
        if (options.length > 0 && !options.includes(dettLuogo)) {
            setDettLuogo('');
        }
    }, [luogo, dettLuogo]);

    useEffect(() => {
        const options = getDettMotivoOptions(motivo);
        if (options.length > 0 && !options.includes(dettMotivo)) {
            setDettMotivo('');
        }
    }, [motivo, dettMotivo]);

    useEffect(() => {
        const options = getNoteEvento2Options(noteEvento);
        if (options.length > 0 && !options.includes(noteEvento2)) {
            setNoteEvento2('');
        }
    }, [noteEvento, noteEvento2]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (onEventCreated) {
            onEventCreated();
        }

        // Reset form
        setCodice('');
        setLuogo('');
        setDettLuogo('');
        setMotivo('');
        setDettMotivo('');
        setCoscienza('');
        setNoteEvento('');
        setNoteEvento2('');
        setAltroEvento('');
        setVvf(false);
        setFfo(false);
    };

    return (
        <div className={styles['form-container']}>
            <form onSubmit={handleSubmit} className={styles['event-form']}>
                <div className={styles['form-grid']}>
                    {/* first row: codice always visible */}
                    <div className={styles['form-group']}>
                        <select
                            id="codice"
                            aria-label="Codice"
                            value={codice}
                            onChange={(e) => setCodice(e.target.value as Codice | '')}
                            className={styles['form-select']}
                            style={{ borderLeft: `4px solid ${getColoreCodice(codice)}` }}
                        >
                            <option value="">-- Codice --</option>
                            {Object.values(Codice).map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>

                    {/* show Luogo once Codice selected */}
                    {codice !== '' && (
                        <div className={styles['form-group']}>
                            <select
                                id="luogo"
                                aria-label="Luogo"
                                value={luogo}
                                onChange={(e) => setLuogo(e.target.value as Luogo | '')}
                                className={styles['form-select']}
                            >
                                <option value="">-- Luogo --</option>
                                {Object.values(Luogo).map(value => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* show Dett. Luogo once Luogo selected */}
                    {luogo !== '' && (
                        <div className={styles['form-group']}>
                            <select
                                id="dett-luogo"
                                aria-label="Dettaglio luogo"
                                value={dettLuogo}
                                onChange={(e) => setDettLuogo(e.target.value as DettLuogo | '')}
                                className={styles['form-select']}
                                disabled={getDettLuogoOptions(luogo).length === 0}
                            >
                                <option value="">-- Dettaglio --</option>
                                {getDettLuogoOptions(luogo).map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* show Motivo once Dett. Luogo selected OR if Luogo had no details */}
                    {(dettLuogo !== '' || (luogo !== '' && getDettLuogoOptions(luogo).length === 0)) && (
                        <div className={styles['form-group']}>
                            <select
                                id="motivo"
                                aria-label="Motivo"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value as Motivo | '')}
                                className={styles['form-select']}
                            >
                                <option value="">-- Motivo --</option>
                                {Object.values(Motivo).map(value => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* show Dett. Motivo once Motivo selected */}
                    {motivo !== '' && (
                        <div className={styles['form-group']}>
                            <select
                                id="dett-motivo"
                                aria-label="Dettaglio motivo"
                                value={dettMotivo}
                                onChange={(e) => setDettMotivo(e.target.value as DettMotivo | '')}
                                className={styles['form-select']}
                                disabled={getDettMotivoOptions(motivo).length === 0}
                            >
                                <option value="">-- Dettaglio --</option>
                                {getDettMotivoOptions(motivo).map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* show Coscienza after Dett. Motivo selected or if Motivo had no details */}
                    {(dettMotivo !== '' || (motivo !== '' && getDettMotivoOptions(motivo).length === 0)) && (
                        <div className={styles['form-group']}>
                            <select
                                id="coscienza"
                                aria-label="Coscienza"
                                value={coscienza}
                                onChange={(e) => setCoscienza(e.target.value as Coscienza | '')}
                                className={styles['form-select']}
                            >
                                <option value="">-- Coscienza --</option>
                                {Object.values(Coscienza).map(value => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* show Note evento after Coscienza selected */}
                    {coscienza !== '' && (
                        <div className={styles['form-group']}>
                            <select
                                id="note-evento"
                                aria-label="Note evento"
                                value={noteEvento}
                                onChange={(e) => setNoteEvento(e.target.value as NoteEvento | '')}
                                className={styles['form-select']}
                            >
                                <option value="">-- Note --</option>
                                {Object.values(NoteEvento).map(value => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* show Note evento 2 after Note evento selected */}
                    {noteEvento !== '' && (
                        <div className={styles['form-group']}>
                            <select
                                id="note-evento2"
                                aria-label="Note evento 2"
                                value={noteEvento2}
                                onChange={(e) => setNoteEvento2(e.target.value as NoteEvento2 | '')}
                                className={styles['form-select']}
                                disabled={getNoteEvento2Options(noteEvento).length === 0}
                            >
                                <option value="">-- Dettaglio --</option>
                                {getNoteEvento2Options(noteEvento).map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* show Altro evento after Note evento 2 selected or if previous had no details */}
                    {(noteEvento2 !== '' || (noteEvento !== '' && getNoteEvento2Options(noteEvento).length === 0)) && (
                        <div className={styles['form-group']}>
                            <input
                                id="altro-evento"
                                aria-label="Altro evento"
                                type="text"
                                value={altroEvento}
                                onChange={(e) => setAltroEvento(e.target.value)}
                                className={styles['form-input']}
                                placeholder="-- Altro --"
                            />
                        </div>
                    )}
                </div>

                <div className={styles['checkbox-group']}>
                    <label>
                        <input
                            type="checkbox"
                            checked={vvf}
                            onChange={(e) => setVvf(e.target.checked)}
                        />
                        <span>Vigili del Fuoco</span>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={ffo}
                            onChange={(e) => setFfo(e.target.checked)}
                        />
                        <span>Forze Ordine</span>
                    </label>
                </div>

                <button type="submit" className={styles['submit-button']}>
                    Crea Evento
                </button>
            </form>
        </div>
    );
}

function getColoreCodice(codice: Codice | ''): string {
    switch (codice) {
        case Codice.ROSSO: return '#e53935';
        case Codice.GIALLO: return '#ffb300';
        case Codice.VERDE: return '#4caf50';
        default: return '#888';
    }
}