
import { useEffect, useState } from 'react';
import { useQueueStore, type QueueEntry } from '@/store/queue.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const statusColors = {
  waiting: 'bg-yellow-500',
  serving: 'bg-blue-500',
  served: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const QueueManagement = () => {
  const { entries, isLoading, error, markAsServed, removeFromQueue, updateStatus, fetchQueueEntries } = useQueueStore();
  const { toast } = useToast();
  const [selectedEntry, setSelectedEntry] = useState<QueueEntry | null>(null);

  useEffect(() => {
    fetchQueueEntries();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_entries'
        },
        () => {
          fetchQueueEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchQueueEntries]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleServe = async (entry: QueueEntry) => {
    try {
      await updateStatus(entry.id, 'serving');
      setSelectedEntry(entry);
      toast({
        title: 'Now Serving',
        description: `Now serving ${entry.customer_name}`,
      });
    } catch (error) {
      console.error('Error serving customer:', error);
    }
  };

  const handleComplete = async (entry: QueueEntry) => {
    try {
      await markAsServed(entry.id);
      setSelectedEntry(null);
      toast({
        title: 'Completed',
        description: `${entry.customer_name} has been served`,
      });
    } catch (error) {
      console.error('Error completing service:', error);
    }
  };

  const handleRemove = async (entry: QueueEntry) => {
    try {
      await removeFromQueue(entry.id);
      if (selectedEntry?.id === entry.id) {
        setSelectedEntry(null);
      }
      toast({
        title: 'Removed',
        description: `${entry.customer_name} has been removed from the queue`,
      });
    } catch (error) {
      console.error('Error removing from queue:', error);
    }
  };

  const waitingEntries = entries.filter(
    (entry) => entry.status === 'waiting' || entry.status === 'serving'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Queue Management</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {waitingEntries.length === 0 ? (
                <p className="text-muted-foreground">No customers in queue</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Wait Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waitingEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.position}</TableCell>
                        <TableCell>{entry.customer_name}</TableCell>
                        <TableCell>{entry.expected_wait_time} mins</TableCell>
                        <TableCell>
                          <Badge className={statusColors[entry.status]}>
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {entry.status === 'waiting' && (
                              <Button
                                size="sm"
                                onClick={() => handleServe(entry)}
                              >
                                Serve
                              </Button>
                            )}
                            {entry.status === 'serving' && (
                              <Button
                                size="sm"
                                onClick={() => handleComplete(entry)}
                              >
                                Complete
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemove(entry)}
                            >
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Now Serving</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEntry ? (
                <div className="space-y-4">
                  <div className="text-2xl font-bold">{selectedEntry.customer_name}</div>
                  {selectedEntry.phone_number && (
                    <div className="text-sm text-muted-foreground">
                      Phone: {selectedEntry.phone_number}
                    </div>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => handleComplete(selectedEntry)}
                  >
                    Mark as Complete
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No customer selected</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueueManagement;
