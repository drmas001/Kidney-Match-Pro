import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipientSelector } from '@/components/matching/RecipientSelector';
import { RecipientDetails } from '@/components/matching/RecipientDetails';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getRecipients } from '@/lib/api/recipients';
import { findCompatibleDonors } from '@/lib/api/matching';
import type { Recipient } from '@/types/matching';
import { toast } from 'sonner';

export function MatchingSystem() {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      const data = await getRecipients();
      setRecipients(data);
    } catch (error) {
      console.error('Error loading recipients:', error);
      toast.error('Failed to load recipients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindDonors = async () => {
    if (!selectedRecipient) {
      toast.error('Please select a recipient first');
      return;
    }

    setIsMatching(true);
    try {
      const matches = await findCompatibleDonors(selectedRecipient.id);
      
      // Navigate to the report page with the results
      navigate('/reports', {
        state: {
          recipient: selectedRecipient,
          results: matches,
          timestamp: new Date().toISOString(),
        },
        replace: true,
      });

      toast.success('Matching analysis completed successfully');
    } catch (error) {
      console.error('Matching analysis failed:', error);
      toast.error('Failed to complete matching analysis');
    } finally {
      setIsMatching(false);
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
    <div className="space-y-8">
      <div className="rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-semibold mb-6">Kidney Matching System</h1>
        
        <div className="space-y-6">
          <RecipientSelector
            recipients={recipients}
            selectedRecipient={selectedRecipient}
            onSelect={setSelectedRecipient}
          />

          {selectedRecipient && (
            <>
              <RecipientDetails recipient={selectedRecipient} />
              
              <div className="flex justify-end">
                <Button
                  onClick={handleFindDonors}
                  disabled={isMatching}
                  className="gap-2"
                >
                  {isMatching && <Loader2 className="h-4 w-4 animate-spin" />}
                  Find Best Donors
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}