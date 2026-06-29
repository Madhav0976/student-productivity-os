import PageHeader from "../components/PageHeader";
import EmptyState from "../components/ui/EmptyState";

export default function Archive() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Archive" subtitle="Past completed tasks, goals, and notes." />
      <EmptyState type="notes" action={{ label: "Go to Home", onClick: () => {} }} />
    </div>
  );
}
