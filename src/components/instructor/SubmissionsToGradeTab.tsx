import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/errorHandler';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/shared/DataTable';
import { submissionService, type Submission } from '@/services/submissionService';
import { courseService, type Course } from '@/services/courseService';
import { accountService } from '@/services/accountService';
import type { ColumnDef } from '@tanstack/react-table';

export default function SubmissionsToGradeTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [score, setScore] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>();

  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['account-profile'],
    queryFn: accountService.getProfile,
  });

  const { data: allCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll({ per_page: 100 }),
  });

  const myCourses = allCourses?.data?.filter((c: Course) => 
    c.instructor_id === profile?.user_id
  ) || [];

  const { data, isLoading } = useQuery({
    queryKey: ['submissions', selectedCourse],
    queryFn: () => submissionService.getAll({ per_page: 100, course_id: selectedCourse }),
  });

  const gradeMutation = useMutation({
    mutationFn: ({ id, score }: { id: number; score: number }) => 
      submissionService.grade(id, score),
    onSuccess: () => {
      toast.success('Submission graded successfully');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setDialogOpen(false);
      setEditingSubmission(null);
      setScore('');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Grade submission error:', error);
    },
  });

  const handleGrade = (submission: Submission) => {
    setEditingSubmission(submission);
    setScore(submission.score?.toString() || '');
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubmission) {
      gradeMutation.mutate({ 
        id: editingSubmission.submission_id, 
        score: parseInt(score) 
      });
    }
  };

  const columns: ColumnDef<Submission>[] = [
    { accessorKey: 'submission_id', header: 'ID' },
    { 
      accessorKey: 'student.full_name', 
      header: 'Student',
      cell: ({ row }) => row.original.student?.full_name || 'N/A'
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
        return row.original.score ? `${row.original.score}/${maxPoints}` : 'Not graded';
      }
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submissions to Grade</CardTitle>
        <CardDescription>Grade student submissions for your courses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="course_filter">Select Course</Label>
          <Select 
            value={selectedCourse ? String(selectedCourse) : ''} 
            onValueChange={(v) => setSelectedCourse(Number(v))}
          >
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
            <>
              <DataTable 
                columns={columns} 
                data={data?.data || []} 
                onEdit={handleGrade}
              />
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Grade Submission</DialogTitle>
                    <DialogDescription>
                      Set score for {editingSubmission?.student?.full_name}'s submission
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="score">
                        Score (0-{editingSubmission?.assignment?.max_points || 100})
                      </Label>
                      <Input
                        id="score"
                        type="number"
                        min="0"
                        max={editingSubmission?.assignment?.max_points || 100}
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Grade</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}
