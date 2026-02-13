 import { useState } from 'react'
  import { Outlet, useNavigate, useParams } from 'react-router-dom'
  import { Layout, Menu, Button, Typography, theme, Spin } from 'antd'
  import { LogoutOutlined, ProjectOutlined, HomeOutlined } from '@ant-design/icons'
  import { useAuth } from '../features/auth/hooks/useAuth'
  import { useProjects } from '../features/projects/hooks/useProjects'

  const { Header, Sider, Content } = Layout
  const { Text } = Typography

  export function AppLayout() {
    const { user, signOut } = useAuth()
    const { projectsQuery } = useProjects()
    const navigate = useNavigate()
    const { projectId } = useParams()
    const [collapsed, setCollapsed] = useState(false)
    const { token } = theme.useToken()

    const projectMenuItems = (projectsQuery.data ?? []).map((p) => ({
      key: p.id,
      icon: <span style={{ color: p.color }}>●</span>,
      label: p.name,
      onClick: () => navigate(`/projects/${p.id}`),
    }))

    const selectedKeys = projectId ? [projectId] : ['home']

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div style={{ padding: 16, textAlign: 'center' }}>
            <Text strong style={{ color: '#fff', fontSize: collapsed ? 14 : 18 }}>
              {collapsed ? 'TM' : 'Task Manager'}
            </Text>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            items={[
              {
                key: 'home',
                icon: <HomeOutlined />,
                label: 'Dashboard',
                onClick: () => navigate('/'),
              },
              {
                type: 'divider',
              },
              {
                key: 'projects-group',
                icon: <ProjectOutlined />,
                label: 'Projects',
                children: projectsQuery.isLoading
                  ? [{ key: 'loading', label: <Spin size="small" />, disabled: true }]
                  : projectMenuItems,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}>
            <Text style={{ marginRight: 16 }}>{user?.email}</Text>
            <Button icon={<LogoutOutlined />} onClick={signOut}>
              Logout
            </Button>
          </Header>
          <Content style={{ margin: 24 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    )
  }