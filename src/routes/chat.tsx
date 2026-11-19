import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AlertTriangle, ArrowUp, Check, Copy, Laptop, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useOrbit } from "@/lib/orbit/store";
import { QUICK_PROMPTS, demoReply, type ChatMessage } from "@/lib/orbit/chat";
import { Page } from "@/components/orbit/common/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Chat · ORBIT" },
      { name: "description", content: "A demo assistant that answers from your sample activity, spending and reading data." },
      { property: "og:title", content: "Chat · ORBIT" },
      { property: "og:description", content: "A demo assistant grounded in your sample Orbit data." },
    ],
  }),
  component: Chat,
});

function Bubble({ m, onRetry }: { m: ChatMessage; onRetry: () => void }) {
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();
  const mine = m.role === "user";
  const copy = async () => {
    try { await navigator.clipboard.writeText(m.text); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch { toast.error("Couldn't copy to clipboard"); }
  };
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[86%]", mine ? "" : "flex gap-3")}>
        {!mine && <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary"><Sparkles className="size-4" /></span>}
        <div>
          <div className={cn(
            "whitespace-pre-wrap rounded-3xl px-4 py-3 text-[15px] leading-relaxed",
            mine ? "rounded-br-lg bg-primary text-primary-foreground" : m.status === "error" ? "rounded-tl-lg border border-destructive/40 bg-destructive/10" : "rounded-tl-lg border bg-surface",
          )}>
            {m.status === "error" && <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-destructive"><AlertTriangle className="size-4" /> Couldn't complete</p>}
            {m.text}
          </div>
          {!mine && (
            <div className="mt-1 flex gap-1 pl-1">
              <Button variant="ghost" onClick={copy} className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-xs text-muted-foreground hover:bg-surface-2" aria-label="Copy response">
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? "Copied" : "Copy"}
              </Button>
              {m.status === "error" && (
                <Button variant="ghost" onClick={onRetry} className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-xs text-muted-foreground hover:bg-surface-2"><RotateCcw className="size-3.5" /> Retry</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Chat() {
  const { state, update, today, allExpenses } = useOrbit();
  const reduce = useReducedMotion();
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const msgs = state.chat;

  useEffect(() => { end.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" }); }, [msgs.length, typing, reduce]);

  const respond = (prompt: string) => {
    setTyping(true);
    setTimeout(() => {
      const r = demoReply(prompt, { today, goal: state.stepGoal, budget: state.budget, expenses: allExpenses, topics: state.topics, city: state.city });
      update((s) => ({ ...s, chat: [...s.chat, { id: `a-${Date.now()}`, role: "assistant", text: r.text, ts: Date.now(), status: r.error ? "error" : undefined }] }));
      setTyping(false);
    }, 900 + Math.min(900, prompt.length * 12));
  };
  const send = (raw: string) => {
    const t = raw.trim();
    if (!t || typing) return;
    update((s) => ({ ...s, chat: [...s.chat, { id: `u-${Date.now()}`, role: "user", text: t, ts: Date.now() }] }));
    setText("");
    respond(t);
  };
  const retry = (id: string) => {
    const idx = msgs.findIndex((m) => m.id === id);
    const prev = [...msgs.slice(0, idx)].reverse().find((m) => m.role === "user");
    update((s) => ({ ...s, chat: s.chat.filter((m) => m.id !== id) }));
    if (prev) respond(prev.text);
  };

  return (
    <Page className="flex min-h-[calc(100dvh-10rem)] max-w-3xl flex-col pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary"><Sparkles className="size-3.5" /> Demo assistant</span>
        <Link to="/connections" className="inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold text-muted-foreground hover:text-foreground">
          <span className="size-1.5 rounded-full bg-muted-foreground" /> Laptop agent • offline
        </Link>
        {msgs.length > 0 && (
          <Button variant="ghost" onClick={() => update((s) => ({ ...s, chat: [] }))} className="ml-auto inline-flex min-h-8 items-center gap-1 rounded-full px-3 text-xs text-muted-foreground hover:bg-surface-2"><Trash2 className="size-3.5" /> Clear</Button>
        )}
      </div>

      <div className="flex-1 py-6" aria-live="polite">
        {msgs.length === 0 ? (
          <div className="flex flex-col items-center pt-6 text-center">
            <div className="grid size-16 place-items-center rounded-3xl bg-primary text-on-accent shadow-float"><Sparkles className="size-7" /></div>
            <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">What would you like to know?</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">Answers come from your demo data on this device. No AI service is called.</p>
            <Link to="/connections" className="card-orbit mt-6 flex w-full max-w-md items-center gap-3 p-4 text-left">
              <span className="grid size-11 place-items-center rounded-2xl bg-surface-2"><Laptop className="size-5 text-muted-foreground" /></span>
              <div className="flex-1"><p className="font-semibold">Laptop agent</p><p className="text-xs text-muted-foreground">Offline — not connected</p></div>
              <span className="text-xs font-semibold text-primary">Set up</span>
            </Link>
            <div className="mt-6 grid w-full max-w-md gap-2 sm:grid-cols-2">
              {QUICK_PROMPTS.map((p) => (
                <Button variant="ghost" key={p} onClick={() => send(p)} className="h-auto min-h-12 whitespace-normal rounded-2xl border bg-surface px-4 py-3 text-left text-sm font-semibold hover:border-primary/50">{p}</Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {msgs.map((m) => <Bubble key={m.id} m={m} onRetry={() => retry(m.id)} />)}
            {typing && (
              <div className="flex gap-3" aria-label="Orbit is typing">
                <span className="grid size-8 place-items-center rounded-xl bg-primary/15 text-primary"><Sparkles className="size-4" /></span>
                <div className="flex items-center gap-1 rounded-3xl rounded-tl-lg border bg-surface px-4 py-4">
                  {[0, 1, 2].map((i) => <span key={i} className="animate-typing size-2 rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            )}
            {!typing && (
              <div className="no-scrollbar flex gap-2 overflow-x-auto pt-2">
                {QUICK_PROMPTS.map((p) => <Button variant="ghost" key={p} onClick={() => send(p)} className="min-h-10 shrink-0 rounded-full border px-3 text-xs font-semibold text-muted-foreground hover:text-foreground">{p}</Button>)}
              </div>
            )}
          </div>
        )}
        <div ref={end} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="sticky bottom-[calc(6.25rem+env(safe-area-inset-bottom))] z-10 lg:bottom-6">
        <div className="glass shadow-float flex items-end gap-2 rounded-[24px] border p-2">
          <label htmlFor="composer" className="sr-only">Message Orbit</label>
          <textarea
            id="composer"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(text); } }}
            rows={1}
            placeholder="Ask Orbit anything…"
            className="max-h-32 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <Button variant="ghost" type="submit" disabled={!text.trim() || typing} className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground disabled:opacity-30" aria-label="Send message"><ArrowUp className="size-5" /></Button>
        </div>
      </form>
    </Page>
  );
}
