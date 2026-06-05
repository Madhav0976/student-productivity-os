import { BarChart3, BookOpen, Briefcase, CheckSquare, Code2, FileText, LayoutDashboard, LogOut, Moon, Sun, Target, User } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/study", label: "Study", icon: BookOpen },
  { to: "/placements", label: "Placements", icon: Briefcase },
  { to: "/coding", label: "Coding", icon: Code2 },
  { to: "/notes", label: "Notes", icon: FileText },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User }
];

export default function AppLayout() {
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark(document.documentElement.classList.contains("dark"));
  };

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-mist text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="mb-8">
          <p className="text-lg font-bold text-slate-950 dark:text-white">Student Productivity OS</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user?.college}</p>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-brand dark:bg-blue-950"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
              <p className="font-semibold text-slate-950 dark:text-white">{user?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary !px-3" onClick={toggleTheme} aria-label="Toggle theme">
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="btn-secondary !px-3" onClick={signOut} aria-label="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to} className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-slate-800">
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
