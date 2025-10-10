import type { Scheduler } from './Scheduler';
import { EventType } from './EventQueue';
import { addCall } from '../global-state/slices/calls';

/**
 * CallGenerator - Generates calls at regular intervals
 */
export class CallGenerator {
  private scheduler: Scheduler;
  private intervalMs: number;
  private isStarted = false;

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
  }

  private scheduleNextCall(): void {
    if (!this.isStarted) return;

    try {
      this.scheduler.scheduleIn(this.intervalMs, {
        type: EventType.CALL_RECEIVED,
        payload: this.generateCallId(),
        handler: (ctx) => {
          this.handleCall(ctx);
          this.scheduleNextCall();
        }
      });
    } catch (error) {
      // Scheduler might be disposed, stop the generator
      console.warn('CallGenerator: Scheduler error, stopping generation:', error);
      this.isStarted = false;
    }
  }

  private handleCall(ctx: any): void {
    const callId = this.generateCallId();
    console.log(`Generated call: ${callId}`);
    if (ctx?.dispatch) {
      ctx.dispatch(addCall(callId));
    } else {
      console.warn('CallGenerator: No dispatch function available in context');
    }
  }

  private generateCallId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}