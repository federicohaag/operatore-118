import type { Scheduler } from './Scheduler';
import { EventType } from './EventQueue';
import { addCall } from '../global-state/slices/calls';
import { CALL_TEMPLATES } from '../data/calls';
import type { Call } from '../model/call';

/**
 * Generates emergency calls at regular intervals and dispatches them to the Redux store.
 * 
 * CallGenerator uses a Scheduler to create periodic CALL_RECEIVED events. Each call is
 * randomly generated from templates with weighted severity distribution (50% stable, 
 * 30% medium, 20% critical). The generator supports start/stop control and automatically
 * cancels pending events when stopped.
 * 
 * Integration with simulation:
 * - Schedules events through the provided Scheduler instance
 * - Uses simulation time (not real time) via the scheduler's clock
 * - Dispatches calls to Redux store through scheduler context
 * 
 * Lifecycle:
 * - Create with a Scheduler instance
 * - Call start() to begin generation
 * - Call stop() to halt generation and cancel pending events
 * - Handles scheduler disposal gracefully by stopping generation
 */
export class CallGenerator {
  /** Scheduler instance used for timing and event management */
  private scheduler: Scheduler;
  
  /** Interval between calls in simulation milliseconds */
  private intervalMs: number;
  
  /** Tracks whether the generator is actively scheduling calls */
  private isStarted = false;
  
  /** Cancel function for the currently pending call event, if any */
  private currentEventCancel?: () => boolean;

  /**
   * Creates a new CallGenerator instance.
   * 
   * @param scheduler - Scheduler instance for event timing and dispatch context
   */
  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
    this.intervalMs = 3000;
  }

  /**
   * Starts generating calls at regular intervals.
   * 
   * Schedules the first call immediately. Subsequent calls are automatically
   * scheduled after each call is generated. Does nothing if already started.
   */
  start(): void {
    if (this.isStarted) return;
    
    this.isStarted = true;
    this.scheduleNextCall();
  }

  /**
   * Stops call generation and cancels any pending call event.
   * 
   * Sets the started flag to false to prevent rescheduling, then cancels
   * the currently pending event if one exists. Safe to call multiple times.
   */
  stop(): void {
    this.isStarted = false;
    // Cancel any pending event
    if (this.currentEventCancel) {
      this.currentEventCancel();
      this.currentEventCancel = undefined;
    }
  }

  /**
   * Schedules the next call generation event.
   * 
   * Creates a CALL_RECEIVED event scheduled after the configured interval.
   * The event handler dispatches the call to Redux and schedules the next call
   * to create a continuous generation loop. Stores the cancel function for
   * cleanup on stop().
   * 
   * If scheduling fails (e.g., scheduler disposed), logs a warning and stops
   * generation automatically.
   */
  private scheduleNextCall(): void {
    if (!this.isStarted) return;

    try {
      const { cancel } = this.scheduler.scheduleIn(this.intervalMs, {
        type: EventType.CALL_RECEIVED,
        payload: this.generateCall(),
        handler: (ctx, event) => {
          this.handleCall(ctx, event);
          this.scheduleNextCall();
        }
      });
      
      // Store the cancel function so we can cancel if stopped
      this.currentEventCancel = cancel;
    } catch (error) {
      // Scheduler might be disposed, stop the generator
      console.warn('CallGenerator: Scheduler error, stopping generation:', error);
      this.isStarted = false;
    }
  }

  /**
   * Handles a generated call event by dispatching it to the Redux store.
   * 
   * @param ctx - Scheduler execution context containing dispatch function and clock
   * @param event - Event object containing the generated call in payload
   * 
   * Logs a warning if the dispatch function is unavailable (shouldn't happen in
   * normal operation but helps with debugging).
   */
  private handleCall(ctx: any, event: any): void {
    const call = event.payload;
    console.log(`Generated call: ${call.id}`);
    if (ctx?.dispatch) {
      ctx.dispatch(addCall(call));
    } else {
      console.warn('CallGenerator: No dispatch function available in context');
    }
  }

  /**
   * Generates a unique identifier for a call.
   * 
   * @returns Random alphanumeric string suitable for use as a call ID
   * 
   * Uses base-36 encoding of a random number to create short, readable IDs.
   * Not cryptographically secure but sufficient for simulation purposes.
   */
  private generateCallId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generates a random emergency call from templates with weighted severity.
   * 
   * @returns New Call object with randomly selected template and severity-matched feedback
   * 
   * Selection process:
   * 1. Randomly picks a call template from CALL_TEMPLATES
   * 2. Randomly selects severity using weighted distribution:
   *    - 50% chance of 'stable' (minor emergencies)
   *    - 30% chance of 'medium' (moderate emergencies)
   *    - 20% chance of 'critical' (life-threatening emergencies)
   * 3. Matches appropriate feedback from template based on selected severity
   * 4. Generates unique ID for the call
   * 
   * The weighted distribution ensures realistic emergency frequency patterns
   * where critical cases are less common than stable ones.
   */
  private generateCall(): Call {
    // Pick a random template
    const template = CALL_TEMPLATES[Math.floor(Math.random() * CALL_TEMPLATES.length)];
    
    // Generate random case severity with weighted probabilities
    const severities = ['stable', 'medium', 'critical'] as const;
    const weights = [0.5, 0.3, 0.2]; // 50% stable, 30% medium, 20% critical
    
    let selectedSeverity: typeof severities[number] = 'stable';
    const rand = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (rand < sum) {
        selectedSeverity = severities[i];
        break;
      }
    }
    
    // Select appropriate feedback based on severity
    const feedback = selectedSeverity === 'stable' 
      ? template.stableCaseFeedback
      : selectedSeverity === 'medium'
      ? template.mediumCaseFeedback
      : template.criticalCaseFeedback;
    
    return {
      id: this.generateCallId(),
      text: template.text,
      feedback
    };
  }
}