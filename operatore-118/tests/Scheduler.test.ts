import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { VirtualClock } from '../src/utils/VirtualClock';
import { Scheduler } from '../src/utils/Scheduler';
import type { SimContext } from '../src/utils/EventQueue';

// Mock setTimeout/clearTimeout for predictable testing
const mockSetTimeout = vi.fn();
const mockClearTimeout = vi.fn();
const mockPerformanceNow = vi.fn();

vi.stubGlobal('setTimeout', mockSetTimeout);
vi.stubGlobal('clearTimeout', mockClearTimeout);
vi.stubGlobal('performance', { now: mockPerformanceNow });

describe('Scheduler', () => {
  let clock: VirtualClock;
  let context: SimContext;
  let scheduler: Scheduler;
  let realTime: number;
  let timeoutId: number;

  beforeEach(() => {
    vi.clearAllMocks();
    
    realTime = 0;
    timeoutId = 1;
    
    mockPerformanceNow.mockImplementation(() => realTime);
    mockSetTimeout.mockImplementation((fn: Function, delay: number) => {
      return timeoutId++;
    });
    mockClearTimeout.mockImplementation(() => {});
    
    clock = new VirtualClock(1.0, true, 0);
    context = { now: () => clock.now() };
    scheduler = new Scheduler(clock, context);
  });

  afterEach(() => {
    scheduler.dispose();
  });

  describe('constructor and basic setup', () => {
    it('should create scheduler and subscribe to clock changes', () => {
      // Clock changes should trigger timer updates
      expect(scheduler).toBeDefined();
      expect(scheduler.size()).toBe(0);
    });

    it('should not arm timer when queue is empty', () => {
      expect(mockSetTimeout).not.toHaveBeenCalled();
    });

    it('should not arm timer when clock is paused', () => {
      scheduler.schedule({
        time: 1000,
        type: 'test',
        handler: () => {}
      });

      // Clock is paused by default, so no timer should be set
      expect(mockSetTimeout).not.toHaveBeenCalled();
    });
  });

  describe('schedule', () => {
    it('should schedule events and return unique IDs', () => {
      const handler = vi.fn();
      
      const { id: id1 } = scheduler.schedule({
        time: 1000,
        type: 'event1',
        handler
      });

      const { id: id2 } = scheduler.schedule({
        time: 2000,
        type: 'event2',
        handler
      });

      expect(id1).not.toBe(id2);
      expect(scheduler.size()).toBe(2);
    });

    it('should arm timer when clock is playing', () => {
      clock.play(); // Start the clock
      
      scheduler.schedule({
        time: 1000,
        type: 'test',
        handler: () => {}
      });

      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    });

    it('should calculate correct real delay based on clock speed', () => {
      clock.setSpeed(2.0); // Double speed
      clock.play();
      
      scheduler.schedule({
        time: 1000,
        type: 'test',
        handler: () => {}
      });

      // Real delay should be simulation delay / speed = 1000 / 2 = 500
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 500);
    });

    it('should schedule immediate execution for overdue events', () => {
      clock.seek(2000); // Current time is 2000
      clock.play();
      
      scheduler.schedule({
        time: 1000, // Event is in the past
        type: 'overdue',
        handler: () => {}
      });

      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 0);
    });
  });

  describe('scheduleIn', () => {
    it('should schedule events relative to current time', () => {
      clock.seek(5000); // Current time is 5000
      const handler = vi.fn();
      
      scheduler.scheduleIn(1000, {
        type: 'relative',
        handler
      });

      expect(scheduler.size()).toBe(1);
      
      // The event should be scheduled at 5000 + 1000 = 6000
      // We can verify this by checking if it's due when we seek to 6000
      scheduler.runUntil(6000);
      expect(handler).toHaveBeenCalledOnce();
    });

    it('should work with current clock time', () => {
      clock.seek(1500);
      const handler = vi.fn();
      
      scheduler.scheduleIn(500, {
        type: 'test',
        handler
      });

      scheduler.runUntil(2000);
      expect(handler).toHaveBeenCalledWith(context, expect.objectContaining({
        time: 2000,
        type: 'test'
      }));
    });
  });

  describe('timer management', () => {
    it('should cancel timer when clock is paused', () => {
      clock.play();
      
      scheduler.schedule({
        time: 1000,
        type: 'test',
        handler: () => {}
      });

      expect(mockSetTimeout).toHaveBeenCalled();
      
      clock.pause();
      
      expect(mockClearTimeout).toHaveBeenCalled();
    });

    it('should re-arm timer when clock speed changes', () => {
      clock.play();
      
      scheduler.schedule({
        time: 1000,
        type: 'test',
        handler: () => {}
      });

      mockSetTimeout.mockClear();
      mockClearTimeout.mockClear();
      
      clock.setSpeed(4.0);
      
      expect(mockClearTimeout).toHaveBeenCalled();
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 250); // 1000 / 4
    });

    it('should re-arm timer when seeking', () => {
      clock.play();
      
      scheduler.schedule({
        time: 2000,
        type: 'test',
        handler: () => {}
      });

      mockSetTimeout.mockClear();
      mockClearTimeout.mockClear();
      
      clock.seek(1500);
      
      expect(mockClearTimeout).toHaveBeenCalled();
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 500); // 2000 - 1500
    });

    it('should handle very low speeds without division by zero', () => {
      clock.play();
      clock.setSpeed(1e-15); // Extremely low speed
      
      scheduler.schedule({
        time: 1,
        type: 'test',
        handler: () => {}
      });

      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 1 / 1e-9); // Uses minimum speed
    });
  });

  describe('runUntil', () => {
    it('should process all events up to target time', () => {
      const handlers = [vi.fn(), vi.fn(), vi.fn()];
      
      scheduler.schedule({ time: 1000, type: 'first', handler: handlers[0] });
      scheduler.schedule({ time: 2000, type: 'second', handler: handlers[1] });
      scheduler.schedule({ time: 3000, type: 'third', handler: handlers[2] });

      scheduler.runUntil(2500);

      expect(handlers[0]).toHaveBeenCalledOnce();
      expect(handlers[1]).toHaveBeenCalledOnce();
      expect(handlers[2]).not.toHaveBeenCalled();
      expect(clock.now()).toBe(2500);
    });

    it('should process events in correct order', () => {
      const executionOrder: string[] = [];
      
      scheduler.schedule({
        time: 1000,
        type: 'second',
        handler: () => executionOrder.push('second')
      });
      
      scheduler.schedule({
        time: 500,
        type: 'first',
        handler: () => executionOrder.push('first')
      });
      
      scheduler.schedule({
        time: 1500,
        type: 'third',
        handler: () => executionOrder.push('third')
      });

      scheduler.runUntil(2000);

      expect(executionOrder).toEqual(['first', 'second', 'third']);
    });

    it('should handle events scheduled during processing', () => {
      const executionOrder: string[] = [];
      
      scheduler.schedule({
        time: 1000,
        type: 'initial',
        handler: () => {
          executionOrder.push('initial');
          // Schedule another event at the same time
          scheduler.schedule({
            time: 1000,
            type: 'nested',
            handler: () => executionOrder.push('nested')
          });
        }
      });

      scheduler.runUntil(1000);

      expect(executionOrder).toEqual(['initial', 'nested']);
    });

    it('should handle errors in event handlers gracefully', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const goodHandler = vi.fn();
      
      scheduler.schedule({
        time: 1000,
        type: 'error',
        handler: () => {
          throw new Error('Test error');
        }
      });
      
      scheduler.schedule({
        time: 1000,
        type: 'good',
        handler: goodHandler
      });

      scheduler.runUntil(1000);

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('Error in event handler'),
        expect.any(Error)
      );
      expect(goodHandler).toHaveBeenCalled();
      
      consoleError.mockRestore();
    });
  });

  describe('cancellation', () => {
    it('should cancel events and prevent execution', () => {
      const handler = vi.fn();
      
      const { cancel } = scheduler.schedule({
        time: 1000,
        type: 'canceled',
        handler
      });

      expect(cancel()).toBe(true);
      
      scheduler.runUntil(1500);
      
      expect(handler).not.toHaveBeenCalled();
    });

    it('should return false when canceling already canceled event', () => {
      const { cancel } = scheduler.schedule({
        time: 1000,
        type: 'test',
        handler: () => {}
      });

      expect(cancel()).toBe(true);
      expect(cancel()).toBe(false);
    });

    it('should update timer when canceling the next due event', () => {
      clock.play();
      
      const { cancel } = scheduler.schedule({
        time: 1000,
        type: 'first',
        handler: () => {}
      });
      
      scheduler.schedule({
        time: 2000,
        type: 'second',
        handler: () => {}
      });

      mockSetTimeout.mockClear();
      mockClearTimeout.mockClear();
      
      cancel();
      
      expect(mockClearTimeout).toHaveBeenCalled();
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 2000); // Next event at 2000
    });
  });

  describe('clear', () => {
    it('should remove all events and cancel timer', () => {
      clock.play();
      
      scheduler.schedule({ time: 1000, type: 'test1', handler: () => {} });
      scheduler.schedule({ time: 2000, type: 'test2', handler: () => {} });

      expect(scheduler.size()).toBe(2);
      
      scheduler.clear();
      
      expect(scheduler.size()).toBe(0);
      expect(mockClearTimeout).toHaveBeenCalled();
    });
  });

  describe('dispose', () => {
    it('should clean up resources and prevent further operations', () => {
      clock.play();
      
      scheduler.schedule({ time: 1000, type: 'test', handler: () => {} });
      
      scheduler.dispose();
      
      expect(mockClearTimeout).toHaveBeenCalled();
      
      // Further operations should throw
      expect(() => {
        scheduler.schedule({ time: 2000, type: 'test2', handler: () => {} });
      }).toThrow('Scheduler has been disposed');
      
      expect(() => {
        scheduler.runUntil(3000);
      }).toThrow('Scheduler has been disposed');
    });

    it('should be safe to call multiple times', () => {
      scheduler.dispose();
      scheduler.dispose(); // Should not throw
    });
  });

  describe('integration scenarios', () => {
    it('should handle complex play/pause/speed scenarios', () => {
      const handlers = [vi.fn(), vi.fn(), vi.fn()];
      
      // Schedule events
      scheduler.schedule({ time: 1000, type: 'a', handler: handlers[0] });
      scheduler.schedule({ time: 2000, type: 'b', handler: handlers[1] });
      scheduler.schedule({ time: 3000, type: 'c', handler: handlers[2] });

      // Start playing
      clock.play();
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
      
      // Change speed
      mockSetTimeout.mockClear();
      clock.setSpeed(2.0);
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 500); // 1000 / 2
      
      // Pause
      mockClearTimeout.mockClear();
      clock.pause();
      expect(mockClearTimeout).toHaveBeenCalled();
      
      // No events should have fired yet
      expect(handlers[0]).not.toHaveBeenCalled();
      expect(handlers[1]).not.toHaveBeenCalled();
      expect(handlers[2]).not.toHaveBeenCalled();
    });

    it('should maintain deterministic execution order with equal timestamps', () => {
      const executionOrder: string[] = [];
      
      // Schedule multiple events at the same time
      for (let i = 0; i < 5; i++) {
        scheduler.schedule({
          time: 1000,
          type: `event-${i}`,
          handler: () => executionOrder.push(`event-${i}`)
        });
      }

      scheduler.runUntil(1000);

      expect(executionOrder).toEqual(['event-0', 'event-1', 'event-2', 'event-3', 'event-4']);
    });

    it('should handle seeking forward past multiple events', () => {
      const handlers = [vi.fn(), vi.fn(), vi.fn()];
      
      scheduler.schedule({ time: 1000, type: 'a', handler: handlers[0] });
      scheduler.schedule({ time: 2000, type: 'b', handler: handlers[1] });
      scheduler.schedule({ time: 3000, type: 'c', handler: handlers[2] });

      // Seek directly to time 2500
      clock.seek(2500);
      
      // This should process events at 1000 and 2000, but not 3000
      scheduler.runUntil(2500);

      expect(handlers[0]).toHaveBeenCalledOnce();
      expect(handlers[1]).toHaveBeenCalledOnce();
      expect(handlers[2]).not.toHaveBeenCalled();
    });
  });
});