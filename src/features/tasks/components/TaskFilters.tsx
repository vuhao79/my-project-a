import { Select, DatePicker, Space, theme } from 'antd'
  import { FilterOutlined } from '@ant-design/icons'
  import dayjs from 'dayjs'

  export interface FilterValues {
    priority: string | null
    dueBefore: string | null
    sort: 'position' | 'priority' | 'due_date'
  }

  interface Props {
    filters: FilterValues
    onChange: (filters: FilterValues) => void
  }

  export function TaskFilters({ filters, onChange }: Props) {
    const { token } = theme.useToken()

    return (
      <Space wrap style={{ marginBottom: token.marginMD }}>
        <FilterOutlined />
        <Select
          placeholder="Priority"
          allowClear
          value={filters.priority}
          onChange={(value) => onChange({ ...filters, priority: value ?? null })}
          style={{ width: 130 }}
          options={[
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ]}
        />
        <DatePicker
          placeholder="Due before"
          value={filters.dueBefore ? dayjs(filters.dueBefore) : null}
          onChange={(date) =>
            onChange({ ...filters, dueBefore: date ? date.format('YYYY-MM-DD') : null })
          }
        />
        <Select
          value={filters.sort}
          onChange={(value) => onChange({ ...filters, sort: value })}
          style={{ width: 150 }}
          options={[
            { value: 'position', label: 'Sort: Position' },
            { value: 'priority', label: 'Sort: Priority' },
            { value: 'due_date', label: 'Sort: Due Date' },
          ]}
        />
      </Space>
    )
  }