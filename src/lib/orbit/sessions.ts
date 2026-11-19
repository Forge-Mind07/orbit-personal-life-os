import type { ChatMessage } from "./chat";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}
export interface SessionState {
  chatSessions: ChatSession[];
  activeSessionId: string | null;
}
export function blankSession(id: string, now: number): ChatSession {
  return { id, title: "New conversation", createdAt: now, updatedAt: now, messages: [] };
}
/** Idempotent migration. Legacy messages move together, never one session per turn. */
export function migrateSessions(state: { chat?: ChatMessage[]; chatSessions?: ChatSession[]; activeSessionId?: string | null }): SessionState & { chat: ChatMessage[] } {
  const sessions = state.chatSessions ?? [];
  const legacy = state.chat ?? [];
  const migrated = legacy.length && !sessions.some((s) => s.id === "legacy-conversation")
    ? [...sessions, { id: "legacy-conversation", title: "Previous conversation", createdAt: legacy[0]?.ts ?? 0, updatedAt: legacy.at(-1)?.ts ?? 0, messages: legacy }]
    : sessions;
  return { chat: [], chatSessions: migrated, activeSessionId: migrated.some((s) => s.id === state.activeSessionId) ? state.activeSessionId ?? null : migrated[0]?.id ?? null };
}
export function appendMessage<T extends SessionState>(state: T, sessionId: string, message: ChatMessage): T {
  return { ...state, chatSessions: state.chatSessions.map((s) => s.id !== sessionId || s.messages.some((m) => m.id === message.id) ? s : {
    ...s, title: s.messages.length === 0 && message.role === "user" ? message.text.trim().slice(0, 45) : s.title,
    updatedAt: message.ts, messages: [...s.messages, message],
  }) };
}
export function startSession<T extends SessionState>(state: T, id: string, now: number): T {
  const active = state.chatSessions.find((s) => s.id === state.activeSessionId);
  if (active && !active.messages.length) return state;
  return { ...state, activeSessionId: id, chatSessions: [blankSession(id, now), ...state.chatSessions] };
}
export function deleteSession<T extends SessionState>(state: T, id: string): T {
  const chatSessions = state.chatSessions.filter((s) => s.id !== id);
  return { ...state, chatSessions, activeSessionId: state.activeSessionId === id ? [...chatSessions].sort((a, b) => b.updatedAt - a.updatedAt)[0]?.id ?? null : state.activeSessionId };
}
export function renameSession<T extends SessionState>(state: T, id: string, title: string): T {
  if (!title.trim()) return state;
  return { ...state, chatSessions: state.chatSessions.map((s) => s.id === id ? { ...s, title: title.trim().slice(0, 100) } : s) };
}