/**
 * VirtualClock - Models simulation time with accelerated speed
 * 
 * This class provides a virtual clock that can run at different speeds, be paused,
 * and support seeking to specific times. It uses performance.now() for monotonic
 * time measurement and provides O(1) operations without internal timers.
 * 
 * @example
 * ```typescript
 * const clock = new VirtualClock(1.0); // Normal speed
 * 
 * clock.onChange(() => {
 *   console.log('Clock state changed:', clock.now());
 * });
 * 
 * clock.setSpeed(2.0); // Double speed
 * clock.play();
 * 
 * // Later...
 * console.log('Current sim time:', clock.now());
 * clock.pause();
 * ```
 */
export class VirtualClock {
  private simAnchor: number;
  private realAnchor: number;
  private _speed: number;
  private _paused: boolean;
  private changeListeners: Set<() => void>;

  /**
   * Creates a new VirtualClock instance
   * 
   * @param initialSpeed - Initial speed multiplier (≥0, default: 1.0)
   * @param startPaused - Whether to start in paused state (default: true)
   * @param initialTime - Initial simulation time (default: 0)
   */
  constructor(initialSpeed: number = 1.0, startPaused: boolean = true, initialTime: number = 0) {
    this.simAnchor = initialTime;
    this.realAnchor = performance.now();
    this._speed = Math.max(0, initialSpeed);
    this._paused = startPaused;
    this.changeListeners = new Set();
  }

  /**
   * Gets the current simulation time
   * 
   * @returns Current simulation time in milliseconds
   */
  now(): number {
    if (this._paused) {
      return this.simAnchor;
    }
    return this.simAnchor + (performance.now() - this.realAnchor) * this._speed;
  }

  /**
   * Starts or resumes the clock
   * 
   * If the clock is paused, this will resume time progression at the current speed.
   * Does nothing if already playing.
   */
  play(): void {
    if (!this._paused) {
      return;
    }

    this.realAnchor = performance.now();
    this._paused = false;
    this.emitChange();
  }

  /**
   * Pauses the clock
   * 
   * Stops time progression and preserves the current simulation time.
   * Does nothing if already paused.
   */
  pause(): void {
    if (this._paused) {
      return;
    }

    this.simAnchor = this.now();
    this._paused = true;
    this.emitChange();
  }

  /**
   * Sets the clock speed
   * 
   * Changes the speed multiplier and ensures continuity of the current time.
   * Speed is clamped to be ≥ 0.
   * 
   * @param speed - New speed multiplier (≥0)
   */
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

  /**
   * Seeks to a specific simulation time
   * 
   * Immediately changes the current simulation time to the specified value.
   * 
   * @param time - Target simulation time in milliseconds
   */
  seek(time: number): void {
    this.simAnchor = time;
    this.realAnchor = performance.now();
    this.emitChange();
  }

  /**
   * Gets the current speed multiplier
   * 
   * @returns Current speed multiplier
   */
  get speed(): number {
    return this._speed;
  }

  /**
   * Gets the current paused state
   * 
   * @returns true if paused, false if playing
   */
  get paused(): boolean {
    return this._paused;
  }

  /**
   * Subscribes to clock state changes
   * 
   * The callback will be called whenever the clock state changes (play/pause/setSpeed/seek).
   * 
   * @param callback - Function to call on state changes
   * @returns Unsubscribe function
   */
  onChange(callback: () => void): () => void {
    this.changeListeners.add(callback);
    
    return () => {
      this.changeListeners.delete(callback);
    };
  }

  /**
   * Emits change events to all registered listeners
   * @private
   */
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