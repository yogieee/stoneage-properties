"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoSpinner } from "@/components/decorative/LogoSpinner";

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

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const [attention, setAttention] = useState(false);
  const conversationIdRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchedContextForPathRef = useRef<string | null>(null);
  const userInteractedForPathRef = useRef(false);

  // Don't show the widget inside the Sanity Studio.
  const hidden = pathname?.startsWith("/studio");

  useEffect(() => {
    conversationIdRef.current =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem(CONVERSATION_ID_KEY)
        : null;
  }, []);

  // Auto-open once per page path, 5-10s after the visitor lands on it,
  // with a greeting tailored to that page. Re-fires on each new page the
  // visitor navigates to (within the same session), unless they've
  // already opened/closed the widget themselves on that specific page,
  // or the widget already auto-opened for that path earlier this session.
  useEffect(() => {
    if (typeof window === "undefined" || hidden || !pathname) return;
    userInteractedForPathRef.current = false;

    if (getAutoOpenedPaths().has(pathname)) {
      setAttention(false);
      return;
    }

    setAttention(true);
    const delay =
      AUTO_OPEN_MIN_MS + Math.random() * (AUTO_OPEN_MAX_MS - AUTO_OPEN_MIN_MS);

    const timer = window.setTimeout(() => {
      markPathAutoOpened(pathname);
      setAttention(false);
      if (!userInteractedForPathRef.current) {
        setOpen(true);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [pathname, hidden]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open, pageContext]);

  // Fetch a page-aware greeting + suggestions whenever the widget opens
  // with no messages yet — re-fetches if the visitor navigated to a
  // different page since the last time it opened.
  useEffect(() => {
    if (!open || messages.length > 0) return;
    if (fetchedContextForPathRef.current === pathname) return;
    fetchedContextForPathRef.current = pathname ?? "/";

    fetch(`/api/chat/context?path=${encodeURIComponent(pathname ?? "/")}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PageContext | null) => {
        if (data) setPageContext(data);
      })
      .catch(() => {
        // Silent: the widget still works without a tailored greeting.
      });
  }, [open, pathname, messages.length]);

  if (hidden) return null;

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setError(null);
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
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not reach the assistant.");
      }

      const data: { conversationId: string; reply: string } = await res.json();
      conversationIdRef.current = data.conversationId;
      window.sessionStorage.setItem(CONVERSATION_ID_KEY, data.conversationId);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach the assistant. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div
      className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      {open && (
        <div
          data-lenis-prevent
          className="paper-texture bg-paper-card border-line text-ink mb-3 flex h-[min(28rem,calc(100dvh-6rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-lg border shadow-2xl sm:w-96"
        >
          {/* Header */}
          <div className="border-line bg-charcoal text-paper flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <LogoSpinner size="h-5 w-5" className="text-paper" spin="none" />
              <span className="font-mono text-xs tracking-widest uppercase">
                Ask Stoneage
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                userInteractedForPathRef.current = true;
                setOpen(false);
              }}
              aria-label="Close chat"
              className="text-paper/70 hover:text-paper font-mono text-xs"
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
                <div className="bg-paper-warm border-line text-ink max-w-[90%] rounded-lg border px-3 py-2 font-body text-sm leading-relaxed">
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
                        className="border-line text-ink-muted hover:border-ink hover:text-ink rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
                className={`max-w-[85%] rounded-lg px-3 py-2 font-body text-sm leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-charcoal text-paper ml-auto"
                    : "bg-paper-warm text-ink border-line border"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="bg-paper-warm border-line text-ink-muted max-w-[85%] rounded-lg border px-3 py-2 font-mono text-xs">
                Thinking&hellip;
              </div>
            )}
            {error && (
              <p className="font-mono text-xs text-red-600">{error}</p>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-line flex items-center gap-2 border-t p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="border-line font-body focus:border-ink placeholder:text-ink-subtle/50 flex-1 rounded-full border bg-transparent px-3 py-2 text-base focus:outline-none sm:text-sm"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="bg-charcoal text-paper hover:bg-ink rounded-full px-4 py-2 font-mono text-xs tracking-wider uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          userInteractedForPathRef.current = true;
          setAttention(false);
          setOpen((v) => !v);
        }}
        aria-label={open ? "Close chat" : "Open chat"}
        className={`bg-charcoal text-paper hover:bg-ink group ml-auto flex items-center gap-2 rounded-full px-5 py-3.5 font-mono text-xs tracking-widest uppercase shadow-xl transition-all duration-300 hover:shadow-2xl ${
          attention && !open ? "animate-chat-attention" : ""
        }`}
      >
        <LogoSpinner spin="hover" size="h-5 w-5" className="text-paper" />
        <span>{open ? "Close" : "Chat"}</span>
      </button>
    </div>
  );
}
