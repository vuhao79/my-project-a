import { useState } from 'react'
import { Input, Button, Checkbox, List, Typography, Empty, Space, theme } from 'antd'

const { Title, Text } = Typography

interface Todo {
  id: number
  text: string
  completed: boolean
}

function App() {
  const { token } = theme.useToken()
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')

  const addTodo = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    setTodos([...todos, { id: Date.now(), text: trimmed, completed: false }])
    setInputValue('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTodo()
  }

  const completedCount = todos.filter(t => t.completed).length

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
                <Button type="text" danger onClick={() => deleteTodo(todo.id)}>
                  Delete
                </Button>
              ]}
            >
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
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
