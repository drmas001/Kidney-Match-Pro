import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Recipient } from '@/types/matching';

interface RecipientSelectorProps {
  recipients: Recipient[];
  selectedRecipient: Recipient | null;
  onSelect: (recipient: Recipient | null) => void;
}

export function RecipientSelector({
  recipients,
  selectedRecipient,
  onSelect,
}: RecipientSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">
        Select Recipient
      </label>
      <Select
        value={selectedRecipient?.id}
        onValueChange={(value) => {
          const recipient = recipients.find((r) => r.id === value) || null;
          onSelect(recipient);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a recipient" />
        </SelectTrigger>
        <SelectContent>
          {recipients.map((recipient) => (
            <SelectItem key={recipient.id} value={recipient.id}>
              {recipient.fullName} ({recipient.mrn})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}