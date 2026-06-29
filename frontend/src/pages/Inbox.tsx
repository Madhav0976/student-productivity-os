import PageHeader from "../components/PageHeader";
import EmptyState from "../components/ui/EmptyState";

export default function Inbox() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Inbox" subtitle="Capture ideas, tasks, and notes here before organizing them." />
      <EmptyState type="tasks" action={{ label: "Add item", onClick: () => {} }} />
    </div>
  );
}
