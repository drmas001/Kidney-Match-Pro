import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { LandingPage } from '@/pages/LandingPage';
import { LearnMore } from '@/pages/LearnMore';
import { Dashboard } from '@/pages/Dashboard';
import { DonorForm } from '@/pages/DonorForm';
import { DonorEditForm } from '@/pages/DonorEditForm';
import { DonorList } from '@/pages/DonorList';
import { RecipientForm } from '@/pages/RecipientForm';
import { RecipientEditForm } from '@/pages/RecipientEditForm';
import { RecipientList } from '@/pages/RecipientList';
import { MatchingSystem } from '@/pages/MatchingSystem';
import { Reports } from '@/pages/Reports';
import { AdminPanel } from '@/pages/AdminPanel';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/contexts/auth';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/learn-more" element={<LearnMore />} />
        
        {/* Protected Routes */}
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donors">
            <Route index element={<DonorList />} />
            <Route path="new" element={<DonorForm />} />
            <Route path="edit/:id" element={<DonorEditForm />} />
          </Route>
          <Route path="/recipients">
            <Route index element={<RecipientList />} />
            <Route path="new" element={<RecipientForm />} />
            <Route path="edit/:id" element={<RecipientEditForm />} />
          </Route>
          <Route path="/matching" element={<MatchingSystem />} />
          <Route path="/reports" element={<Reports />} />
          <Route
            path="/admin"
            element={
              <RequireAuth allowedRoles={['Administrator']}>
                <AdminPanel />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}