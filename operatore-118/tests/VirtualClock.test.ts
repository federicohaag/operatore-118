import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VirtualClock } from '../src/utils/VirtualClock.tsx';

// Mock performance.now() for predictable testing
const mockPerformanceNow = vi.fn();
vi.stubGlobal('performance', { now: mockPerformanceNow });

describe('VirtualClock', () => {
  let realTime: number;

  beforeEach(() => {
    realTime = 0;
    mockPerformanceNow.mockImplementation(() => realTime);
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const clock = new VirtualClock();
      
      expect(clock.speed).toBe(1.0);
      expect(clock.paused).toBe(true);
      expect(clock.now()).toBe(0);
    });

    it('should initialize with custom values', () => {
      const clock = new VirtualClock(2.5, false, 1000);
      
      expect(clock.speed).toBe(2.5);
      expect(clock.paused).toBe(false);
      expect(clock.now()).toBe(1000);
    });

    it('should clamp negative speed to 0', () => {
      const clock = new VirtualClock(-1);
      
      expect(clock.speed).toBe(0);
    });
  });

  describe('now()', () => {
    it('should return simAnchor when paused', () => {
      const clock = new VirtualClock(1.0, true, 5000);
      
      realTime = 1000;
      expect(clock.now()).toBe(5000);
      
      realTime = 2000;
      expect(clock.now()).toBe(5000);
    });

    it('should calculate simulation time when playing', () => {
      const clock = new VirtualClock(2.0, false, 1000);
      
      realTime = 0; // Start time
      expect(clock.now()).toBe(1000);
      
      realTime = 500; // 500ms real time passed
      expect(clock.now()).toBe(2000); // 1000 + 500 * 2.0
      
      realTime = 1000; // 1000ms real time passed
      expect(clock.now()).toBe(3000); // 1000 + 1000 * 2.0
    });

    it('should be monotonic while playing', () => {
      const clock = new VirtualClock(1.0, false, 0);
      
      const times: number[] = [];
      for (let i = 0; i < 100; i++) {
        realTime = i * 10;
        times.push(clock.now());
      }
      
      // Verify monotonic increase
      for (let i = 1; i < times.length; i++) {
        expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
      }
    });

    it('should handle speed = 0 correctly', () => {
      const clock = new VirtualClock(0, false, 1000);
      
      realTime = 0;
      expect(clock.now()).toBe(1000);
      
      realTime = 5000;
      expect(clock.now()).toBe(1000); // No time progression with speed 0
    });
  });

  describe('play()', () => {
    it('should resume time when paused', () => {
      const clock = new VirtualClock(1.0, true, 1000);
      
      realTime = 100;
      clock.play();
      
      expect(clock.paused).toBe(false);
      
      realTime = 600; // 500ms passed since play
      expect(clock.now()).toBe(1500);
    });

    it('should do nothing when already playing', () => {
      const changeListener = vi.fn();
      const clock = new VirtualClock(1.0, false, 0);
      clock.onChange(changeListener);
      
      clock.play();
      
      expect(changeListener).not.toHaveBeenCalled();
    });

    it('should emit change event', () => {
      const changeListener = vi.fn();
      const clock = new VirtualClock(1.0, true, 0);
      clock.onChange(changeListener);
      
      clock.play();
      
      expect(changeListener).toHaveBeenCalledOnce();
    });
  });

  describe('pause()', () => {
    it('should preserve current time when pausing', () => {
      const clock = new VirtualClock(2.0, false, 1000);
      
      realTime = 0;
      expect(clock.now()).toBe(1000);
      
      realTime = 500;
      const timeBeforePause = clock.now(); // Should be 2000
      clock.pause();
      
      expect(clock.paused).toBe(true);
      expect(clock.now()).toBe(timeBeforePause);
      
      realTime = 1000;
      expect(clock.now()).toBe(timeBeforePause); // Should remain same
    });

    it('should do nothing when already paused', () => {
      const changeListener = vi.fn();
      const clock = new VirtualClock(1.0, true, 0);
      clock.onChange(changeListener);
      
      clock.pause();
      
      expect(changeListener).not.toHaveBeenCalled();
    });

    it('should emit change event', () => {
      const changeListener = vi.fn();
      const clock = new VirtualClock(1.0, false, 0);
      clock.onChange(changeListener);
      
      clock.pause();
      
      expect(changeListener).toHaveBeenCalledOnce();
    });
  });

  describe('setSpeed()', () => {
    it('should change speed and maintain time continuity', () => {
      const clock = new VirtualClock(1.0, false, 1000);
      
      realTime = 0;
      expect(clock.now()).toBe(1000);
      
      realTime = 500;
      const timeBefore = clock.now(); // 1500
      
      clock.setSpeed(2.0);
      expect(clock.speed).toBe(2.0);
      
      // Time should be continuous at speed change
      expect(clock.now()).toBe(timeBefore);
      
      realTime = 1000; // 500ms more passed
      expect(clock.now()).toBe(timeBefore + 500 * 2.0); // Previous time + elapsed * new speed
    });

    it('should clamp negative speeds to 0', () => {
      const clock = new VirtualClock(1.0);
      
      clock.setSpeed(-5);
      
      expect(clock.speed).toBe(0);
    });

    it('should do nothing when setting same speed', () => {
      const changeListener = vi.fn();
      const clock = new VirtualClock(2.0);
      clock.onChange(changeListener);
      
      clock.setSpeed(2.0);
      
      expect(changeListener).not.toHaveBeenCalled();
    });

    it('should emit change event when speed changes', () => {
      const changeListener = vi.fn();
      const clock = new VirtualClock(1.0);
      clock.onChange(changeListener);
      
      clock.setSpeed(3.0);
      
      expect(changeListener).toHaveBeenCalledOnce();
    });

    it('should handle speed = 0 edge case', () => {
      const clock = new VirtualClock(1.0, false, 1000);
      
      realTime = 0;
      realTime = 500;
      const timeBefore = clock.now();
      
      clock.setSpeed(0);
      
      realTime = 1000;
      expect(clock.now()).toBe(timeBefore); // No progression with speed 0
    });
  });

  describe('seek()', () => {
    it('should jump to specified time', () => {
      const clock = new VirtualClock(1.0, false, 1000);
      
      clock.seek(5000);
      
      expect(clock.now()).toBe(5000);
    });

    it('should maintain speed after seeking', () => {
      const clock = new VirtualClock(2.0, false, 1000);
      
      realTime = 0;
      clock.seek(3000);
      
      realTime = 500;
      expect(clock.now()).toBe(4000); // 3000 + 500 * 2.0
    });

    it('should emit change event', () => {
      const changeListener = vi.fn();
      const clock = new VirtualClock();
      clock.onChange(changeListener);
      
      clock.seek(1000);
      
      expect(changeListener).toHaveBeenCalledOnce();
    });

    it('should work when paused', () => {
      const clock = new VirtualClock(1.0, true, 1000);
      
      clock.seek(2500);
      
      expect(clock.now()).toBe(2500);
      expect(clock.paused).toBe(true);
    });
  });

  describe('onChange subscription', () => {
    it('should notify subscribers on state changes', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const clock = new VirtualClock();
      
      clock.onChange(listener1);
      clock.onChange(listener2);
      
      clock.play();
      
      expect(listener1).toHaveBeenCalledOnce();
      expect(listener2).toHaveBeenCalledOnce();
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const clock = new VirtualClock();
      
      const unsubscribe = clock.onChange(listener);
      
      clock.play();
      expect(listener).toHaveBeenCalledOnce();
      
      listener.mockClear();
      unsubscribe();
      
      clock.pause();
      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle listener errors gracefully', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const faultyListener = vi.fn().mockImplementation(() => {
        throw new Error('Listener error');
      });
      const goodListener = vi.fn();
      
      const clock = new VirtualClock();
      clock.onChange(faultyListener);
      clock.onChange(goodListener);
      
      clock.play();
      
      expect(consoleError).toHaveBeenCalledWith(
        'Error in VirtualClock change listener:',
        expect.any(Error)
      );
      expect(goodListener).toHaveBeenCalled();
      
      consoleError.mockRestore();
    });
  });

  describe('integration scenarios', () => {
    it('should handle play/pause/speed change sequence correctly', () => {
      const clock = new VirtualClock(1.0, true, 0);
      
      // Start paused at time 0
      expect(clock.now()).toBe(0);
      expect(clock.paused).toBe(true);
      
      // Play for 1 second at normal speed
      realTime = 0;
      clock.play();
      realTime = 1000;
      expect(clock.now()).toBe(1000);
      
      // Pause and verify time is preserved
      clock.pause();
      realTime = 2000;
      expect(clock.now()).toBe(1000);
      
      // Change speed while paused
      clock.setSpeed(2.0);
      expect(clock.now()).toBe(1000);
      
      // Resume at double speed
      clock.play();
      realTime = 2500; // 500ms more
      expect(clock.now()).toBe(2000); // 1000 + 500 * 2.0
    });

    it('should handle seeking while playing', () => {
      const clock = new VirtualClock(1.5, false, 0);
      
      realTime = 0;
      realTime = 1000;
      expect(clock.now()).toBe(1500);
      
      // Seek backwards while playing
      clock.seek(500);
      realTime = 1200; // 200ms more after seek
      expect(clock.now()).toBe(800); // 500 + 200 * 1.5
      
      // Seek forwards while playing
      clock.seek(2000);
      realTime = 1400; // 200ms more after second seek
      expect(clock.now()).toBe(2300); // 2000 + 200 * 1.5
    });
  });
});