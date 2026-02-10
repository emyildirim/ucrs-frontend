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
import { submissionService, type Submission } from '@/services/submissionService';
import { assignmentService, type Assignment } from '@/services/assignmentService';
import { enrollmentService } from '@/services/enrollmentService';
import type { ColumnDef } from '@tanstack/react-table';

export default function MySubmissionsTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [selectedAssignment, setSelectedAssignment] = useState(0);
  const [contentUrl, setContentUrl] = useState('');

  const queryClient = useQueryClient();

  const { data: enrollments } = useQuery({
    queryKey: ['my-courses'],
    queryFn: enrollmentService.getMyCourses,
  });

  const { data: assignments } = useQuery({
    queryKey: ['assignments', selectedCourse],
    queryFn: () => selectedCourse ? assignmentService.getByCourse(selectedCourse) : Promise.resolve([]),
    enabled: !!selectedCourse,
  });

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: submissionService.getMySubmissions,
  });

  const submitMutation = useMutation({
    mutationFn: ({ assignmentId, url }: { assignmentId: number; url: string }) => 
      submissionService.submit(assignmentId, url),
    onSuccess: () => {
      toast.success('Assignment submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['my-submissions'] });
      setDialogOpen(false);
      setContentUrl('');
      setSelectedAssignment(0);
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Submit error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({ assignmentId: selectedAssignment, url: contentUrl });
  };

  const columns: ColumnDef<Submission>[] = [
    { accessorKey: 'submission_id', header: 'ID' },
    { 
      accessorKey: 'assignment.course.code', 
      header: 'Course',
      cell: ({ row }) => row.original.assignment?.course?.code || 'N/A'
    },
    { 
      accessorKey: 'assignment.title', 
      header: 'Assignment',
      cell: ({ row }) => row.original.assignment?.title || 'N/A'
    },
    { 
      accessorKey: 'content_url', 
      header: 'Submission',
      cell: ({ row }) => (
        <a href={row.original.content_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          View
        </a>
      )
    },
    { 
      accessorKey: 'score', 
      header: 'Score',
      cell: ({ row }) => {
        const maxPoints = row.original.assignment?.max_points || 100;
        return row.original.score ? `${row.original.score}/${maxPoints}` : 'Pending';
      }
    },
    { 
      accessorKey: 'created_at', 
      header: 'Submitted',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString()
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Submissions</CardTitle>
            <CardDescription>Submit assignments and view your grades</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Submit Assignment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Assignment</DialogTitle>
                <DialogDescription>Submit your work for an assignment</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="course_select">Course</Label>
                  <Select value={String(selectedCourse)} onValueChange={(v) => setSelectedCourse(Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
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
                  <div>
                    <Label htmlFor="assignment_select">Assignment</Label>
                    <Select value={String(selectedAssignment)} onValueChange={(v) => setSelectedAssignment(Number(v))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignment" />
                      </SelectTrigger>
                      <SelectContent>
                        {(assignments as Assignment[] || []).map((assignment) => (
                          <SelectItem key={assignment.assignment_id} value={String(assignment.assignment_id)}>
                            {assignment.title} (Due: {new Date(assignment.due_at).toLocaleDateString()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="content_url">Submission URL</Label>
                  <Input
                    id="content_url"
                    type="url"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    placeholder="https://example.com/my-submission.pdf"
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!selectedAssignment}>Submit</Button>
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
          <DataTable columns={columns} data={submissions || []} />
        )}
      </CardContent>
    </Card>
  );
}
