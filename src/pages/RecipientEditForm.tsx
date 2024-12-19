import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RecipientPersonalInfo } from '@/components/recipients/RecipientPersonalInfo';
import { RecipientHLATyping } from '@/components/recipients/RecipientHLATyping';
import { RecipientMedicalInfo } from '@/components/recipients/RecipientMedicalInfo';
import { RecipientAdditionalInfo } from '@/components/recipients/RecipientAdditionalInfo';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipientSchema } from '@/lib/validations/recipient';
import { getRecipient, updateRecipient } from '@/lib/api/recipients';
import type { RecipientFormData } from '@/types/recipient';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function RecipientEditForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const methods = useForm<RecipientFormData>({
    resolver: zodResolver(recipientSchema),
  });

  useEffect(() => {
    if (!id) return;
    
    const loadRecipient = async () => {
      try {
        const recipient = await getRecipient(id);
        // Transform the data to match form fields
        const formData = {
          mrn: recipient.mrn,
          nationalId: recipient.nationalId,
          fullName: recipient.fullName,
          age: recipient.age,
          bloodType: recipient.bloodType,
          mobileNumber: recipient.mobileNumber,
          hlaA: recipient.hlaTyping.hlaA,
          hlaB: recipient.hlaTyping.hlaB,
          hlaC: recipient.hlaTyping.hlaC,
          hlaDR: recipient.hlaTyping.hlaDR,
          hlaDQ: recipient.hlaTyping.hlaDQ,
          hlaDP: recipient.hlaTyping.hlaDP,
          unacceptableAntigens: recipient.unacceptableAntigens,
          pra: recipient.pra,
          crossmatchRequirement: recipient.crossmatchRequirement,
          donorAntibodies: recipient.donorAntibodies,
          serumCreatinine: recipient.serumCreatinine,
          egfr: recipient.egfr,
          bloodPressure: recipient.bloodPressure,
          viralScreening: recipient.viralScreening,
          cmvStatus: recipient.cmvStatus,
          medicalHistory: recipient.medicalHistory,
          notes: recipient.notes,
        };
        methods.reset(formData);
      } catch (error) {
        console.error('Error loading recipient:', error);
        toast.error('Failed to load recipient information');
        navigate('/recipients');
      }
    };

    loadRecipient();
  }, [id, methods, navigate]);

  const onSubmit = async (data: RecipientFormData) => {
    if (!id) return;

    try {
      // Validate required fields
      if (!data.bloodType) {
        toast.error('Please select a blood type');
        return;
      }
      if (!data.crossmatchRequirement) {
        toast.error('Please select a crossmatch requirement');
        return;
      }
      if (!data.cmvStatus) {
        toast.error('Please select a CMV status');
        return;
      }

      // Show loading state
      const loadingToast = toast.loading('Updating recipient information...');

      // Update recipient
      await updateRecipient(id, data);
      
      // Clear loading state and show success
      toast.dismiss(loadingToast);
      toast.success('Recipient information updated successfully');
      
      // Navigate back to list
      navigate('/recipients');
    } catch (error) {
      console.error('Error updating recipient:', error);
      toast.error('Failed to update recipient information');
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border bg-card p-6">
          <h1 className="text-2xl font-semibold mb-6">Edit Recipient Information</h1>
          <div className="space-y-8">
            <RecipientPersonalInfo />
            <RecipientHLATyping />
            <RecipientMedicalInfo />
            <RecipientAdditionalInfo />
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/recipients')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={methods.formState.isSubmitting}
                className="gap-2"
              >
                {methods.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
} 