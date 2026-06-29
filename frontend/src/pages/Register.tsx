import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { GraduationCap } from "lucide-react";

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
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-4 py-8">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center shadow-glow mb-4">
            <GraduationCap size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white text-center tracking-tight">Create your workspace</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center">Set up your student operating system.</p>
        </div>

        <Card className="!bg-white dark:!bg-slate-900/50 dark:!border-slate-800">
          <form onSubmit={submit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => update("name", e.target.value)} required />
              <Input label="Email" type="email" placeholder="name@university.edu" value={form.email} onChange={(e) => update("email", e.target.value)} required />
              <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => update("password", e.target.value)} required />
              <Input label="College / University" placeholder="Stanford University" value={form.college} onChange={(e) => update("college", e.target.value)} required />
              <Input label="Branch / Major" placeholder="Computer Science" value={form.branch} onChange={(e) => update("branch", e.target.value)} required />
              <Input label="Graduation Year" type="number" placeholder="2028" value={form.graduationYear} onChange={(e) => update("graduationYear", Number(e.target.value))} required />
            </div>
            
            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
                Create Account
              </Button>
            </div>
          </form>
        </Card>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center">
          Already registered? <Link className="font-semibold text-brand-500 hover:text-brand-400 transition-colors" to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
