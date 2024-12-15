import { supabase } from '@/lib/supabase';
import type { CreateEmployeeData } from '@/types/employee';

export async function createEmployee(data: CreateEmployeeData) {
  const { data: employee, error } = await supabase
    .from('employees')
    .insert([{
      full_name: data.fullName,
      role: data.role,
      employee_code: data.employeeCode,
    }])
    .select()
    .single();

  if (error) throw error;
  return employee;
}

export async function getEmployees() {
  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return employees;
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) throw error;
}