/**
 * VirtualClock - Models simulation time with accelerated speed
 * 
 * Provides a virtual clock for discrete-event simulation that can run at different 
 * speeds, be paused, and support seeking to specific times. Uses performance.now() 
 * for monotonic time measurement and provides O(1) operations without internal timers.
 * 
 * The clock maintains two anchor points: a simulation time anchor (simAnchor) and 
 * a real-world time anchor (realAnchor). Current simulation time is calculated as:
 * `simTime = simAnchor + (performance.now() - realAnchor) * speed`
 * 
 * When paused, simAnchor represents the frozen simulation time. When playing, 
 * simAnchor and realAnchor are updated together during speed changes or seeks 
 * to ensure time continuity.
 * 
 * Key features:
 * - Speed control: Run simulation at any non-negative speed multiplier
 * - Play/pause: Stop and resume time progression
 * - Seek: Jump to specific simulation times
 * - Change notifications: Subscribe to state changes
 * - No internal timers: Efficient O(1) time calculation
 * 
 * Thread safety: Not thread-safe. Designed for single-threaded JavaScript environments.
 * 
 * @example Basic usage
 * ```typescript
 * const clock = new VirtualClock(1.0); // Normal speed, starts paused
 * 
 * clock.onChange(() => {
 *   console.log('Clock state changed:', clock.now());
 * });
 * 
 * clock.play();  // Start time progression
 * clock.setSpeed(2.0); // Double speed
 * 
 * // Later...
 * console.log('Current sim time:', clock.now());
 * clock.pause();
 * ```
 * 
 * @example Integration with Scheduler
 * ```typescript
 * const clock = new VirtualClock(2.0, true, 0);
 * const scheduler = new Scheduler(clock, dispatch);
 * 
 * scheduler.scheduleIn(1000, {
 *   type: EventType.CALL_RECEIVED,
 *   handler: (ctx, event) => {
 *     console.log('Event at sim time:', ctx.now());
 *   }
 * });
 * 
 * clock.play(); // Start simulation
 * ```
 */
export class VirtualClock {
  /**
   * Simulation time anchor point (milliseconds)
   * 
   * When paused: represents the current frozen simulation time
   * When playing: represents the simulation time at realAnchor
   * @private
   */
  private simAnchor: number;
  
  /**
   * Real-world time anchor point from performance.now() (milliseconds)
   * 
   * Used to calculate elapsed real time since the last anchor update.
   * Updated whenever speed changes or play/pause/seek operations occur.
   * @private
   */
  private realAnchor: number;
  
  /**
   * Speed multiplier for time progression (≥0)
   * 
   * 1.0 = normal speed, 2.0 = double speed, 0.5 = half speed, 0 = frozen
   * @private
   */
  private _speed: number;
  
  /**
   * Whether the clock is currently paused
   * 
   * When true, time does not progress and now() returns simAnchor
   * @private
   */
  private _paused: boolean;
  
  /**
   * Set of registered change listener callbacks
   * 
   * Called whenever clock state changes (play/pause/setSpeed/seek)
   * @private
   */
  private changeListeners: Set<() => void>;

  /**
   * Creates a new VirtualClock instance
   * 
   * Initializes a virtual clock with specified speed, pause state, and starting time.
   * Negative speeds are clamped to 0. The real-world anchor is set to the current
   * performance.now() value.
   * 
   * @param initialSpeed - Initial speed multiplier (≥0, default: 1.0). 
   *                       Values < 0 are clamped to 0.
   * @param startPaused - Whether to start in paused state (default: true).
   *                      Recommended to start paused for controlled simulation start.
   * @param initialTime - Initial simulation time in milliseconds (default: 0).
   *                      Can be any non-negative value.
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
   * Calculates the current simulation time based on the clock state:
   * - When paused: returns the frozen simAnchor value
   * - When playing: returns simAnchor + elapsed real time × speed
   * 
   * This is an O(1) operation that does not modify clock state.
   * The returned value is always monotonically increasing when playing
   * (assuming system time doesn't go backwards).
   * 
   * @returns Current simulation time in milliseconds (≥0)
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
   * Transitions from paused to playing state, allowing time to progress.
   * Updates realAnchor to the current performance.now() to establish a new
   * reference point for time calculation. Emits a change event to notify listeners.
   * 
   * If the clock is already playing, this operation is a no-op and does not
   * emit change events.
   * 
   * @emits change event if state changes from paused to playing
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
   * Transitions from playing to paused state, stopping time progression.
   * Captures the current simulation time into simAnchor to preserve the
   * exact time when paused. Emits a change event to notify listeners.
   * 
   * If the clock is already paused, this operation is a no-op and does not
   * emit change events.
   * 
   * The paused time can be retrieved with now() and will remain constant
   * until play() or seek() is called.
   * 
   * @emits change event if state changes from playing to paused
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
   * Changes the speed multiplier while ensuring continuity of the current
   * simulation time. Both anchors (simAnchor and realAnchor) are updated
   * to maintain the exact current time across the speed transition.
   * 
   * Speed is clamped to be ≥ 0. Negative values are treated as 0.
   * A speed of 0 effectively freezes time (but differs from pause state).
   * 
   * If the new speed equals the current speed, this operation is a no-op
   * and does not emit change events.
   * 
   * @param speed - New speed multiplier (≥0). Common values:
   *                - 0.5 = half speed
   *                - 1.0 = normal speed  
   *                - 2.0 = double speed
   *                - 10.0 = 10x speed
   * @emits change event if speed value changes
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
   * Immediately jumps to the specified simulation time, regardless of
   * whether the clock is playing or paused. Updates both simAnchor and
   * realAnchor to establish a new reference point. Emits a change event
   * to notify listeners.
   * 
   * This operation always emits a change event, even if seeking to the
   * current time. No validation is performed on the target time value.
   * 
   * Warning: Seeking backwards while a Scheduler is active may cause
   * issues with already-scheduled future events. Consider pausing and
   * clearing events before seeking backwards.
   * 
   * @param time - Target simulation time in milliseconds. Can be any value,
   *               including times before the current time (seeking backwards)
   *               or after (seeking forwards).
   * @emits change event unconditionally
   */
  seek(time: number): void {
    this.simAnchor = time;
    this.realAnchor = performance.now();
    this.emitChange();
  }

  /**
   * Gets the current speed multiplier
   * 
   * Returns the current speed setting. Does not reflect the paused state;
   * a paused clock retains its speed value and returns it here.
   * 
   * @returns Current speed multiplier (≥0)
   */
  get speed(): number {
    return this._speed;
  }

  /**
   * Gets the current paused state
   * 
   * Returns whether the clock is currently paused. A paused clock does
   * not progress time, and now() returns a constant value until play()
   * or seek() is called.
   * 
   * @returns true if clock is paused, false if playing
   */
  get paused(): boolean {
    return this._paused;
  }

  /**
   * Subscribes to clock state changes
   * 
   * Registers a callback that will be invoked whenever the clock state changes
   * due to play(), pause(), setSpeed(), or seek() operations. Callbacks are
   * not invoked for operations that don't change state (e.g., calling play()
   * when already playing).
   * 
   * Callbacks are executed synchronously during the state change operation.
   * If a callback throws an error, the error is logged to console.error and
   * other callbacks continue to execute.
   * 
   * The same callback function can only be registered once. Duplicate
   * registrations are ignored.
   * 
   * @param callback - Function to call on state changes. Receives no arguments.
   *                   Should not throw exceptions.
   * @returns Unsubscribe function that removes the callback when called.
   *          Safe to call multiple times (subsequent calls are no-ops).
   * 
   * @example
   * ```typescript
   * const clock = new VirtualClock();
   * const unsubscribe = clock.onChange(() => {
   *   console.log('Clock changed to:', clock.now());
   * });
   * 
   * clock.play(); // Triggers callback
   * unsubscribe(); // Remove callback
   * clock.pause(); // Does not trigger callback
   * ```
   */
  onChange(callback: () => void): () => void {
    this.changeListeners.add(callback);
    
    return () => {
      this.changeListeners.delete(callback);
    };
  }

  /**
   * Emits change events to all registered listeners
   * 
   * Invokes all registered onChange callbacks synchronously in registration order.
   * If a callback throws an error, it is caught, logged to console.error, and
   * execution continues with the next callback.
   * 
   * This is called internally by play(), pause(), setSpeed(), and seek() when
   * they modify clock state.
   * 
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