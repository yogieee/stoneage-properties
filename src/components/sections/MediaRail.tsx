"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SocialIcon } from "@/components/decorative/SocialIcon";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface PageContext {
  greeting: string;
  suggestions: string[];
}

export interface SocialItem {
  platform: string;
  url: string;
}

interface MediaRailProps {
  socials?: SocialItem[];
}

const FALLBACK_SOCIALS: SocialItem[] = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/stoneage_building_contractors/",
  },
  { platform: "Facebook", url: "https://www.facebook.com/stoneageproperties" },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/stoneage-properties-5bb8171a1/",
  },
  {
    platform: "YouTube",
    url: "https://www.youtube.com/channel/UCaXNV-S7WE2LfIQOr9NlGeQ",
  },
];

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

export function MediaRail({ socials }: MediaRailProps) {
  const activeSocials = socials?.length ? socials : FALLBACK_SOCIALS;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    if (!pathname || hidden || fetchedContextForPathRef.current === pathname) {
      return;
    }

    let cancelled = false;

    async function loadPageContext() {
      try {
        const res = await fetch(
          `/api/chat/context?path=${encodeURIComponent(pathname)}`,
        );
        if (!res.ok) return;
        const data: PageContext = await res.json();
        if (!cancelled) {
          setPageContext(data);
          fetchedContextForPathRef.current = pathname;
        }
      } catch {
        // Soft-fail: fallback greeting is used
      }
    }

    loadPageContext();
    return () => {
      cancelled = true;
    };
  }, [pathname, hidden]);

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

  if (hidden) return null;

  return (
    <>
      {/* Desktop / Tablet Media Rail: Vertically centered on right edge */}
      <div
        className="pointer-events-auto fixed top-1/2 right-0 z-30 hidden w-6 -translate-y-1/2 flex-col items-center justify-center mix-blend-difference sm:flex md:w-12"
        aria-label="Social media and chat"
      >
        <div className="flex flex-col items-center gap-4 py-2">
          {/* Social icons: centered 24x24 hit areas with 16x16 icons */}
          {activeSocials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.platform}
              title={social.platform}
              className="hidden h-6 w-6 items-center justify-center text-white opacity-80 transition-opacity hover:opacity-100 lg:flex"
            >
              <SocialIcon platform={social.platform} className="h-4 w-4" />
            </a>
          ))}

          {/* Thin subtle divider on desktop */}
          <div className="my-0.5 hidden h-px w-3 bg-white/30 lg:block" />

          {/* Chat Icon / Close X Button in Media Rail */}
          <button
            type="button"
            onClick={() => {
              userInteractedForPathRef.current = true;
              setOpen((v) => !v);
            }}
            aria-label={open ? "Close chat" : "Open chat"}
            title={open ? "Close chat" : "Open chat"}
            className="flex h-6 w-6 cursor-pointer items-center justify-center text-white opacity-85 transition-all duration-200 hover:scale-110 hover:opacity-100 focus:outline-none"
          >
            {open ? (
              <span className="flex items-center justify-center font-mono text-xl leading-none font-medium select-none">
                &times;
              </span>
            ) : (
              <ChatBubbleIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Chat Button: Fixed at bottom right with larger, tactile circular button */}
      <div
        className="fixed right-4 bottom-5 z-40 flex flex-col items-end sm:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
      >
        <button
          type="button"
          onClick={() => {
            userInteractedForPathRef.current = true;
            setOpen((v) => !v);
          }}
          aria-label={open ? "Close chat" : "Open chat"}
          className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-xl transition-all duration-200 active:scale-95 ${
            open
              ? "border-black bg-black text-white"
              : "border-[#1C1B19]/15 bg-[#FAF8F5] text-[#1C1B19] hover:border-[#1C1B19]"
          }`}
        >
          {open ? (
            <span className="font-mono text-2xl leading-none select-none">
              &times;
            </span>
          ) : (
            <ChatBubbleIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Chat Conversation Drawer (Adaptive: bottom-anchored on mobile, beside rail on tablet/desktop) */}
      {open && (
        <div
          data-lenis-prevent
          className="fixed right-4 bottom-20 z-50 flex h-[min(30rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded border border-[#1C1B19]/10 bg-[#FAF8F5] text-[#1C1B19] shadow-2xl sm:top-1/2 sm:right-16 sm:bottom-auto sm:h-[min(32rem,calc(100dvh-5rem))] sm:w-96 sm:-translate-y-1/2 md:right-18"
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
            {error && <p className="font-mono text-xs text-red-600">{error}</p>}
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
    </>
  );
}
