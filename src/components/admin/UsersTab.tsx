import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorHandler';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/shared/DataTable';
import { userService, type User } from '@/services/userService';
import type { ColumnDef } from '@tanstack/react-table';

export default function UsersTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role_id: 3,
    status: 'active',
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll({ per_page: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Create user error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => userService.update(id, data),
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Update user error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
      console.error('Delete user error:', error);
    },
  });

  const resetForm = () => {
    setFormData({ full_name: '', email: '', password: '', role_id: 3, status: 'active' });
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updateData: any = { ...formData };
      if (!updateData.password) delete updateData.password;
      updateMutation.mutate({ id: editingUser.user_id, data: updateData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      password: '',
      role_id: user.role_id,
      status: user.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    deleteMutation.mutate(user.user_id);
  };

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'user_id', header: 'ID' },
    { accessorKey: 'full_name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role.name', header: 'Role' },
    { accessorKey: 'status', header: 'Status' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Users Management</CardTitle>
            <CardDescription>Manage system users and their roles</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? 'Edit User' : 'Create User'}</DialogTitle>
                <DialogDescription>
                  {editingUser ? 'Update user information' : 'Add a new user to the system'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    Password {editingUser && '(leave blank to keep)'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    minLength={8}
                    placeholder="Minimum 8 characters"
                  />
                  {!editingUser && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be at least 8 characters
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="role_id">Role</Label>
                  <Select value={String(formData.role_id)} onValueChange={(v) => setFormData({ ...formData, role_id: Number(v) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Admin</SelectItem>
                      <SelectItem value="2">Instructor</SelectItem>
                      <SelectItem value="3">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingUser ? 'Update' : 'Create'}</Button>
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
