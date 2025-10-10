import { VirtualClock } from './src/utils/VirtualClock';
import { Scheduler } from './src/utils/Scheduler';
import type { SimContext } from './src/utils/EventQueue';

/**
 * Minimal usage example for EventQueue and Scheduler
 * 
 * This example demonstrates discrete-event simulation with:
 * - VirtualClock for time management
 * - Scheduler for event processing
 * - Various event types and scheduling patterns
 */

// Create virtual clock starting at time 0, paused, at normal speed
const clock = new VirtualClock(1.0, true, 0);

// Create simulation context
const context: SimContext = {
  now: () => clock.now()
};

// Create scheduler
const scheduler = new Scheduler(clock, context);

// Example 1: Basic event scheduling
console.log('=== Basic Event Scheduling ===');

scheduler.schedule({
  time: 1000,
  type: 'Welcome',
  handler: (ctx, ev) => {
    console.log(`${ev.type} event fired at simulation time ${ctx.now()}ms`);
  }
});

scheduler.scheduleIn(2000, {
  type: 'Reminder',
  payload: { message: 'Don\'t forget to check the system!' },
  handler: (ctx, ev) => {
    console.log(`${ev.type}: ${ev.payload?.message} (sim time: ${ctx.now()}ms)`);
  }
});

// Example 2: Events that schedule other events
scheduler.schedule({
  time: 1500,
  type: 'Cascade',
  handler: (ctx, ev) => {
    console.log(`${ev.type} event at ${ctx.now()}ms - scheduling follow-up`);
    
    // Schedule immediate follow-up
    scheduler.schedule({
      time: ctx.now(), // Same time
      type: 'Immediate Follow-up',
      handler: (ctx2, ev2) => {
        console.log(`  ${ev2.type} at ${ctx2.now()}ms`);
      }
    });
    
    // Schedule delayed follow-up
    scheduler.scheduleIn(500, {
      type: 'Delayed Follow-up',
      handler: (ctx2, ev2) => {
        console.log(`  ${ev2.type} at ${ctx2.now()}ms`);
      }
    });
  }
});

// Example 3: Cancellable events
const { cancel } = scheduler.schedule({
  time: 2500,
  type: 'Cancellable',
  handler: (ctx, ev) => {
    console.log(`This event should NOT fire: ${ev.type} at ${ctx.now()}ms`);
  }
});

// Cancel the event before it fires
setTimeout(() => {
  console.log('Cancelling event...');
  cancel();
}, 100);

// Example 4: Set up clock speed and start simulation
console.log('\n=== Starting Simulation ===');
console.log('Initial time:', clock.now());
console.log('Setting speed to 60x (1 minute simulation time per second real time)');

clock.setSpeed(60); // 60x speed - 1 minute sim time per second real time
clock.play();

// Example 5: Periodic events using recursive scheduling
function schedulePeriodicPing(interval: number = 1000) {
  scheduler.scheduleIn(interval, {
    type: 'Ping',
    payload: { interval },
    handler: (ctx, ev) => {
      console.log(`Ping at ${ctx.now()}ms (next in ${ev.payload.interval}ms)`);
      
      // Schedule next ping
      schedulePeriodicPing(ev.payload.interval);
    }
  });
}

// Start periodic pings every 1 second simulation time
schedulePeriodicPing(1000);

// Example 6: Demonstrate runUntil for batch processing
setTimeout(() => {
  console.log('\n=== Batch Processing with runUntil ===');
  clock.pause();
  
  // Schedule a batch of events
  for (let i = 0; i < 5; i++) {
    scheduler.schedule({
      time: 5000 + i * 100,
      type: 'Batch',
      payload: { index: i },
      handler: (ctx, ev) => {
        console.log(`Batch event ${ev.payload.index} at ${ctx.now()}ms`);
      }
    });
  }
  
  // Process all events up to time 6000 immediately
  console.log('Processing events up to 6000ms...');
  scheduler.runUntil(6000);
  
  console.log('Current simulation time after batch:', clock.now());
  
  // Resume normal operation
  clock.play();
}, 3000);

// Example 7: Clean shutdown
setTimeout(() => {
  console.log('\n=== Shutting Down ===');
  console.log('Final simulation time:', clock.now());
  console.log('Events remaining in queue:', scheduler.size());
  
  scheduler.dispose();
  console.log('Scheduler disposed');
}, 8000);

// Example 8: Error handling demonstration
scheduler.schedule({
  time: 4000,
  type: 'Error Demo',
  handler: (ctx, ev) => {
    console.log('This event will throw an error...');
    throw new Error('Demo error - should be caught gracefully');
  }
});

scheduler.schedule({
  time: 4000,
  type: 'After Error',
  handler: (ctx, ev) => {
    console.log('This event runs after the error (same timestamp)');
  }
});

console.log('\nSimulation started! Watch the console for events...');
console.log('The simulation will run for about 8 seconds real time.');
console.log('Events are processed in simulation time order, not real time order.\n');