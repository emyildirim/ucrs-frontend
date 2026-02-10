import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/errorHandler';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/shared/DataTable';
import { assignmentService, type Assignment } from '@/services/assignmentService';
import { courseService, type Course } from '@/services/courseService';
import { accountService } from '@/services/accountService';
import type { ColumnDef } from '@tanstack/react-table';

export default function MyAssignmentsTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_at: '',
    max_points: 100,
  });

  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['account-profile'],
    queryFn: accountService.getProfile,
  });

  const { data: allCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll({ per_page: 100 }),
  });

  const myCourses = allCourses?.data?.filter((c: any) => 
    c.instructor_id === profile?.user_id
  ) || [];

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments', selectedCourse],
    queryFn: () => selectedCourse ? assignmentService.getByCourse(selectedCourse) : Promise.resolve([]),
    enabled: !!selectedCourse,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => assignmentService.create(selectedCourse, data),
    onSuccess: () => {
      toast.success('Assignment created successfully');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Create assignment error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => assignmentService.update(id, data),
    onSuccess: () => {
      toast.success('Assignment updated successfully');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Update assignment error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: assignmentService.delete,
    onSuccess: () => {
      toast.success('Assignment deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Delete assignment error:', error);
    },
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', due_at: '', max_points: 100 });
    setEditingAssignment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssignment) {
      updateMutation.mutate({ id: editingAssignment.assignment_id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      due_at: assignment.due_at.split('T')[0],
      max_points: assignment.max_points,
    });
    setDialogOpen(true);
  };

  const handleDelete = (assignment: Assignment) => {
    if (confirm(`Delete assignment "${assignment.title}"?`)) {
      deleteMutation.mutate(assignment.assignment_id);
    }
  };

  const columns: ColumnDef<Assignment>[] = [
    { accessorKey: 'assignment_id', header: 'ID' },
    { accessorKey: 'title', header: 'Title' },
    { 
      accessorKey: 'due_at', 
      header: 'Due Date',
      cell: ({ row }) => new Date(row.original.due_at).toLocaleDateString()
    },
    { accessorKey: 'max_points', header: 'Max Points' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Assignments</CardTitle>
            <CardDescription>Manage assignments for your courses</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button disabled={!selectedCourse}>Add Assignment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Create Assignment'}</DialogTitle>
                <DialogDescription>
                  {editingAssignment ? 'Update assignment details' : 'Add a new assignment'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="due_at">Due Date</Label>
                  <Input
                    id="due_at"
                    type="date"
                    value={formData.due_at}
                    onChange={(e) => setFormData({ ...formData, due_at: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="max_points">Max Points</Label>
                  <Input
                    id="max_points"
                    type="number"
                    value={formData.max_points}
                    onChange={(e) => setFormData({ ...formData, max_points: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingAssignment ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="course_select">Select Course</Label>
          <Select value={String(selectedCourse)} onValueChange={(v) => setSelectedCourse(Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a course" />
            </SelectTrigger>
            <SelectContent>
              {myCourses.map((course: Course) => (
                <SelectItem key={course.course_id} value={String(course.course_id)}>
                  {course.code} - {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCourse && (
          isLoading ? (
            <p>Loading...</p>
          ) : (
            <DataTable 
              columns={columns} 
              data={assignments || []} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )
        )}

        {myCourses.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No courses assigned to you yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
