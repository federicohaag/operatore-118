import { useEffect, useRef } from 'react';
import styles from './Map.module.css';

// Import Leaflet types
declare global {
    interface Window {
        L: any;
    }
}

type MapProps = {
    initCenter: [number, number];
    initZoom?: number;
}

export default function Map({ initCenter, initZoom = 10 }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        // Load Leaflet CSS and JS
        const loadLeaflet = async () => {
            // Load CSS
            if (!document.querySelector('link[href*="leaflet"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            // Load JS
            if (!window.L) {
                return new Promise<void>((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.onload = () => resolve();
                    document.head.appendChild(script);
                });
            }
        };

        const initializeMap = async () => {
            await loadLeaflet();
            
            if (mapRef.current && window.L && !mapInstanceRef.current) {
                // Initialize the map
                mapInstanceRef.current = window.L.map(mapRef.current).setView(initCenter, initZoom);
                
                // Add OpenStreetMap tile layer
                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(mapInstanceRef.current);
            }
        };

        initializeMap();

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [initCenter, initZoom]);

    return (
        <div className={styles['map-container']}>
            <div 
                ref={mapRef} 
                className={styles['leaflet-map']}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}