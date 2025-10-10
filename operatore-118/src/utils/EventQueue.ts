/**
 * SimEvent - Represents a discrete simulation event
 */
export type SimEvent<Payload = any> = {
  time: number;                    // simulation ms
  type: string;
  payload?: Payload;
  handler: (ctx: SimContext, ev: SimEvent<Payload>) => void;
};

/**
 * SimContext - Simulation context passed to event handlers
 */
export type SimContext = {
  now: () => number;               // usually clock.now()
  // extend with domain state, rng, publish(), etc.
};

/**
 * Internal event node for the priority queue
 * @private
 */
interface EventNode<Payload = any> extends SimEvent<Payload> {
  _seq: number;                    // insertion sequence for deterministic ordering
  _id: number;                     // unique identifier for cancellation
  _canceled: boolean;              // cancellation flag
}

/**
 * EventQueue - Min-heap priority queue for simulation events
 * 
 * Orders events by (time ascending, sequence ascending) for deterministic execution.
 * Supports O(log N) push/pop operations and O(1) cancellation marking.
 * 
 * @example
 * ```typescript
 * const queue = new EventQueue();
 * const { id, cancel } = queue.push({
 *   time: 1000,
 *   type: 'test',
 *   handler: (ctx, ev) => console.log('Event fired at', ctx.now())
 * });
 * 
 * // Later...
 * const next = queue.pop(); // Gets the earliest event
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
   * @param event - The event to schedule
   * @returns Object with unique ID and cancel function
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
   * @returns The next event or undefined if queue is empty
   */
  peek(): SimEvent | undefined {
    this.skipCanceled();
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }

  /**
   * Removes and returns the next event
   * 
   * @returns The next event or undefined if queue is empty
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
   * @param id - The event ID to cancel
   * @returns true if the event was canceled, false if already canceled or not found
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
   * @returns Number of active events
   */
  size(): number {
    return this.heap.filter(node => !node._canceled).length;
  }

  /**
   * Clears all events from the queue
   */
  clear(): void {
    this.heap = [];
    this.canceledIds.clear();
    this.nextSeq = 0;
    this.nextId = 1;
  }

  /**
   * Removes canceled events from the top of the heap
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
   * @private
   */
  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}