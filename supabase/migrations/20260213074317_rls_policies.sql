-- Enable RLS
alter table projects enable row level security;

alter table tasks enable row level security;

alter table labels enable row level security;

alter table task_labels enable row level security;

-- Projects: user can only see/modify their own
create policy "Users can view own projects" on projects for
select
    using (auth.uid () = user_id);

create policy "Users can create own projects" on projects for insert
with
    check (auth.uid () = user_id);

create policy "Users can update own projects" on projects for
update using (auth.uid () = user_id);

create policy "Users can delete own projects" on projects for delete using (auth.uid () = user_id);

-- Tasks: user can only see/modify their own
create policy "Users can view own tasks" on tasks for
select
    using (auth.uid () = user_id);

create policy "Users can create own tasks" on tasks for insert
with
    check (auth.uid () = user_id);

create policy "Users can update own tasks" on tasks for
update using (auth.uid () = user_id);

create policy "Users can delete own tasks" on tasks for delete using (auth.uid () = user_id);

-- Labels: user can only see/modify their own
create policy "Users can view own labels" on labels for
select
    using (auth.uid () = user_id);

create policy "Users can create own labels" on labels for insert
with
    check (auth.uid () = user_id);

create policy "Users can update own labels" on labels for
update using (auth.uid () = user_id);

create policy "Users can delete own labels" on labels for delete using (auth.uid () = user_id);

-- Task-Labels: user can manage through task ownership
create policy "Users can view own task_labels" on task_labels for
select
    using (
        exists (
            select
                1
            from
                tasks
            where
                tasks.id = task_labels.task_id
                and tasks.user_id = auth.uid ()
        )
    );

create policy "Users can create own task_labels" on task_labels for insert
with
    check (
        exists (
            select
                1
            from
                tasks
            where
                tasks.id = task_labels.task_id
                and tasks.user_id = auth.uid ()
        )
    );

create policy "Users can delete own task_labels" on task_labels for delete using (
    exists (
        select
            1
        from
            tasks
        where
            tasks.id = task_labels.task_id
            and tasks.user_id = auth.uid ()
    )
);