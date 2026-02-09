import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/shared/DataTable';
import { assignmentService, type Assignment } from '@/services/assignmentService';
import { enrollmentService } from '@/services/enrollmentService';
import type { ColumnDef } from '@tanstack/react-table';

export default function MyAssignmentsTab() {
  const [selectedCourse, setSelectedCourse] = useState(0);

  const { data: enrollments } = useQuery({
    queryKey: ['my-courses'],
    queryFn: enrollmentService.getMyCourses,
  });

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments', selectedCourse],
    queryFn: () => selectedCourse ? assignmentService.getByCourse(selectedCourse) : Promise.resolve([]),
    enabled: !!selectedCourse,
  });

  const columns: ColumnDef<Assignment>[] = [
    { accessorKey: 'assignment_id', header: 'ID' },
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'description', header: 'Description' },
    { 
      accessorKey: 'due_at', 
      header: 'Due Date',
      cell: ({ row }) => new Date(row.original.due_at).toLocaleDateString()
    },
    { accessorKey: 'max_points', header: 'Points' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Assignments</CardTitle>
        <CardDescription>View assignments for your enrolled courses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="course_select">Select Course</Label>
          <Select value={String(selectedCourse)} onValueChange={(v) => setSelectedCourse(Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a course" />
            </SelectTrigger>
            <SelectContent>
              {enrollments?.map((enrollment: any) => (
                <SelectItem key={enrollment.course_id} value={String(enrollment.course_id)}>
                  {enrollment.course?.code} - {enrollment.course?.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCourse && (
          isLoading ? (
            <p>Loading...</p>
          ) : (
            <DataTable columns={columns} data={assignments || []} />
          )
        )}

        {!enrollments?.length && (
          <p className="text-muted-foreground text-center py-8">
            You are not enrolled in any courses yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
