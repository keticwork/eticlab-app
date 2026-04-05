"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function formatResponse(text: string) {
  // Rendre les codes modules cliquables
  const parts = text.split(/((?:C\d+-\d+[a-z]?|T-\d+[a-z]?|T-A\d+[a-z]?|T-SEC\d+|T-LEG\d+|T-ORG\d+|T-GCLOUD\d+))/g);

  return parts.map((part, i) => {
    if (/^(C\d+-\d+|T-\d+|T-A\d+|T-SEC\d+|T-LEG\d+|T-ORG\d+|T-GCLOUD\d+)/i.test(part)) {
      return (
        <Link
          key={i}
          href={`/modules/${part.toLowerCase()}`}
          className="rounded bg-[#1D9E75]/10 px-1.5 py-0.5 font-mono text-sm font-semibold text-[#1D9E75] hover:bg-[#1D9E75]/20"
        >
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function ChatInterface({
  initialRemaining,
}: {
  initialRemaining: number;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(initialRemaining);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setError("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: messages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur inconnue");
        setLoading(false);
        return;
      }

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.response },
      ]);
      setRemaining(data.requests_remaining);
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (text: string) => {
    setInput(text);
  };

  const examples = [
    "Je veux créer un SaaS de A à Z",
    "Comprendre les API REST",
    "Déployer mon premier site",
    "Sécuriser mon application",
  ];

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              🤖 Guide IA
            </h1>
            <p className="text-xs text-gray-400">
              Décris ton projet, je te crée un parcours
            </p>
          </div>
          <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {remaining} question{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1D9E75]/10">
                <span className="text-2xl">🤖</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Quel est ton projet ?
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Décris ce que tu veux créer et je te recommanderai les modules à suivre.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleExample(ex)}
                    className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs text-gray-500 transition-colors hover:border-[#1D9E75] hover:text-[#1D9E75]"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1D9E75] text-white"
                    : "border border-gray-200 bg-white text-gray-700"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="whitespace-pre-wrap">
                    {formatResponse(msg.content)}
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-400">
                <span className="animate-pulse">Réflexion en cours...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-500">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-3xl">
          {remaining <= 0 ? (
            <div className="rounded-lg bg-gray-100 px-4 py-3 text-center text-sm text-gray-500">
              Limite atteinte — tes questions se réinitialisent à minuit.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Décris ton projet..."
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#1D9E75] focus:bg-white"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#178a64] disabled:opacity-50"
              >
                Envoyer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
