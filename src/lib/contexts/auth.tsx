import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { Employee } from '@/types/employee';

interface AuthContextType {
  employee: Employee | null;
  isLoading: boolean;
  login: (employee: Employee) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have an active session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const storedEmployee = sessionStorage.getItem('employee');
        if (storedEmployee) {
          setEmployee(JSON.parse(storedEmployee));
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (employee: Employee) => {
    setEmployee(employee);
    sessionStorage.setItem('employee', JSON.stringify(employee));
  };

  const logout = () => {
    setEmployee(null);
    sessionStorage.removeItem('employee');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ employee, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}