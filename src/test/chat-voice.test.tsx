import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VoiceMode } from "@/components/orbit/chat/VoiceMode";
import { demoReply } from "@/lib/orbit/chat";
import { seedExpenses } from "@/lib/orbit/finance";

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("Chat voice preview", () => {
  it("does not send an empty transcript", () => {
    const send = vi.fn();
    render(<VoiceMode open onClose={() => {}} onSend={send} />);
    expect(screen.getByRole("button", { name: "Send voice transcript" })).toBeDisabled();
    expect(send).not.toHaveBeenCalled();
  });
  it("sends the manually edited captured text to Chat", async () => {
    vi.useFakeTimers();
    const send = vi.fn();
    const close = vi.fn();
    render(<VoiceMode open onClose={close} onSend={send} />);
    fireEvent.change(screen.getByLabelText("Transcript"), { target: { value: "How are my expenses this month?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send voice transcript" }));
    await act(async () => { vi.advanceTimersByTime(350); });
    expect(send).toHaveBeenCalledWith("How are my expenses this month?");
    expect(close).toHaveBeenCalledOnce();
  });
  it("cancel discards the transcript without sending", () => {
    const send = vi.fn();
    const close = vi.fn();
    render(<VoiceMode open onClose={close} onSend={send} />);
    fireEvent.change(screen.getByLabelText("Transcript"), { target: { value: "Discard this message" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancel voice preview" }));
    expect(close).toHaveBeenCalledOnce();
    expect(send).not.toHaveBeenCalled();
  });
  it("the expense voice prompt answers from the existing ₹8,450 demo total", () => {
    const result = demoReply("How are my expenses this month?", {
      today: "2026-11-19", goal: 10000, budget: 15000,
      expenses: seedExpenses("2026-11-19"), topics: ["AI"], city: "Chennai",
    });
    expect(result.text).toContain("₹8,450");
    expect(result.text).toContain("₹6,550");
  });
});