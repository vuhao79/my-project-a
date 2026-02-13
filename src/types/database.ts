 export interface Project {
    id: string
    user_id: string
    name: string
    description: string | null
    color: string
    created_at: string
    updated_at: string
  }

  export interface Task {
    id: string
    project_id: string
    user_id: string
    title: string
    description: string | null
    status: 'todo' | 'in_progress' | 'done'
    priority: 'low' | 'medium' | 'high'
    due_date: string | null
    position: number
    created_at: string
    updated_at: string
  }

  export interface Label {
    id: string
    user_id: string
    name: string
    color: string
    created_at: string
  }

  export interface TaskLabel {
    task_id: string
    label_id: string
  }
