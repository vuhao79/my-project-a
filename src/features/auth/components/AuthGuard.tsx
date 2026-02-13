  import { Spin } from 'antd'
  import { useAuth } from '../hooks/useAuth'

  export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth()

    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" />
        </div>
      )
    }

    return <>{children}</>
  }
