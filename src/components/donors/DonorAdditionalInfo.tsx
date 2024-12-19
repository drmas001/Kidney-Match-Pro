import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export function DonorAdditionalInfo() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Additional Information</h2>
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={control}
          name="donorAntibodies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donor Antibodies</FormLabel>
              <FormControl>
                <Input placeholder="Enter donor antibodies" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical Conditions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter any relevant medical conditions or history"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter any additional notes or comments"
                  className="min-h-[100px]"
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