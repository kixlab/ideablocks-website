interface GuideHintProps {
  text: string;
  className?: string;
}

export function GuideHint({ text, className = "" }: GuideHintProps) {
  return (
    <p className={`text-sm font-medium text-blue-500 flex items-center gap-1.5 ${className}`}>
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {text}
    </p>
  );
}
