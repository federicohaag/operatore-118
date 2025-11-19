import { useEffect, useRef } from 'react';
import styles from './Map.module.css';

// Import Leaflet types
declare global {
    interface Window {
        L: any;
    }
}

export type Station = {
    name: string;
    coordinates: [number, number];
};

type MapProps = {
    initCenter: [number, number];
    initZoom?: number;
    center?: [number, number];
    zoom?: number;
    stations?: Station[];
}

export default function Map({ initCenter, initZoom = 10, center, zoom, stations = [] }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const stationMarkersRef = useRef<any[]>([]);

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
                
                // Add station markers after map is initialized
                addStationMarkers();
            }
        };
        
        // Function to add station markers
        const addStationMarkers = () => {
            if (!mapInstanceRef.current || !window.L || stations.length === 0) return;
            
            console.log('✅ Adding', stations.length, 'station markers to map');
            
            // Remove existing station markers
            stationMarkersRef.current.forEach(marker => marker.remove());
            stationMarkersRef.current = [];
            
            // Create custom icon for stations (smaller blue marker)
            const stationIcon = window.L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [20, 33],
                iconAnchor: [10, 33],
                popupAnchor: [1, -34],
                shadowSize: [33, 33]
            });
            
            // Add markers for each station
            stations.forEach(station => {
                const marker = window.L.marker(station.coordinates, { icon: stationIcon })
                    .bindPopup(station.name)
                    .addTo(mapInstanceRef.current);
                stationMarkersRef.current.push(marker);
            });
            
            console.log('✅ Added', stationMarkersRef.current.length, 'station markers');
        };

        initializeMap();

        // Cleanup function
        return () => {
            stationMarkersRef.current.forEach(marker => marker.remove());
            stationMarkersRef.current = [];
            
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [initCenter, initZoom, stations]);

    // Update map center and marker when center prop changes
    useEffect(() => {
        if (mapInstanceRef.current && window.L) {
            if (center) {
                // Pan to new center without changing zoom level
                mapInstanceRef.current.panTo(center, {
                    animate: true,
                    duration: 0.5
                });
                
                // Remove existing marker if any
                if (markerRef.current) {
                    markerRef.current.remove();
                    markerRef.current = null;
                }
            } else {
                // Remove marker if center is null/undefined
                if (markerRef.current) {
                    markerRef.current.remove();
                    markerRef.current = null;
                }
            }
        }
    }, [center, zoom]);

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