import { FormEvent, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";
import { Note, NoteCategory } from "../types";

const initialForm = { title: "", content: "", category: "College" as NoteCategory };

export default function Notes() {
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    return params.toString() ? `?${params.toString()}` : "";
  }, [search, category]);
  const { data, reload } = useAsyncData<Note[]>(() => api.notes(query), [query]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await api.createNote(form);
    setForm(initialForm);
    await reload();
  };

  return (
    <>
      <PageHeader title="Notes" subtitle="Capture college, placement, DSA, project, and personal notes." />
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="panel space-y-3">
          <input className="input" placeholder="Note title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as NoteCategory })}>
            <option>College</option><option>Placement</option><option>DSA</option><option>Project</option><option>Personal</option>
          </select>
          <textarea className="input min-h-40" placeholder="Write your note" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          <button className="btn-primary w-full">Create Note</button>
        </form>
        <div className="panel">
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <input className="input" placeholder="Search notes" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option><option>College</option><option>Placement</option><option>DSA</option><option>Project</option><option>Personal</option>
            </select>
          </div>
          {data?.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {data.map((note) => (
                <article key={note._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{note.title}</h2>
                      <p className="text-xs text-slate-500">{note.category}</p>
                    </div>
                    <button className="text-sm font-semibold text-red-600" onClick={() => api.deleteNote(note._id).then(reload)}>Delete</button>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{note.content}</p>
                </article>
              ))}
            </div>
          ) : <EmptyState title="No notes yet" description="Create a note or adjust search filters." />}
        </div>
      </section>
    </>
  );
}
