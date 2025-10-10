import type { Scheduler } from './Scheduler';
import { EventType } from './EventQueue';
import { addCall } from '../global-state/slices/calls';
import { CALL_TEMPLATES } from '../data/calls';
import type { Call } from '../model/call';

/**
 * CallGenerator - Generates calls at regular intervals
 */
export class CallGenerator {
  private scheduler: Scheduler;
  private intervalMs: number;
  private isStarted = false;
  private currentEventCancel?: () => boolean;

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
    this.intervalMs = 3000;
  }

  start(): void {
    if (this.isStarted) return;
    
    this.isStarted = true;
    this.scheduleNextCall();
  }

  stop(): void {
    this.isStarted = false;
    // Cancel any pending event
    if (this.currentEventCancel) {
      this.currentEventCancel();
      this.currentEventCancel = undefined;
    }
  }

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

  private handleCall(ctx: any, event: any): void {
    const call = event.payload;
    console.log(`Generated call: ${call.id}`);
    if (ctx?.dispatch) {
      ctx.dispatch(addCall(call));
    } else {
      console.warn('CallGenerator: No dispatch function available in context');
    }
  }

  private generateCallId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

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