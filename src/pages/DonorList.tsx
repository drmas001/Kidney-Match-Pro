import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DonorTable } from '@/components/donors/DonorTable';
import { DonorSearch } from '@/components/donors/DonorSearch';
import { DonorDeleteDialog } from '@/components/donors/DonorDeleteDialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { getDonors, deleteDonor } from '@/lib/api/donors';
import type { Donor } from '@/types/matching';
import { toast } from 'sonner';

export function DonorList() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const data = await getDonors();
      setDonors(data);
      setFilteredDonors(data);
    } catch (error) {
      console.error('Error loading donors:', error);
      toast.error('Failed to load donors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string, filters: { bloodType?: string; status?: string }) => {
    let filtered = [...donors];

    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(
        (donor) =>
          donor.fullName.toLowerCase().includes(searchTerm) ||
          donor.mrn.toLowerCase().includes(searchTerm)
      );
    }

    // Apply blood type filter
    if (filters.bloodType) {
      filtered = filtered.filter(
        (donor) => donor.bloodType === filters.bloodType
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(
        (donor) => donor.status === filters.status
      );
    }

    setFilteredDonors(filtered);
  };

  const handleDelete = async (donor: Donor) => {
    if (donor.status === 'Utilized') {
      toast.error('Cannot delete a utilized donor');
      return;
    }
    setSelectedDonor(donor);
    setShowDeleteDialog(true);
  };

  const handleEdit = (donor: Donor) => {
    navigate(`/donors/edit/${donor.id}`);
  };

  const confirmDelete = async () => {
    if (!selectedDonor) return;

    try {
      await deleteDonor(selectedDonor.id);
      setDonors(prev => prev.filter(d => d.id !== selectedDonor.id));
      setFilteredDonors(prev => prev.filter(d => d.id !== selectedDonor.id));
      toast.success('Donor deleted successfully');
    } catch (error) {
      console.error('Error deleting donor:', error);
      toast.error('Failed to delete donor');
    } finally {
      setShowDeleteDialog(false);
      setSelectedDonor(null);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Donor List</h1>
        <Button onClick={() => navigate('/donors/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Donor
        </Button>
      </div>

      <DonorSearch onSearch={handleSearch} />

      <DonorTable
        donors={filteredDonors}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <DonorDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        donor={selectedDonor}
      />
    </div>
  );
}