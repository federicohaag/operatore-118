import { useState, useEffect } from 'react';
import styles from './CallTakerForm.module.css';
import type { DettLuogo, DettMotivo, NoteEvento2 } from '../../../model/missionDetails';
import {
    Codice,
    Luogo,
    Motivo,
    Coscienza,
    NoteEvento,
    LUOGO_DETAILS_MAP,
    MOTIVO_DETAILS_MAP,
    NOTE_EVENTO_DETAILS_MAP
} from '../../../model/missionDetails';

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
                    <div className={styles['form-group']}>
                        <label htmlFor="codice">Codice:</label>
                        <select
                            id="codice"
                            value={codice}
                            onChange={(e) => setCodice(e.target.value as Codice | '')}
                            className={styles['form-select']}
                            style={{ borderLeft: `4px solid ${getColoreCodice(codice)}` }}
                        >
                            <option value="">-- Seleziona codice --</option>
                            {Object.values(Codice).map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="luogo">Luogo:</label>
                        <select
                            id="luogo"
                            value={luogo}
                            onChange={(e) => setLuogo(e.target.value as Luogo | '')}
                            className={styles['form-select']}
                        >
                            <option value="">-- Seleziona luogo --</option>
                            {Object.values(Luogo).map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="dett-luogo">Dett. Luogo:</label>
                        <select
                            id="dett-luogo"
                            value={dettLuogo}
                            onChange={(e) => setDettLuogo(e.target.value as DettLuogo | '')}
                            className={styles['form-select']}
                            disabled={!luogo || getDettLuogoOptions(luogo).length === 0}
                        >
                            <option value="">-- Seleziona dettaglio --</option>
                            {getDettLuogoOptions(luogo).map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="motivo">Motivo:</label>
                        <select
                            id="motivo"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value as Motivo | '')}
                            className={styles['form-select']}
                        >
                            <option value="">-- Seleziona motivo --</option>
                            {Object.values(Motivo).map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="dett-motivo">Dett. Motivo:</label>
                        <select
                            id="dett-motivo"
                            value={dettMotivo}
                            onChange={(e) => setDettMotivo(e.target.value as DettMotivo | '')}
                            className={styles['form-select']}
                            disabled={!motivo || getDettMotivoOptions(motivo).length === 0}
                        >
                            <option value="">-- Seleziona dettaglio --</option>
                            {getDettMotivoOptions(motivo).map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="coscienza">Coscienza:</label>
                        <select
                            id="coscienza"
                            value={coscienza}
                            onChange={(e) => setCoscienza(e.target.value as Coscienza | '')}
                            className={styles['form-select']}
                        >
                            <option value="">-- Seleziona coscienza --</option>
                            {Object.values(Coscienza).map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="note-evento">Note evento:</label>
                        <select
                            id="note-evento"
                            value={noteEvento}
                            onChange={(e) => setNoteEvento(e.target.value as NoteEvento | '')}
                            className={styles['form-select']}
                        >
                            <option value="">-- Seleziona note evento --</option>
                            {Object.values(NoteEvento).map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="note-evento2">Note evento 2:</label>
                        <select
                            id="note-evento2"
                            value={noteEvento2}
                            onChange={(e) => setNoteEvento2(e.target.value as NoteEvento2 | '')}
                            className={styles['form-select']}
                            disabled={!noteEvento || getNoteEvento2Options(noteEvento).length === 0}
                        >
                            <option value="">-- Seleziona dettaglio --</option>
                            {getNoteEvento2Options(noteEvento).map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="altro-evento">Altro evento:</label>
                        <input
                            id="altro-evento"
                            type="text"
                            value={altroEvento}
                            onChange={(e) => setAltroEvento(e.target.value)}
                            className={styles['form-input']}
                            placeholder="Campo libero per note aggiuntive"
                        />
                    </div>
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
                    Crea Missione
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