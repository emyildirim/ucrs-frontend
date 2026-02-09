import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import AdminDashboard from './admin/AdminDashboard';
import InstructorDashboard from './instructor/InstructorDashboard';
import StudentDashboard from './student/StudentDashboard';

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
  });

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const role = (user as any)?.role || 'Student';

  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">UCRS - {role} Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>{(user as any)?.full_name || user?.name}</span>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-6 px-4">
        {role === 'Admin' && <AdminDashboard />}
        {role === 'Instructor' && <InstructorDashboard />}
        {role === 'Student' && <StudentDashboard />}
      </main>
    </div>
  );
}
