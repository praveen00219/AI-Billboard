/**
 * Civix Button — design-system primitive.
 * Backward compatible: <Button>…</Button> and <Button variant="outline">…</Button>
 * still work. Adds size, loading, and extra variants.
 */
const VARIANTS = {
  primary:
    "text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 shadow-[0_10px_34px_-10px_rgba(100,87,243,0.7)] hover:shadow-[0_14px_44px_-10px_rgba(100,87,243,0.9)] hover:-translate-y-0.5",
  accent:
    "text-ink-950 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-300 hover:to-accent-400 shadow-[0_10px_34px_-10px_rgba(34,211,238,0.65)] hover:-translate-y-0.5",
  secondary:
    "text-white glass hover:bg-white/10 hover:border-white/20",
  outline:
    "text-gray-200 border border-white/15 hover:bg-white/5 hover:border-white/25",
  ghost:
    "text-gray-300 hover:bg-white/5 hover:text-white",
};

const SIZES = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition-all duration-200 will-change-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:opacity-50 disabled:pointer-events-none";

  return (
    <button
      className={`${base} ${SIZES[size] ?? SIZES.md} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
