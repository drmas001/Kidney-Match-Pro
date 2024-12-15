import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import type { Database } from '@/types/supabase';

type DonorWithStatus = Database['public']['Tables']['donors']['Row'];

interface DonorTableProps {
  donors: DonorWithStatus[];
  onDelete: (donor: DonorWithStatus) => void;
}

export function DonorTable({ donors, onDelete }: DonorTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Donor Name</TableHead>
            <TableHead>MRN</TableHead>
            <TableHead>Blood Type</TableHead>
            <TableHead>HLA Typing</TableHead>
            <TableHead>Crossmatch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No donors found
              </TableCell>
            </TableRow>
          ) : (
            donors.map((donor) => (
              <TableRow key={donor.id}>
                <TableCell className="font-medium">{donor.full_name}</TableCell>
                <TableCell>{donor.mrn}</TableCell>
                <TableCell>{donor.blood_type}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {donor.hla_typing ? (
                      <>
                        <div>A: {donor.hla_typing.hla_a || 'N/A'}</div>
                        <div>B: {donor.hla_typing.hla_b || 'N/A'}</div>
                        <div>DR: {donor.hla_typing.hla_dr || 'N/A'}</div>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No HLA data</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      donor.crossmatch_result === 'Negative'
                        ? 'text-green-600 dark:text-green-500'
                        : 'text-red-600 dark:text-red-500'
                    }
                  >
                    {donor.crossmatch_result}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={donor.status === 'Available' ? 'default' : 'secondary'}
                  >
                    {donor.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(donor)}
                    disabled={donor.status === 'Utilized'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}