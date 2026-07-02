import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTaskStore } from "../store/taskStore";
import { Task, Priority } from "../types";
import { isToday, parseISO } from "date-fns";
import { isOverdue } from "../utils/dates";
import { useDebounce } from "../hooks/useDebounce";
import toast from "react-hot-toast";

import TaskHeader from "../components/tasks/TaskHeader";
import TaskToolbar from "../components/tasks/TaskToolbar";
import TaskQuickAdd from "../components/tasks/TaskQuickAdd";
import TaskProgress from "../components/tasks/TaskProgress";
import TaskGroup from "../components/tasks/TaskGroup";
import TaskDetail from "../components/tasks/TaskDetail";
import TaskEditor from "../components/tasks/TaskEditor";
import BulkActionsBar from "../components/tasks/BulkActionsBar";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonRow } from "../components/ui/Skeleton";

export default function Tasks() {
  const { tasks, loading, fetch, create, update, remove, toggle, filter, searchQuery, setSearch } =
    useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const debouncedSearch = useDebounce(searchQuery, 250);

  // Bulk mode: any selected
  const bulkMode = selectedIds.size > 0;

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetch();
  }, []);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT";

      if (e.key === "Escape") {
        if (selectedTask) { setSelectedTask(null); setIsEditing(false); return; }
        if (quickAddOpen) { setQuickAddOpen(false); return; }
        if (bulkMode) { setSelectedIds(new Set()); return; }
      }

      if (isInput) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setQuickAddOpen(true);
      }

      if (e.key === "/") {
        e.preventDefault();
        const searchEl = document.querySelector<HTMLInputElement>("[data-search-input]");
        searchEl?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedTask, quickAddOpen, bulkMode]);

  // ── Filtered tasks ──────────────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    switch (filter) {
      case "today":
        result = result.filter((t) => isToday(parseISO(t.dueDate)));
        break;
      case "overdue":
        result = result.filter((t) => isOverdue(t.dueDate) && t.status !== "Completed");
        break;
      case "high":
        result = result.filter((t) => t.priority === "High");
        break;
      case "completed":
        result = result.filter((t) => t.status === "Completed");
        break;
    }

    return result;
  }, [tasks, filter, debouncedSearch]);

  // ── Grouping ────────────────────────────────────────────────────────────────
  // ── Grouping ────────────────────────────────────────────────────────────────
  const { overdueTasks, todayTasks, upcomingTasks, completedTasks } = useMemo(() => {
    const overdueTasks: Task[] = [];
    const todayTasks: Task[] = [];
    const upcomingTasks: Task[] = [];
    const completedTasks: Task[] = [];

    filteredTasks.forEach((t) => {
      if (t.status === "Completed") {
        completedTasks.push(t);
      } else {
        if (isOverdue(t.dueDate)) {
          overdueTasks.push(t);
        } else if (isToday(parseISO(t.dueDate))) {
          todayTasks.push(t);
        } else {
          upcomingTasks.push(t);
        }
      }
    });

    return { overdueTasks, todayTasks, upcomingTasks, completedTasks };
  }, [filteredTasks]);

  // ── Summary stats ───────────────────────────────────────────────────────────
  const { total, completed, pending, overallOverdue, completedToday, dueToday, highPriority } = useMemo(() => {
    let completed = 0, overallOverdue = 0, completedToday = 0, dueToday = 0, highPriority = 0;
    tasks.forEach(t => {
      if (t.status === "Completed") {
        completed++;
        if (isToday(parseISO(t.updatedAt || t.dueDate))) completedToday++;
      } else {
        if (isOverdue(t.dueDate)) overallOverdue++;
        if (isToday(parseISO(t.dueDate))) dueToday++;
        if (t.priority === "High") highPriority++;
      }
    });
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
      overallOverdue,
      completedToday,
      dueToday,
      highPriority
    };
  }, [tasks]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAdd = async (taskData: Partial<Task>) => {
    try {
      await create(taskData);
      toast.success("Task added!");
    } catch {
      toast.error("Failed to add task");
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await remove(id);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success("Task deleted");
      } catch {
        toast.error("Failed to delete");
      }
    },
    [remove]
  );

  const handleSelectToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ── Bulk actions ────────────────────────────────────────────────────────────
  const handleBulkComplete = async () => {
    const ids = Array.from(selectedIds);
    await Promise.all(
      ids.map((id) => {
        const task = tasks.find((t) => t._id === id);
        if (task && task.status !== "Completed") return toggle(id);
        return Promise.resolve();
      })
    );
    toast.success(`Completed ${ids.length} task${ids.length > 1 ? "s" : ""}`);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (!confirm(`Delete ${ids.length} selected task${ids.length > 1 ? "s" : ""}?`)) return;
    await Promise.all(ids.map(remove));
    toast.success(`Deleted ${ids.length} task${ids.length > 1 ? "s" : ""}`);
    setSelectedIds(new Set());
  };

  const handleBulkPriority = async (priority: Priority) => {
    const ids = Array.from(selectedIds);
    await Promise.all(ids.map((id) => update(id, { priority })));
    toast.success(`Priority updated for ${ids.length} task${ids.length > 1 ? "s" : ""}`);
    setSelectedIds(new Set());
  };

  const hasAnyTasks =
    overdueTasks.length > 0 ||
    todayTasks.length > 0 ||
    upcomingTasks.length > 0 ||
    completedTasks.length > 0;

  const isFiltered = !!searchQuery || filter !== "all";

  if (selectedTask) {
    if (isEditing) {
      return (
        <TaskEditor
          task={selectedTask}
          onCancel={() => setIsEditing(false)}
          onSave={update}
        />
      );
    }
    return (
      <TaskDetail
        task={selectedTask}
        onBack={() => { setSelectedTask(null); setIsEditing(false); }}
        onEdit={() => setIsEditing(true)}
        onDelete={async (id) => { await remove(id); setSelectedTask(null); }}
        onToggleStatus={async () => {
          await toggle(selectedTask._id);
          // After toggle(), the store has updated — re-read directly
          const updated = tasks.find(t => t._id === selectedTask._id);
          if (updated) setSelectedTask({ ...updated });
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-24">
      {/* Header */}
      <TaskHeader
        total={total}
        completedToday={completedToday}
        dueToday={dueToday}
        highPriority={highPriority}
        onQuickAdd={() => setQuickAddOpen(true)}
      />

      {/* Toolbar */}
      <TaskToolbar />

      {/* Progress */}
      {total > 0 && (
        <TaskProgress
          total={total}
          completed={completed}
          pending={pending}
          overdue={overallOverdue}
        />
      )}

      {/* Main card */}
      <div className="card p-0 overflow-hidden dark:!bg-slate-900/50 dark:!border-slate-800 shadow-sm border border-slate-200">
        {/* Quick Add */}
        <TaskQuickAdd
          isExpanded={quickAddOpen}
          onExpand={() => setQuickAddOpen(true)}
          onCollapse={() => setQuickAddOpen(false)}
          onAdd={handleAdd}
        />

        <div className="p-4 md:p-6 bg-slate-50/50 dark:bg-black/10 min-h-[300px]">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : !hasAnyTasks ? (
            <EmptyState
              type={isFiltered ? "search" : "tasks"}
              action={
                !isFiltered
                  ? {
                      label: "Add your first task",
                      onClick: () => setQuickAddOpen(true),
                    }
                  : undefined
              }
            />
          ) : (
            <div>
              <TaskGroup
                title="Overdue"
                tasks={overdueTasks}
                variant="overdue"
                defaultExpanded={true}
                onSelect={setSelectedTask}
                onToggle={toggle}
                onDelete={handleDelete}
                selectedIds={selectedIds}
                onSelectToggle={handleSelectToggle}
                bulkMode={bulkMode}
              />
              <TaskGroup
                title="Today"
                tasks={todayTasks}
                variant="today"
                defaultExpanded={true}
                onSelect={setSelectedTask}
                onToggle={toggle}
                onDelete={handleDelete}
                selectedIds={selectedIds}
                onSelectToggle={handleSelectToggle}
                bulkMode={bulkMode}
              />
              <TaskGroup
                title="Upcoming"
                tasks={upcomingTasks}
                variant="upcoming"
                defaultExpanded={true}
                onSelect={setSelectedTask}
                onToggle={toggle}
                onDelete={handleDelete}
                selectedIds={selectedIds}
                onSelectToggle={handleSelectToggle}
                bulkMode={bulkMode}
              />
              <TaskGroup
                title="Completed"
                tasks={completedTasks}
                variant="completed"
                defaultExpanded={false}
                onSelect={setSelectedTask}
                onToggle={toggle}
                onDelete={handleDelete}
                selectedIds={selectedIds}
                onSelectToggle={handleSelectToggle}
                bulkMode={bulkMode}
              />
            </div>
          )}
        </div>
      </div>



      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedIds.size}
        onComplete={handleBulkComplete}
        onDelete={handleBulkDelete}
        onChangePriority={handleBulkPriority}
        onClear={() => setSelectedIds(new Set())}
      />
    </div>
  );
}
