 import { Card, Dropdown, Typography, App } from 'antd'
  import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons'
  import { useNavigate } from 'react-router-dom'
  import type { Project } from '../../../types/database'
  import { useProjects } from '../hooks/useProjects'

  const { Text, Paragraph } = Typography

  interface Props {
    project: Project
    onEdit: (project: Project) => void
  }

  export function ProjectCard({ project, onEdit }: Props) {
    const navigate = useNavigate()
    const { deleteProject } = useProjects()
    const { modal } = App.useApp()

    const handleDelete = () => {
      modal.confirm({
        title: 'Delete project?',
        content: 'All tasks in this project will be deleted too.',
        okText: 'Delete',
        okButtonProps: { danger: true },
        onOk: () => deleteProject.mutateAsync(project.id),
      })
    }

    const menuItems = [
      { key: 'edit', icon: <EditOutlined />, label: 'Edit', onClick: () => onEdit(project) },
      { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true, onClick: handleDelete },
    ]

    return (
      <Card
        hoverable
        onClick={() => navigate(`/projects/${project.id}`)}
        style={{ borderTop: `3px solid ${project.color}` }}
        extra={
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <MoreOutlined onClick={(e) => e.stopPropagation()} style={{ fontSize: 18 }} />
          </Dropdown>
        }
      >
        <Text strong>{project.name}</Text>
        {project.description && (
          <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginTop: 8, marginBottom: 0 }}>
            {project.description}
          </Paragraph>
        )}
      </Card>
    )
  }