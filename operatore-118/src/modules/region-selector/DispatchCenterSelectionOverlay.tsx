import { useState } from 'react';
import styles from './DispatchCenterSelectionOverlay.module.css';
import { type RegionName } from './types';
import { dispatchCenterConfig } from './config';

interface DispatchCenterSelectionOverlayProps {
    region: RegionName;
    onClose: () => void;
    onDispatchCenterSelect: (dispatchCenter: string) => void;
}

export default function DispatchCenterSelectionOverlay({ region, onClose, onDispatchCenterSelect }: DispatchCenterSelectionOverlayProps) {
    const [selectedDispatchCenter, setSelectedDispatchCenter] = useState(dispatchCenterConfig[region]?.[0]?.id || '');

    const handleStartSimulation = () => {
        onDispatchCenterSelect(selectedDispatchCenter);
    };

    // Se la regione non ha opzioni disponibili, non mostrare l'overlay
    if (!dispatchCenterConfig[region]) {
        onClose();
        return null;
    }

    return (
        <div className={styles['dispatch-center-selector-overlay']}>
            <div className={styles['dispatch-center-selector-content']}>
                <h1>{region}</h1>
                <h2>Seleziona la Centrale 118</h2>
                <select 
                    value={selectedDispatchCenter}
                    onChange={(e) => setSelectedDispatchCenter(e.target.value)}
                >
                    {dispatchCenterConfig[region].map(option => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <button onClick={handleStartSimulation}>
                    Avvia simulazione
                </button>
            </div>
        </div>
    );
}