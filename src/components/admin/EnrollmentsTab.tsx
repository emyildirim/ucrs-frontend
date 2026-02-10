import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/errorHandler';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { enrollmentService, type Enrollment } from '@/services/enrollmentService';
import type { ColumnDef } from '@tanstack/react-table';

export default function EnrollmentsTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  const [grade, setGrade] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentService.getAll({ per_page: 100 }),
  });

  const updateGradeMutation = useMutation({
    mutationFn: ({ id, grade }: { id: number; grade: number }) => 
      enrollmentService.updateGrade(id, grade),
    onSuccess: () => {
      toast.success('Grade updated successfully');
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      setDialogOpen(false);
      setEditingEnrollment(null);
      setGrade('');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Update grade error:', error);
    },
  });

  const handleGrade = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment);
    setGrade(enrollment.final_grade?.toString() || '');
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEnrollment) {
      updateGradeMutation.mutate({ 
        id: editingEnrollment.enrollment_id, 
        grade: parseFloat(grade) 
      });
    }
  };

  const columns: ColumnDef<Enrollment>[] = [
    { accessorKey: 'enrollment_id', header: 'ID' },
    { 
      accessorKey: 'student.full_name', 
      header: 'Student',
      cell: ({ row }) => row.original.student?.full_name || 'N/A'
    },
    { 
      accessorKey: 'course.code', 
      header: 'Course Code',
      cell: ({ row }) => row.original.course?.code || 'N/A'
    },
    { 
      accessorKey: 'course.title', 
      header: 'Course Title',
      cell: ({ row }) => row.original.course?.title || 'N/A'
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
        <CardTitle>Enrollments Management</CardTitle>
        <CardDescription>Manage student course enrollments and grades</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <DataTable 
              columns={columns} 
              data={data?.data || []} 
              onEdit={handleGrade}
            />
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Final Grade</DialogTitle>
                  <DialogDescription>
                    Set final grade for {editingEnrollment?.student?.full_name}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="grade">Final Grade (0-100)</Label>
                    <Input
                      id="grade"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Grade</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
}
