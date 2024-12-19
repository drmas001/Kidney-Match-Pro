import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipientTable } from '@/components/recipients/RecipientTable';
import { RecipientSearch } from '@/components/recipients/RecipientSearch';
import { RecipientDeleteDialog } from '@/components/recipients/RecipientDeleteDialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { getRecipients, deleteRecipient } from '@/lib/api/recipients';
import type { Recipient } from '@/types/matching';
import { toast } from 'sonner';

export function RecipientList() {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [filteredRecipients, setFilteredRecipients] = useState<Recipient[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      const data = await getRecipients();
      setRecipients(data);
      setFilteredRecipients(data);
    } catch (error) {
      console.error('Error loading recipients:', error);
      toast.error('Failed to load recipients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string, filters: { bloodType?: string }) => {
    let filtered = [...recipients];

    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(
        (recipient) =>
          recipient.fullName.toLowerCase().includes(searchTerm) ||
          recipient.mrn.toLowerCase().includes(searchTerm)
      );
    }

    // Apply blood type filter
    if (filters.bloodType) {
      filtered = filtered.filter(
        (recipient) => recipient.bloodType === filters.bloodType
      );
    }

    setFilteredRecipients(filtered);
  };

  const handleDelete = async (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setShowDeleteDialog(true);
  };

  const handleEdit = (recipient: Recipient) => {
    navigate(`/recipients/edit/${recipient.id}`);
  };

  const confirmDelete = async () => {
    if (!selectedRecipient) return;

    try {
      await deleteRecipient(selectedRecipient.id);
      setRecipients(prev => prev.filter(r => r.id !== selectedRecipient.id));
      setFilteredRecipients(prev => prev.filter(r => r.id !== selectedRecipient.id));
      toast.success('Recipient deleted successfully');
    } catch (error) {
      console.error('Error deleting recipient:', error);
      toast.error('Failed to delete recipient');
    } finally {
      setShowDeleteDialog(false);
      setSelectedRecipient(null);
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
        <h1 className="text-2xl font-semibold">Recipient List</h1>
        <Button onClick={() => navigate('/recipients/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Recipient
        </Button>
      </div>

      <RecipientSearch onSearch={handleSearch} />

      <RecipientTable
        recipients={filteredRecipients}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <RecipientDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        recipient={selectedRecipient}
      />
    </div>
  );
}