import type { Scheduler } from './scheduling/Scheduler';
import { addCall } from './redux/slices/game';
import { CALL_TEMPLATES } from '../data/calls';
import type { Call } from '../model/call';
import { AddressGenerator } from './AddressGenerator';
import { EventType } from './simulation/EventQueue';

/**
 * Configuration options for CallGenerator.
 */
export interface CallGeneratorConfig {
  /** Interval between call generation in simulation milliseconds */
  intervalMs: number;
  
  /** Probability weights for severity distribution [stable, medium, critical] */
  severityWeights: {
    stable: number;
    medium: number;
    critical: number;
  };
}

/** Generates periodic CALL_RECEIVED events and dispatches them to Redux. */
export class CallGenerator {
  private scheduler: Scheduler;
  private config: CallGeneratorConfig;
  private isStarted = false;
  private currentEventCancel?: () => boolean;
  private addressGenerator: AddressGenerator;

  /**
   * Creates a new CallGenerator instance.
   * 
   * @param scheduler - Scheduler instance for event timing and dispatch context
   * @param config - Configuration for call generation behavior
   * @param addressGenerator - AddressGenerator instance for creating realistic addresses
   */
  constructor(scheduler: Scheduler, config: CallGeneratorConfig, addressGenerator: AddressGenerator) {
    this.scheduler = scheduler;
    this.config = config;
    this.addressGenerator = addressGenerator;
  }

  /** Start generating calls (no-op if already started). */
  start(): void {
    if (this.isStarted) return;
    
    this.isStarted = true;
    this.scheduleNextCall();
  }

  /** Stop generation and cancel pending event. */
  stop(): void {
    this.isStarted = false;
    // Cancel any pending event
    if (this.currentEventCancel) {
      this.currentEventCancel();
      this.currentEventCancel = undefined;
    }
  }

  /** Schedule the next CALL_RECEIVED event; stores cancel() for cleanup. */
  private scheduleNextCall(): void {
    if (!this.isStarted) return;

    try {
      // Generate call
      const call = this.generateCall();
      
      const { cancel } = this.scheduler.scheduleIn(this.config.intervalMs, {
        type: EventType.CALL_RECEIVED,
        payload: call,
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

  /** Dispatch generated call to Redux; stamps `receivedAt` from sim time. */
  private handleCall(ctx: any, event: any): void {
    const call = event.payload;
    // Add receivedAt timestamp from simulation time
    const callWithTimestamp = {
      ...call,
      receivedAt: ctx.now()
    };
    console.log(`Generated call: ${call.id} - ${call.location.address.city.name}, ${call.location.address.street} ${call.location.address.number}`);
    if (ctx?.dispatch) {
      ctx.dispatch(addCall(callWithTimestamp));
    } else {
      console.warn('CallGenerator: No dispatch function available in context');
    }
  }

  /** Return a new unique call id. */
  private generateCallId(): string {
    return crypto.randomUUID();
  }

  /** Create a new Call sampled from templates and weighted severities. */
  private generateCall(): Call {
    // Pick a random template
    const template = CALL_TEMPLATES[Math.floor(Math.random() * CALL_TEMPLATES.length)];
    
    // Generate random case severity with weighted probabilities from config
    const severities = ['stable', 'medium', 'critical'] as const;
    const weights = [
      this.config.severityWeights.stable,
      this.config.severityWeights.medium,
      this.config.severityWeights.critical
    ];
    
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
    
    // Generate address using AddressGenerator
    const address = this.addressGenerator.getRandomAddress();
    
    return {
      id: this.generateCallId(),
      text: template.text,
      feedback,
      receivedAt: 0, // Placeholder, will be set to simulation time in handleCall
      location: {
        address,
        type: template.locationType
      }
    };
  }
}