
import { Card } from '@/components/ui/card';

const QueueManagement = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Queue Management</h1>
      <Card className="p-6">
        <p className="text-muted-foreground">No customers in queue</p>
      </Card>
    </div>
  );
};

export default QueueManagement;
