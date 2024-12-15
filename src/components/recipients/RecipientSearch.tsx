import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface RecipientSearchProps {
  onSearch: (query: string, filters: { bloodType?: string }) => void;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function RecipientSearch({ onSearch }: RecipientSearchProps) {
  const [query, setQuery] = useState('');
  const [bloodType, setBloodType] = useState<string>();

  const handleChange = (
    value: string,
    type: 'query' | 'bloodType'
  ) => {
    switch (type) {
      case 'query':
        setQuery(value);
        onSearch(value, { bloodType });
        break;
      case 'bloodType':
        setBloodType(value);
        onSearch(query, { bloodType: value });
        break;
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipients..."
            value={query}
            onChange={(e) => handleChange(e.target.value, 'query')}
            className="pl-8"
          />
        </div>

        <Select
          value={bloodType}
          onValueChange={(value) => handleChange(value, 'bloodType')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by blood type" />
          </SelectTrigger>
          <SelectContent>
            {bloodTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}