import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Heart, Users, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface DashboardStats {
  totalDonors: number;
  totalRecipients: number;
  successfulMatches: number;
  pendingMatches: number;
}

interface Activity {
  id: string;
  type: 'donor_added' | 'match_found' | 'urgent_review';
  content: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDonors: 0,
    totalRecipients: 0,
    successfulMatches: 0,
    pendingMatches: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch total donors
      const { count: donorCount } = await supabase
        .from('donors')
        .select('*', { count: 'exact', head: true });

      // Fetch total recipients
      const { count: recipientCount } = await supabase
        .from('recipients')
        .select('*', { count: 'exact', head: true });

      // Fetch matching results
      const { data: matchingResults } = await supabase
        .from('matching_results')
        .select('status');

      const successfulMatches = matchingResults?.filter(
        (match) => match.status === 'Approved'
      ).length || 0;

      const pendingMatches = matchingResults?.filter(
        (match) => match.status === 'Pending'
      ).length || 0;

      setStats({
        totalDonors: donorCount || 0,
        totalRecipients: recipientCount || 0,
        successfulMatches,
        pendingMatches,
      });

      // Fetch recent activities
      const { data: recentDonors } = await supabase
        .from('donors')
        .select('id, full_name, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: recentMatches } = await supabase
        .from('matching_results')
        .select(`
          id,
          created_at,
          status,
          recipient:recipients!inner(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      // Transform into activities
      const activities: Activity[] = [
        ...(recentDonors?.map((donor) => ({
          id: donor.id,
          type: 'donor_added' as const,
          content: `New donor ${donor.full_name} added to the system`,
          timestamp: donor.created_at,
          status: 'success' as const,
        })) || []),
        ...(recentMatches?.map((match) => ({
          id: match.id,
          type: 'match_found' as const,
          content: `Potential match found for recipient ${match.recipient[0].full_name}`,
          timestamp: match.created_at,
          status: match.status === 'Pending' ? 'warning' as const : 'info' as const,
        })) || []),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 bg-background/95 backdrop-blur-sm rounded-lg p-8 border shadow-sm">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Welcome to Kidney Match Pro
        </h1>
        <p className="text-lg text-muted-foreground">
          Streamlining kidney donor and recipient management with precision and
          care.
        </p>
      </div>

      <div className="mb-8">
        <QuickActions />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Donors"
          value={stats.totalDonors}
          icon={Heart}
        />
        <StatsCard
          title="Total Recipients"
          value={stats.totalRecipients}
          icon={Users}
        />
        <StatsCard
          title="Successful Matches"
          value={stats.successfulMatches}
          icon={CheckCircle}
        />
        <StatsCard
          title="Pending Matches"
          value={stats.pendingMatches}
          icon={Clock}
        />
      </div>

      <div className="grid gap-6">
        <ActivityFeed activities={activities} />
      </div>
    </>
  );
}