import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'donor_added' | 'match_found' | 'urgent_review';
  content: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const statusStyles = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border bg-background p-6">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        <h2 className="font-semibold">Recent Activity</h2>
      </div>
      <div className="mt-6 space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg border p-4"
            >
              <div
                className={cn(
                  'mt-1 h-2 w-2 rounded-full',
                  statusStyles[activity.status]
                )}
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm">{activity.content}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(activity.timestamp), 'PPp')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No recent activities
          </div>
        )}
      </div>
    </div>
  );
}