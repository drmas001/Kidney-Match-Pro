import { useNavigate } from 'react-router-dom';
import { RecipientPersonalInfo } from '@/components/recipients/RecipientPersonalInfo';
import { RecipientHLATyping } from '@/components/recipients/RecipientHLATyping';
import { RecipientMedicalInfo } from '@/components/recipients/RecipientMedicalInfo';
import { RecipientAdditionalInfo } from '@/components/recipients/RecipientAdditionalInfo';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipientSchema } from '@/lib/validations/recipient';
import { createRecipient } from '@/lib/api/recipients';
import type { RecipientFormData } from '@/types/recipient';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function RecipientForm() {
  const navigate = useNavigate();
  const methods = useForm<RecipientFormData>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      mrn: '',
      nationalId: '',
      fullName: '',
      age: 0,
      bloodType: '',
      mobileNumber: '',
      hlaA: '',
      hlaB: '',
      hlaC: '',
      hlaDR: '',
      hlaDQ: '',
      hlaDP: '',
      unacceptableAntigens: '',
      pra: 0,
      crossmatchRequirement: '',
      donorAntibodies: '',
      serumCreatinine: 0,
      egfr: 0,
      bloodPressure: '',
      viralScreening: '',
      cmvStatus: '',
      medicalHistory: '',
      notes: '',
    },
  });

  const onSubmit = async (data: RecipientFormData) => {
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
      toast.loading('Saving recipient information...');

      // Create recipient
      await createRecipient(data);
      
      // Clear loading state and show success
      toast.dismiss();
      toast.success('Recipient information saved successfully');
      
      // Navigate to matching page
      navigate('/matching');
    } catch (error) {
      // Clear loading state and show error
      toast.dismiss();
      console.error('Error saving recipient:', error);
      
      // Show specific error message if available
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          if (error.message.includes('mrn')) {
            toast.error('A recipient with this MRN already exists');
          } else if (error.message.includes('national_id')) {
            toast.error('A recipient with this National ID already exists');
          } else {
            toast.error('A recipient with these details already exists');
          }
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Failed to save recipient information');
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border bg-card p-6">
          <h1 className="text-2xl font-semibold mb-6">New Recipient Registration</h1>
          <div className="space-y-8">
            <RecipientPersonalInfo />
            <RecipientHLATyping />
            <RecipientMedicalInfo />
            <RecipientAdditionalInfo />
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/matching')}
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
                Save Recipient Information
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}