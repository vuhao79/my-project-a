import { Form, Input, Modal, ColorPicker, App } from "antd";
import { useProjects } from "../hooks/useProjects";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ open, onClose }: Props) {
  const [form] = Form.useForm();
  const { createProject } = useProjects();
  const { message } = App.useApp();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const color =
        typeof values.color === "string"
          ? values.color
          : (values.color?.toHexString?.() ?? "#1677ff");
      await createProject.mutateAsync({
        name: values.name,
        description: values.description,
        color,
      });
      message.success("Project created!");
      form.resetFields();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) message.error(err.message);
    }
  };

  return (
    <Modal
      title="New Project"
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      confirmLoading={createProject.isPending}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="color" label="Color" initialValue="#1677ff">
          <ColorPicker />
        </Form.Item>
      </Form>
    </Modal>
  );
}
