 import { Typography, Badge, theme } from 'antd'
  import { Droppable, Draggable } from '@hello-pangea/dnd'
  import type { Task } from '../../../types/database'
  import { TaskCard } from './TaskCard'

  const { Text } = Typography

  const statusConfig = {
    todo: { title: 'Todo', color: '#8c8c8c' },
    in_progress: { title: 'In Progress', color: '#1677ff' },
    done: { title: 'Done', color: '#52c41a' },
  }

  interface Props {
    status: Task['status']
    tasks: Task[]
    onEdit: (task: Task) => void
    onDelete: (task: Task) => void
  }

  export function TaskColumn({ status, tasks, onEdit, onDelete }: Props) {
    const { token } = theme.useToken()
    const config = statusConfig[status]

    return (
      <div
        style={{
          flex: 1,
          minWidth: 250,
          background: token.colorBgLayout,
          borderRadius: token.borderRadiusLG,
          padding: token.paddingSM,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: token.marginSM,
            marginBottom: token.marginSM,
            padding: `0 ${token.paddingXS}px`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: config.color,
            }}
          />
          <Text strong>{config.title}</Text>
          <Badge count={tasks.length} style={{ backgroundColor: config.color }} />
        </div>

        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: 100,
                background: snapshot.isDraggingOver ? token.colorPrimaryBg : 'transparent',
                borderRadius: token.borderRadius,
                transition: 'background 0.2s',
                padding: 2,
              }}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    )
  }