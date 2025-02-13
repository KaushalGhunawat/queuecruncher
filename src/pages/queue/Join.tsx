
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQueueStore } from '@/store/queue.store';
import { useToast } from '@/hooks/use-toast';

const JoinQueue = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const addToQueue = useQueueStore((state) => state.addToQueue);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      addToQueue(name, phone);
      toast({
        title: 'Success',
        description: 'You have been added to the queue',
      });
      navigate(`/queue/status/${businessId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join queue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-queue-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join the Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone (Optional)
              </label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Joining Queue...' : 'Join Queue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinQueue;
