"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface PageContext {
  greeting: string;
  suggestions: string[];
}

const VISITOR_ID_KEY = "stoneage_chat_visitor_id";
const CONVERSATION_ID_KEY = "stoneage_chat_conversation_id";
const AUTO_OPENED_PATHS_KEY = "stoneage_chat_auto_opened_paths";
const AUTO_OPEN_MIN_MS = 5000;
const AUTO_OPEN_MAX_MS = 10000;
const FALLBACK_REPLY =
  "Sorry, something went wrong on our end. Please try again in a moment, or reach out via the Spatial Brief form and the team will follow up directly.";

function getOrCreateVisitorId() {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function getAutoOpenedPaths(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(AUTO_OPENED_PATHS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function markPathAutoOpened(path: string) {
  const paths = getAutoOpenedPaths();
  paths.add(path);
  window.sessionStorage.setItem(
    AUTO_OPENED_PATHS_KEY,
    JSON.stringify([...paths]),
  );
}

/**
 * Minimalist speech bubble chat icon
 */
function ChatBubbleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.8 4.8C3 6.6 2 9.1 2 12c0 2.3.6 4.3 1.8 6l-.8 3.2 3.3-.9c1.6.8 3.5 1.2 5.7 1.2 2.9 0 5.4-1 7.2-2.8 1.8-1.8 2.8-4.3 2.8-6.7 0-2.9-1-5.4-2.8-7.2C17.4 3 14.9 2 12 2c-2.9 0-5.4 1-7.2 2.8ZM12 3.5c2.5 0 4.6.8 6.1 2.3 1.5 1.5 2.4 3.6 2.4 6.2 0 2-.7 3.9-2.2 5.4-1.5 1.5-3.6 2.4-6.3 2.4-1.8 0-3.5-.4-4.8-1l-.4-.2-2 .6.5-1.9-.3-.4c-1-1.4-1.5-3.1-1.5-4.9 0-2.3.8-4.4 2.3-5.9C7.4 4.4 9.5 3.5 12 3.5Zm-3.5 8a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0Zm3.5 0a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0Zm3.5 0a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0Z"
      />
    </svg>
  );
}

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchedContextForPathRef = useRef<string | null>(null);
  const userInteractedForPathRef = useRef(false);

  const hidden = pathname?.startsWith("/studio");

  useEffect(() => {
    conversationIdRef.current =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem(CONVERSATION_ID_KEY)
        : null;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || hidden || !pathname) return;
    userInteractedForPathRef.current = false;

    if (getAutoOpenedPaths().has(pathname)) return;

    const delay =
      AUTO_OPEN_MIN_MS + Math.random() * (AUTO_OPEN_MAX_MS - AUTO_OPEN_MIN_MS);

    const timer = window.setTimeout(() => {
      markPathAutoOpened(pathname);
      if (!userInteractedForPathRef.current) {
        setOpen(true);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [pathname, hidden]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open, pageContext]);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    if (fetchedContextForPathRef.current === pathname) return;
    fetchedContextForPathRef.current = pathname ?? "/";

    fetch(`/api/chat/context?path=${encodeURIComponent(pathname ?? "/")}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PageContext | null) => {
        if (data) setPageContext(data);
      })
      .catch(() => {});
  }, [open, pathname, messages.length]);

  if (hidden) return null;

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: getOrCreateVisitorId(),
          conversationId: conversationIdRef.current,
          message: trimmed,
          pagePath: pathname,
        }),
      });

      if (!res.ok) {
        // Surface server-side errors (rate limit, not configured, etc.) as a
        // normal chat bubble so the visitor sees a graceful message inline
        // rather than a raw error banner.
        const data = await res.json().catch(() => null);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data?.error ?? FALLBACK_REPLY },
        ]);
        return;
      }

      const data: { conversationId: string; reply: string } = await res.json();
      conversationIdRef.current = data.conversationId;
      window.sessionStorage.setItem(CONVERSATION_ID_KEY, data.conversationId);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      // Network failure or unexpected exception: same fail-safe treatment.
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: FALLBACK_REPLY },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    /* Fixed at the bottom of the screen, right-aligned with the MediaRail (right-4 sm:right-6) */
    <div
      className="fixed right-4 bottom-5 z-40 flex flex-col items-end select-none sm:right-6 sm:bottom-6"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      {/* Chat conversation drawer */}
      {open && (
        <div
          data-lenis-prevent
          className="mb-3 flex h-[min(30rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded border border-black/10 bg-white text-black shadow-2xl sm:w-96"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 bg-black px-4 py-3 text-white">
            <span className="font-mono text-xs tracking-widest uppercase">
              Ask Stoneage
            </span>
            <button
              type="button"
              onClick={() => {
                userInteractedForPathRef.current = true;
                setOpen(false);
              }}
              aria-label="Close chat"
              className="font-mono text-base text-white/70 hover:text-white"
            >
              &times;
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="max-w-[90%] rounded border border-black/10 bg-black/5 px-3 py-2 text-sm leading-relaxed font-light text-black">
                  {pageContext?.greeting ??
                    "Ask about our services, process, or timelines — or share your project and we'll point you to a Spatial Brief."}
                </div>
                {pageContext && pageContext.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {pageContext.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => sendMessage(suggestion)}
                        disabled={sending}
                        className="rounded border border-black/15 bg-white px-2.5 py-1 text-left font-mono text-[11px] tracking-wide text-black/70 transition-colors hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "ml-auto bg-black text-white"
                    : "border border-black/10 bg-black/5 font-light text-black"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="max-w-[85%] rounded border border-black/10 bg-black/5 px-3 py-2 font-mono text-xs text-black/60">
                Thinking&hellip;
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-black/10 bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded border border-black/15 bg-transparent px-3 py-1.5 text-sm text-black placeholder:text-black/40 focus:border-black focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="fabric-btn cursor-pointer !px-3 !py-1.5 !text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Minimalist Chat Icon Button (fixed, right-aligned to MediaRail at the bottom, no text) */}
      <button
        type="button"
        onClick={() => {
          userInteractedForPathRef.current = true;
          setOpen((v) => !v);
        }}
        aria-label={open ? "Close chat" : "Open chat"}
        className={`group flex h-10 w-10 items-center justify-center rounded-full border shadow-md transition-all duration-300 ${
          open
            ? "border-black bg-black text-white"
            : "border-black/25 bg-white text-black hover:scale-105 hover:border-black"
        }`}
      >
        {open ? (
          <span className="font-mono text-lg leading-none">&times;</span>
        ) : (
          <ChatBubbleIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
        )}
      </button>
    </div>
  );
}
