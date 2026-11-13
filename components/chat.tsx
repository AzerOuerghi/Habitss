"use client";

import { useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Pourquoi je suis fatigué en ce moment ?",
  "À quelle heure je devrais arrêter le café ?",
  "Comment améliorer mon sommeil cette semaine ?",
];

export function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function send(content: string) {
    if (!content.trim() || pending) return;

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        { role: "assistant", content: data.reply ?? data.error ?? "Erreur inconnue." },
      ]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Connexion impossible au coach." }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="min-h-80 space-y-4 p-5">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-slate-500">Pose ta première question :</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-slate-900 hover:text-slate-900"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <span
              className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-left ${
                m.role === "user" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}

        {pending && <p className="text-sm text-slate-400">Le coach réfléchit...</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = inputRef.current?.value ?? "";
          if (inputRef.current) inputRef.current.value = "";
          send(v);
        }}
        className="flex gap-2 border-t border-slate-200 p-3"
      >
        <input
          ref={inputRef}
          placeholder="Écris ta question..."
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        />
        <button
          disabled={pending}
          className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
