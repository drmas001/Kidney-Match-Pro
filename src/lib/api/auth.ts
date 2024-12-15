import { supabase } from '@/lib/supabase';
import type { Employee } from '@/types/employee';

export async function loginWithEmployeeCode(employeeCode: string): Promise<Employee> {
  const { data: employee, error } = await supabase
    .from('employees')
    .select('*')
    .eq('employee_code', employeeCode)
    .single();

  if (error) {
    throw new Error('Invalid employee code');
  }

  return employee;
}