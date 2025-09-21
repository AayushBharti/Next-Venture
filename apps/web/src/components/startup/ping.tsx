/** Pulsing dot animation — visual indicator for live data. */
export function Ping() {
  return (
    <span className="relative flex size-2.5">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-pink-400 opacity-75" />
      <span className="relative inline-flex size-2.5 rounded-full bg-pink-500" />
    </span>
  );
}
