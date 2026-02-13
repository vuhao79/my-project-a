create table todos (
    id bigint generated always as identity primary key,
    text text not null,
    completed boolean not null default false,
    created_at timestamptz default now()
);