import { FormEvent, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";
import { Priority, Task, TaskStatus } from "../types";

const initialForm = { title: "", description: "", priority: "Medium" as Priority, dueDate: "", status: "Pending" as TaskStatus };

export default function Tasks() {
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    return params.toString() ? `?${params.toString()}` : "";
  }, [search, status]);
  const { data: tasks, loading, reload } = useAsyncData<Task[]>(() => api.tasks(query), [query]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await api.createTask(form);
    setForm(initialForm);
    await reload();
  };

  const updateStatus = async (task: Task, nextStatus: TaskStatus) => {
    await api.updateTask(task._id, { status: nextStatus });
    await reload();
  };

  return (
    <>
      <PageHeader title="Task Manager" subtitle="Create, search, filter, update, and close the loop on academic work." />
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="panel space-y-3">
          <input className="input" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input min-h-24" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
          <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          <button className="btn-primary w-full">Create Task</button>
        </form>
        <div className="panel">
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <input className="input" placeholder="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option><option>Pending</option><option>In Progress</option><option>Completed</option>
            </select>
          </div>
          {loading ? <p>Loading...</p> : tasks?.length ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <article key={task._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-semibold text-slate-950 dark:text-white">{task.title}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
                      <p className="mt-2 text-xs text-slate-500">Due {new Date(task.dueDate).toLocaleDateString()} • {task.priority}</p>
                    </div>
                    <div className="flex gap-2">
                      <select className="input min-w-36" value={task.status} onChange={(e) => updateStatus(task, e.target.value as TaskStatus)}>
                        <option>Pending</option><option>In Progress</option><option>Completed</option>
                      </select>
                      <button className="btn-secondary" onClick={() => api.deleteTask(task._id).then(reload)}>Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : <EmptyState title="No tasks found" description="Add a task or adjust your filters." />}
        </div>
      </section>
    </>
  );
}
