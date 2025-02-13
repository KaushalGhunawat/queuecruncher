
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface QueueEntry {
  id: string;
  customer_name: string;
  phone_number?: string;
  position: number;
  status: 'waiting' | 'serving' | 'served' | 'cancelled';
  joined_at: Date;
  expected_wait_time: number;
  business_id: string;
}

interface QueueState {
  entries: QueueEntry[];
  isLoading: boolean;
  error: string | null;
  addToQueue: (name: string, phone?: string) => Promise<void>;
  removeFromQueue: (id: string) => Promise<void>;
  markAsServed: (id: string) => Promise<void>;
  updateStatus: (id: string, status: QueueEntry['status']) => Promise<void>;
  fetchQueueEntries: () => Promise<void>;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,
  
  fetchQueueEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: entries, error } = await supabase
        .from('queue_entries')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;

      set({ 
        entries: entries.map(entry => ({
          ...entry,
          joined_at: new Date(entry.joined_at)
        })),
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching queue:', error);
      set({ error: 'Failed to fetch queue entries', isLoading: false });
    }
  },

  addToQueue: async (name: string, phone?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const position = (get().entries?.length || 0) + 1;
      const expectedWaitTime = position * 10; // Assuming 10 minutes per customer

      const { data, error } = await supabase
        .from('queue_entries')
        .insert([
          {
            customer_name: name,
            phone_number: phone,
            position,
            status: 'waiting',
            expected_wait_time: expectedWaitTime,
            business_id: userData.user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      await get().fetchQueueEntries();
    } catch (error) {
      console.error('Error adding to queue:', error);
      set({ error: 'Failed to add to queue', isLoading: false });
    }
  },

  removeFromQueue: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('queue_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchQueueEntries();
    } catch (error) {
      console.error('Error removing from queue:', error);
      set({ error: 'Failed to remove from queue', isLoading: false });
    }
  },

  markAsServed: async (id: string) => {
    await get().updateStatus(id, 'served');
  },

  updateStatus: async (id: string, status: QueueEntry['status']) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('queue_entries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      await get().fetchQueueEntries();
    } catch (error) {
      console.error('Error updating status:', error);
      set({ error: 'Failed to update status', isLoading: false });
    }
  }
}));
