export const EventType = {
  CALL_RECEIVED: "CALL_RECEIVED",
  MISSION_DISPATCH: "MISSION_DISPATCH"
} as const;

export type EventType = typeof EventType[keyof typeof EventType];

/** Simulation event with handler. */
export type SimEvent<Payload = any> = {
  time: number;
  type: EventType;
  payload?: Payload;
  handler: (ctx: SimContext, ev: SimEvent<Payload>) => void;
};

/** Context passed to event handlers. */
export type SimContext = {
  now: () => number;
  dispatch?: (action: any) => void;
};

/** Internal node stored in the heap (adds metadata). */
interface EventNode<Payload = any> extends SimEvent<Payload> {
  _seq: number;
  _id: number;
  _canceled: boolean;
}

/** Min-heap priority queue for simulation events. */
export class EventQueue {
  private heap: EventNode[] = [];
  private nextSeq = 0;
  private nextId = 1;
  private canceledIds = new Set<number>();

  /** Add event to queue. Returns id and cancel(). */
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

  /** Peek next active event (does not remove). */
  peek(): SimEvent | undefined {
    this.skipCanceled();
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }

  /** Pop next active event. */
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

  /** Cancel event by id. */
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

  /** Return number of active (non-canceled) events. */
  size(): number {
    return this.heap.filter(node => !node._canceled).length;
  }

  /** Clear queue and reset internal counters. */
  clear(): void {
    this.heap = [];
    this.canceledIds.clear();
    this.nextSeq = 0;
    this.nextId = 1;
  }

  /** Remove canceled events from heap top. */
  private skipCanceled(): void {
    while (this.heap.length > 0 && this.heap[0]._canceled) {
      const last = this.heap.pop()!;
      if (this.heap.length > 0) {
        this.heap[0] = last;
        this.bubbleDown(0);
      }
    }
  }

  /** Bubble element up to restore heap property. */
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

  /** Bubble element down to restore heap property. */
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

  /** Compare events by (time, sequence). */
  private compare(a: EventNode, b: EventNode): number {
    // Primary sort: time ascending
    if (a.time !== b.time) {
      return a.time - b.time;
    }
    // Secondary sort: sequence ascending (for deterministic ordering)
    return a._seq - b._seq;
  }

  /** Swap two heap elements. */
  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}