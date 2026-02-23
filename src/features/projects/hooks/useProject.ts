 import { useQuery } from '@tanstack/react-query'
  import { supabase } from '../../../lib/supabase'
  import { queryKeys } from '../../../lib/constants'
  import { useAuth } from '../../auth/hooks/useAuth'
  import type { Project } from '../../../types/database'

  export function useProject(projectId: string) {
    const { user } = useAuth()

    const projectQuery = useQuery({
      queryKey: queryKeys.projects.detail(projectId),
      queryFn: async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single()
        if (error) throw error
        return data as Project
      },
      enabled: !!user && !!projectId,
    })

    return { projectQuery }
  }