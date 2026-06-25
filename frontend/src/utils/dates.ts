import { format, formatDistance, isToday, isTomorrow, isThisWeek, isPast, parseISO } from "date-fns";

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "MMM d, yyyy");
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isThisWeek(d)) return format(d, "EEE");
  return format(d, "MMM d");
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d 'at' h:mm a");
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistance(d, new Date(), { addSuffix: true });
}

export function isOverdue(date: string | Date): boolean {
  const d = typeof date === "string" ? parseISO(date) : date;
  return isPast(d) && !isToday(d);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getDayName(): string {
  return format(new Date(), "EEEE");
}

export function getFullDate(): string {
  return format(new Date(), "MMMM d, yyyy");
}

export function getDaysUntil(date: string | Date): number {
  const d = typeof date === "string" ? parseISO(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return format(d, "yyyy-MM-dd");
  });
}

export function getLast52Weeks(): string[][] {
  const weeks: string[][] = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  for (let w = 51; w >= 0; w--) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() - w * 7 + d);
      week.push(format(date, "yyyy-MM-dd"));
    }
    weeks.push(week);
  }
  return weeks;
}
