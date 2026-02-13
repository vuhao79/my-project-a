 import { Col, Row, Empty } from 'antd'
  import type { Project } from '../../../types/database'
  import { ProjectCard } from './ProjectCard'

  interface Props {
    projects: Project[]
    onEdit: (project: Project) => void
  }

  export function ProjectList({ projects, onEdit }: Props) {
    if (projects.length === 0) {
      return <Empty description="No projects yet. Create one to get started!" />
    }

    return (
      <Row gutter={[16, 16]}>
        {projects.map((project) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={project.id}>
            <ProjectCard project={project} onEdit={onEdit} />
          </Col>
        ))}
      </Row>
    )
  }