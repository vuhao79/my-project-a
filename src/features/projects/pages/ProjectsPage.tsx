import { useState } from "react";
import {
  Button,
  Typography,
  Spin,
  Form,
  Input,
  Modal,
  ColorPicker,
  App,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useProjects } from "../hooks/useProjects";
import { ProjectList } from "../components/ProjectList";
import { CreateProjectModal } from "../components/CreateProjectModal";
import type { Project } from "../../../types/database";

const { Title } = Typography;

export function ProjectsPage() {
  const { projectsQuery, updateProject } = useProjects();
  const { message } = App.useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm] = Form.useForm();

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    editForm.setFieldsValue({
      name: project.name,
      description: project.description,
      color: project.color,
    });
  };

  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      const color =
        typeof values.color === "string"
          ? values.color
          : (values.color?.toHexString?.() ?? "#1677ff");
      await updateProject.mutateAsync({
        id: editingProject!.id,
        name: values.name,
        description: values.description,
        color,
      });
      message.success("Project updated!");
      setEditingProject(null);
      editForm.resetFields();
    } catch (err: unknown) {
      if (err instanceof Error) message.error(err.message);
    }
  };

  if (projectsQuery.isLoading) {
    return <Spin size="large" style={{ display: "block", marginTop: 100 }} />;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Projects
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
        >
          New Project
        </Button>
      </div>

      <ProjectList projects={projectsQuery.data ?? []} onEdit={handleEdit} />

      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <Modal
        title="Edit Project"
        open={!!editingProject}
        onOk={handleEditOk}
        onCancel={() => {
          setEditingProject(null);
          editForm.resetFields();
        }}
        confirmLoading={updateProject.isPending}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="color" label="Color">
            <ColorPicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
