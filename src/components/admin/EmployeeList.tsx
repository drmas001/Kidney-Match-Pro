import { format } from 'date-fns';
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
import type { Employee } from '@/types/employee';

interface EmployeeListProps {
  employees: Employee[];
  onDelete: (employee: Employee) => void;
}

const roleColors = {
  Doctor: 'default',
  Nurse: 'secondary',
  Administrator: 'destructive',
} as const;

export function EmployeeList({ employees, onDelete }: EmployeeListProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'PPp');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Employee Code</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                {employee.fullName}
              </TableCell>
              <TableCell>
                <Badge variant={roleColors[employee.role]}>
                  {employee.role}
                </Badge>
              </TableCell>
              <TableCell>{employee.employeeCode}</TableCell>
              <TableCell>
                {formatDate(employee.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(employee)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {employees.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No employees found. Add your first employee using the form above.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}