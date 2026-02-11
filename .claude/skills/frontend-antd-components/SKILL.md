---
name: frontend-antd-components
description: Use when working with ANTD components, theme tokens, icons, forms, or feedback components (message/notification/modal)
---

# Frontend: ANTD Components

All new components must use Ant Design (ANTD) with theme tokens. Never use hardcoded color/spacing values for new development.

## Theme Tokens (Required)

**Always use ANTD theme tokens** instead of hardcoded values:

```typescript
import { theme } from 'antd';

function MyComponent() {
  const { token } = theme.useToken();

  return (
    <div style={{
      padding: token.paddingXL,
      color: token.colorPrimary,
      fontSize: token.fontSizeLG,
      borderRadius: token.borderRadiusLG,
    }}>
      Content
    </div>
  );
}
```

**Common Token Categories:**

- **Colors:** `token.colorPrimary`, `token.colorError`, `token.colorSuccess`, `token.colorWarning`, `token.colorBorder`, `token.colorBgContainer`
- **Spacing:** `token.paddingSM`, `token.paddingMD`, `token.paddingLG`, `token.paddingXL`, `token.marginSM`, `token.marginMD`, `token.marginLG`, `token.marginXL`
- **Typography:** `token.fontSize`, `token.fontSizeSM`, `token.fontSizeLG`, `token.fontSizeHeading1`, `token.fontSizeHeading2`, `token.fontSizeHeading3`
- **Borders:** `token.borderRadius`, `token.borderRadiusSM`, `token.borderRadiusLG`

## Typography Components

Use ANTD Typography components instead of plain HTML:

```typescript
import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

// ❌ Bad
<h1>Page Title</h1>
<p>Description</p>

// ✅ Good
<Title level={1}>Page Title</Title>
<Paragraph type="secondary">Description</Paragraph>
<Text strong>Bold text</Text>
<Text type="danger">Error text</Text>
```

## App.useApp Pattern (Message/Notification/Modal)

**Always use `App.useApp()` hook** for feedback components — never import directly:

```typescript
import { App } from 'antd';

function MyComponent() {
  const { message, notification, modal } = App.useApp();

  const handleSuccess = () => {
    message.success('Operation successful!');
  };

  const handleNotify = () => {
    notification.info({
      message: 'Update Available',
      description: 'A new version is ready.',
    });
  };

  return <button onClick={handleSuccess}>Save</button>;
}
```

**Requirement:** Your app root must be wrapped with `<App>` provider. Example:

```typescript
// In your app entry or provider setup
import { App as AntdApp } from 'antd';

function AppProvider({ children }) {
  return <AntdApp>{children}</AntdApp>;
}
```

## Modal Confirmations (Async Pattern)

**Always use async onOk** for delete confirmations and critical actions:

```typescript
import { App } from 'antd';

function MyComponent() {
  const { modal } = App.useApp();

  const handleDelete = (id: string, name: string) => {
    modal.confirm({
      title: 'Delete Item',
      content: `Are you sure you want to delete "${name}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        await deleteItem(id); // or mutation.mutateAsync({ id })
      },
    });
  };

  return <button onClick={() => handleDelete('1', 'Item')}>Delete</button>;
}
```

**Why async onOk matters:**

- Modal stays open until async operation completes
- Loading spinner shows automatically on OK button
- Errors prevent modal from closing
- Success closes modal automatically

## Icon Usage

**Primary:** Use `@ant-design/icons` for all icons:

```typescript
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, theme } from 'antd';

function MyComponent() {
  const { token } = theme.useToken();

  return (
    <>
      <Button icon={<PlusOutlined />}>Create</Button>
      <EditOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
    </>
  );
}
```

**Fallback:** Use `lucide-react` or other icon library only when `@ant-design/icons` doesn't have a suitable icon. Never mix multiple icon libraries in the same component.

## Form Handling

Use ANTD Form components with validation rules:

```typescript
import { Form, Input, Select, Button } from 'antd';

function MyForm() {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log(values);
    });
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true, message: 'Please enter a name' },
          { min: 1, max: 255, message: 'Name must be 1-255 characters' },
        ]}
      >
        <Input placeholder="Enter name..." />
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: 'Please select a type' }]}
      >
        <Select placeholder="Select type...">
          <Select.Option value="a">Type A</Select.Option>
          <Select.Option value="b">Type B</Select.Option>
        </Select>
      </Form.Item>

      <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
  );
}
```

## CSS/Styling Rules

- **No separate CSS/SCSS files** for new components
- **Use:** ANTD components + inline styles with theme tokens
- **Existing CSS:** Legacy styled components remain as-is (no refactoring required)

## Deprecated Props (Avoid)

Some ANTD props are deprecated. Always use the new replacements:

| ❌ Deprecated | ✅ Replacement |
|---|---|
| `Card bodyStyle={...}` | `Card styles={{ body: {...} }}` |
| `Modal destroyOnClose` | `Modal destroyOnHidden` |
| `Divider orientation="left"` | `Divider titlePlacement="left"` |

```typescript
// ✅ Good
<Card styles={{ body: { padding: token.paddingSM } }}>Content</Card>
<Modal destroyOnHidden>Content</Modal>
<Divider titlePlacement="left">Section Title</Divider>
```

## Component Tokens

If your project configures component-level tokens (e.g., Button sizes in your ANTD provider/theme config), use the `size` prop instead of overriding with inline styles:

```typescript
// ❌ Bad — overrides component tokens
<Button type="primary" style={{ borderRadius: 9999, fontSize: 16, fontWeight: 600 }}>

// ✅ Good — let component tokens handle it
<Button type="primary" size="large">
```

## Anti-Pattern Detection

Check for these violations before completing any ANTD-related code:

1. ❌ Hardcoded colors/spacing → ✅ Use `theme.useToken()` and `token.*`
2. ❌ `import { message } from 'antd'` → ✅ `const { message } = App.useApp()`
3. ❌ Plain HTML (`<h1>`, `<p>`, `<span>` for text) → ✅ ANTD Typography (`<Title>`, `<Paragraph>`, `<Text>`)
4. ❌ Missing `theme.useToken()` hook → ✅ Import and use in component
5. ❌ Mixed icon libraries in same component → ✅ Choose one (prefer `@ant-design/icons`)
6. ❌ New CSS/SCSS files for components → ✅ Inline styles with theme tokens
7. ❌ Deprecated props (`bodyStyle`, `destroyOnClose`, `orientation`) → ✅ Use new props
8. ❌ Inline styles duplicating component tokens → ✅ Use `size` prop

If any violations are detected, flag them and ask the user to confirm before proceeding.
