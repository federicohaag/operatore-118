export const EventType = {
  CALL_RECEIVED: "CALL_RECEIVED",
  MISSION_CREATION: "MISSION_CREATION"
} as const;

export type EventType = typeof EventType[keyof typeof EventType];

/**
 * Discrete simulation event with handler
 * 
 * @property time - Simulation time in milliseconds when event fires
 * @property type - Event type identifier
 * @property payload - Optional event-specific data
 * @property handler - Function executed when event fires
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
 * @property now - Returns current simulation time in milliseconds
 * @property dispatch - Optional Redux dispatch function for state updates
 */
export type SimContext = {
  now: () => number;
  dispatch?: (action: any) => void;
};

/**
 * Internal event node with metadata for heap operations
 * 
 * @property _seq - Sequence number for deterministic ordering
 * @property _id - Unique identifier for cancellation
 * @property _canceled - Cancellation flag
 */
interface EventNode<Payload = any> extends SimEvent<Payload> {
  _seq: number;
  _id: number;
  _canceled: boolean;
}

/**
 * Min-heap priority queue for simulation events
 * 
 * Orders events by (time, sequence) for deterministic execution. Supports O(log N)
 * insertion/extraction and O(1) cancellation marking.
 */
export class EventQueue {
  private heap: EventNode[] = [];
  private nextSeq = 0;
  private nextId = 1;
  private canceledIds = new Set<number>();

  /**
   * Adds event to queue
   * 
   * @param event - Event to schedule
   * @returns Object with event id and cancel function
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
   * Returns next event without removing it
   * 
   * @returns Next active event, or undefined if queue is empty
   */
  peek(): SimEvent | undefined {
    this.skipCanceled();
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }

  /**
   * Removes and returns next event
   * 
   * @returns Next active event, or undefined if queue is empty
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
   * Cancels event by ID
   * 
   * @param id - Event identifier from push()
   * @returns true if canceled, false if already canceled or not found
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
   * Returns number of active events
   * 
   * @returns Count of non-canceled events
   */
  size(): number {
    return this.heap.filter(node => !node._canceled).length;
  }

  /**
   * Removes all events and resets queue
   */
  clear(): void {
    this.heap = [];
    this.canceledIds.clear();
    this.nextSeq = 0;
    this.nextId = 1;
  }

  /**
   * Removes canceled events from heap top
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
   * Restores heap property by bubbling element up
   * 
   * @param index - Index of element to bubble up
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
   * Restores heap property by bubbling element down
   * 
   * @param index - Index of element to bubble down
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
   * Compares events by (time, sequence) for ordering
   * 
   * @param a - First event node
   * @param b - Second event node
   * @returns Negative if a < b, positive if a > b
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
   * Swaps two heap elements
   * 
   * @param i - First index
   * @param j - Second index
   */
  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}