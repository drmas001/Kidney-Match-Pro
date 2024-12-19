import { useFormContext } from 'react-hook-form';
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

export function DonorMedicalInfo() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Medical Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="serumCreatinine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serum Creatinine (mg/dL)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1"
                  placeholder="Enter serum creatinine" 
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="egfr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>eGFR (mL/min/1.73m²)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1"
                  placeholder="Enter eGFR" 
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
          control={control}
          name="viralScreening"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Viral Screening Results</FormLabel>
              <FormControl>
                <Input placeholder="Enter viral screening results" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cmvStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CMV Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select CMV status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Positive">Positive</SelectItem>
                  <SelectItem value="Negative">Negative</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="crossmatchResult"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crossmatch Result</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crossmatch result" />
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