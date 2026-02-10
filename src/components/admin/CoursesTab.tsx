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
import { courseService, type Course } from '@/services/courseService';
import { userService } from '@/services/userService';
import type { ColumnDef } from '@tanstack/react-table';

export default function CoursesTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    instructor_id: 0,
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll({ per_page: 100, show_all: true }),
  });

  const { data: instructors } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => userService.getAll({ per_page: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: courseService.create,
    onSuccess: () => {
      toast.success('Course created successfully');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Create course error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => courseService.update(id, data),
    onSuccess: () => {
      toast.success('Course updated successfully');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Update course error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: courseService.delete,
    onSuccess: () => {
      toast.success('Course deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Delete course error:', error);
    },
  });

  const resetForm = () => {
    setFormData({ title: '', code: '', instructor_id: 0 });
    setEditingCourse(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.course_id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      code: course.code,
      instructor_id: course.instructor_id,
    });
    setDialogOpen(true);
  };

  const handleDelete = (course: Course) => {
    if (confirm(`Delete course ${course.title}?`)) {
      deleteMutation.mutate(course.course_id);
    }
  };

  const columns: ColumnDef<Course>[] = [
    { accessorKey: 'course_id', header: 'ID' },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'instructor.full_name', header: 'Instructor' },
    { 
      accessorKey: 'is_active', 
      header: 'Status',
      cell: ({ row }) => row.original.is_active ? 'Active' : 'Inactive'
    },
  ];

  const instructorsList = instructors?.data?.filter((u: any) => u.role?.name === 'Instructor') || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Courses Management</CardTitle>
            <CardDescription>Manage courses and instructors</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>Add Course</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Create Course'}</DialogTitle>
                <DialogDescription>
                  {editingCourse ? 'Update course information' : 'Add a new course'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="code">Course Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="CS101"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Introduction to Computer Science"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="instructor_id">Instructor</Label>
                  <Select 
                    value={String(formData.instructor_id)} 
                    onValueChange={(v) => setFormData({ ...formData, instructor_id: Number(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      {instructorsList.map((instructor: any) => (
                        <SelectItem key={instructor.user_id} value={String(instructor.user_id)}>
                          {instructor.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingCourse ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <DataTable columns={columns} data={data?.data || []} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </CardContent>
    </Card>
  );
}
