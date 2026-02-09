import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyCoursesTab from '@/components/instructor/MyCoursesTab';
import MyAssignmentsTab from '@/components/instructor/MyAssignmentsTab';
import SubmissionsToGradeTab from '@/components/instructor/SubmissionsToGradeTab';
import AccountTab from '@/components/shared/AccountTab';

export default function InstructorDashboard() {
  return (
    <Tabs defaultValue="courses" className="space-y-4">
      <TabsList>
        <TabsTrigger value="courses">My Courses</TabsTrigger>
        <TabsTrigger value="assignments">My Assignments</TabsTrigger>
        <TabsTrigger value="submissions">Submissions to Grade</TabsTrigger>
        <TabsTrigger value="account">My Account</TabsTrigger>
      </TabsList>

      <TabsContent value="courses">
        <MyCoursesTab />
      </TabsContent>

      <TabsContent value="assignments">
        <MyAssignmentsTab />
      </TabsContent>

      <TabsContent value="submissions">
        <SubmissionsToGradeTab />
      </TabsContent>

      <TabsContent value="account">
        <AccountTab />
      </TabsContent>
    </Tabs>
  );
}
