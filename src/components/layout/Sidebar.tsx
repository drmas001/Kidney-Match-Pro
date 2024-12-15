import { cn } from '@/lib/utils';
import {
  Activity,
  BarChart3,
  Heart,
  Home,
  Users,
  UserCog,
} from 'lucide-react';
import { NavLink } from '@/components/ui/nav-link';
import { useAuth } from '@/lib/contexts/auth';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const { employee } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Manage Donors', href: '/donors', icon: Heart },
    { name: 'Manage Recipients', href: '/recipients', icon: Users },
    { name: 'Matching System', href: '/matching', icon: Activity },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    ...(employee?.role === 'Administrator' ? [
      { name: 'Employee Management', href: '/admin', icon: UserCog }
    ] : []),
  ];

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r shadow-lg transition-transform duration-200 ease-in-out md:translate-x-0 md:shadow-none md:relative md:z-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-4">
          <span className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Kidney Match Pro
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative overflow-hidden group',
                  'hover:bg-accent hover:text-accent-foreground',
                  'active:scale-[0.98] active:transition-none',
                  isActive
                    ? 'bg-primary/10 text-primary before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary'
                    : 'text-muted-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-lg bg-accent/50 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{employee?.fullName}</span>
              <span className="text-xs text-muted-foreground">{employee?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}