import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const initialForm = {
  name: "",
  email: "",
  password: "",
  college: "",
  branch: "",
  graduationYear: new Date().getFullYear() + 4
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  const update = (key: keyof typeof form, value: string | number) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-4 py-8 dark:bg-slate-950">
      <form onSubmit={submit} className="panel w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Create your workspace</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Set up your student operating system.</p>
        {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
          <input className="input" placeholder="College" value={form.college} onChange={(e) => update("college", e.target.value)} required />
          <input className="input" placeholder="Branch" value={form.branch} onChange={(e) => update("branch", e.target.value)} required />
          <input className="input" type="number" placeholder="Graduation Year" value={form.graduationYear} onChange={(e) => update("graduationYear", Number(e.target.value))} required />
        </div>
        <button className="btn-primary mt-6 w-full" disabled={isLoading}>{isLoading ? "Creating..." : "Register"}</button>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Already registered? <Link className="font-semibold text-brand" to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
