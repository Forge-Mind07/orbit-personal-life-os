import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Footprints, Laptop, Mic, Orbit, Plus, BookOpen, Wallet, ChartNoAxesCombined, MessageSquare, ShieldCheck } from "lucide-react";
import { useOrbit } from "@/lib/orbit/store";
import { QUICK_PROMPTS, demoReply } from "@/lib/orbit/chat";
import { ChatArt } from "@/components/orbit/chat/ChatArt";
import { MessageBubble } from "@/components/orbit/chat/MessageBubble";
import { VoiceMode } from "@/components/orbit/chat/VoiceMode";
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
  const [typing, setTyping] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  const sequence = useRef(0);
  const end = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const closeVoice = useCallback(() => setVoiceOpen(false), []);
  const msgs = state.chat;
  const history = msgs.filter((m) => m.role === "user");
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!msgs.length && !typing) return;
    end.current?.scrollIntoView({ behavior: "auto", block: "nearest" });
  }, [msgs.length, typing]);
  const respond = (prompt: string) => {
    busy.current = true; setTyping(true);
    timer.current = setTimeout(() => {
      const r = demoReply(prompt, { today, goal: state.stepGoal, budget: state.budget, expenses: allExpenses, topics: state.topics, city: state.city });
      sequence.current += 1;
      update((s) => ({ ...s, chat: [...s.chat, { id: `a-${Date.now()}-${sequence.current}`, role: "assistant", text: r.text, ts: Date.now(), status: r.error ? "error" : undefined }] }));
      busy.current = false; setTyping(false); timer.current = null;
    }, 1100);
  };
  const send = (raw: string) => {
    const t = raw.trim();
    if (!t || busy.current) return;
    sequence.current += 1;
    update((s) => ({ ...s, chat: [...s.chat, { id: `u-${Date.now()}-${sequence.current}`, role: "user", text: t, ts: Date.now() }] }));
    setText(""); respond(t);
  };
  const newChat = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null; busy.current = false; setTyping(false); setText("");
    update((s) => ({ ...s, chat: [] }));
    composer.current?.focus({ preventScroll: true });
  };
  const retry = (id: string) => {
    if (busy.current) return;
    const idx = msgs.findIndex((m) => m.id === id);
    const prev = [...msgs.slice(0, idx)].reverse().find((m) => m.role === "user");
    if (!prev) return;
    update((s) => ({ ...s, chat: s.chat.filter((m) => m.id !== id) }));
    respond(prev.text);
  };
  return <div className="orbit-chat-area chat-workspace">
    <header className="chat-topbar">
      <div className="chat-title-group"><span className="chat-logo"><Orbit /></span><div><h1>Orbit Intelligence</h1><div className="chat-demo-label"><span className="chat-status-dot" />Demo assistant · on this device</div></div></div>
      <div className="chat-toolbar"><Link to="/connections" className="chat-offline"><Laptop />Laptop Agent · offline</Link><Button className="chat-new" onClick={newChat} aria-label="New chat — clear conversation" title="New chat — clears this conversation"><Plus /><span className="chat-new-text">New chat</span></Button></div>
    </header>
    <div className="chat-columns">
      <aside className="chat-history" aria-label="Current conversation history">
        <div className="chat-history-label">IN THIS CONVERSATION</div>
        {history.length ? history.map((message) => <Button key={message.id} variant="ghost" className="chat-history-item" onClick={() => document.getElementById(`message-${message.id}`)?.scrollIntoView({ behavior: "auto", block: "center" })}><MessageSquare />{message.text.length > 65 ? `${message.text.slice(0, 65)}…` : message.text}</Button>) : <p className="chat-history-empty">Your conversation will appear here.</p>}
        <div className="chat-history-label">QUICK SHORTCUTS</div>
        {SUGGESTIONS.slice(0, 3).map((item) => <Button variant="ghost" className="chat-history-item" key={item.title} disabled={typing} onClick={() => send(item.prompt)}><item.icon />{item.subtitle}</Button>)}
        <div className="chat-history-footer"><ShieldCheck className="size-4 mb-2" />One conversation, saved on this device. New chat clears it. No AI service or external tool is connected.</div>
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
    <VoiceMode open={voiceOpen} onClose={closeVoice} onSend={send} />
  </div>;
}
