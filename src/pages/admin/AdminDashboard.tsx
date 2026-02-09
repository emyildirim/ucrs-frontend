import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsersTab from '@/components/admin/UsersTab';
import CoursesTab from '@/components/admin/CoursesTab';
import EnrollmentsTab from '@/components/admin/EnrollmentsTab';
import AssignmentsTab from '@/components/admin/AssignmentsTab';
import SubmissionsTab from '@/components/admin/SubmissionsTab';
import AuditLogsTab from '@/components/admin/AuditLogsTab';
import AccountTab from '@/components/shared/AccountTab';

export default function AdminDashboard() {
  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="submissions">Submissions</TabsTrigger>
        <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        <TabsTrigger value="account">My Account</TabsTrigger>
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

      <TabsContent value="account">
        <AccountTab />
      </TabsContent>
    </Tabs>
  );
}
