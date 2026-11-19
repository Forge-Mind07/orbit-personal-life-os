import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, Mic, Pause, X, Orbit, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatArt } from "./ChatArt";

const SAMPLE = "How are my expenses this month?";
type VoicePhase = "idle" | "listening" | "ready" | "sending";

export function VoiceMode({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: (text: string) => void }) {
  const [phase, setPhase] = useState<VoicePhase>("idle");
  const [text, setText] = useState("");
  const index = useRef(0);
  const sendTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!open) return;
    setText(""); setPhase("idle"); index.current = 0;
    // A browser/mobile back gesture dismisses the preview, not the conversation.
    window.history.pushState({ ...window.history.state, orbitVoice: true }, "");
    const back = () => onClose();
    window.addEventListener("popstate", back);
    return () => {
      window.removeEventListener("popstate", back);
      if (window.history.state?.orbitVoice) window.history.back();
      if (sendTimer.current) clearTimeout(sendTimer.current);
    };
  }, [open, onClose]);
  useEffect(() => {
    if (!open || phase !== "listening") return;
    const timer = setInterval(() => {
      index.current += 1;
      setText(SAMPLE.slice(0, index.current));
      if (index.current >= SAMPLE.length) { setPhase("ready"); clearInterval(timer); }
    }, 75);
    return () => clearInterval(timer);
  }, [phase, open]);
  const toggle = () => {
    if (phase === "listening") { setPhase(text ? "ready" : "idle"); return; }
    if (index.current >= SAMPLE.length || (text && text !== SAMPLE.slice(0, index.current))) { index.current = 0; setText(""); }
    setPhase("listening");
  };
  const confirm = () => {
    if (!text.trim() || phase === "sending") return;
    const captured = text.trim();
    setPhase("sending");
    sendTimer.current = setTimeout(() => { onSend(captured); onClose(); }, 350);
  };
  const words = text.split(" ");
  return <DialogPrimitive.Root open={open} onOpenChange={(value) => { if (!value) onClose(); }}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="orbit-chat-area chat-voice-backdrop" />
      <DialogPrimitive.Content className="orbit-chat-area chat-voice" data-phase={phase} onCloseAutoFocus={(e) => { e.preventDefault(); document.getElementById("chat-voice-trigger")?.focus({ preventScroll: true }); }}>
        <header className="chat-voice-header"><span><Orbit /> ORBIT INTELLIGENCE</span><Button variant="ghost" className="chat-icon" onClick={onClose} aria-label="Close voice mode"><X /></Button></header>
        <DialogPrimitive.Description className="chat-voice-disclaimer">Interactive voice preview — simulated recognition</DialogPrimitive.Description>
        <div className="chat-voice-main">
          <div className="chat-voice-art"><ChatArt active={phase === "listening" || phase === "sending"} /></div>
          <div className="chat-voice-status"><span className="chat-status-dot" />{phase === "idle" ? "READY WHEN YOU ARE" : phase === "listening" ? "SIMULATING RECOGNITION" : phase === "sending" ? "SENDING TO CHAT" : "TRANSCRIPT READY"}</div>
          <DialogPrimitive.Title className="chat-voice-title">{phase === "idle" ? <>A little less typing.<br />A little more flow.</> : phase === "sending" ? "One moment…" : "Your words, in focus."}</DialogPrimitive.Title>
          <div className="chat-spoken" aria-hidden="true">{text ? words.map((word, i) => <span key={i} className={i >= words.length - 2 ? "spoken-active" : ""}>{word} </span>) : <span>How are my expenses this month?</span>}</div>
          <div className="chat-waveform" data-active={phase === "listening"} aria-hidden="true">{Array.from({ length: 25 }, (_, i) => <span key={i} style={{ "--wave-height": `${10 + ((i * 17) % 31)}px`, "--wave-delay": `${(i % 6) * -.13}s` } as React.CSSProperties} />)}</div>
          <label className="chat-transcript-label" htmlFor="voice-transcript">Transcript</label>
          <textarea id="voice-transcript" className="chat-transcript" rows={2} placeholder="Or type your message here…" value={text} disabled={phase === "sending"} onChange={(e) => { setText(e.target.value); setPhase("ready"); }} />
          <p className="chat-voice-note" aria-live="polite">{phase === "listening" ? "Playing a sample phrase. No microphone is used." : phase === "sending" ? "Sending your message to the demo assistant." : "No audio is recorded. You’re in control of what you send."}</p>
        </div>
        <footer className="chat-voice-footer">
          <div className="chat-voice-dock"><Button variant="ghost" className="voice-cancel chat-icon" onClick={onClose} aria-label="Cancel voice preview"><X /></Button><Button variant="ghost" className="voice-mic chat-icon" disabled={phase === "sending"} onClick={toggle} aria-label={phase === "listening" ? "Pause simulation" : "Demo listening"}>{phase === "listening" ? <Pause /> : <Mic />}</Button><Button variant="ghost" className="voice-send chat-icon" disabled={!text.trim() || phase === "sending"} onClick={confirm} aria-label="Send voice transcript">{phase === "sending" ? <ArrowUp /> : <Check />}</Button></div>
          <span>{phase === "listening" ? "Pause preview" : "Demo listening"}</span>
        </footer>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>;
}