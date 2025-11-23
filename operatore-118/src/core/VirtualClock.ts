/**
 * VirtualClock - monotonic simulation clock
 *
 * Computes simulation time as:
 *   simTime = simAnchor + (performance.now() - realAnchor) * speed
 *
 * Purpose: provide a simple, efficient clock for the scheduler with
 * play/pause, speed, seek and change listeners. No internal timers.
 */
export class VirtualClock {
  /** Simulation time anchor (ms). */
  private simAnchor: number;
  
  /** Real-world anchor from performance.now() (ms). */
  private realAnchor: number;
  
  /** Speed multiplier (≥0). */
  private _speed: number;
  
  /** Paused state. when true, now() returns simAnchor. */
  private _paused: boolean;
  
  /** Registered onChange callbacks. */
  private changeListeners: Set<() => void>;

  /**
   * Create a new VirtualClock
   * @param initialSpeed Initial speed multiplier (≥0). Default 1.0
   * @param startPaused Start paused if true. Default true
   * @param initialTime Initial simulation time in ms. Default 0
   */
  constructor(initialSpeed: number = 1.0, startPaused: boolean = true, initialTime: number = 0) {
    this.simAnchor = initialTime;
    this.realAnchor = performance.now();
    this._speed = Math.max(0, initialSpeed);
    this._paused = startPaused;
    this.changeListeners = new Set();
  }

  /** Return current simulation time (ms). */
  now(): number {
    if (this._paused) {
      return this.simAnchor;
    }
    return this.simAnchor + (performance.now() - this.realAnchor) * this._speed;
  }

  /** Resume time progression (no-op if already playing). */
  play(): void {
    if (!this._paused) {
      return;
    }

    this.realAnchor = performance.now();
    this._paused = false;
    this.emitChange();
  }

  /** Pause and freeze current simulation time. */
  pause(): void {
    if (this._paused) {
      return;
    }

    this.simAnchor = this.now();
    this._paused = true;
    this.emitChange();
  }

  /** Set speed multiplier (≥0). Preserves current sim time. */
  setSpeed(speed: number): void {
    const clampedSpeed = Math.max(0, speed);
    
    if (clampedSpeed === this._speed) {
      return;
    }

    // Ensure continuity by updating anchors
    this.simAnchor = this.now();
    this.realAnchor = performance.now();
    this._speed = clampedSpeed;
    this.emitChange();
  }

  /** Seek to a target simulation time (ms). Emits change event. */
  seek(time: number): void {
    this.simAnchor = time;
    this.realAnchor = performance.now();
    this.emitChange();
  }

  /** Current speed multiplier (≥0). */
  get speed(): number {
    return this._speed;
  }

  /** Whether the clock is paused. */
  get paused(): boolean {
    return this._paused;
  }

  /**
   * Register a change listener. Returns an unsubscribe function.
   * Callbacks run synchronously; errors are caught and logged.
   */
  onChange(callback: () => void): () => void {
    this.changeListeners.add(callback);
    
    return () => {
      this.changeListeners.delete(callback);
    };
  }

  /** Invoke listeners synchronously; log and continue on errors. */
  private emitChange(): void {
    this.changeListeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in VirtualClock change listener:', error);
      }
    });
  }
}