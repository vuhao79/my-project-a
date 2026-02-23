 import { Empty, theme } from 'antd'
  import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
  import type { Task } from '../../../types/database'
  import { TaskColumn } from './TaskColumn'

  const statuses: Task['status'][] = ['todo', 'in_progress', 'done']

  interface Props {
    tasks: Task[]
    onEdit: (task: Task) => void
    onDelete: (task: Task) => void
    onDragEnd: (result: DropResult) => void
  }

  export function TaskBoard({ tasks, onEdit, onDelete, onDragEnd }: Props) {
    const { token } = theme.useToken()

    if (tasks.length === 0) {
      return <Empty description="No tasks yet. Click Add Task to get started!" />
    }

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: token.marginMD, overflowX: 'auto' }}>
          {statuses.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </DragDropContext>
    )
  }
