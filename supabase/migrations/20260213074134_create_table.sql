 -- Function to auto-update updated_at
  create or replace function update_updated_at()
  returns trigger as $$
  begin
    new.updated_at = now();
    return new;
  end;
  $$ language plpgsql;

  -- Projects
  create table projects (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    description text,
    color text not null default '#1677ff',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );

  create trigger projects_updated_at
    before update on projects
    for each row execute function update_updated_at();

  -- Tasks
  create table tasks (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references projects(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    title text not null,
    description text,
    status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
    priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
    due_date timestamptz,
    position integer not null default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );

  create trigger tasks_updated_at
    before update on tasks
    for each row execute function update_updated_at();

  -- Labels
  create table labels (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    color text not null default '#1677ff',
    created_at timestamptz default now()
  );

  -- Task-Labels junction
  create table task_labels (
    task_id uuid references tasks(id) on delete cascade not null,
    label_id uuid references labels(id) on delete cascade not null,
    primary key (task_id, label_id)
  );