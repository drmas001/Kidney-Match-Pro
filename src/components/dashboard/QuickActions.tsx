import { Plus, Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-4">
      <Button className="gap-2" onClick={() => navigate('/donors/new')}>
        <Plus className="h-4 w-4" />
        Add New Donor
      </Button>
      <Button className="gap-2" variant="secondary" onClick={() => navigate('/recipients')}>
        <UserPlus className="h-4 w-4" />
        Add New Recipient
      </Button>
      <Button className="gap-2" variant="outline" onClick={() => navigate('/matching')}>
        <Search className="h-4 w-4" />
        Run Matching Algorithm
      </Button>
    </div>
  );
}