 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
  import { supabase } from '../../../lib/supabase'
  import { queryKeys } from '../../../lib/constants'
  import { useAuth } from '../../auth/hooks/useAuth'
  import type { Task } from '../../../types/database'

  export function useTasks(projectId: string) {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const tasksQuery = useQuery({
      queryKey: queryKeys.tasks.byProject(projectId),
      queryFn: async () => {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', projectId)
          .order('position')
          .order('created_at', { ascending: false })
        if (error) throw error
        return data as Task[]
      },
      enabled: !!user && !!projectId,
    })

    const createTask = useMutation({
      mutationFn: async (task: { title: string; description?: string; status?: string; priority?: string; due_date?:
  string | null }) => {
        const maxPosition = (tasksQuery.data ?? []).reduce((max, t) => Math.max(max, t.position), -1)
        const { data, error } = await supabase
          .from('tasks')
          .insert({ ...task, project_id: projectId, user_id: user!.id, position: maxPosition + 1 })
          .select()
          .single()
        if (error) throw error
        return data as Task
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(projectId) })
      },
    })

    const updateTask = useMutation({
      mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
        const { data, error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        return data as Task
      },
      // Optimistic update
      onMutate: async (updatedTask) => {
        await queryClient.cancelQueries({ queryKey: queryKeys.tasks.byProject(projectId) })
        const previous = queryClient.getQueryData<Task[]>(queryKeys.tasks.byProject(projectId))
        queryClient.setQueryData<Task[]>(queryKeys.tasks.byProject(projectId), (old) =>
          old?.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
        )
        return { previous }
      },
      onError: (_err, _vars, context) => {
        if (context?.previous) {
          queryClient.setQueryData(queryKeys.tasks.byProject(projectId), context.previous)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(projectId) })
      },
    })

    const deleteTask = useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id)
        if (error) throw error
      },
      // Optimistic delete
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: queryKeys.tasks.byProject(projectId) })
        const previous = queryClient.getQueryData<Task[]>(queryKeys.tasks.byProject(projectId))
        queryClient.setQueryData<Task[]>(queryKeys.tasks.byProject(projectId), (old) =>
          old?.filter((t) => t.id !== id)
        )
        return { previous }
      },
      onError: (_err, _vars, context) => {
        if (context?.previous) {
          queryClient.setQueryData(queryKeys.tasks.byProject(projectId), context.previous)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(projectId) })
      },
    })

    return { tasksQuery, createTask, updateTask, deleteTask }
  }