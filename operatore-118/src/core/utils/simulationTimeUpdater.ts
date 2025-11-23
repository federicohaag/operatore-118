/**
 * Simulation Time Updater
 * 
 * This module provides utilities for periodically updating the simulation time
 * in Redux state. The simulation time is updated at a lower frequency than
 * animation frames to avoid excessive Redux updates while still maintaining
 * smooth vehicle animations.
 * 
 * ## Update Strategy
 * 
 * - **Update interval**: Every 1 simulation second (or configurable interval)
 * - **Why not every frame?**: Updating Redux 60 times per second would:
 *   - Trigger excessive re-renders across all components
 *   - Flood localStorage with sync events
 *   - Cause performance degradation
 * 
 * - **Animation smoothness**: Even with 1-second updates, vehicle animations
 *   remain smooth because:
 *   - Map components can interpolate between updates using requestAnimationFrame
 *   - Position calculation is deterministic (same inputs = same output)
 *   - useVehiclePosition hook recalculates on every render
 * 
 * ## Usage
 * 
 * Schedule periodic updates using the Scheduler in Game.tsx:
 * 
 * ```typescript
 * useEffect(() => {
 *   const updateInterval = 1000; // 1 simulation second
 *   
 *   const { cancel } = scheduler.scheduleIn(updateInterval, {
 *     type: EventType.UPDATE_SIMULATION_TIME,
 *     handler: (ctx) => {
 *       ctx.dispatch(setSimulationTime(ctx.now()));
 *       
 *       // Reschedule next update
 *       scheduler.scheduleIn(updateInterval, {
 *         type: EventType.UPDATE_SIMULATION_TIME,
 *         handler: // ... (recursive)
 *       });
 *     }
 *   });
 *   
 *   return () => cancel();
 * }, [scheduler]);
 * ```
 */

import type { Scheduler } from '../Scheduler';
import type { AppDispatch } from '../redux/store';
import { setSimulationTime } from '../redux/slices/game';

/**
 * Configuration for simulation time updates
 */
export type SimTimeUpdateConfig = {
  /**
   * How often to update simulation time in Redux (in simulation milliseconds)
   * 
   * - 1000 ms = 1 sim second (recommended default)
   * - 500 ms = 0.5 sim seconds (more frequent, smoother for slow vehicles)
   * - 2000 ms = 2 sim seconds (less frequent, better performance)
   */
  updateInterval: number;
};

const DEFAULT_CONFIG: SimTimeUpdateConfig = {
  updateInterval: 1000 // 1 simulation second
};

/**
 * Starts periodic simulation time updates
 * 
 * Schedules a recurring event that updates the Redux simulation time state
 * at regular intervals. This enables vehicle position calculations without
 * requiring continuous state updates.
 * 
 * The update mechanism is self-rescheduling: each event handler schedules
 * the next update. This ensures updates continue as long as the scheduler
 * is active, even if the clock speed changes.
 * 
 * @param scheduler - Active Scheduler instance
 * @param dispatch - Redux dispatch function
 * @param config - Optional configuration (defaults to 1-second updates)
 * @returns Cancellation function to stop the updates
 * 
 * @example
 * ```typescript
 * useEffect(() => {
 *   const cancelUpdates = startSimulationTimeUpdates(scheduler, dispatch, {
 *     updateInterval: 1000 // Update every sim-second
 *   });
 *   
 *   return () => cancelUpdates();
 * }, [scheduler, dispatch]);
 * ```
 */
export function startSimulationTimeUpdates(
  scheduler: Scheduler,
  _dispatch: AppDispatch,
  config: Partial<SimTimeUpdateConfig> = {}
): () => void {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  let currentCancelFn: (() => boolean) | undefined;
  
  const scheduleNext = () => {
    const { cancel } = scheduler.scheduleIn(finalConfig.updateInterval, {
      type: 'UPDATE_SIMULATION_TIME' as any, // Custom event type for time updates
      handler: (ctx) => {
        // Update Redux with current simulation time
        if (ctx.dispatch) {
          ctx.dispatch(setSimulationTime(ctx.now()));
        }
        
        // Schedule the next update
        scheduleNext();
      }
    });
    
    currentCancelFn = cancel;
  };
  
  // Start the update cycle
  scheduleNext();
  
  // Return cancellation function
  return () => {
    if (currentCancelFn) {
      currentCancelFn();
    }
  };
}
