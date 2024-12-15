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
import type { RecipientFormData } from '@/types/recipient';

export function RecipientHLATyping() {
  const form = useFormContext<RecipientFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">HLA Typing Requirements</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="hlaA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HLA-A Typing</FormLabel>
              <FormControl>
                <Input placeholder="e.g., A1, A3" {...field} />
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
                <Input placeholder="e.g., B8, B44" {...field} />
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
                <Input placeholder="e.g., Cw5, Cw7" {...field} />
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
                <Input placeholder="e.g., DR4, DR17" {...field} />
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
                <Input placeholder="e.g., DQ2, DQ8" {...field} />
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
                <Input placeholder="e.g., DP1, DP2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unacceptableAntigens"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Unacceptable Antigens</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List HLA antigens that would exclude a donor (e.g., A1, B8, DR3)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                Any donor with these HLA antigens will be automatically excluded from matching
              </p>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pra"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Panel Reactive Antibody (PRA) %</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter PRA percentage"
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
          name="crossmatchRequirement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crossmatch Compatibility Requirement</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select requirement" />
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
        <FormField
          control={form.control}
          name="donorAntibodies"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Donor-Specific Antibodies</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List required antibodies"
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