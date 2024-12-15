export type EmployeeRole = 'Doctor' | 'Nurse' | 'Administrator';

export interface Employee {
  id: string;
  fullName: string;
  role: EmployeeRole;
  employeeCode: string;
  createdAt: string;
  lastActive?: string;
}

export interface CreateEmployeeData {
  fullName: string;
  role: EmployeeRole;
  employeeCode: string;
}