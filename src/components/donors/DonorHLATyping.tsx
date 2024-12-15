import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import type { DonorFormData } from '@/types/donor';

export function DonorHLATyping() {
  const form = useFormContext<DonorFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">HLA Typing Information</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="hlaA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-A Typing</FormLabel>
              <FormControl>
                <Input placeholder="e.g., A1, A2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hlaB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-B Typing</FormLabel>
              <FormControl>
                <Input placeholder="e.g., B7, B27" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hlaC"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-C Typing</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cw4, Cw6" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hlaDR"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-DR Typing</FormLabel>
              <FormControl>
                <Input placeholder="e.g., DR15, DR16" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hlaDQ"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-DQ Typing</FormLabel>
              <FormControl>
                <Input placeholder="e.g., DQ5, DQ6" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hlaDP"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-DP Typing</FormLabel>
              <FormControl>
                <Input placeholder="e.g., DP4, DP5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="highResTyping"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>High-Resolution Typing Results</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., HLA-A01:01, HLA-B07:02"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="donorAntibodies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donor-Specific Antibodies</FormLabel>
              <FormControl>
                <Input placeholder="Enter antibodies" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="antigenMismatch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Antigen Mismatch Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter mismatch count"
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
          name="crossmatchResult"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crossmatch Test Result</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
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