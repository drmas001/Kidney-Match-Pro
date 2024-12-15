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

interface DonorSearchProps {
  onSearch: (query: string, filters: { status?: string; bloodType?: string }) => void;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function DonorSearch({ onSearch }: DonorSearchProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>();
  const [bloodType, setBloodType] = useState<string>();

  const handleChange = (
    value: string,
    type: 'query' | 'status' | 'bloodType'
  ) => {
    switch (type) {
      case 'query':
        setQuery(value);
        onSearch(value, { status, bloodType });
        break;
      case 'status':
        setStatus(value);
        onSearch(query, { status: value, bloodType });
        break;
      case 'bloodType':
        setBloodType(value);
        onSearch(query, { status, bloodType: value });
        break;
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search donors..."
            value={query}
            onChange={(e) => handleChange(e.target.value, 'query')}
            className="pl-8"
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) => handleChange(value, 'status')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Utilized">Utilized</SelectItem>
          </SelectContent>
        </Select>

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