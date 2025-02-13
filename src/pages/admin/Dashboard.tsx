
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueueStore } from '@/store/queue.store';

const AdminDashboard = () => {
  const entries = useQueueStore((state) => state.entries);

  const waitingCount = entries.filter(
    (entry) => entry.status === 'waiting' || entry.status === 'serving'
  ).length;

  const servedToday = entries.filter(
    (entry) => entry.status === 'served'
  ).length;

  const averageWaitTime = entries.reduce(
    (acc, entry) => acc + entry.expectedWaitTime,
    0
  ) / Math.max(entries.length, 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">{waitingCount}</span>
            <span className="text-sm text-muted-foreground ml-2">people waiting</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">{Math.round(averageWaitTime)}</span>
            <span className="text-sm text-muted-foreground ml-2">minutes</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Served Today</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">{servedToday}</span>
            <span className="text-sm text-muted-foreground ml-2">customers</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
