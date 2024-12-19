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
import type { Recipient } from '@/types/matching';

interface RecipientTableProps {
  recipients: Recipient[];
  onDelete: (recipient: Recipient) => void;
  onEdit: (recipient: Recipient) => void;
}

export function RecipientTable({ recipients, onDelete, onEdit }: RecipientTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Recipient Name</TableHead>
            <TableHead>MRN</TableHead>
            <TableHead>Blood Type</TableHead>
            <TableHead>HLA Typing</TableHead>
            <TableHead>PRA</TableHead>
            <TableHead>Crossmatch</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No recipients found
              </TableCell>
            </TableRow>
          ) : (
            recipients.map((recipient) => (
              <TableRow key={recipient.id}>
                <TableCell className="font-medium">{recipient.fullName}</TableCell>
                <TableCell>{recipient.mrn}</TableCell>
                <TableCell>{recipient.bloodType}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {recipient.hlaTyping ? (
                      <>
                        <div>A: {recipient.hlaTyping.hlaA || 'N/A'}</div>
                        <div>B: {recipient.hlaTyping.hlaB || 'N/A'}</div>
                        <div>DR: {recipient.hlaTyping.hlaDR || 'N/A'}</div>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No HLA data</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{recipient.pra}%</TableCell>
                <TableCell>{recipient.crossmatchRequirement}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(recipient)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(recipient)}
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