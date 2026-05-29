import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

import { AgentBadge } from '@/components/shared/agent-badge';
import { EmptyTableRow } from '@/components/shared/empty-table-row';
import { LoadingTableRow } from '@/components/shared/loading-state';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { api, formatDate,qk } from '@/lib/api';

import type { TaskSummary } from '@/schema/api';

export const Route = createFileRoute('/tasks/')({
  component: Tasks,
});

type Filter = 'all' | 'pending' | 'in_progress' | 'done' | 'blocked' | 'archived';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'archived', label: 'Archived' },
];

function Tasks() {
  const [filter, setFilter] = useState<Filter>('all');
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: qk.allTasks(true),
    queryFn: () => api.allTasks(true),
  });

  const filtered =
    filter === 'all' ? tasks.filter(t => !t.archived_at) :
    filter === 'archived' ? tasks.filter(t => t.archived_at) :
    tasks.filter((t) => t.status === filter && !t.archived_at);

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle={`${filtered.length} task${filtered.length !== 1 ? 's' : ''}`}
        right={
          <div className="flex gap-1">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`font-mono text-xs px-3 py-1.5 rounded transition-colors ${
                  filter === value
                    ? 'bg-[#0a0a0a] text-[#fafafa] border border-[#3a3a3a]'
                    : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1f1f1f]">
              {[
                '#',
                'Title',
                'Slug',
                'Status',
                'Assigned',
                'Acceptance',
                'Created',
                'Archived',
              ].map((h) => (
                <th
                  key={h}
                  className="text-left font-mono text-[10px] text-neutral-600 uppercase tracking-wider px-4 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && <LoadingTableRow cols={8} />}
            {filtered.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
            {!isLoading && filtered.length === 0 && <EmptyTableRow cols={8} message="No tasks" />}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: TaskSummary }) {
  return (
    <tr className="border-b border-[#1f1f1f] hover:bg-[#0a0a0a] transition-colors group">
      <td className="px-4 py-3 font-mono text-xs text-neutral-600">
        {task.id}
      </td>
      <td className="px-4 py-3">
        <Link
          to="/tasks/$id"
          params={{ id: String(task.id) }}
          className="font-mono text-sm text-[#fafafa] hover:text-green-400 transition-colors"
        >
          {task.title}
        </Link>
        {task.description && (
          <div className="text-xs text-neutral-600 mt-0.5 truncate max-w-xs">
            {task.description}
          </div>
        )}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-neutral-500">
        {task.slug}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={task.status} />
      </td>
      <td className="px-4 py-3">
        {task.assigned_to ? (
          <AgentBadge agent={task.assigned_to} size="xs" />
        ) : (
          <span className="text-neutral-700 text-xs">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        {task.acceptance_total > 0 ? (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-neutral-900 rounded-full h-1">
              <div
                className="bg-green-600 h-1 rounded-full"
                style={{
                  width: `${(task.acceptance_met / task.acceptance_total) * 100}%`,
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-neutral-600">
              {task.acceptance_met}/{task.acceptance_total}
            </span>
          </div>
        ) : (
          <span className="text-neutral-700 text-xs">—</span>
        )}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-neutral-600">
        {formatDate(task.created_at)}
      </td>
      <td className="px-4 py-3">
        {task.archived_at ? (
          <span className="text-[10px] font-mono text-yellow-600/80 bg-yellow-500/5 px-2 py-0.5 rounded">
            archived
          </span>
        ) : (
          <span className="text-neutral-800 text-xs">—</span>
        )}
      </td>
    </tr>
  );
}
