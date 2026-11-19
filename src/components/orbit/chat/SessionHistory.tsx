import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { MessageSquare, MoreHorizontal, Pencil, Trash2, X, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useOrbit } from "@/lib/orbit/store";
import { deleteSession, renameSession, type ChatSession } from "@/lib/orbit/sessions";

export function SessionHistory({ onSelect, onNew }: { onSelect: () => void; onNew: () => void }) {
  const { state, update } = useOrbit();
  const [edit, setEdit] = useState<{ session: ChatSession; mode: "rename" | "delete" } | null>(null);
  const [title, setTitle] = useState("");
  const sessions = [...state.chatSessions].sort((a, b) => b.updatedAt - a.updatedAt || b.createdAt - a.createdAt);
  return <>
    <div className="chat-history-label">CONVERSATIONS</div>
    <Button variant="ghost" className="chat-history-create" onClick={onNew}><Plus />New chat</Button>
    <div className="chat-session-list">
      {sessions.length ? sessions.map((session) => <div key={session.id} className="chat-session-row" data-active={session.id === state.activeSessionId}>
        <Button variant="ghost" className="chat-session-select" aria-current={session.id === state.activeSessionId ? "true" : undefined} onClick={() => { update((s) => ({ ...s, activeSessionId: session.id })); onSelect(); }} title={session.title}>
          <MessageSquare /><span><strong>{session.title}</strong><small>{session.updatedAt ? new Date(session.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}</small></span>
        </Button>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="chat-session-menu" aria-label={`Actions for ${session.title}`} title="Conversation actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
          <DropdownMenuContent className="orbit-chat-area chat-session-dropdown" align="end">
            <DropdownMenuItem onSelect={() => { setTitle(session.title); setEdit({ session, mode: "rename" }); }}><Pencil />Rename</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setEdit({ session, mode: "delete" })}><Trash2 />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>) : <p className="chat-history-empty">No conversations yet.</p>}
    </div>
    <div className="chat-history-footer"><ShieldCheck className="size-4 mb-2" />Saved on this device.<br />Synthetic data. No live AI.</div>
    <Dialog.Root open={edit !== null} onOpenChange={(open) => { if (!open) setEdit(null); }}><Dialog.Portal>
      <Dialog.Overlay className="chat-session-overlay" />
      <Dialog.Content className="orbit-chat-area chat-session-dialog">
        <Button variant="ghost" className="chat-icon chat-dialog-close" aria-label="Close conversation dialog" onClick={() => setEdit(null)}><X /></Button>
        <Dialog.Title>{edit?.mode === "delete" ? "Delete conversation?" : "Rename conversation"}</Dialog.Title>
        <Dialog.Description>{edit?.mode === "delete" ? "Only this conversation will be removed. Your other ORBIT data stays unchanged." : "Give this conversation a name you’ll recognize."}</Dialog.Description>
        <form onSubmit={(e) => { e.preventDefault(); if (!edit) return; if (edit.mode === "delete") update((s) => deleteSession(s, edit.session.id)); else update((s) => renameSession(s, edit.session.id, title)); setEdit(null); }}>
          {edit?.mode === "rename" && <><label htmlFor="session-title">Conversation name</label><input id="session-title" value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} autoFocus /></>}
          <div className="chat-dialog-actions"><Button type="button" variant="ghost" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit" className="chat-new" disabled={edit?.mode === "rename" && !title.trim()}>{edit?.mode === "delete" ? "Delete conversation" : "Save name"}</Button></div>
        </form>
      </Dialog.Content>
    </Dialog.Portal></Dialog.Root>
  </>;
}