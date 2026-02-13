import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
  import { supabase } from '../../../lib/supabase'
  import { queryKeys } from '../../../lib/constants'
  import { useAuth } from '../../auth/hooks/useAuth'
  import type { Project } from '../../../types/database'

  export function useProjects() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const projectsQuery = useQuery({
      queryKey: queryKeys.projects.all,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        return data as Project[]
      },
      enabled: !!user,
    })

    const createProject = useMutation({
      mutationFn: async (project: { name: string; description?: string; color?: string }) => {
        const { data, error } = await supabase
          .from('projects')
          .insert({ ...project, user_id: user!.id })
          .select()
          .single()
        if (error) throw error
        return data as Project
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      },
    })

    const updateProject = useMutation({
      mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
        const { data, error } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        return data as Project
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      },
    })

    const deleteProject = useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from('projects').delete().eq('id', id)
        if (error) throw error
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      },
    })

    return { projectsQuery, createProject, updateProject, deleteProject }
  }