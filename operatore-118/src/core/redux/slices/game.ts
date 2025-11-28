import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { initStateFromStorage, syncStateFromOtherWindow } from '../middlewares/localStorage';
import type { Call } from '../../../model/call';
import type { Event } from '../../../model/event';
import type { Mission } from '../../../model/mission';
import type { Vehicle } from '../../../model/vehicle';
import type { EventType } from '../../simulation/EventQueue';

/**
 * Persisted scheduled event for page reload recovery
 * 
 * Stores minimal data needed to recreate a SimEvent after page reload.
 * The handler function is not persisted - it's recreated based on type.
 */
export interface ScheduledEvent {
  id: string;
  scheduledTime: number;
  type: EventType;
  payload: any;
}

export interface GameSlice {
  calls: Call[];
  events: Event[];
  vehicles: Vehicle[];
  /** Current simulation time in milliseconds (updated periodically, not every frame) */
  simulationTime: number;
  /** Scheduled events that need to be restored on page reload */
  scheduledEvents: ScheduledEvent[];
}

const initialState: GameSlice = {
  calls: [],
  events: [],
  vehicles: [],
  simulationTime: 0,
  scheduledEvents: [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Call actions
    addCall: (state: GameSlice, action: PayloadAction<Call>) => {
      state.calls.push(action.payload);
    },
    removeCall: (state: GameSlice, action: PayloadAction<string>) => {
      state.calls = state.calls.filter(call => call.id !== action.payload);
    },
    markCallAsProcessed: (state: GameSlice, action: PayloadAction<string>) => {
      const call = state.calls.find(call => call.id === action.payload);
      if (call) {
        call.processed = true;
      }
    },
    clearCalls: (state) => {
      state.calls = [];
    },
    // Vehicle actions
    setVehicles: (state: GameSlice, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
    },
    updateVehicleLocation: (state: GameSlice, action: PayloadAction<{ vehicleId: string; location: { latitude: number; longitude: number } }>) => {
      const vehicle = state.vehicles.find(v => v.id === action.payload.vehicleId);
      if (vehicle) {
        vehicle.currentLocation = action.payload.location;
      }
    },
    // Event actions
    addEvent: (state: GameSlice, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    removeEvent: (state: GameSlice, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    clearEvents: (state) => {
      state.events = [];
    },
    addMissionToEvent: (state: GameSlice, action: PayloadAction<{ eventId: string; mission: Mission }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.missions.push(action.payload.mission);
        console.log('🚑 Mission assigned:', {
          eventId: action.payload.eventId,
          missionId: action.payload.mission.id,
          vehicleId: action.payload.mission.vehicleId,
          status: action.payload.mission.status,
          createdAt: action.payload.mission.createdAt
        });
      }
    },
    removeMissionFromEvent: (state: GameSlice, action: PayloadAction<{ eventId: string; vehicleId: string }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.missions = event.missions.filter(m => m.vehicleId !== action.payload.vehicleId);
      }
    },
    // Simulation time action
    setSimulationTime: (state: GameSlice, action: PayloadAction<number>) => {
      state.simulationTime = action.payload;
    },
    // Mission lifecycle action - updates mission as it progresses (traveling → arrived → transporting → completed)
    updateMissionStatus: (state: GameSlice, action: PayloadAction<{
      eventId: string;
      missionId: string;
      status: Mission['status'];
      route?: Mission['route'];
    }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        const mission = event.missions.find(m => m.id === action.payload.missionId);
        if (mission) {
          const oldStatus = mission.status;
          mission.status = action.payload.status;
          if (action.payload.route !== undefined) {
            mission.route = action.payload.route;
          }
          console.log('🔄 Mission status updated:', {
            eventId: action.payload.eventId,
            missionId: action.payload.missionId,
            vehicleId: mission.vehicleId,
            oldStatus,
            newStatus: action.payload.status,
            hasRoute: !!action.payload.route,
            routeWaypoints: action.payload.route?.waypoints.length || 0
          });
        }
      }
    },
    incrementVehiclesOnScene: (state: GameSlice, action: PayloadAction<string>) => {
      const event = state.events.find(e => e.id === action.payload);
      if (event) {
        event.vehiclesOnScene = (event.vehiclesOnScene || 0) + 1;
        console.log('🚑 Vehicle arrived on scene:', {
          eventId: action.payload,
          vehiclesOnScene: event.vehiclesOnScene
        });
      }
    },
    // Scheduled events management
    addScheduledEvent: (state: GameSlice, action: PayloadAction<ScheduledEvent>) => {
      state.scheduledEvents.push(action.payload);
    },
    removeScheduledEvent: (state: GameSlice, action: PayloadAction<string>) => {
      state.scheduledEvents = state.scheduledEvents.filter(e => e.id !== action.payload);
    },
    clearScheduledEvents: (state: GameSlice) => {
      state.scheduledEvents = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(initStateFromStorage, (state, action) => {
      // When loading from storage, replace the game state
      state.calls = action.payload.game.calls;
      state.events = action.payload.game.events.map(event => ({
        ...event,
        missions: event.missions || [],
        vehiclesOnScene: event.vehiclesOnScene || 0
      }));
      state.vehicles = action.payload.game.vehicles || [];
      state.simulationTime = action.payload.game.simulationTime || 0;
      state.scheduledEvents = action.payload.game.scheduledEvents || [];
    });
    builder.addCase(syncStateFromOtherWindow, (state, action) => {
      // When syncing from other windows, update the game state
      state.calls = action.payload.game.calls;
      state.events = action.payload.game.events.map(event => ({
        ...event,
        missions: event.missions || [],
        vehiclesOnScene: event.vehiclesOnScene || 0
      }));
      state.vehicles = action.payload.game.vehicles || [];
      state.simulationTime = action.payload.game.simulationTime || 0;
      state.scheduledEvents = action.payload.game.scheduledEvents || [];
    });
  },
});

export const { 
  addCall, 
  removeCall, 
  markCallAsProcessed, 
  clearCalls,
  setVehicles,
  updateVehicleLocation,
  addEvent,
  removeEvent,
  clearEvents,
  addMissionToEvent,
  removeMissionFromEvent,
  setSimulationTime,
  updateMissionStatus,
  incrementVehiclesOnScene,
  addScheduledEvent,
  removeScheduledEvent,
  clearScheduledEvents
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;

// Selectors
export const selectAllCalls = (state: RootState) => state.game.calls;

export const selectCalls = createSelector(
  [selectAllCalls],
  (calls) => calls.filter(call => !call.processed)
);

export const selectCallById = (callId: string) => (state: RootState) => 
  state.game.calls.find(call => call.id === callId);

export const selectEvents = (state: RootState) => state.game.events;

export const selectVehicles = (state: RootState) => state.game.vehicles;

export const selectVehicleById = (vehicleId: string) => (state: RootState) =>
  state.game.vehicles.find(vehicle => vehicle.id === vehicleId);

export const selectSimulationTime = (state: RootState) => state.game.simulationTime;

export const selectScheduledEvents = (state: RootState) => state.game.scheduledEvents;

/**
 * Selects all missions from all events
 * 
 * @returns Flattened array of all missions across all events
 */
export const selectAllMissions = createSelector(
  [selectEvents],
  (events) => events.flatMap(event => event.missions)
);
