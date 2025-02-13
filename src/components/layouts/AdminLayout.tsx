
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-queue-background">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
