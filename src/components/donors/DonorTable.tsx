import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil } from 'lucide-react';
import type { Donor } from '@/types/matching';

interface DonorTableProps {
  donors: Donor[];
  onDelete: (donor: Donor) => void;
  onEdit: (donor: Donor) => void;
}

export function DonorTable({ donors, onDelete, onEdit }: DonorTableProps) {
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
                <TableCell className="font-medium">{donor.fullName}</TableCell>
                <TableCell>{donor.mrn}</TableCell>
                <TableCell>{donor.bloodType}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {donor.hlaTyping ? (
                      <>
                        <div>A: {donor.hlaTyping.hlaA || 'N/A'}</div>
                        <div>B: {donor.hlaTyping.hlaB || 'N/A'}</div>
                        <div>DR: {donor.hlaTyping.hlaDR || 'N/A'}</div>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No HLA data</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{donor.crossmatchResult}</TableCell>
                <TableCell>{donor.status}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(donor)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(donor)}
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