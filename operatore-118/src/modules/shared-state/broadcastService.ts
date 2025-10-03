/**
 * Service to handle cross-window/tab communication using localStorage
 */
export class BroadcastService {
  private storageKey: string;
  private listeners: Set<(message: any) => void>;

  constructor(storageKey: string = 'operatore-118-state') {
    this.storageKey = storageKey;
    this.listeners = new Set();

    // Listen for storage events from other windows
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey) {
        try {
          const message = JSON.parse(event.newValue || '');
          this.listeners.forEach(listener => listener(message));
        } catch (error) {
          console.error('Failed to parse message from localStorage:', error);
        }
      }
    });
  }

  /**
   * Send a message to all other windows/tabs
   */
  broadcast(message: any): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(message));
    } catch (error) {
      console.error('Failed to broadcast message:', error);
    }
  }

  /**
   * Add a listener for incoming messages
   */
  addListener(listener: (message: any) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Clean up resources
   */
  close(): void {
    this.listeners.clear();
    window.removeEventListener('storage', this.handleStorage);
  }

  private handleStorage = (event: StorageEvent) => {
    if (event.key === this.storageKey) {
      try {
        const message = JSON.parse(event.newValue || '');
        this.listeners.forEach(listener => listener(message));
      } catch (error) {
        console.error('Failed to parse message from localStorage:', error);
      }
    }
  };
}

export const broadcastService = new BroadcastService();