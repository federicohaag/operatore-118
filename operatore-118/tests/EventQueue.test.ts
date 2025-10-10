import { describe, it, expect, beforeEach } from 'vitest';
import { EventQueue } from '../src/utils/EventQueue';
import type { SimEvent, SimContext } from '../src/utils/EventQueue';

describe('EventQueue', () => {
  let queue: EventQueue;
  let mockContext: SimContext;

  beforeEach(() => {
    queue = new EventQueue();
    mockContext = { now: () => 0 };
  });

  describe('push and ordering', () => {
    it('should order events by time ascending', () => {
      const handler = () => {};
      
      queue.push({ time: 300, type: 'c', handler });
      queue.push({ time: 100, type: 'a', handler });
      queue.push({ time: 200, type: 'b', handler });

      expect(queue.pop()?.time).toBe(100);
      expect(queue.pop()?.time).toBe(200);
      expect(queue.pop()?.time).toBe(300);
    });

    it('should order events by sequence when times are equal', () => {
      const handler = () => {};
      
      const { id: id1 } = queue.push({ time: 100, type: 'first', handler });
      const { id: id2 } = queue.push({ time: 100, type: 'second', handler });
      const { id: id3 } = queue.push({ time: 100, type: 'third', handler });

      const first = queue.pop();
      const second = queue.pop();
      const third = queue.pop();

      expect(first?.type).toBe('first');
      expect(second?.type).toBe('second');
      expect(third?.type).toBe('third');
    });

    it('should maintain deterministic ordering across mixed time/sequence scenarios', () => {
      const handler = () => {};
      
      queue.push({ time: 200, type: 'later1', handler });
      queue.push({ time: 100, type: 'earlier1', handler });
      queue.push({ time: 100, type: 'earlier2', handler });
      queue.push({ time: 200, type: 'later2', handler });
      queue.push({ time: 150, type: 'middle', handler });

      const results = [];
      while (queue.size() > 0) {
        results.push(queue.pop()?.type);
      }

      expect(results).toEqual(['earlier1', 'earlier2', 'middle', 'later1', 'later2']);
    });

    it('should return unique IDs for each event', () => {
      const handler = () => {};
      
      const { id: id1 } = queue.push({ time: 100, type: 'a', handler });
      const { id: id2 } = queue.push({ time: 100, type: 'b', handler });
      const { id: id3 } = queue.push({ time: 100, type: 'c', handler });

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });
  });

  describe('peek', () => {
    it('should return undefined for empty queue', () => {
      expect(queue.peek()).toBeUndefined();
    });

    it('should return the next event without removing it', () => {
      const handler = () => {};
      
      queue.push({ time: 200, type: 'b', handler });
      queue.push({ time: 100, type: 'a', handler });

      const peeked = queue.peek();
      expect(peeked?.type).toBe('a');
      expect(peeked?.time).toBe(100);
      
      // Should still be there
      expect(queue.size()).toBe(2);
      expect(queue.peek()?.type).toBe('a');
    });

    it('should skip canceled events when peeking', () => {
      const handler = () => {};
      
      const { cancel } = queue.push({ time: 100, type: 'canceled', handler });
      queue.push({ time: 200, type: 'active', handler });

      cancel();
      
      const peeked = queue.peek();
      expect(peeked?.type).toBe('active');
      expect(peeked?.time).toBe(200);
    });
  });

  describe('pop', () => {
    it('should return undefined for empty queue', () => {
      expect(queue.pop()).toBeUndefined();
    });

    it('should remove and return the next event', () => {
      const handler = () => {};
      
      queue.push({ time: 200, type: 'b', handler });
      queue.push({ time: 100, type: 'a', handler });

      const popped = queue.pop();
      expect(popped?.type).toBe('a');
      expect(queue.size()).toBe(1);
      
      const nextPopped = queue.pop();
      expect(nextPopped?.type).toBe('b');
      expect(queue.size()).toBe(0);
    });

    it('should skip canceled events when popping', () => {
      const handler = () => {};
      
      const { cancel } = queue.push({ time: 100, type: 'canceled', handler });
      queue.push({ time: 200, type: 'active', handler });

      cancel();
      
      const popped = queue.pop();
      expect(popped?.type).toBe('active');
      expect(queue.size()).toBe(0);
    });

    it('should handle multiple canceled events at the top', () => {
      const handler = () => {};
      
      const { cancel: cancel1 } = queue.push({ time: 100, type: 'canceled1', handler });
      const { cancel: cancel2 } = queue.push({ time: 150, type: 'canceled2', handler });
      queue.push({ time: 200, type: 'active', handler });

      cancel1();
      cancel2();
      
      const popped = queue.pop();
      expect(popped?.type).toBe('active');
      expect(queue.size()).toBe(0);
    });
  });

  describe('cancellation', () => {
    it('should cancel events by ID', () => {
      const handler = () => {};
      
      const { id, cancel } = queue.push({ time: 100, type: 'test', handler });
      
      expect(cancel()).toBe(true);
      expect(queue.cancel(id)).toBe(false); // Already canceled
      expect(queue.size()).toBe(0);
    });

    it('should return false when canceling non-existent ID', () => {
      expect(queue.cancel(999)).toBe(false);
    });

    it('should return false when canceling already canceled event', () => {
      const handler = () => {};
      
      const { cancel } = queue.push({ time: 100, type: 'test', handler });
      
      expect(cancel()).toBe(true);
      expect(cancel()).toBe(false);
    });

    it('should handle cancellation of events in the middle of the heap', () => {
      const handler = () => {};
      
      queue.push({ time: 100, type: 'first', handler });
      const { cancel } = queue.push({ time: 200, type: 'middle', handler });
      queue.push({ time: 300, type: 'last', handler });

      cancel();
      
      const results = [];
      while (queue.size() > 0) {
        results.push(queue.pop()?.type);
      }

      expect(results).toEqual(['first', 'last']);
    });

    it('should preserve order when some events are canceled', () => {
      const handler = () => {};
      
      queue.push({ time: 100, type: 'keep1', handler });
      const { cancel: cancel1 } = queue.push({ time: 150, type: 'cancel1', handler });
      queue.push({ time: 200, type: 'keep2', handler });
      const { cancel: cancel2 } = queue.push({ time: 250, type: 'cancel2', handler });
      queue.push({ time: 300, type: 'keep3', handler });

      cancel1();
      cancel2();
      
      const results = [];
      while (queue.size() > 0) {
        results.push(queue.pop()?.type);
      }

      expect(results).toEqual(['keep1', 'keep2', 'keep3']);
    });
  });

  describe('size', () => {
    it('should return 0 for empty queue', () => {
      expect(queue.size()).toBe(0);
    });

    it('should return correct size after adding events', () => {
      const handler = () => {};
      
      expect(queue.size()).toBe(0);
      
      queue.push({ time: 100, type: 'a', handler });
      expect(queue.size()).toBe(1);
      
      queue.push({ time: 200, type: 'b', handler });
      expect(queue.size()).toBe(2);
    });

    it('should decrease size after popping events', () => {
      const handler = () => {};
      
      queue.push({ time: 100, type: 'a', handler });
      queue.push({ time: 200, type: 'b', handler });
      
      expect(queue.size()).toBe(2);
      
      queue.pop();
      expect(queue.size()).toBe(1);
      
      queue.pop();
      expect(queue.size()).toBe(0);
    });

    it('should not count canceled events', () => {
      const handler = () => {};
      
      queue.push({ time: 100, type: 'active', handler });
      const { cancel } = queue.push({ time: 200, type: 'canceled', handler });
      
      expect(queue.size()).toBe(2);
      
      cancel();
      expect(queue.size()).toBe(1);
    });
  });

  describe('clear', () => {
    it('should remove all events', () => {
      const handler = () => {};
      
      queue.push({ time: 100, type: 'a', handler });
      queue.push({ time: 200, type: 'b', handler });
      queue.push({ time: 300, type: 'c', handler });
      
      expect(queue.size()).toBe(3);
      
      queue.clear();
      
      expect(queue.size()).toBe(0);
      expect(queue.peek()).toBeUndefined();
      expect(queue.pop()).toBeUndefined();
    });

    it('should reset sequence and ID counters', () => {
      const handler = () => {};
      
      // Add some events to advance counters
      queue.push({ time: 100, type: 'a', handler });
      queue.push({ time: 200, type: 'b', handler });
      
      queue.clear();
      
      // New events should start with fresh IDs
      const { id: id1 } = queue.push({ time: 100, type: 'x', handler });
      const { id: id2 } = queue.push({ time: 100, type: 'y', handler });
      
      // IDs should be low numbers again
      expect(id1).toBeLessThan(10);
      expect(id2).toBeLessThan(10);
      
      // Sequence should also reset (events with same time should be in insertion order)
      expect(queue.pop()?.type).toBe('x');
      expect(queue.pop()?.type).toBe('y');
    });
  });

  describe('heap property maintenance', () => {
    it('should maintain heap property with complex operations', () => {
      const handler = () => {};
      const times = [500, 200, 800, 100, 300, 700, 600, 50, 150, 250];
      
      // Add events in random order
      for (const time of times) {
        queue.push({ time, type: `event-${time}`, handler });
      }
      
      // Pop all events - should come out in sorted order
      const results = [];
      while (queue.size() > 0) {
        results.push(queue.pop()?.time);
      }
      
      const expected = [...times].sort((a, b) => a - b);
      expect(results).toEqual(expected);
    });

    it('should handle large number of events efficiently', () => {
      const handler = () => {};
      const n = 1000;
      
      // Add events in reverse order
      for (let i = n; i > 0; i--) {
        queue.push({ time: i, type: `event-${i}`, handler });
      }
      
      expect(queue.size()).toBe(n);
      
      // Should still come out in correct order
      for (let i = 1; i <= n; i++) {
        const event = queue.pop();
        expect(event?.time).toBe(i);
      }
      
      expect(queue.size()).toBe(0);
    });

    it('should handle events with same timestamp and maintain sequence order', () => {
      const handler = () => {};
      const sameTime = 1000;
      
      // Add many events with the same timestamp
      for (let i = 0; i < 100; i++) {
        queue.push({ time: sameTime, type: `event-${i}`, handler });
      }
      
      // Should come out in insertion order
      for (let i = 0; i < 100; i++) {
        const event = queue.pop();
        expect(event?.type).toBe(`event-${i}`);
        expect(event?.time).toBe(sameTime);
      }
    });
  });
});