import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Input, Button, Checkbox, List, Typography, Empty, Space, Spin, theme } from 'antd'
import { supabase } from './lib/supabase'

const { Title, Text } = Typography

interface Todo {
  id: number
  text: string
  completed: boolean
  created_at: string
}

function App() {
  const { token } = theme.useToken()
  const [inputValue, setInputValue] = useState('')
  const queryClient = useQueryClient()

  // READ: Fetch todos from Supabase
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data as Todo[]
    }
  })

  // CREATE: Add a new todo
  const addMutation = useMutation({
    mutationFn: async (text: string) => {
      const { error } = await supabase
        .from('todos')
        .insert({ text })

      if (error) throw new Error(error.message)
    },
    onSuccess: () => 
      queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  // UPDATE: Toggle todo completion
  const toggleMutation = useMutation({
    mutationFn: async ({id, completed} : {id: number, completed: boolean}) => {
      const { error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', id)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => 
      queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  // DELETE: Remove a todo
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => 
      queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const addTodo = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    addMutation.mutate(trimmed)
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTodo()
  }

  const completedCount = todos.filter(t => t.completed).length

  if (isLoading) {
    return (
             <Spin style={{display: 'block', marginTop: 100}} size="large" />

    )
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: token.paddingXL }}>
      <Title level={1} style={{ textAlign: 'center' }}>Todo App</Title>

      <Space.Compact style={{ width: '100%', marginBottom: token.marginMD }}>
        <Input
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="primary" onClick={addTodo}>
          Add
        </Button>
      </Space.Compact>

      {todos.length > 0 && (
        <Text type="secondary" style={{ display: 'block', marginBottom: token.marginSM }}>
          {completedCount}/{todos.length} completed
        </Text>
      )}

      {todos.length > 0 ? (
        <List
          dataSource={todos}
          renderItem={todo => (
            <List.Item
              style={{ opacity: todo.completed ? 0.6 : 1 }}
              actions={[
                <Button type="text" danger onClick={() => deleteMutation.mutate(todo.id)}>
                  Delete
                </Button>
              ]}
            >
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleMutation.mutate({ id: todo.id, completed: !todo.completed })}
              >
                <Text delete={todo.completed}>{todo.text}</Text>
              </Checkbox>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No tasks yet. Add one above!" />
      )}
    </div>
  )
}

export default App
