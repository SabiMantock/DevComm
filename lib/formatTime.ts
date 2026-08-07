const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "2h ago" / "5h ago" / "1d ago" / "2d ago" style, derived from an ISO timestamp vs now. */
export const formatRelativeTime = (iso: string): string => {
  const elapsed = Date.now() - new Date(iso).getTime();

  if (elapsed < MINUTE) return "just now";

  const minutes = Math.floor(elapsed / MINUTE);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(elapsed / HOUR);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(elapsed / DAY);
  return `${days}d ago`;
};

const WORDS_PER_MINUTE = 200;

/** "4 min read" style, estimated from word count at ~200wpm, minimum "1 min read". */
export const formatReadTime = (body: string): string => {
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
  return `${minutes} min read`;
};
