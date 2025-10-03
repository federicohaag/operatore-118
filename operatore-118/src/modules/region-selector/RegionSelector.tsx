
import { useState } from 'react';
import styles from './RegionSelector.module.css';
import DispatchCenterSelectionOverlay from './DispatchCenterSelectionOverlay';

interface Region {
    name: string;
    available: boolean;
    unavailableMessage?: string;
}

const regions: Region[] = [
    { name: 'Calabria', available: true },
    { name: 'Emilia-Romagna', available: true },
    { name: 'Lazio', available: true },
    { name: 'Liguria', available: true },
    { name: 'Lombardia', available: true },
    { name: 'Puglia', available: true },
    { name: 'Sardegna', available: true },
    { name: 'Veneto', available: true },
    { name: 'Abruzzo', available: false, unavailableMessage: 'In fase di costruzione, tempistiche non note al momento' },
    { name: 'Basilicata', available: false, unavailableMessage: 'Non disponibile, scriveteci per info' },
    { name: 'Campania', available: false, unavailableMessage: 'Non disponibile, scriveteci per info' },
    { name: 'Friuli-Venezia Giulia', available: false, unavailableMessage: 'In fase di costruzione, tempistiche non note al momento' },
    { name: 'Marche', available: false, unavailableMessage: 'In fase di costruzione, tempistiche non note al momento' },
    { name: 'Molise', available: false, unavailableMessage: 'Non disponibile, scriveteci per info' },
    { name: 'Piemonte', available: false, unavailableMessage: 'Non disponibile, scriveteci per info' },
    { name: 'Sicilia', available: false, unavailableMessage: 'In fase di costruzione, tempistiche non note al momento' },
    { name: 'Toscana', available: false, unavailableMessage: 'In fase di costruzione, tempistiche non note al momento' },
    { name: 'Trentino-Alto Adige', available: false, unavailableMessage: 'In fase di costruzione, tempistiche non note al momento' },
    { name: 'Umbria', available: false, unavailableMessage: 'Non disponibile, scriveteci per info' },
    { name: "Valle d'Aosta", available: false, unavailableMessage: 'In fase di costruzione, tempistiche non note al momento' }
];

export default function RegionSelector() {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    const handleRegionClick = (region: Region) => {
        if (region.available) {
            setSelectedRegion(region.name);
        } else if (region.unavailableMessage) {
            alert(region.unavailableMessage);
        }
    };

    const handleDispatchCenterSelect = (dispatchCenter: string) => {
        if (selectedRegion) {
            // TBD
            alert(`Selected dispatch center: ${dispatchCenter} in region: ${selectedRegion}`);
        }
    };

    return (
        <div className={styles['dispatch-center-container']}>
            <img src="logo118.png" alt="Logo Centrale Operativa 118" className={styles['logo-dispatch-center']} />
            <h1 className={styles.h1}>Selezionare la Regione</h1>
            <div className={styles['regioni-container']}>
                {regions.map(region => (
                    <button
                        key={region.name}
                        className={`${styles['regione-btn']} ${!region.available ? styles['regione-prossimamente'] : ''}`}
                        onClick={() => handleRegionClick(region)}
                    >
                        {region.name}
                    </button>
                ))}
            {/* Sezione supporto */}
            <div className={styles['supporto-container']}>
                <a href="https://www.facebook.com/people/Operatore-118/61576502672516/?locale=it_IT" target="_blank" className={styles['supporto-btn'] + ' ' + styles['facebook-btn']}>
                    <svg className={styles['social-icon']} viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                </a>
                <a href="https://discord.gg/eCzj6wGxvD" target="_blank" className={styles['supporto-btn'] + ' ' + styles['discord-btn']}>
                    <svg className={styles['social-icon']} viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    Discord
                </a>
            </div>
            {selectedRegion && (
                <DispatchCenterSelectionOverlay
                    region={selectedRegion}
                    onClose={() => setSelectedRegion(null)}
                    onDispatchCenterSelect={handleDispatchCenterSelect}
                />
            )}
        </div>
    )
        </div>
    )
}
