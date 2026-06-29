import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { GraduationCap } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center shadow-glow mb-4">
            <GraduationCap size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white text-center tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center">Sign in to AcademOS to continue your journey.</p>
        </div>

        <Card className="!bg-white dark:!bg-slate-900/50 dark:!border-slate-800">
          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            
            <Input
              type="email"
              label="Email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
                Sign In
              </Button>
            </div>
          </form>
        </Card>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center">
          New here? <Link className="font-semibold text-brand-500 hover:text-brand-400 transition-colors" to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
