import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/errorHandler';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { courseService, type Course } from '@/services/courseService';
import type { ColumnDef } from '@tanstack/react-table';

export default function CourseCatalogTab() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll({ per_page: 100 }),
  });

  const enrollMutation = useMutation({
    mutationFn: courseService.enroll,
    onSuccess: () => {
      toast.success('Successfully enrolled in course');
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Enroll error:', error);
    },
  });

  const handleEnroll = (course: Course) => {
    if (confirm(`Enroll in ${course.title}?`)) {
      enrollMutation.mutate(course.course_id);
    }
  };

  const columns: ColumnDef<Course>[] = [
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'title', header: 'Title' },
    { 
      accessorKey: 'instructor.full_name', 
      header: 'Instructor',
      cell: ({ row }) => row.original.instructor?.full_name || 'TBA'
    },
    {
      id: 'enroll',
      header: 'Action',
      cell: ({ row }) => (
        <Button 
          size="sm" 
          onClick={() => handleEnroll(row.original)}
          disabled={enrollMutation.isPending}
        >
          Enroll
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Catalog</CardTitle>
        <CardDescription>Browse and enroll in available courses</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <DataTable columns={columns} data={data?.data || []} />
        )}
      </CardContent>
    </Card>
  );
}
