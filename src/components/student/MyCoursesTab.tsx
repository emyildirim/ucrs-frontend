import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/errorHandler';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/shared/DataTable';
import { enrollmentService, type Enrollment } from '@/services/enrollmentService';
import type { ColumnDef } from '@tanstack/react-table';

export default function MyCoursesTab() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: enrollmentService.getMyCourses,
  });

  const dropMutation = useMutation({
    mutationFn: enrollmentService.drop,
    onSuccess: () => {
      toast.success('Course dropped successfully');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Drop course error:', error);
    },
  });

  const handleDrop = (enrollment: Enrollment) => {
    if (confirm(`Drop ${enrollment.course?.title}?`)) {
      dropMutation.mutate(enrollment.enrollment_id);
    }
  };

  const columns: ColumnDef<Enrollment>[] = [
    { 
      accessorKey: 'course.code', 
      header: 'Code',
      cell: ({ row }) => row.original.course?.code || 'N/A'
    },
    { 
      accessorKey: 'course.title', 
      header: 'Course',
      cell: ({ row }) => row.original.course?.title || 'N/A'
    },
    { 
      accessorKey: 'course.instructor.full_name', 
      header: 'Instructor',
      cell: ({ row }) => row.original.course?.instructor?.full_name || 'N/A'
    },
    { 
      accessorKey: 'final_grade', 
      header: 'Grade',
      cell: ({ row }) => row.original.final_grade ? `${row.original.final_grade}%` : 'Not graded'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Courses</CardTitle>
        <CardDescription>Courses you are enrolled in</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <DataTable 
            columns={columns} 
            data={data || []} 
            onDelete={handleDrop}
          />
        )}
      </CardContent>
    </Card>
  );
}
