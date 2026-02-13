export const queryKeys = {
    projects: {
      all: ['projects'] as const,
      detail: (id: string) => ['projects', id] as const,
    },
    tasks: {
      all: ['tasks'] as const,
      byProject: (projectId: string) => ['tasks', 'project', projectId] as const,
      detail: (id: string) => ['tasks', id] as const,
    },
    labels: {
      all: ['labels'] as const,
    },
  }
