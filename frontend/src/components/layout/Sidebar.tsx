import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Inbox, CheckSquare, BookOpen, Target, Code2,
  Briefcase, FileText, Calendar, BarChart3, User, Settings,
  Archive, ChevronLeft, Zap, GraduationCap, LogOut
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/study", label: "Study Planner", icon: BookOpen },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/coding", label: "Coding", icon: Code2 },
  { to: "/placements", label: "Placements", icon: Briefcase },
  { to: "/notes", label: "Notes", icon: FileText },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

const BOTTOM_ITEMS = [
  { to: "/archive", label: "Archive", icon: Archive },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex flex-col transition-all duration-300 border-r border-[var(--border)] bg-[var(--surface)]
        ${sidebarCollapsed ? "w-[60px]" : "w-[240px]"}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-[var(--border)] min-h-[57px]`}>
        <div className="flex-shrink-0 w-8 h-8 gradient-brand rounded-lg flex items-center justify-center shadow-glow-sm">
          <GraduationCap size={16} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="animate-fade-in overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">AcademOS</p>
            <p className="text-2xs text-slate-500 truncate">{user?.college || "Student"}</p>
          </div>
        )}
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="ml-auto btn-icon btn-ghost opacity-50 hover:opacity-100"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Quick capture shortcut hint */}
      {!sidebarCollapsed && (
        <div className="px-3 py-2">
          <button
            onClick={() => useUIStore.getState().openQuickCapture()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-brand/5 border border-brand/10 
                       text-slate-500 text-xs hover:text-slate-900 hover:bg-brand/10 dark:text-slate-400 dark:hover:text-white dark:bg-brand-600/10 dark:border-brand-600/20 dark:hover:bg-brand-600/15 transition-all duration-150"
          >
            <Zap size={12} className="text-brand-500 dark:text-brand-400" />
            <span>Quick capture</span>
            <kbd className="ml-auto text-2xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-1 py-0.5">Q</kbd>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto no-scrollbar">
        {!sidebarCollapsed && (
          <p className="section-title px-3 pb-2 pt-1">Workspace</p>
        )}
        <div className="space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `nav-item group ${isActive ? "active" : ""} ${sidebarCollapsed ? "justify-center" : ""}`
              }
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </div>

        {!sidebarCollapsed && (
          <p className="section-title px-3 pb-2 pt-4">Account</p>
        )}
        {sidebarCollapsed && <div className="divider mx-2" />}
        <div className="space-y-0.5 mt-1">
          {BOTTOM_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""} ${sidebarCollapsed ? "justify-center" : ""}`
              }
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className={`nav-item !text-red-500 hover:!bg-red-50 dark:!text-red-400 dark:hover:!bg-red-500/10 w-full text-left ${sidebarCollapsed ? "justify-center" : ""}`}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span className="truncate">Logout</span>}
          </button>
        </div>
      </nav>

      {/* User footer */}
      {!sidebarCollapsed && user && (
        <div
          className="p-3 border-t border-[var(--border)] cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
          onClick={() => navigate("/profile")}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-2xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Expand button when collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="m-2 btn-icon btn-ghost border border-[var(--border)] mx-auto"
          aria-label="Expand sidebar"
        >
          <ChevronLeft size={16} className="rotate-180" />
        </button>
      )}
    </aside>
  );
}
