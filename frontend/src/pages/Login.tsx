import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

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
    <main className="grid min-h-screen place-items-center bg-mist px-4 dark:bg-slate-950">
      <form onSubmit={submit} className="panel w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Student Productivity OS</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to plan, track, and ship your semester.</p>
        {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 space-y-4">
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn-primary w-full" disabled={isLoading}>{isLoading ? "Signing in..." : "Login"}</button>
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          New here? <Link className="font-semibold text-brand" to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
