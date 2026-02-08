import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/shared/DataTable';
import { auditLogService, type AuditLog } from '@/services/auditLogService';
import type { ColumnDef } from '@tanstack/react-table';

export default function AuditLogsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => auditLogService.getAll({ per_page: 100 }),
  });

  const columns: ColumnDef<AuditLog>[] = [
    { 
      accessorKey: 'audit_id', 
      header: 'ID',
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.audit_id}</span>
    },
    { 
      accessorKey: 'actor.full_name', 
      header: 'User',
      cell: ({ row }) => row.original.actor?.full_name || 'System'
    },
    { accessorKey: 'action_type', header: 'Action' },
    { accessorKey: 'entity_type', header: 'Entity' },
    { 
      accessorKey: 'created_at', 
      header: 'Timestamp',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString()
    },
    {
      id: 'details',
      header: 'Details',
      cell: ({ row }) => {
        const hasChanges = row.original.before_json || row.original.after_json;
        return hasChanges ? (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              console.log('Before:', row.original.before_json);
              console.log('After:', row.original.after_json);
              alert('Check console for details');
            }}
          >
            View
          </Button>
        ) : '-';
      }
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
        <CardDescription>System activity and change history</CardDescription>
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

// Import Button for the View button
import { Button } from '@/components/ui/button';
