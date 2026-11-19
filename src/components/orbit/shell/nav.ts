import { Bell, Home, HeartPulse, MessageCircle, Newspaper, Plug, Settings, Wallet, type LucideIcon } from "lucide-react";

export type NavPath = "/" | "/health" | "/finance" | "/feed" | "/chat" | "/connections" | "/notifications" | "/settings";
export interface NavItem { to: NavPath; label: string; icon: LucideIcon; tone: string }

export const PRIMARY_NAV: NavItem[] = [
  { to: "/", label: "Home", icon: Home, tone: "var(--primary)" },
  { to: "/health", label: "Health", icon: HeartPulse, tone: "var(--health)" },
  { to: "/finance", label: "Finance", icon: Wallet, tone: "var(--finance)" },
  { to: "/feed", label: "Feed", icon: Newspaper, tone: "var(--feed)" },
  { to: "/chat", label: "Chat", icon: MessageCircle, tone: "var(--primary)" },
];
export const SECONDARY_NAV: NavItem[] = [
  { to: "/connections", label: "Connections", icon: Plug, tone: "var(--muted-foreground)" },
  { to: "/notifications", label: "Notifications", icon: Bell, tone: "var(--muted-foreground)" },
  { to: "/settings", label: "Settings", icon: Settings, tone: "var(--muted-foreground)" },
];

export function titleFor(path: string): string {
  if (path.startsWith("/article/")) return "Reader";
  const all = [...PRIMARY_NAV, ...SECONDARY_NAV];
  return all.find((n) => n.to === path)?.label ?? "Orbit";
}
export const isActive = (to: string, path: string) => (to === "/" ? path === "/" : path.startsWith(to));
