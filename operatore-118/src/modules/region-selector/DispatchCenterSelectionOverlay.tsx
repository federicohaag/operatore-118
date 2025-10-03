import { useState } from 'react';
import styles from './DispatchCenterSelectionOverlay.module.css';

interface DispatchCenterSelectionOverlayProps {
    region: string;
    onClose: () => void;
    onDispatchCenterSelect: (dispatchCenter: string) => void;
}

interface DispatchCenterOption {
    value: string;
    label: string;
}

const dispatchCenterOptions: Record<string, DispatchCenterOption[]> = {
    'Calabria': [
        { value: 'NORD', label: 'SUEM 118 Nord' },
        { value: 'SUD', label: 'SUEM 118 Sud' }
    ],
    'Emilia-Romagna': [
        { value: '118 Emilia Ovest', label: '118 Emilia Ovest' },
        { value: '118 Emilia Est', label: '118 Emilia Est' },
        { value: '118 Romagna', label: '118 Romagna' }
    ],
    'Lazio': [
        { value: 'NORD', label: 'CORES NORD' },
        { value: 'METRO', label: 'CORES METROPOLITANA' },
        { value: 'SUD', label: 'CORES SUD' }
    ],
    'Liguria': [
        { value: 'ASL1', label: '118 Imperia Soccorso' },
        { value: 'ASL2', label: '118 Savona Soccorso' },
        { value: 'ASL3', label: '118 Genova Soccorso' },
        { value: 'ASL4', label: '118 Tigullio Soccorso' },
        { value: 'ASL5', label: '118 La Spezia Soccorso' }
    ],
    'Lombardia': [
        { value: 'SRA', label: 'SOREU Alpina' },
        { value: 'SRL', label: 'SOREU Laghi' },
        { value: 'SRM', label: 'SOREU Metropolitana' },
        { value: 'SRP', label: 'SOREU Pianura' }
    ],
    'Puglia': [
        { value: 'FG', label: '118 Foggia' },
        { value: 'BA', label: '118 Bari' },
        { value: 'BR', label: '118 Brindisi' },
        { value: 'LE', label: '118 Lecce' }
    ],
    'Sardegna': [
        { value: 'NORD', label: '118 Nord - Sassari' },
        { value: 'SUD', label: '118 Sud - Cagliari' }
    ],
    'Veneto': [
        { value: 'Belluno Emergenza', label: '118 Belluno Emergenza' },
        { value: 'Padova Emergenza', label: '118 Padova Emergenza' },
        { value: 'Rovigo Emergenza', label: '118 Rovigo Emergenza' },
        { value: 'Treviso Emergenza', label: '118 Treviso Emergenza' },
        { value: 'Venezia Emergenza', label: '118 Venezia Emergenza' },
        { value: 'Vicenza Emergenza', label: '118 Vicenza Emergenza' },
        { value: 'Verona Emergenza', label: '118 Verona Emergenza' }
    ]
};

export default function DispatchCenterSelectionOverlay({ region, onClose, onDispatchCenterSelect }: DispatchCenterSelectionOverlayProps) {
    const [selectedDispatchCenter, setSelectedDispatchCenter] = useState(dispatchCenterOptions[region]?.[0]?.value || '');

    const handleStartSimulation = () => {
        onDispatchCenterSelect(selectedDispatchCenter);
    };

    // Se la regione non ha opzioni disponibili, non mostrare l'overlay
    if (!dispatchCenterOptions[region]) {
        onClose();
        return null;
    }

    return (
        <div className={styles['dispatch-center-selector-overlay']}>
            <div className={styles['dispatch-center-selector-content']}>
                <div className={styles['dispatch-center-logo']}>
                    <img src="/src/assets/logo gioco.png" alt="Logo Gioco" />
                </div>
                <h2>Seleziona la Centrale 118</h2>
                <select 
                    value={selectedDispatchCenter}
                    onChange={(e) => setSelectedDispatchCenter(e.target.value)}
                >
                    {dispatchCenterOptions[region].map(option => (
                        <option key={option.value} value={option.value}>
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