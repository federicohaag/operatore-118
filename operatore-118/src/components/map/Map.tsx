import { useEffect, useRef } from 'react';
import styles from './Map.module.css';
import type { Call } from '../../model/call';
import type { EventDetails } from '../../model/eventDetails';

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

export type EventLocation = {
    id: string;
    call: Call;
    details: EventDetails;
};

type MapProps = {
    initCenter: [number, number];
    initZoom?: number;
    center?: [number, number];
    zoom?: number;
    stations?: Station[];
    events?: EventLocation[];
}

export default function Map({ initCenter, initZoom = 10, center, zoom, stations = [], events = [] }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const stationMarkersRef = useRef<any[]>([]);
    const eventMarkersRef = useRef<Record<string, any>>({});

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
                addEventMarkers();
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

        // Function to add event markers
        const addEventMarkers = () => {
            if (!mapInstanceRef.current || !window.L || events.length === 0) return;
            
            console.log('✅ Adding', events.length, 'event markers to map');
            
            // Remove existing event markers
            Object.values(eventMarkersRef.current).forEach((marker: any) => marker.remove());
            eventMarkersRef.current = {};
            
            // Create custom icon for events (red marker)
            const eventIcon = window.L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            
            // Add markers for each event
            events.forEach(event => {
                const coordinates: [number, number] = [
                    event.call.location.address.latitude,
                    event.call.location.address.longitude
                ];
                const marker = window.L.marker(coordinates, { icon: eventIcon })
                    .bindPopup(`<b>Event ${event.details.codice}</b><br>${event.call.location.address.street} ${event.call.location.address.number}, ${event.call.location.address.city.name}`)
                    .addTo(mapInstanceRef.current);
                eventMarkersRef.current[event.id] = marker;
            });
            
            console.log('✅ Added', Object.keys(eventMarkersRef.current).length, 'event markers');
        };

        initializeMap();

        // Cleanup function
        return () => {
            stationMarkersRef.current.forEach(marker => marker.remove());
            stationMarkersRef.current = [];
            Object.values(eventMarkersRef.current).forEach((marker: any) => marker.remove());
            eventMarkersRef.current = {};
            
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [initCenter, initZoom, stations, events]);

    // Update map center and marker when center prop changes
    useEffect(() => {
        if (mapInstanceRef.current && window.L) {
            if (center) {
                // Pan to new center without changing zoom level
                mapInstanceRef.current.panTo(center, {
                    animate: true,
                    duration: 0.5
                });
                
                // Find and bounce the event marker at this location
                Object.values(eventMarkersRef.current).forEach((marker: any) => {
                    const markerLatLng = marker.getLatLng();
                    if (Math.abs(markerLatLng.lat - center[0]) < 0.00001 && 
                        Math.abs(markerLatLng.lng - center[1]) < 0.00001) {
                        // Found the marker, make it bounce
                        setTimeout(() => {
                            if (marker._icon) {
                                marker._icon.classList.add('bounce');
                                setTimeout(() => {
                                    if (marker._icon) {
                                        marker._icon.classList.remove('bounce');
                                    }
                                }, 1000);
                            }
                        }, 500);
                    }
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