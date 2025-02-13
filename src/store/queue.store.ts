
import { create } from 'zustand';

export interface QueueEntry {
  id: string;
  name: string;
  phone?: string;
  position: number;
  status: 'waiting' | 'serving' | 'served' | 'cancelled';
  joinedAt: Date;
  expectedWaitTime: number;
}

interface QueueState {
  entries: QueueEntry[];
  addToQueue: (name: string, phone?: string) => void;
  removeFromQueue: (id: string) => void;
  markAsServed: (id: string) => void;
  updateStatus: (id: string, status: QueueEntry['status']) => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  entries: [],
  addToQueue: (name, phone) => {
    set((state) => {
      const newEntry: QueueEntry = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        phone,
        position: state.entries.length + 1,
        status: 'waiting',
        joinedAt: new Date(),
        expectedWaitTime: state.entries.length * 10, // Assuming 10 minutes per customer
      };

      return {
        entries: [...state.entries, newEntry],
      };
    });
  },
  removeFromQueue: (id) => {
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    }));
  },
  markAsServed: (id) => {
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, status: 'served' } : entry
      ),
    }));
  },
  updateStatus: (id, status) => {
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, status } : entry
      ),
    }));
  },
}));
