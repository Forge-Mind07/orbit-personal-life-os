import type { DayStatus } from "@/lib/orbit/activity";

export const STATUS_LABEL: Record<DayStatus, string> = {
  completed: "Goal reached",
  missed: "Below goal",
  rest: "Planned rest",
  nodata: "No data",
  today: "In progress",
  future: "Upcoming",
};
export const STATUS_COLOR: Record<DayStatus, string> = {
  completed: "var(--health)",
  missed: "var(--finance)",
  rest: "var(--rest)",
  nodata: "var(--missing)",
  today: "var(--primary)",
  future: "var(--track)",
};
