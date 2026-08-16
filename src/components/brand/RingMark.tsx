import { useId } from "react";
import { cn } from "@/lib/utils";

export function RingMark({
  size = 44,
  className,
  pulse = false,
  title = "Daycostra mark",
}: {
  size?: number;
  className?: string;
  pulse?: boolean;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const metal = `${uid}-metal`;
  const core = `${uid}-core`;
  const violet = `${uid}-violet`;

  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={cn("dc-ring-mark", pulse && "dc-ring-mark--pulse", className)}
    >
      <defs>
        <linearGradient id={metal} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3f3f1" />
          <stop offset="0.2" stopColor="#8c8f95" />
          <stop offset="0.48" stopColor="#292c32" />
          <stop offset="0.72" stopColor="#b9bcc1" />
          <stop offset="1" stopColor="#595c63" />
        </linearGradient>
        <radialGradient id={core} cx="48%" cy="44%" r="62%">
          <stop offset="0" stopColor="#9d68ff" stopOpacity="0.72" />
          <stop offset="0.42" stopColor="#6a2be2" stopOpacity="0.34" />
          <stop offset="1" stopColor="#120817" stopOpacity="0.98" />
        </radialGradient>
        <linearGradient id={violet} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d3b4ff" />
          <stop offset="0.48" stopColor="#7d32ef" />
          <stop offset="1" stopColor="#4a1599" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="80" cy="80" r="67" fill="none" stroke={`url(#${metal})`} strokeWidth="4" opacity="0.92" />
      <circle cx="80" cy="80" r="59" fill="none" stroke="#9b9da2" strokeWidth="2.5" opacity="0.76" />
      <circle
        cx="80"
        cy="80"
        r="51"
        fill="none"
        stroke={`url(#${violet})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="118 19 92 28 56 24"
        filter={`url(#${uid}-glow)`}
      />

      <circle cx="80" cy="80" r="37" fill={`url(#${core})`} stroke="#bcbec4" strokeWidth="1.6" />

      <g fill="none" stroke={`url(#${metal})`} strokeWidth="13" strokeLinecap="butt">
        <path d="M80 30 A50 50 0 0 1 128 67" />
        <path d="M130 83 A50 50 0 0 1 84 130" />
        <path d="M68 129 A50 50 0 0 1 31 91" />
        <path d="M32 70 A50 50 0 0 1 68 31" />
      </g>

      <g fill="none" stroke="#f1f1ef" strokeOpacity="0.18" strokeWidth="1.2">
        <path d="M83 34 A46 46 0 0 1 123 65" />
        <path d="M124 88 A46 46 0 0 1 87 125" />
        <path d="M63 124 A46 46 0 0 1 36 91" />
        <path d="M37 67 A46 46 0 0 1 64 36" />
      </g>

      <circle cx="80" cy="80" r="6" fill="#8d4bf5" opacity="0.68" filter={`url(#${uid}-glow)`} />
    </svg>
  );
}
