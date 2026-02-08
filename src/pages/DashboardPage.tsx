import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UsersTab from '@/components/admin/UsersTab';
import CoursesTab from '@/components/admin/CoursesTab';
import EnrollmentsTab from '@/components/admin/EnrollmentsTab';
import AssignmentsTab from '@/components/admin/AssignmentsTab';
import SubmissionsTab from '@/components/admin/SubmissionsTab';
import AuditLogsTab from '@/components/admin/AuditLogsTab';

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
            <span>{user?.name}</span>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-6 px-4">
        {role === 'Admin' && (
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UsersTab />
            </TabsContent>

            <TabsContent value="courses">
              <CoursesTab />
            </TabsContent>

            <TabsContent value="enrollments">
              <EnrollmentsTab />
            </TabsContent>

            <TabsContent value="assignments">
              <AssignmentsTab />
            </TabsContent>

            <TabsContent value="submissions">
              <SubmissionsTab />
            </TabsContent>

            <TabsContent value="audit">
              <AuditLogsTab />
            </TabsContent>
          </Tabs>
        )}

        {role === 'Instructor' && (
          <Card>
            <CardHeader>
              <CardTitle>Instructor Dashboard</CardTitle>
              <CardDescription>Manage your courses and assignments</CardDescription>
            </CardHeader>
            <CardContent>Coming soon...</CardContent>
          </Card>
        )}

        {role === 'Student' && (
          <Card>
            <CardHeader>
              <CardTitle>Student Dashboard</CardTitle>
              <CardDescription>Browse courses and manage your enrollments</CardDescription>
            </CardHeader>
            <CardContent>Coming soon...</CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
