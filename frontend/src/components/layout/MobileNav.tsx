import React from "react";
import { NavLink } from "react-router-dom";
import { Home, CheckSquare, BookOpen, Code2, FileText } from "lucide-react";

const MOBILE_NAV = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/study", label: "Study", icon: BookOpen },
  { to: "/coding", label: "Coding", icon: Code2 },
  { to: "/notes", label: "Notes", icon: FileText },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav lg:hidden" role="navigation" aria-label="Mobile navigation">
      {MOBILE_NAV.map(({ to, label, icon: Icon, exact }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 transition-all duration-150 ${
              isActive ? "text-brand-400" : "text-slate-500 hover:text-slate-300"
            }`
          }
        >
          <Icon size={20} />
          <span className="text-2xs font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
