import { useState } from 'react';
import styles from './DispatchCenterSelectionOverlay.module.css';
import type { Region } from '../../model/region';

interface DispatchCenterSelectionOverlayProps {
    region: Region;
    onClose: () => void;
    onDispatchCenterSelect: (dispatchCenter: string) => void;
}

export default function DispatchCenterSelectionOverlay({ region, onClose, onDispatchCenterSelect }: DispatchCenterSelectionOverlayProps) {
    const [selectedDispatchCenter, setSelectedDispatchCenter] = useState(region.dispatchCenters?.[0]?.id || '');

    const handleStartSimulation = () => {
        onDispatchCenterSelect(selectedDispatchCenter);
    };

    // Se la regione non ha opzioni disponibili, non mostrare l'overlay
    if (!region.dispatchCenters) {
        onClose();
        return null;
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles['dispatch-center-selector-overlay']} onClick={handleOverlayClick}>
            <div className={styles['dispatch-center-selector-content']}>
                <h1>{region.label}</h1>
                <h2>Seleziona la Centrale 118</h2>
                <select 
                    value={selectedDispatchCenter}
                    onChange={(e) => setSelectedDispatchCenter(e.target.value)}
                >
                    {region.dispatchCenters.map(dispatchCenter => (
                        <option key={dispatchCenter.id} value={dispatchCenter.id}>
                            {dispatchCenter.label}
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