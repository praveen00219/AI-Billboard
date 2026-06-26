import { useId } from "react";

/**
 * Civix brand mark — a civic "lens" badge: a gradient "C" with a focus node
 * (the detection/eye) and two corner scan ticks. Pure SVG, scales crisply,
 * no external assets.
 */
export function LogoMark({ size = 36, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const grad = `civix-grad-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Civix"
    >
      <defs>
        <linearGradient id={grad} x1="6" y1="5" x2="34" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7f7cfb" />
          <stop offset="0.5" stopColor="#6457f3" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      {/* Badge */}
      <rect x="2.25" y="2.25" width="35.5" height="35.5" rx="11" fill="#0c0c12" />
      <rect x="2.25" y="2.25" width="35.5" height="35.5" rx="11" fill="none" stroke={`url(#${grad})`} strokeWidth="1.5" />

      {/* The "C" arc */}
      <path
        d="M27 13.6A9.4 9.4 0 1 0 27 26.4"
        stroke={`url(#${grad})`}
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* Focus / detection node */}
      <circle cx="26.6" cy="20" r="2.7" fill="#22d3ee" />

      {/* Corner scan ticks */}
      <path d="M12 9H9V12" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <path d="M28 31H31V28" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  );
}

/**
 * Full Civix logo (mark + wordmark). Use `withWordmark={false}` for icon-only.
 */
export default function Logo({ size = 34, withWordmark = true, className = "", wordmarkClassName = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className={`font-display text-[1.35rem] font-bold tracking-tight leading-none ${wordmarkClassName}`}>
          <span className="text-white">Civ</span>
          <span className="text-gradient">ix</span>
        </span>
      )}
    </span>
  );
}
