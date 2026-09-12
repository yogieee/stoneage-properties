interface PaperclipProps {
  className?: string;
  variant?: "silver" | "dark";
}

export function Paperclip({ className = "w-16 h-auto", variant = "silver" }: PaperclipProps) {
  const strokeColor = variant === "silver" ? "#a8a7a3" : "#2e2e2c";
  const innerStroke = variant === "silver" ? "#6b6a66" : "#111110";

  return (
    <svg
      viewBox="3 -4 58 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: "rotate(8deg)" }}
      aria-hidden="true"
    >
      <defs>
        <filter id="clip-shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.25" />
        </filter>
      </defs>
      <path
        d="M16 34V92C16 102 24 110 32 110C40 110 48 102 48 92V18C48 8 38 0 28 0C18 0 8 8 8 18V96C8 109 20 120 32 120C44 120 56 109 56 96V36"
        stroke={innerStroke}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#clip-shadow)"
      />
      <path
        d="M16 34V92C16 102 24 110 32 110C40 110 48 102 48 92V18C48 8 38 0 28 0C18 0 8 8 8 18V96C8 109 20 120 32 120C44 120 56 109 56 96V36"
        stroke={strokeColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
