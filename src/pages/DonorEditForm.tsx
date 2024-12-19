import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DonorPersonalInfo } from '@/components/donors/DonorPersonalInfo';
import { DonorHLATyping } from '@/components/donors/DonorHLATyping';
import { DonorMedicalInfo } from '@/components/donors/DonorMedicalInfo';
import { DonorAdditionalInfo } from '@/components/donors/DonorAdditionalInfo';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { donorSchema } from '@/lib/validations/donor';
import { getDonor, updateDonor } from '@/lib/api/donors';
import type { DonorFormData } from '@/types/donor';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function DonorEditForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  
  const methods = useForm<DonorFormData>({
    resolver: zodResolver(donorSchema),
  });

  useEffect(() => {
    if (!id) {
      navigate('/donors');
      return;
    }
    
    const loadDonor = async () => {
      try {
        setIsLoading(true);
        const donor = await getDonor(id);
        
        // Transform the data to match form fields
        const formData = {
          mrn: donor.mrn || '',
          nationalId: donor.nationalId || '',
          fullName: donor.fullName || '',
          age: donor.age || 0,
          bloodType: donor.bloodType || '',
          mobileNumber: donor.mobileNumber || '',
          hlaA: donor.hlaTyping?.hlaA || '',
          hlaB: donor.hlaTyping?.hlaB || '',
          hlaC: donor.hlaTyping?.hlaC || '',
          hlaDR: donor.hlaTyping?.hlaDR || '',
          hlaDQ: donor.hlaTyping?.hlaDQ || '',
          hlaDP: donor.hlaTyping?.hlaDP || '',
          crossmatchResult: donor.crossmatchResult || '',
          donorAntibodies: donor.donorAntibodies || '',
          serumCreatinine: donor.serumCreatinine || 0,
          egfr: donor.egfr || 0,
          bloodPressure: donor.bloodPressure || '',
          viralScreening: donor.viralScreening || '',
          cmvStatus: donor.cmvStatus || '',
          medicalConditions: donor.medicalConditions || '',
          notes: donor.notes || '',
          highResTyping: donor.highResTyping || '',
          antigenMismatch: donor.antigenMismatch || 0,
        };
        
        methods.reset(formData);
      } catch (error) {
        console.error('Error loading donor:', error);
        toast.error('Failed to load donor information');
        navigate('/donors');
      } finally {
        setIsLoading(false);
      }
    };

    loadDonor();
  }, [id, methods, navigate]);

  const onSubmit = async (data: DonorFormData) => {
    if (!id) return;

    try {
      // Validate required fields
      if (!data.bloodType) {
        toast.error('Please select a blood type');
        return;
      }
      if (!data.crossmatchResult) {
        toast.error('Please select a crossmatch result');
        return;
      }
      if (!data.cmvStatus) {
        toast.error('Please select a CMV status');
        return;
      }

      // Show loading state
      const loadingToast = toast.loading('Updating donor information...');
      setIsLoading(true);

      // Update donor
      await updateDonor(id, data);
      
      // Clear loading state and show success
      toast.dismiss(loadingToast);
      toast.success('Donor information updated successfully');
      
      // Navigate back to list
      navigate('/donors');
    } catch (error) {
      console.error('Error updating donor:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update donor information');
      }
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
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border bg-card p-6">
          <h1 className="text-2xl font-semibold mb-6">Edit Donor Information</h1>
          <div className="space-y-8">
            <DonorPersonalInfo />
            <DonorHLATyping />
            <DonorMedicalInfo />
            <DonorAdditionalInfo />
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/donors')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || methods.formState.isSubmitting}
                className="gap-2"
              >
                {(isLoading || methods.formState.isSubmitting) && (
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