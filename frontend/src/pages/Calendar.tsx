import PageHeader from "../components/PageHeader";
import EmptyState from "../components/ui/EmptyState";

export default function Calendar() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Calendar" subtitle="View your schedule and deadlines." />
      <EmptyState type="study" action={{ label: "Add event", onClick: () => {} }} />
    </div>
  );
}
