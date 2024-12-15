import { useState, useEffect } from 'react';
import { EmployeeForm } from '@/components/admin/EmployeeForm';
import { EmployeeList } from '@/components/admin/EmployeeList';
import { EmployeeDeleteDialog } from '@/components/admin/EmployeeDeleteDialog';
import { createEmployee, deleteEmployee, getEmployees } from '@/lib/api/employees';
import type { CreateEmployeeData, Employee } from '@/types/employee';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Loader2 } from 'lucide-react';

export function AdminPanel() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [credentials, setCredentials] = useState<{
    employeeCode: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (data: CreateEmployeeData) => {
    try {
      const result = await createEmployee(data);
      setEmployees(prev => [...prev, result]);
      setCredentials({ employeeCode: data.employeeCode });
      toast.success('Employee account created successfully');
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create employee account');
    }
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedEmployee) return;

    try {
      await deleteEmployee(selectedEmployee.id);
      setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));
      toast.success('Employee account deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee account');
    } finally {
      setShowDeleteDialog(false);
      setSelectedEmployee(null);
    }
  };

  const copyCredentials = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-semibold mb-6">Employee Management</h1>
        
        <div className="space-y-8">
          <EmployeeForm onSubmit={handleAddEmployee} />
          <EmployeeList 
            employees={employees}
            onDelete={handleDeleteEmployee}
          />
        </div>
      </div>

      <EmployeeDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        employee={selectedEmployee}
      />

      <Dialog open={!!credentials} onOpenChange={() => setCredentials(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Account Created</DialogTitle>
            <DialogDescription>
              Please securely share this employee code with the staff member.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Employee Code</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted px-2 py-1">
                  {credentials?.employeeCode}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => credentials && copyCredentials(credentials.employeeCode)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}