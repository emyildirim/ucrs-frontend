import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseCatalogTab from '@/components/student/CourseCatalogTab';
import MyCoursesTab from '@/components/student/MyCoursesTab';
import MyAssignmentsTab from '@/components/student/MyAssignmentsTab';
import MySubmissionsTab from '@/components/student/MySubmissionsTab';
import AccountTab from '@/components/shared/AccountTab';

export default function StudentDashboard() {
  return (
    <Tabs defaultValue="catalog" className="space-y-4">
      <TabsList>
        <TabsTrigger value="catalog">Course Catalog</TabsTrigger>
        <TabsTrigger value="courses">My Courses</TabsTrigger>
        <TabsTrigger value="assignments">My Assignments</TabsTrigger>
        <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        <TabsTrigger value="account">My Account</TabsTrigger>
      </TabsList>

      <TabsContent value="catalog">
        <CourseCatalogTab />
      </TabsContent>

      <TabsContent value="courses">
        <MyCoursesTab />
      </TabsContent>

      <TabsContent value="assignments">
        <MyAssignmentsTab />
      </TabsContent>

      <TabsContent value="submissions">
        <MySubmissionsTab />
      </TabsContent>

      <TabsContent value="account">
        <AccountTab />
      </TabsContent>
    </Tabs>
  );
}
