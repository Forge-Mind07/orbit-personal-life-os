import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Footprints, Laptop, Mic, Orbit, Plus, BookOpen, Wallet, ChartNoAxesCombined, ShieldCheck, PanelLeftOpen, PanelLeftClose, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useOrbit } from "@/lib/orbit/store";
import { QUICK_PROMPTS, demoReply } from "@/lib/orbit/chat";
import { ChatArt } from "@/components/orbit/chat/ChatArt";
import { MessageBubble } from "@/components/orbit/chat/MessageBubble";
import { VoiceMode } from "@/components/orbit/chat/VoiceMode";
import { SessionHistory } from "@/components/orbit/chat/SessionHistory";
import { appendMessage, blankSession, startSession } from "@/lib/orbit/sessions";
import "@/components/orbit/chat/chat.css";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [
    { title: "Orbit Intelligence · ORBIT" },
    { name: "description", content: "Your private, local demo workspace for activity, spending and reading, with an interactive simulated voice preview." },
    { property: "og:title", content: "Orbit Intelligence · ORBIT" },
    { property: "og:description", content: "A thoughtful demo chat workspace grounded in your ORBIT sample data." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Chat,
});
const SUGGESTIONS = [
  { icon: Footprints, title: "Find my rhythm", subtitle: "Your week in movement", prompt: QUICK_PROMPTS[0] ?? "Summarize my week of activity" },
  { icon: Wallet, title: "Make sense of spending", subtitle: "A clearer view of your budget", prompt: QUICK_PROMPTS[1] ?? "How are my expenses this month?" },
  { icon: BookOpen, title: "Something worth reading", subtitle: "Picks from your interests", prompt: QUICK_PROMPTS[2] ?? "What should I read today?" },
  { icon: ChartNoAxesCombined, title: "See the bigger picture", subtitle: "Your sample portfolio", prompt: QUICK_PROMPTS[3] ?? "How is my portfolio doing?" },
];

function Chat() {
  const { state, update, today, allExpenses } = useOrbit();
  const [text, setText] = useState("");
  const [pending, setPending] = useState<string[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const sequence = useRef(0);
  const end = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const closeVoice = useCallback(() => setVoiceOpen(false), []);
  const activeId = state.activeSessionId;
  const msgs = state.chatSessions.find((s) => s.id === activeId)?.messages ?? [];
  const typing = activeId !== null && pending.includes(activeId);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => { setDesktop(media.matches); if (media.matches) setHistoryOpen(false); };
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);
  useEffect(() => {
    if (!msgs.length && !typing) return;
    const log = end.current?.parentElement;
    if (log) log.scrollTop = log.scrollHeight;
  }, [msgs.length, typing, activeId]);
  const respond = (prompt: string, sessionId: string) => {
    if (timers.current.has(sessionId)) return;
    setPending((ids) => [...ids, sessionId]);
    const timer = setTimeout(() => {
      if (timers.current.get(sessionId) !== timer) return;
      const r = demoReply(prompt, { today, goal: state.stepGoal, budget: state.budget, expenses: allExpenses, topics: state.topics, city: state.city });
      sequence.current += 1;
      update((s) => appendMessage(s, sessionId, { id: `a-${Date.now()}-${sequence.current}`, role: "assistant", text: r.text, ts: Date.now(), status: r.error ? "error" : undefined }));
      timers.current.delete(sessionId); setPending((ids) => ids.filter((id) => id !== sessionId));
    }, 1100);
    timers.current.set(sessionId, timer);
  };
  const send = (raw: string) => {
    const t = raw.trim();
    if (!t || (activeId && timers.current.has(activeId))) return;
    const sessionId = activeId ?? `session-${Date.now()}-${++sequence.current}`;
    sequence.current += 1;
    const message = { id: `u-${Date.now()}-${sequence.current}`, role: "user" as const, text: t, ts: Date.now() };
    update((s) => appendMessage(s.chatSessions.some((session) => session.id === sessionId) ? s : { ...s, activeSessionId: sessionId, chatSessions: [blankSession(sessionId, message.ts), ...s.chatSessions] }, sessionId, message));
    setText(""); respond(t, sessionId);
  };
  const newChat = () => {
    setText(""); setHistoryOpen(false);
    const id = `session-${Date.now()}-${++sequence.current}`;
    update((s) => startSession(s, id, Date.now()));
    composer.current?.focus({ preventScroll: true });
  };
  const retry = (id: string) => {
    if (!activeId || timers.current.has(activeId)) return;
    const idx = msgs.findIndex((m) => m.id === id);
    const prev = [...msgs.slice(0, idx)].reverse().find((m) => m.role === "user");
    if (!prev) return;
    update((s) => ({ ...s, chatSessions: s.chatSessions.map((session) => session.id === activeId ? { ...session, messages: session.messages.filter((m) => m.id !== id) } : session) }));
    respond(prev.text, activeId);
  };
  return <div className="orbit-chat-area chat-workspace">
    <header className="chat-topbar">
      <Button variant="ghost" className="chat-icon chat-history-toggle" aria-label={!desktop || state.chatSidebarCollapsed ? "Open conversations" : "Toggle conversations"} title="Conversations" aria-expanded={desktop ? !state.chatSidebarCollapsed : historyOpen} aria-controls={desktop ? "chat-sessions" : "chat-sessions-mobile"} onClick={() => { if (desktop) update((s) => ({ ...s, chatSidebarCollapsed: !s.chatSidebarCollapsed })); else setHistoryOpen(true); }}>{!desktop || state.chatSidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</Button>
      <div className="chat-title-group"><span className="chat-logo"><Orbit /></span><div><h1>Orbit Intelligence</h1><div className="chat-demo-label"><span className="chat-status-dot" />Demo assistant · on this device</div></div></div>
      <div className="chat-toolbar"><Link to="/connections" className="chat-offline"><Laptop />Laptop Agent · offline</Link><Button className="chat-new" onClick={newChat} aria-label="New chat" title="New chat"><Plus /><span className="chat-new-text">New chat</span></Button></div>
    </header>
    <div className="chat-columns" data-history-collapsed={state.chatSidebarCollapsed}>
      <aside id="chat-sessions" className="chat-history" aria-label="Conversation sessions">
        {state.chatSidebarCollapsed ? <Button variant="ghost" className="chat-icon" aria-label="Expand conversations sidebar" title="Expand conversations" onClick={() => update((s) => ({ ...s, chatSidebarCollapsed: false }))}><PanelLeftOpen /></Button> : <SessionHistory onSelect={() => setText("")} onNew={newChat} />}
      </aside>
      <section className="chat-conversation" aria-label="Chat conversation">
        <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
          {msgs.length === 0 ? <div className="chat-empty">
            <div className="chat-empty-art"><ChatArt /></div>
            <div className="chat-eyebrow">A LITTLE SPACE TO THINK</div>
            <h2>Your day. A clearer picture.</h2>
            <p className="chat-empty-sub">Movement, money, and ideas — brought together in one conversation.</p>
            <div className="chat-suggestions">{SUGGESTIONS.map((item) => <Button variant="ghost" className="chat-suggestion" key={item.title} onClick={() => send(item.prompt)}><item.icon /><div><span>{item.title}</span><br /><small>{item.subtitle}</small></div></Button>)}</div>
          </div> : msgs.map((message) => <MessageBubble key={message.id} message={message} onRetry={() => retry(message.id)} busy={typing} />)}
          {typing && <div className="chat-thinking" role="status"><Orbit className="size-5 text-primary" /><span className="chat-thinking-line" aria-hidden="true" />Putting your sample data together…</div>}
          <div ref={end} />
        </div>
        <div className="chat-composer-wrap">
          <form className="chat-composer" onSubmit={(e) => { e.preventDefault(); send(text); }}>
            <label className="sr-only" htmlFor="composer">Message Orbit</label>
            <textarea ref={composer} id="composer" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(text); } }} rows={2} placeholder="What's on your mind?" />
            <div className="chat-composer-controls"><span className="chat-composer-hint"><ShieldCheck className="size-3" />Local demo · not live AI</span><div className="chat-composer-buttons"><Button id="chat-voice-trigger" type="button" variant="ghost" className="chat-icon" disabled={typing} onClick={() => setVoiceOpen(true)} aria-label="Open voice mode" title="Voice preview"><Mic /></Button><Button type="submit" variant="ghost" className="chat-icon chat-send" disabled={!text.trim() || typing} aria-label="Send message"><ArrowUp /></Button></div></div>
          </form>
          {msgs.length > 0 && <div className="chat-followups">{SUGGESTIONS.slice(0, 3).map((item) => <Button variant="ghost" className="chat-chip" key={item.title} disabled={typing} onClick={() => send(item.prompt)}><item.icon />{item.subtitle}</Button>)}</div>}
          <p className="chat-bottom-note">Synthetic data only. Laptop Agent is offline. Voice is a simulated preview.</p>
        </div>
      </section>
    </div>
    <Dialog.Root open={historyOpen} onOpenChange={setHistoryOpen}><Dialog.Portal><Dialog.Overlay className="chat-session-overlay" /><Dialog.Content id="chat-sessions-mobile" className="orbit-chat-area chat-history-drawer"><Dialog.Title className="sr-only">Conversation sessions</Dialog.Title><Dialog.Description className="sr-only">Open or manage a saved conversation</Dialog.Description><Button variant="ghost" className="chat-icon chat-drawer-close" aria-label="Close conversations" onClick={() => setHistoryOpen(false)}><X /></Button><SessionHistory onSelect={() => { setText(""); setHistoryOpen(false); }} onNew={newChat} /></Dialog.Content></Dialog.Portal></Dialog.Root>
    <VoiceMode open={voiceOpen} onClose={closeVoice} onSend={send} />
  </div>;
}
