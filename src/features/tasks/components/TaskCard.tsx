import { Card, Tag, Typography, Dropdown, App } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { theme } from "antd";
import type { Task } from "../../../types/database";

const { Text } = Typography;

const priorityConfig = {
  high: { color: "red", label: "High" },
  medium: { color: "orange", label: "Medium" },
  low: { color: "blue", label: "Low" },
};

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: Props) {
  const { token } = theme.useToken();
  const { modal } = App.useApp();

  const handleDelete = () => {
    modal.confirm({
      title: "Delete task?",
      content: `Are you sure you want to delete "${task.title}"?`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        onDelete(task);
      },
    });
  };

  const menuItems = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      onClick: () => onEdit(task),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      danger: true,
      onClick: handleDelete,
    },
  ];

  const priority = priorityConfig[task.priority];

  return (
    <Card
      size="small"
      styles={{ body: { padding: token.paddingSM } }}
      style={{ marginBottom: token.marginSM }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Text strong ellipsis style={{ flex: 1 }}>
          {task.title}
        </Text>
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <MoreOutlined style={{ cursor: "pointer", padding: 4 }} />
        </Dropdown>
      </div>

      <div
        style={{
          display: "flex",
          gap: token.marginXS,
          marginTop: token.marginXS,
          flexWrap: "wrap",
        }}
      >
        <Tag color={priority.color}>{priority.label}</Tag>
        {task.due_date && (
          <Tag icon={<CalendarOutlined />}>
            {new Date(task.due_date).toLocaleDateString()}
          </Tag>
        )}
      </div>
    </Card>
  );
}
