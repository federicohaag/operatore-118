import { useEffect, useRef } from 'react';
import styles from './Map.module.css';
import type { Call } from '../../model/call';
import type { EventDetails } from '../../model/eventDetails';
import { Codice } from '../../model/eventDetails';

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
    calls?: Call[];
    events?: EventLocation[];
}

export default function Map({ initCenter, initZoom = 10, center, zoom, stations = [], calls = [], events = [] }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const stationMarkersRef = useRef<any[]>([]);
    const callMarkersRef = useRef<Record<string, any>>({});
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
            Object.values(callMarkersRef.current).forEach((marker: any) => marker.remove());
            callMarkersRef.current = {};
            Object.values(eventMarkersRef.current).forEach((marker: any) => marker.remove());
            eventMarkersRef.current = {};
            
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [initCenter, initZoom, stations]);
    
    // Separate effect for call markers (gray pins for unprocessed calls)
    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;
                
        // Get call IDs that are already events
        const eventCallIds = new Set(events.map(e => e.call.id));
        
        // Remove existing call markers
        Object.values(callMarkersRef.current).forEach((marker: any) => marker.remove());
        callMarkersRef.current = {};
        
        // Create custom icon for calls (gray marker)
        const callIcon = window.L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        
        // Add markers only for calls that haven't been processed into events
        calls.forEach(call => {
            if (!eventCallIds.has(call.id) && !call.processed) {
                const coordinates: [number, number] = [
                    call.location.address.latitude,
                    call.location.address.longitude
                ];
                const marker = window.L.marker(coordinates, { icon: callIcon })
                    .bindPopup(`<b>New Call</b><br>${call.location.address.street} ${call.location.address.number}, ${call.location.address.city.name}`)
                    .addTo(mapInstanceRef.current);
                callMarkersRef.current[call.id] = marker;
            }
        });
        
        console.log('✅ Updated call markers, now have', Object.keys(callMarkersRef.current).length);
    }, [calls, events]);
    
    // Separate effect for event markers to avoid re-initializing the entire map
    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;
                
        // Remove existing event markers
        Object.values(eventMarkersRef.current).forEach((marker: any) => marker.remove());
        eventMarkersRef.current = {};
        
        // Helper to get marker color based on triage code
        const getMarkerColor = (codice: string): string => {
            switch (codice) {
                case Codice.ROSSO:
                    return 'red';
                case Codice.GIALLO:
                    return 'yellow';
                case Codice.VERDE:
                    return 'green';
                default:
                    return 'red'; // fallback
            }
        };
        
        // Add markers for each event with color based on triage code
        events.forEach(event => {
            const coordinates: [number, number] = [
                event.call.location.address.latitude,
                event.call.location.address.longitude
            ];
            
            const color = getMarkerColor(event.details.codice);
            const eventIcon = window.L.icon({
                iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            
            const marker = window.L.marker(coordinates, { icon: eventIcon })
                .bindPopup(`<b>Event ${event.details.codice}</b><br>${event.call.location.address.street} ${event.call.location.address.number}, ${event.call.location.address.city.name}`)
                .addTo(mapInstanceRef.current);
            eventMarkersRef.current[event.id] = marker;
        });
        
        console.log('✅ Updated event markers, now have', Object.keys(eventMarkersRef.current).length);
    }, [events]);

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
                        // Found the marker, make it bounce immediately
                        if (marker._icon) {
                            marker._icon.classList.add('bounce');
                            setTimeout(() => {
                                if (marker._icon) {
                                    marker._icon.classList.remove('bounce');
                                }
                            }, 1000);
                        }
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