 import { useEffect } from 'react'
  import { Modal, Form, Input, Select, DatePicker, App } from 'antd'
  import dayjs from 'dayjs'
  import type { Task } from '../../../types/database'

  interface Props {
    open: boolean
    task: Task | null
    onClose: () => void
    onCreate: (values: { title: string; description?: string; priority?: string; due_date?: string | null }) =>
  Promise<void>
    onUpdate: (values: Partial<Task> & { id: string }) => Promise<void>
    loading: boolean
  }

  export function TaskFormModal({ open, task, onClose, onCreate, onUpdate, loading }: Props) {
    const [form] = Form.useForm()
    const { message } = App.useApp()
    const isEdit = !!task

    useEffect(() => {
      if (open && task) {
        form.setFieldsValue({
          title: task.title,
          description: task.description,
          priority: task.priority,
          due_date: task.due_date ? dayjs(task.due_date) : null,
        })
      } else if (open) {
        form.setFieldsValue({ priority: 'medium' })
      }
    }, [open, task, form])

    const handleOk = async () => {
      try {
        const values = await form.validateFields()
        const payload = {
          title: values.title,
          description: values.description || null,
          priority: values.priority,
          due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : null,
        }

        if (isEdit) {
          await onUpdate({ id: task.id, ...payload })
          message.success('Task updated!')
        } else {
          await onCreate(payload)
          message.success('Task created!')
        }
        form.resetFields()
        onClose()
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      }
    }

    const handleCancel = () => {
      form.resetFields()
      onClose()
    }

    return (
      <Modal
        title={isEdit ? 'Edit Task' : 'New Task'}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select>
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="due_date" label="Due Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }