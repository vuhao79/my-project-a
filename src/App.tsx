 import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
  import { AuthGuard } from './features/auth/components/AuthGuard'
  import { LoginPage } from './features/auth/pages/LoginPage'
  import { SignUpPage } from './features/auth/pages/SignUpPage'
  import { AppLayout } from './components/AppLayout'
  import { ProtectedRoute } from './components/ProtectedRoute'
  import { ProjectsPage } from './features/projects/pages/ProjectsPage'

  function App() {
    return (
      <BrowserRouter>
        <AuthGuard>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProjectsPage />} />
              <Route path="projects/:projectId" element={<div>Project Detail — coming in Phase 3</div>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthGuard>
      </BrowserRouter>
    )
  }

  export default App