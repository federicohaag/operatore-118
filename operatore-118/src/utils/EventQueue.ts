/**
 * Valid event types for simulation events
 * 
 * Defines all possible event types that can be scheduled in the simulation.
 * Each type represents a distinct class of simulation event with specific
 * handling logic.
 * 
 * @constant
 * @example
 * ```typescript
 * const event = {
 *   type: EventType.CALL_RECEIVED,
 *   time: 1000,
 *   handler: (ctx, ev) => { ... }
 * };
 * ```
 */
export const EventType = {
  /** Emergency call received event */
  CALL_RECEIVED: "callReceived"
} as const;

/**
 * Type union of all valid event types
 * 
 * Derived from the EventType constant object to ensure type safety
 * at compile time.
 */
export type EventType = typeof EventType[keyof typeof EventType];

/**
 * Represents a discrete simulation event
 * 
 * Events are the fundamental unit of the simulation's discrete-event model.
 * Each event occurs at a specific simulation time and executes a handler
 * function when processed by the Scheduler.
 * 
 * @template Payload - Optional type for event-specific data
 * 
 * @property time - Simulation time in milliseconds when the event should fire
 * @property type - Event type identifier from EventType constant
 * @property payload - Optional event-specific data passed to the handler
 * @property handler - Function executed when the event fires. Receives simulation
 *                      context and the event itself. Must not throw exceptions.
 * 
 * @example
 * ```typescript
 * const callEvent: SimEvent<{ phoneNumber: string }> = {
 *   time: clock.now() + 5000,
 *   type: EventType.CALL_RECEIVED,
 *   payload: { phoneNumber: "112" },
 *   handler: (ctx, ev) => {
 *     console.log(`Call received at ${ctx.now()}`);
 *     ctx.dispatch?.(addCall(ev.payload.phoneNumber));
 *   }
 * };
 * ```
 */
export type SimEvent<Payload = any> = {
  time: number;
  type: EventType;
  payload?: Payload;
  handler: (ctx: SimContext, ev: SimEvent<Payload>) => void;
};

/**
 * Simulation context passed to event handlers
 * 
 * Provides event handlers with access to simulation infrastructure without
 * tight coupling. Handlers use this context to query current simulation state
 * and dispatch side effects.
 * 
 * @property now - Returns current simulation time in milliseconds. Typically
 *                 bound to VirtualClock.now() but abstracted for testability.
 * @property dispatch - Optional Redux dispatch function for state updates.
 *                      Event handlers use this to trigger state changes in
 *                      response to simulation events.
 * 
 * @remarks
 * The context is intentionally minimal to keep event handlers pure and testable.
 * Future extensions might include random number generators, event publishers,
 * or domain-specific state accessors.
 * 
 * @example
 * ```typescript
 * const context: SimContext = {
 *   now: () => virtualClock.now(),
 *   dispatch: store.dispatch
 * };
 * 
 * // Used by event handlers:
 * handler: (ctx, ev) => {
 *   const currentTime = ctx.now();
 *   ctx.dispatch?.(someAction(currentTime));
 * }
 * ```
 */
export type SimContext = {
  now: () => number;
  dispatch?: (action: any) => void;
};

/**
 * Internal event node for the priority queue
 * 
 * Extends SimEvent with metadata required for heap operations and event
 * lifecycle management. Not exposed in public API.
 * 
 * @template Payload - Type of event payload
 * 
 * @property _seq - Insertion sequence number for deterministic ordering when
 *                  events have identical times. Ensures reproducible simulation
 *                  behavior across runs.
 * @property _id - Unique identifier assigned at insertion time. Used for O(1)
 *                 cancellation lookups via Set.
 * @property _canceled - Cancellation flag. When true, event is skipped during
 *                       pop() without triggering heap rebalancing until it
 *                       reaches the top.
 * 
 * @private
 */
interface EventNode<Payload = any> extends SimEvent<Payload> {
  _seq: number;
  _id: number;
  _canceled: boolean;
}

/**
 * Min-heap priority queue for simulation events
 * 
 * Implements a binary min-heap that orders events by (time ascending, sequence ascending)
 * to ensure deterministic event execution in discrete-event simulations. Events with
 * identical timestamps are processed in insertion order via sequence numbers.
 * 
 * The queue supports efficient operations:
 * - O(log N) insertion via push()
 * - O(log N) extraction via pop()
 * - O(1) cancellation marking via cancel()
 * - O(1) peek at next event
 * 
 * Canceled events remain in the heap but are lazily removed when they reach the top,
 * avoiding expensive mid-heap deletions. This trades memory for performance in
 * cancellation-heavy scenarios.
 * 
 * @remarks
 * The queue is designed for use by the Scheduler class but can be used standalone
 * for any priority queue needs. All time values are in milliseconds and should be
 * monotonically increasing for optimal performance (though not strictly required).
 * 
 * Thread safety: Not thread-safe. Assumes single-threaded JavaScript execution.
 * 
 * @example
 * Basic usage:
 * ```typescript
 * const queue = new EventQueue();
 * 
 * // Schedule events
 * const { id, cancel } = queue.push({
 *   time: 1000,
 *   type: EventType.CALL_RECEIVED,
 *   handler: (ctx, ev) => console.log('Event fired')
 * });
 * 
 * // Process events
 * while (queue.size() > 0) {
 *   const event = queue.pop();
 *   event?.handler(context, event);
 * }
 * 
 * // Cancel pending event
 * cancel();
 * ```
 * 
 * @example
 * Deterministic ordering:
 * ```typescript
 * queue.push({ time: 100, type: 'A', handler: handlerA });
 * queue.push({ time: 100, type: 'B', handler: handlerB });
 * 
 * // Events with same time are processed in insertion order
 * queue.pop(); // Returns event A
 * queue.pop(); // Returns event B
 * ```
 */
export class EventQueue {
  private heap: EventNode[] = [];
  private nextSeq = 0;
  private nextId = 1;
  private canceledIds = new Set<number>();

  /**
   * Adds an event to the queue
   * 
   * Inserts the event into the min-heap and assigns a unique ID and sequence number.
   * The event is positioned according to its time value, with ties broken by insertion
   * order via sequence numbers.
   * 
   * @template Payload - Type of the event payload
   * @param event - The event to schedule. Must have a valid time value.
   * @returns Object containing:
   *          - id: Unique identifier for the event (positive integer)
   *          - cancel: Function that cancels the event, returns true if successful
   * 
   * @remarks
   * The returned cancel function can be called multiple times but only succeeds once.
   * Cancellation is O(1) as it only marks the event without removing it from the heap.
   * 
   * Time complexity: O(log N) where N is the number of events in the queue
   * Space complexity: O(1) additional space
   * 
   * @example
   * ```typescript
   * const { id, cancel } = queue.push({
   *   time: clock.now() + 5000,
   *   type: EventType.CALL_RECEIVED,
   *   payload: { urgency: 'high' },
   *   handler: (ctx, ev) => { ... }
   * });
   * 
   * // Cancel if needed
   * if (shouldCancel) {
   *   const wasCanceled = cancel(); // Returns true
   *   cancel(); // Returns false (already canceled)
   * }
   * ```
   */
  push<Payload>(event: SimEvent<Payload>): { id: number; cancel: () => boolean } {
    const node: EventNode<Payload> = {
      ...event,
      _seq: this.nextSeq++,
      _id: this.nextId++,
      _canceled: false
    };

    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);

    const cancel = () => {
      if (!this.canceledIds.has(node._id)) {
        this.canceledIds.add(node._id);
        node._canceled = true;
        return true;
      }
      return false;
    };

    return { id: node._id, cancel };
  }

  /**
   * Peeks at the next event without removing it
   * 
   * Returns the event with the earliest time (and lowest sequence number for ties)
   * without removing it from the queue. Automatically skips over canceled events
   * to return the next active event.
   * 
   * @returns The next active event, or undefined if the queue is empty or all
   *          remaining events are canceled
   * 
   * @remarks
   * This operation has a side effect: it removes canceled events from the top of
   * the heap as it encounters them. This lazy removal strategy maintains O(1)
   * peek time in the average case.
   * 
   * Time complexity: O(k log N) worst case where k is the number of consecutive
   *                  canceled events at the top, O(1) average case
   * 
   * @example
   * ```typescript
   * const next = queue.peek();
   * if (next && next.time <= currentTime) {
   *   const event = queue.pop();
   *   event?.handler(context, event);
   * }
   * ```
   */
  peek(): SimEvent | undefined {
    this.skipCanceled();
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }

  /**
   * Removes and returns the next event
   * 
   * Extracts the event with the earliest time from the queue and rebalances
   * the heap. Automatically skips canceled events, removing them from the heap
   * as they are encountered.
   * 
   * @returns The next active event, or undefined if the queue is empty or all
   *          remaining events are canceled
   * 
   * @remarks
   * After popping an event, the caller is responsible for executing its handler.
   * The EventQueue itself does not execute handlers - it only manages scheduling.
   * 
   * Time complexity: O(k log N) worst case where k is the number of consecutive
   *                  canceled events at the top, O(log N) average case
   * Space complexity: O(1)
   * 
   * @example
   * ```typescript
   * // Process all events up to current time
   * while (true) {
   *   const next = queue.peek();
   *   if (!next || next.time > currentTime) break;
   *   
   *   const event = queue.pop();
   *   if (event) {
   *     event.handler(context, event);
   *   }
   * }
   * ```
   */
  pop(): SimEvent | undefined {
    this.skipCanceled();
    
    if (this.heap.length === 0) {
      return undefined;
    }

    const result = this.heap[0];
    const last = this.heap.pop()!;
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return result;
  }

  /**
   * Cancels an event by ID
   * 
   * Marks the specified event as canceled without removing it from the heap.
   * Canceled events are lazily removed when they reach the top during peek()
   * or pop() operations.
   * 
   * @param id - The unique event identifier returned by push()
   * @returns true if the event was successfully canceled on this call, false if
   *          the event was already canceled or the ID was not found
   * 
   * @remarks
   * This method provides O(1) cancellation by using a Set for fast lookups and
   * marking the event node without heap restructuring. The tradeoff is that
   * canceled events continue to occupy memory until removed by subsequent
   * peek/pop calls.
   * 
   * Calling cancel() multiple times with the same ID is safe but returns false
   * after the first successful cancellation.
   * 
   * Time complexity: O(N) worst case to find the event in the heap, O(1) for
   *                  Set operations
   * Space complexity: O(1) additional space per cancellation (Set entry)
   * 
   * @example
   * ```typescript
   * const { id, cancel: cancelFn } = queue.push(event);
   * 
   * // Cancel via returned function (preferred)
   * cancelFn();
   * 
   * // Or cancel by ID
   * queue.cancel(id);
   * ```
   */
  cancel(id: number): boolean {
    if (!this.canceledIds.has(id)) {
      this.canceledIds.add(id);
      // Find and mark the event as canceled
      for (const node of this.heap) {
        if (node._id === id) {
          node._canceled = true;
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Gets the number of active (non-canceled) events in the queue
   * 
   * Counts all events that have not been canceled, including those that have
   * been marked for cancellation but not yet removed from the heap.
   * 
   * @returns The count of active events (zero or positive integer)
   * 
   * @remarks
   * This operation requires scanning the entire heap to filter out canceled
   * events, making it relatively expensive. Use sparingly in performance-critical
   * code. Consider tracking size separately if frequent queries are needed.
   * 
   * Time complexity: O(N) where N is the total number of events in the heap
   * Space complexity: O(N) temporary space for filtering
   * 
   * @example
   * ```typescript
   * console.log(`${queue.size()} events pending`);
   * 
   * if (queue.size() === 0) {
   *   console.log('Simulation complete');
   * }
   * ```
   */
  size(): number {
    return this.heap.filter(node => !node._canceled).length;
  }

  /**
   * Clears all events from the queue
   * 
   * Removes all events (both active and canceled) and resets internal counters.
   * After calling this method, the queue is in the same state as a newly
   * constructed instance.
   * 
   * @remarks
   * This operation does not notify or cancel pending events - it simply discards
   * them. Event handlers will never be called for cleared events. Use this method
   * when resetting or shutting down a simulation.
   * 
   * Existing event IDs and cancel functions from before the clear become invalid.
   * Calling cancel functions from cleared events has no effect.
   * 
   * Time complexity: O(1)
   * Space complexity: O(1) after garbage collection
   * 
   * @example
   * ```typescript
   * // Reset simulation
   * queue.clear();
   * 
   * // Queue is now empty
   * console.log(queue.size()); // 0
   * console.log(queue.peek()); // undefined
   * ```
   */
  clear(): void {
    this.heap = [];
    this.canceledIds.clear();
    this.nextSeq = 0;
    this.nextId = 1;
  }

  /**
   * Removes canceled events from the top of the heap
   * 
   * Iteratively removes canceled events that have bubbled to the top of the
   * heap, maintaining heap invariants after each removal. This lazy removal
   * strategy avoids expensive mid-heap deletions at cancellation time.
   * 
   * @remarks
   * Called automatically by peek() and pop() to ensure they never return
   * canceled events. The method stops as soon as it encounters an active
   * event at the top, leaving deeper canceled events in the heap.
   * 
   * Time complexity: O(k log N) where k is the number of consecutive canceled
   *                  events at the top
   * 
   * @private
   */
  private skipCanceled(): void {
    while (this.heap.length > 0 && this.heap[0]._canceled) {
      const last = this.heap.pop()!;
      if (this.heap.length > 0) {
        this.heap[0] = last;
        this.bubbleDown(0);
      }
    }
  }

  /**
   * Bubbles an element up to maintain heap property
   * 
   * Restores the min-heap invariant by repeatedly swapping the element at the
   * given index with its parent until the parent is smaller or the element
   * reaches the root. Used after inserting a new element at the end of the heap.
   * 
   * @param index - Zero-based index of the element to bubble up
   * 
   * @remarks
   * The heap property: For any node i, heap[i] <= heap[2*i+1] and heap[i] <= heap[2*i+2]
   * The comparison uses (time, sequence) ordering for determinism.
   * 
   * Time complexity: O(log N) where N is the number of elements
   * 
   * @private
   */
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) {
        break;
      }
      
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  /**
   * Bubbles an element down to maintain heap property
   * 
   * Restores the min-heap invariant by repeatedly swapping the element at the
   * given index with its smallest child until both children are larger or the
   * element reaches a leaf. Used after removing the root or replacing an element.
   * 
   * @param index - Zero-based index of the element to bubble down
   * 
   * @remarks
   * At each step, compares the element with both children and swaps with the
   * smaller child to maintain the min-heap property throughout the tree.
   * 
   * Time complexity: O(log N) where N is the number of elements
   * 
   * @private
   */
  private bubbleDown(index: number): void {
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < this.heap.length && 
          this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
        smallest = leftChild;
      }

      if (rightChild < this.heap.length && 
          this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
        smallest = rightChild;
      }

      if (smallest === index) {
        break;
      }

      this.swap(index, smallest);
      index = smallest;
    }
  }

  /**
   * Compares two event nodes for ordering
   * 
   * Implements the comparison function for the min-heap priority queue.
   * Orders events by time ascending, with ties broken by sequence number
   * ascending to ensure deterministic execution order.
   * 
   * @param a - First event node to compare
   * @param b - Second event node to compare
   * @returns Negative if a < b, positive if a > b, zero if equal (should never
   *          happen due to unique sequence numbers)
   * 
   * @remarks
   * The comparison logic ensures:
   * 1. Earlier events (smaller time) come first
   * 2. Events at the same time execute in insertion order (smaller sequence)
   * 3. Deterministic behavior across simulation runs
   * 
   * Time complexity: O(1)
   * 
   * @private
   */
  private compare(a: EventNode, b: EventNode): number {
    // Primary sort: time ascending
    if (a.time !== b.time) {
      return a.time - b.time;
    }
    // Secondary sort: sequence ascending (for deterministic ordering)
    return a._seq - b._seq;
  }

  /**
   * Swaps two elements in the heap
   * 
   * Exchanges the elements at the given indices using destructuring assignment.
   * Helper method used by bubbleUp() and bubbleDown() during heap rebalancing.
   * 
   * @param i - Index of first element
   * @param j - Index of second element
   * 
   * @remarks
   * Assumes both indices are valid (within bounds of the heap array).
   * No bounds checking is performed for performance.
   * 
   * Time complexity: O(1)
   * 
   * @private
   */
  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}