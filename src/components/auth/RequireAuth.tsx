import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/contexts/auth';
import type { EmployeeRole } from '@/types/employee';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: EmployeeRole[];
}

export function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { employee, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!employee) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(employee.role)) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}