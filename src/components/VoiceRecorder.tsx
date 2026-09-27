"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_RECORDING_SECONDS } from "@/lib/lumina/voiceConfig";

type Status = "idle" | "recording" | "transcribing";

function pickMimeType() {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function VoiceRecorder({
  onTranscript,
  disabled,
}: {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeTypeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function stop() {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function finish() {
    setStatus("transcribing");
    const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current ?? "audio/webm" });
    if (blob.size === 0) {
      setStatus("idle");
      setError("Didn't catch anything. Please try again.");
      return;
    }
    try {
      const ext = mimeTypeRef.current?.includes("mp4") ? "mp4" : mimeTypeRef.current?.includes("ogg") ? "ogg" : "webm";
      const formData = new FormData();
      formData.append("audio", blob, `entry.${ext}`);
      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Couldn't transcribe that. Please try again.");
        return;
      }
      const text = typeof data.text === "string" ? data.text : "";
      if (text) onTranscript(text);
    } catch {
      setError("You appear to be offline. Please try again when you're connected.");
    } finally {
      setStatus("idle");
    }
  }

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      mimeTypeRef.current = mimeType;
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => void finish();
      mediaRecorderRef.current = recorder;
      recorder.start();
      setStatus("recording");
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= MAX_RECORDING_SECONDS) stop();
          return next;
        });
      }, 1000);
    } catch {
      setError("Couldn't access your microphone. Check your browser's permission for this site.");
    }
  }

  if (status === "recording") {
    return (
      <button
        type="button"
        onClick={stop}
        className="inline-flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 ring-1 ring-rose-500/30 transition-colors duration-150 hover:bg-rose-500/15"
      >
        <span aria-hidden className="size-2 animate-pulse rounded-full bg-rose-400" />
        {formatTime(elapsed)} · Stop
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => void start()}
        disabled={disabled || status === "transcribing"}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 ring-1 ring-zinc-700 transition-colors duration-150 hover:text-zinc-100 hover:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "transcribing" ? (
          <>
            <span aria-hidden className="size-2 animate-pulse rounded-full bg-indigo-400" />
            Transcribing…
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" className="size-3.5">
              <path
                d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"
                stroke="currentColor"
                strokeWidth={1.5}
              />
              <path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
            Talk
          </>
        )}
      </button>
      {error && <span className="text-xs text-rose-300">{error}</span>}
    </div>
  );
}
