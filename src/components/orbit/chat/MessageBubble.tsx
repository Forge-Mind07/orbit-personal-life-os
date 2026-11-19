import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Copy, RotateCcw, Orbit, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/lib/orbit/chat";

function CopyButton({ text, code = false }: { text: string; code?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(code ? "Code copied" : "Response copied");
    } catch { toast.error("Couldn't copy to clipboard"); }
  };
  return <Button variant="ghost" className="chat-copy" onClick={copy} aria-label={code ? "Copy code" : "Copy response"}>{copied ? <Check /> : <Copy />}{code ? (copied ? "COPIED" : "COPY CODE") : (copied ? "Copied" : "Copy")}</Button>;
}

function RichText({ text }: { text: string }) {
  return <>{text.split(/(```[\s\S]*?```)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith("```")) {
      const body = part.slice(3, -3);
      const newline = body.indexOf("\n");
      const language = newline >= 0 ? body.slice(0, newline).trim() : "text";
      const code = newline >= 0 ? body.slice(newline + 1).trimEnd() : body;
      return <div className="chat-code" key={i}><header><span>{language || "text"}</span><CopyButton text={code} code /></header><pre><code>{code}</code></pre></div>;
    }
    return part.split("\n\n").filter(Boolean).map((paragraph, j) => {
      const lines = paragraph.split("\n");
      const bullets = lines.filter((line) => line.startsWith("• "));
      if (bullets.length) return <div className="chat-result" key={`${i}-${j}`}><div className="chat-result-label">ORBIT / SAMPLE DATA</div>{lines.filter((line) => !line.startsWith("• ")).map((line, k) => <p key={k} className="chat-result-title">{line}</p>)}<ul>{bullets.map((line, k) => <li key={k}><span className="chat-result-marker" />{line.slice(2)}</li>)}</ul></div>;
      return <p key={`${i}-${j}`} className="chat-paragraph">{paragraph}</p>;
    });
  })}</>;
}

export function MessageBubble({ message, onRetry, busy }: { message: ChatMessage; onRetry: () => void; busy: boolean }) {
  const reduce = useReducedMotion();
  const mine = message.role === "user";
  return <motion.article id={`message-${message.id}`} className={`chat-message ${mine ? "chat-mine" : "chat-assistant"}`} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}>
    {!mine && <div className="chat-avatar" aria-hidden="true"><Orbit /></div>}
    <div className="chat-message-content">
      <div className="chat-message-name">{mine ? "You" : "Orbit"}{!mine && <span>Demo assistant</span>}</div>
      <div className={`chat-bubble ${message.status === "error" ? "chat-error" : ""}`}>
        {message.status === "error" && <div className="chat-error-title"><AlertTriangle /> Couldn't complete</div>}
        {mine ? <p className="chat-paragraph">{message.text}</p> : <RichText text={message.text} />}
      </div>
      {!mine && <div className="chat-message-actions"><CopyButton text={message.text} />{message.status === "error" && <Button variant="ghost" className="chat-copy" disabled={busy} onClick={onRetry}><RotateCcw />Retry</Button>}</div>}
    </div>
  </motion.article>;
}