import PageHeader from "../components/PageHeader";
import Card from "../components/ui/Card";
import { useUIStore } from "../store/uiStore";

export default function Settings() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <div className="animate-fade-in">
      <PageHeader title="Settings" subtitle="Manage your preferences and account." />
      <div className="max-w-2xl space-y-6">
        <Card title="Appearance" subtitle="Customize the look of your workspace.">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-200">Theme</p>
              <p className="text-sm text-slate-500">Toggle between light and dark mode.</p>
            </div>
            <button 
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-medium transition-colors dark:text-slate-200"
            >
              {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
