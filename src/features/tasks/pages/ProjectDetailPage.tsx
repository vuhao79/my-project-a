import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Spin, Space, theme } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useProject } from "../../projects/hooks/useProject";
import { useTasks } from "../hooks/useTasks";
import { TaskBoard } from "../components/TaskBoard";
import { TaskFormModal } from "../components/TaskFormModal";
import type { Task } from "../../../types/database";
import { TaskFilters, type FilterValues } from "../components/TaskFilters";

const { Title, Paragraph, Text } = Typography;

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { projectQuery } = useProject(projectId!);
  const { tasksQuery, createTask, updateTask, deleteTask } = useTasks(
    projectId!,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    priority: null,
    dueBefore: null,
    sort: "position",
  });

  if (projectQuery.isLoading || tasksQuery.isLoading) {
    return <Spin size="large" style={{ display: "block", marginTop: 100 }} />;
  }

  const project = projectQuery.data;
  if (!project) return null;

  const tasks = tasksQuery.data ?? [];
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "in_progress",
  ).length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const filteredTasks = tasks
    .filter((t) => {
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.dueBefore && (!t.due_date || t.due_date > filters.dueBefore))
        return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "priority")
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (filters.sort === "due_date") {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return a.due_date.localeCompare(b.due_date);
      }
      return a.position - b.position;
    });
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    deleteTask.mutateAsync(task.id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div>
      {/* Header */}
      <Space style={{ marginBottom: token.marginMD }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
        />
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {project.name}
          </Title>
          {project.description && (
            <Paragraph type="secondary" style={{ margin: 0 }}>
              {project.description}
            </Paragraph>
          )}
        </div>
      </Space>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: token.marginLG,
          marginBottom: token.marginLG,
        }}
      >
        <Text>
          Total: <Text strong>{tasks.length}</Text>
        </Text>
        <Text>
          Todo: <Text strong>{todoCount}</Text>
        </Text>
        <Text>
          In Progress: <Text strong>{inProgressCount}</Text>
        </Text>
        <Text>
          Done: <Text strong>{doneCount}</Text>
        </Text>
      </div>

      {/* Add Task */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setModalOpen(true)}
        style={{ marginBottom: token.marginMD }}
      >
        Add Task
      </Button>
      <TaskFilters filters={filters} onChange={setFilters} />
      {/* Board */}
      <TaskBoard tasks={filteredTasks} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modal */}
      <TaskFormModal
        open={modalOpen}
        task={editingTask}
        onClose={handleCloseModal}
        onCreate={async (values) => {
          await createTask.mutateAsync(values);
        }}
        onUpdate={async (values) => {
          await updateTask.mutateAsync(values);
        }}
        loading={createTask.isPending || updateTask.isPending}
      />
    </div>
  );
}
