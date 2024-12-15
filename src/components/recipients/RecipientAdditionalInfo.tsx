import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';
import type { RecipientFormData } from '@/types/recipient';

export function RecipientAdditionalInfo() {
  const form = useFormContext<RecipientFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Additional Information</h2>
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="medicalHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter relevant medical history"
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
              <FormLabel>Recipient Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter additional notes or requirements"
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