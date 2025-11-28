/**
 * Periodically update the simulation time in Redux.
 *
 * Updates are intentionally coarse (default 1 sim-second) to avoid flooding
 * Redux and localStorage with high-frequency updates while keeping UI
 * animations smooth. The scheduler-based update is self-rescheduling.
 */

import type { Scheduler } from '../scheduling/Scheduler';
import type { AppDispatch } from '../redux/store';
import { EventType } from './EventQueue';
import { createSimulationTimeUpdateHandler } from '../scheduling/handlers/simulationTimeHandler';

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

/** Start periodic updates of simulation time in Redux. */
export function startSimulationTimeUpdates(
  scheduler: Scheduler,
  _dispatch: AppDispatch,
  config: Partial<SimTimeUpdateConfig> = {}
): () => void {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  let currentCancelFn: (() => boolean) | undefined;
  
  const scheduleNext = () => {
    const { cancel } = scheduler.scheduleIn(finalConfig.updateInterval, {
      type: EventType.UPDATE_SIMULATION_TIME,
      handler: createSimulationTimeUpdateHandler(scheduleNext)
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
