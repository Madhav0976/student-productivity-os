import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import MobileNav from "../components/layout/MobileNav";
import CommandPalette from "../components/shared/CommandPalette";
import QuickCapture from "../components/shared/QuickCapture";
import { useUIStore } from "../store/uiStore";
import { Plus } from "lucide-react";

export default function AppLayout() {
  const { sidebarCollapsed, openQuickCapture } = useUIStore();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-[60px]" : "lg:pl-[240px]"
        }`}
      >
        <TopBar />
        
        <main className="px-4 sm:px-6 py-6 pb-20 lg:pb-6 max-w-[1400px] mx-auto page-enter">
          <Outlet />
        </main>
      </div>

      {/* Mobile nav */}
      <MobileNav />

      {/* Floating action button (mobile) */}
      <button
        className="fab lg:hidden"
        onClick={openQuickCapture}
        aria-label="Quick capture"
        id="fab-quick-capture"
      >
        <Plus size={22} />
      </button>

      {/* Global overlays */}
      <CommandPalette />
      <QuickCapture />

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800",
          style: {
            border: "1px solid var(--border)",
            borderRadius: "10px",
            fontSize: "13px",
            padding: "10px 14px",
          },
          success: {
            iconTheme: { primary: "#10B981", secondary: "#12121A" },
          },
          error: {
            iconTheme: { primary: "#EF4444", secondary: "#12121A" },
          },
          duration: 3000,
        }}
      />
    </div>
  );
}
