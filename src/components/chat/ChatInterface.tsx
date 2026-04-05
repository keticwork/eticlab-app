"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

// Regex pour capturer "CODE — Nom" ou juste "CODE"
const MODULE_REGEX = /((?:C\d+-\d+[a-z]?|T-\d+[a-z]?|T-A\d+[a-z]?|T-SEC\d+|T-LEG\d+|T-ORG\d+|T-GCLOUD\d+)(?:\s*—\s*[^.,\n()\[\]]+)?)/g;
const CODE_ONLY = /^(C\d+-\d+[a-z]?|T-\d+[a-z]?|T-A\d+[a-z]?|T-SEC\d+|T-LEG\d+|T-ORG\d+|T-GCLOUD\d+)/i;

function AssistantMessage({ content }: { content: string }) {
  // Séparer le bloc prompt externe s'il existe
  const promptSeparator = "**🤖 Prompt pour une autre IA";
  const promptIdx = content.indexOf(promptSeparator);
  const mainContent = promptIdx >= 0 ? content.slice(0, promptIdx).trim() : content;
  const promptBlock = promptIdx >= 0 ? content.slice(promptIdx).trim() : null;

  return (
    <div>
      <div className="chat-markdown">
        <ReactMarkdown
          components={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            p({ children }) {
              return <p className="mb-2 last:mb-0">{replaceModuleCodes(children)}</p>;
            },
            strong({ children }) {
              return <strong className="font-semibold">{children}</strong>;
            },
            h2({ children }) {
              return <h2 className="mb-2 mt-4 text-base font-bold">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="mb-1 mt-3 text-sm font-bold">{children}</h3>;
            },
            ul({ children }) {
              return <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>;
            },
            li({ children }) {
              return <li>{replaceModuleCodes(children)}</li>;
            },
            code({ children }) {
              return (
                <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-green-700">
                  {children}
                </code>
              );
            },
          }}
        >
          {mainContent}
        </ReactMarkdown>
      </div>

      {promptBlock && <PromptBlock content={promptBlock} />}
    </div>
  );
}

function PromptBlock({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  // Extraire juste le texte du prompt (entre les ---)
  const lines = content.split("\n");
  const promptText = lines
    .filter((l) => !l.startsWith("**🤖") && l.trim() !== "---")
    .join("\n")
    .trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 rounded-lg border border-[#1D9E75]/20 bg-[#1D9E75]/5 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#1D9E75]">
          🤖 Prompt pour une autre IA
        </span>
        <button
          onClick={handleCopy}
          className="rounded bg-[#1D9E75]/10 px-2.5 py-1 text-xs font-medium text-[#1D9E75] transition-colors hover:bg-[#1D9E75]/20"
        >
          {copied ? "✓ Copié" : "📋 Copier le prompt"}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-xs leading-relaxed text-gray-600">
        {promptText}
      </p>
    </div>
  );
}

// Replace module codes in React children with clickable links
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function replaceModuleCodes(children: any): any {
  if (!children) return children;
  if (typeof children === "string") {
    const parts = children.split(MODULE_REGEX);
    if (parts.length === 1) return children;
    return parts.map((part, i) => {
      const codeMatch = part.match(CODE_ONLY);
      if (codeMatch) {
        return (
          <Link
            key={i}
            href={`/modules/${codeMatch[1].toLowerCase()}`}
            className="inline rounded bg-[#1D9E75]/10 px-1 py-0.5 text-xs font-semibold text-[#1D9E75] hover:bg-[#1D9E75]/20"
          >
            {part.trim()}
          </Link>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }
  if (Array.isArray(children)) {
    return children.map((child, i) => <span key={i}>{replaceModuleCodes(child)}</span>);
  }
  return children;
}

export function ChatInterface({
  initialRemaining,
  initialMessages,
}: {
  initialRemaining: number;
  initialMessages?: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(initialRemaining);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Écouter les changements de projet pour charger une conversation
  useEffect(() => {
    const handleProjectChange = () => {
      const stored = localStorage.getItem("eticlab-load-conversation");
      if (stored) {
        try {
          const msgs = JSON.parse(stored) as Message[];
          setMessages(msgs);
          localStorage.removeItem("eticlab-load-conversation");
        } catch { /* ignore */ }
      }
    };
    window.addEventListener("eticlab-load-conversation", handleProjectChange);
    return () => window.removeEventListener("eticlab-load-conversation", handleProjectChange);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
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
            <h1 className="text-lg font-bold text-gray-900">🤖 Guide IA</h1>
            <p className="text-xs text-gray-400">Décris ton projet, je te crée un parcours</p>
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
              <h2 className="text-lg font-semibold text-gray-900">Quel est ton projet ?</h2>
              <p className="mt-2 text-sm text-gray-500">
                Décris ce que tu veux créer et je te recommanderai les modules à suivre.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setInput(ex)}
                    className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs text-gray-500 transition-colors hover:border-[#1D9E75] hover:text-[#1D9E75]"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1D9E75] text-white"
                    : "border border-gray-200 bg-white text-gray-700"
                }`}
              >
                {msg.role === "assistant" ? (
                  <AssistantMessage content={msg.content} />
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
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
            <div>
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Décris ton projet..."
                  disabled={loading}
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#1D9E75] focus:bg-white"
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading || !input.trim()}
                  className="self-end rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#178a64] disabled:opacity-50"
                >
                  Envoyer
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-300">Shift+↵ pour aller à la ligne</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
