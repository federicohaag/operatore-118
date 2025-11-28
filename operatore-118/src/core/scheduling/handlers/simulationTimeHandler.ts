import type { SimEvent, SimContext } from '../../simulation/EventQueue';
import { setSimulationTime } from '../../redux/slices/game';

/**
 * Creates a handler for UPDATE_SIMULATION_TIME events.
 * 
 * Updates Redux with the current simulation time periodically.
 * This is intentionally coarse (default 1 sim-second) to avoid flooding
 * Redux and localStorage with high-frequency updates while keeping UI
 * animations smooth.
 * 
 * @param onComplete - Callback to schedule the next update
 * @returns Handler function for the scheduler
 */
export function createSimulationTimeUpdateHandler(onComplete?: () => void) {
  return (ctx: SimContext, _event: SimEvent) => {
    // Update Redux with current simulation time
    if (ctx.dispatch) {
      ctx.dispatch(setSimulationTime(ctx.now()));
    }
    
    // Schedule the next update (if callback provided)
    if (onComplete) {
      onComplete();
    }
  };
}
