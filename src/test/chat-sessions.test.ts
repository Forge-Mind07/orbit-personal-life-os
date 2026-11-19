import { describe, expect, it } from "vitest";
import { appendMessage, blankSession, deleteSession, migrateSessions, renameSession, startSession } from "@/lib/orbit/sessions";
import type { ChatMessage } from "@/lib/orbit/chat";
const msg = (id: string, role: ChatMessage["role"] = "user"): ChatMessage => ({ id, role, text: "How are my expenses this month?", ts: 10 });
describe("conversation sessions", () => {
  it("manual rename survives later replies and changes only the selected title", () => {
    const s = { chatSessions: [blankSession("one", 1), blankSession("two", 2)], activeSessionId: "one" };
    const renamed = renameSession(appendMessage(s, "one", msg("a")), "one", "Daily check-in");
    const next = appendMessage(renamed, "one", msg("b", "assistant"));
    expect(next.chatSessions[0]?.title).toBe("Daily check-in");
    expect(next.chatSessions[1]?.title).toBe("New conversation");
  });
  it("three user messages remain in one session with a first-message title", () => {
    let s = { chatSessions: [blankSession("one", 1)], activeSessionId: "one" };
    for (const id of ["a", "b", "c"]) s = appendMessage(s, "one", msg(id));
    expect(s.chatSessions).toHaveLength(1);
    expect(s.chatSessions[0]?.messages).toHaveLength(3);
    expect(s.chatSessions[0]?.title).toBe("How are my expenses this month?");
  });
  it("New Chat preserves the old turns and reuses the active blank", () => {
    const original = appendMessage({ chatSessions: [blankSession("one", 1)], activeSessionId: "one" }, "one", msg("a"));
    const s = startSession(original, "two", 20);
    expect(s.chatSessions).toHaveLength(2);
    expect(s.chatSessions.find((c) => c.id === "one")?.messages).toEqual([msg("a")]);
    expect(startSession(s, "three", 30)).toEqual(s);
  });
  it("migration is lossless and idempotent and preserves other fields", () => {
    const old = { chat: [msg("a"), msg("b", "assistant")], budget: 15000, stepGoal: 10000, paceOutfit: "berry" };
    const s = { ...old, ...migrateSessions(old) };
    expect(s.chatSessions).toHaveLength(1);
    expect(s.chatSessions[0]?.title).toBe("Previous conversation");
    expect(s.chatSessions[0]?.messages).toEqual(old.chat);
    expect(s.chat).toEqual([]);
    expect(migrateSessions(s).chatSessions).toEqual(s.chatSessions);
    expect(s.budget).toBe(15000); expect(s.stepGoal).toBe(10000); expect(s.paceOutfit).toBe("berry");
  });
  it("a delayed reply targets its originating session, not the selected one", () => {
    const s = { chatSessions: [blankSession("one", 1), blankSession("two", 2)], activeSessionId: "two" };
    const next = appendMessage(s, "one", msg("reply", "assistant"));
    expect(next.chatSessions[0]?.messages).toEqual([msg("reply", "assistant")]);
    expect(next.chatSessions[1]?.messages).toEqual([]);
    expect(appendMessage(next, "one", msg("reply", "assistant"))).toEqual(next);
  });
  it("delete removes only the chosen session and does not resurrect it on reply", () => {
    const s = { chatSessions: [blankSession("one", 1), blankSession("two", 2)], activeSessionId: "one", budget: 15000 };
    const next = deleteSession(s, "one");
    expect(next.activeSessionId).toBe("two"); expect(next.budget).toBe(15000);
    expect(appendMessage(next, "one", msg("late"))).toEqual(next);
  });
  it("automatic titles are capped at 45 characters", () => {
    const next = appendMessage({ chatSessions: [blankSession("one", 1)], activeSessionId: "one" }, "one", { ...msg("a"), text: "a".repeat(80) });
    expect(next.chatSessions[0]?.title).toBe("a".repeat(45));
  });
});
