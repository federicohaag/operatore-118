import { useEffect, useRef } from 'react';
import type { Mission } from '../../model/mission';
import { MissionStatus } from '../../model/mission';
import type { Vehicle } from '../../model/vehicle';
import { VehicleType } from '../../model/vehicle';
import MSBIcon from '../../assets/MSB.png';
import MSAIcon from '../../assets/MSA.png';

declare global {
    interface Window {
        L: any;
    }
}

type AnimatedVehicleMarkersProps = {
    /** Leaflet map instance */
    mapInstance: any;
    /** All missions */
    missions: Mission[];
    /** All vehicles for lookup */
    vehicles: Vehicle[];
    /** Current simulation time in milliseconds */
    simulationTime: number;
};

/**
 * Component that renders and animates vehicle markers on the map
 * 
 * Uses requestAnimationFrame for smooth 60fps animations.
 * Calculates positions from mission data using useVehiclePosition hook,
 * avoiding continuous Redux updates.
 */
export default function AnimatedVehicleMarkers({
    mapInstance,
    missions,
    vehicles,
    simulationTime
}: AnimatedVehicleMarkersProps) {
    const vehicleMarkersRef = useRef<Record<string, any>>({});
    const animationFrameRef = useRef<number | null>(null);
    
    // Create a stable dependency based on mission content, not array reference
    const missionKey = missions
        .filter(m => m.route && (
            m.status === MissionStatus.TRAVELING_TO_SCENE || 
            m.status === MissionStatus.TRAVELING_TO_HOSPITAL ||
            m.status === MissionStatus.RETURNING_TO_STATION
        ))
        .map(m => `${m.vehicleId}-${m.status}`)
        .sort()
        .join(',');
    
    useEffect(() => {
        console.log('🔍 AnimatedVehicleMarkers effect triggered:', {
            hasMap: !!mapInstance,
            hasLeaflet: !!window.L,
            vehiclesCount: vehicles.length,
            missionsCount: missions.length,
            missionKey
        });
        
        if (!mapInstance || !window.L) {
            console.log('⏸️ No map or Leaflet');
            return;
        }
        
        // Don't try to create markers if vehicles haven't loaded yet
        if (vehicles.length === 0) {
            console.log('⏸️ Skipping marker creation - no vehicles loaded yet');
            return;
        }
        
        // Get active missions (those with routes)
        const activeMissions = missions.filter(m => 
            m.route && 
            (m.status === MissionStatus.TRAVELING_TO_SCENE || 
             m.status === MissionStatus.TRAVELING_TO_HOSPITAL ||
             m.status === MissionStatus.RETURNING_TO_STATION)
        );
        
        console.log('🗺️ Processing missions for markers:', {
            totalMissions: missions.length,
            activeMissions: activeMissions.length
        });
        
        /**
         * Gets the appropriate icon URL based on vehicle type
         * 
         * @param vehicleType - Type of vehicle (MSB, MSA1, MSA2)
         * @returns Icon URL for the marker
         */
        const getVehicleIconUrl = (vehicleType: string): string => {
            switch (vehicleType) {
                case VehicleType.MSB:
                    return MSBIcon;
                case VehicleType.MSA1:
                case VehicleType.MSA2:
                    return MSAIcon;
                default:
                    return MSBIcon; // fallback
            }
        };
        
        // Get current set of active vehicle IDs
        const activeVehicleIds = new Set(activeMissions.map(m => m.vehicleId));
        const existingVehicleIds = new Set(Object.keys(vehicleMarkersRef.current));
        
        // Remove markers for vehicles that are no longer active
        existingVehicleIds.forEach(vehicleId => {
            if (!activeVehicleIds.has(vehicleId)) {
                console.log('❌ Removing marker for vehicle:', vehicleId);
                try {
                    vehicleMarkersRef.current[vehicleId].remove();
                } catch (error) {
                    console.warn('Failed to remove marker:', error);
                }
                delete vehicleMarkersRef.current[vehicleId];
            }
        });
        
        // Add markers only for new active vehicles (not already in markers)
        activeMissions.forEach(mission => {
            const vehicle = vehicles.find(v => v.id === mission.vehicleId);
            if (!vehicle) return;
            
            // Skip if marker already exists
            if (vehicleMarkersRef.current[mission.vehicleId]) {
                return;
            }
            
            try {
                // Create custom icon based on vehicle type
                const vehicleIcon = window.L.icon({
                    iconUrl: getVehicleIconUrl(vehicle.vehicleType),
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40],
                    shadowSize: [41, 41]
                });
                
                const marker = window.L.marker([0, 0], { icon: vehicleIcon })
                    .bindPopup(`${vehicle.vehicleType}: ${vehicle.radioName}`)
                    .addTo(mapInstance);
                
                vehicleMarkersRef.current[mission.vehicleId] = marker;
            } catch (error) {
                console.error('Failed to create marker for vehicle:', mission.vehicleId, error);
            }
        });
    }, [mapInstance, missionKey, vehicles.length]); // Use missionKey instead of missions to detect content changes
    
    // Cleanup on unmount only
    useEffect(() => {
        return () => {
            Object.values(vehicleMarkersRef.current).forEach((marker: any) => {
                try {
                    marker.remove();
                } catch (e) {
                    // Ignore cleanup errors
                }
            });
            vehicleMarkersRef.current = {};
        };
    }, [mapInstance]);
    
    // Separate effect for animation loop
    useEffect(() => {
        // Get active missions (those with routes)
        const activeMissions = missions.filter(m => 
            m.route && 
            (m.status === MissionStatus.TRAVELING_TO_SCENE || 
             m.status === MissionStatus.TRAVELING_TO_HOSPITAL ||
             m.status === MissionStatus.RETURNING_TO_STATION)
        );
        
        if (!mapInstance || activeMissions.length === 0) {
            return;
        }
                
        let lastTime = performance.now();
        let frameCount = 0;
        
        const animate = () => {
            const now = performance.now();
            const delta = now - lastTime;
            
            // Throttle to ~30fps to reduce CPU usage (still smooth enough)
            if (delta < 33) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }
            
            lastTime = now;
            frameCount++;
            
            // Update each active vehicle marker position
            activeMissions.forEach(mission => {
                const marker = vehicleMarkersRef.current[mission.vehicleId];
                if (!marker || !mission.route) {
                    return;
                }
                
                // Calculate current position using the hook logic directly
                const position = calculateVehiclePosition(mission, simulationTime);
                
                if (position) {
                    marker.setLatLng([position.latitude, position.longitude]);
                }
            });
            
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        // Start animation loop
        animationFrameRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [mapInstance, missions, simulationTime]);
    
    // This component doesn't render anything - it just manages markers
    return null;
}

/**
 * Calculates vehicle position along route (extracted from useVehiclePosition hook)
 * 
 * @param mission Mission with route
 * @param currentSimTime Current simulation time in milliseconds
 * @returns Current position coordinates or null
 */
function calculateVehiclePosition(
    mission: Mission, 
    currentSimTime: number
): { latitude: number; longitude: number } | null {
    if (!mission.route || !mission.route.waypoints.length) return null;
    
    const { route, speed } = mission;
    const { waypoints, totalDistance, startedAt } = route;
    
    // Calculate elapsed time and distance traveled
    const elapsedMs = currentSimTime - startedAt;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    const distanceTraveled = speed * elapsedHours; // km
    
    // If arrived, return last waypoint
    if (distanceTraveled >= totalDistance) {
        const lastWaypoint = waypoints[waypoints.length - 1];
        return { latitude: lastWaypoint.latitude, longitude: lastWaypoint.longitude };
    }
    
    // Find the segment containing the current position
    let accumulatedDistance = 0;
    
    for (let i = 0; i < waypoints.length - 1; i++) {
        const from = waypoints[i];
        const to = waypoints[i + 1];
        const segmentDistance = haversineDistance(from, to);
        
        if (accumulatedDistance + segmentDistance >= distanceTraveled) {
            // Current position is within this segment
            const distanceIntoSegment = distanceTraveled - accumulatedDistance;
            const segmentProgress = distanceIntoSegment / segmentDistance;
            
            // Linear interpolation
            return {
                latitude: from.latitude + (to.latitude - from.latitude) * segmentProgress,
                longitude: from.longitude + (to.longitude - from.longitude) * segmentProgress
            };
        }
        
        accumulatedDistance += segmentDistance;
    }
    
    // Fallback to last waypoint
    const lastWaypoint = waypoints[waypoints.length - 1];
    return { latitude: lastWaypoint.latitude, longitude: lastWaypoint.longitude };
}

/**
 * Calculates great-circle distance between two points using Haversine formula
 * 
 * @param from Starting waypoint
 * @param to Ending waypoint
 * @returns Distance in kilometers
 */
function haversineDistance(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
): number {
    const R = 6371; // Earth radius in km
    const dLat = toRadians(to.latitude - from.latitude);
    const dLon = toRadians(to.longitude - from.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(from.latitude)) * 
              Math.cos(toRadians(to.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}
