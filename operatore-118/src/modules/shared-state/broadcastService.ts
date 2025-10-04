/**
 * Service to handle cross-window/tab communication using localStorage
 */
export class BroadcastService {
  private storageKey: string;
  private listeners: Set<(message: any) => void>;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.listeners = new Set();

    // Listen for broadcast channel messages
    const channel = new BroadcastChannel('operatore-118-state-sync');
    channel.onmessage = (event) => {
      this.listeners.forEach(listener => listener(event.data));
    };
  }

  /**
   * Send a message to all other windows/tabs
   */
  broadcast(message: any): void {
    try {
      const broadcastChannel = new BroadcastChannel('operatore-118-state-sync');
      broadcastChannel.postMessage(message);
      broadcastChannel.close();
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

import { STORAGE_STATE_KEY } from './constants';

export const broadcastService = new BroadcastService(STORAGE_STATE_KEY);