import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';
import type { DonorFormData } from '@/types/donor';

export function DonorAdditionalInfo() {
  const form = useFormContext<DonorFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Additional Information</h2>
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="medicalConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Medical Conditions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any relevant medical conditions"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donor Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter additional notes or instructions"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}