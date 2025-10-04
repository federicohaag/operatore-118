
import { useEffect, useRef } from 'react';
import styles from './RegionSelector.module.css';
import DispatchCenterSelectionOverlay from './DispatchCenterSelectionOverlay';
import { RegionStatus, type Region } from '../../model/types';
import { useAppDispatch, useAppSelector } from '../shared-state/hooks';
import { selectSelectedRegion } from '../shared-state/sharedStateSlice';
import { setSelectedRegion, setSelectedDispatchCenter } from '../shared-state/sharedStateSlice';
import { REGIONS } from '../../model/aggregates';

const StatusMessages: Record<RegionStatus, string> = {
    [RegionStatus.Available]: '',
    [RegionStatus.Unavailable]: 'Non disponibile, scriveteci per info',
    [RegionStatus.WorkInProgress]: 'In fase di costruzione, tempistiche non note al momento'
};

export default function RegionSelector() {
    const dispatch = useAppDispatch();
    const selectedRegion = useAppSelector(selectSelectedRegion);
    const overlayRef = useRef<HTMLDivElement>(null);
    const currentRegionObj = REGIONS.find(r => r.id === selectedRegion) || null;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (selectedRegion && overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
                dispatch(setSelectedRegion(null, true));
                dispatch(setSelectedDispatchCenter(null, true));
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedRegion, dispatch]);

    const handleRegionClick = (region: Region) => {
        if (region.status === RegionStatus.Available) {
            dispatch(setSelectedRegion(region.id, true));
        } else {
            alert(StatusMessages[region.status]);
        }
    };

    const handleDispatchCenterSelect = (dispatchCenter: string) => {
        if (currentRegionObj) {
            dispatch(setSelectedDispatchCenter(dispatchCenter, true));
        }
    };

    return (
        <>
            <img src="logo118.png" alt="Logo Centrale Operativa 118" className={styles['logo-dispatch-center']} />
            <h1 className={styles.h1}>Selezionare la Regione</h1>
            <div className={styles['regioni-container']}>
                {[...REGIONS]
                    .sort((a, b) => {
                        // First sort by availability
                        if (a.status === RegionStatus.Available && b.status !== RegionStatus.Available) return -1;
                        if (a.status !== RegionStatus.Available && b.status === RegionStatus.Available) return 1;
                        // Then sort alphabetically within each group
                        return a.label.localeCompare(b.label);
                    })
                    .map(region => (
                    <button
                        key={region.id}
                        className={`${styles['regione-btn']} ${region.status !== RegionStatus.Available ? styles['regione-prossimamente'] : ''}`}
                        onClick={() => handleRegionClick(region)}
                    >
                        {region.label}
                    </button>
                ))}
            </div>
            
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

            {currentRegionObj && (
                <div ref={overlayRef}>
                    <DispatchCenterSelectionOverlay
                        region={currentRegionObj}
                        onClose={() => dispatch(setSelectedRegion(null))}
                        onDispatchCenterSelect={handleDispatchCenterSelect}
                    />
                </div>
            )}
        </>
    );
}
