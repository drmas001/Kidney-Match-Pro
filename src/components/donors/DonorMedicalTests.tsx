import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import type { DonorFormData } from '@/types/donor';

export function DonorMedicalTests() {
  const form = useFormContext<DonorFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Medical Tests</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="serumCreatinine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serum Creatinine (mg/dL)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 1.2"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="egfr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>eGFR</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter eGFR value"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bloodPressure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Pressure</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 120/80" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="viralScreening"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Viral Screening Results</FormLabel>
              <FormControl>
                <Input placeholder="Enter screening results" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cmvStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CMV Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Positive">Positive</SelectItem>
                  <SelectItem value="Negative">Negative</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}