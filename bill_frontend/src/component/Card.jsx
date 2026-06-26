/**
 * Civix Card — premium glass surface.
 * Backward compatible with the original { icon, title, description } API,
 * and also accepts children + className for richer composition.
 */
const Card = ({ icon, title, description, children, className = "" }) => (
  <div
    className={`group relative rounded-2xl glass ring-hairline p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 ${className}`}
  >
    {/* top hairline highlight on hover */}
    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    {icon && (
      <div className="mb-4 inline-flex p-3 rounded-xl bg-white/[0.04] border border-white/10 text-brand-300">
        {icon}
      </div>
    )}
    {title && <h3 className="font-display text-lg font-semibold text-white tracking-tight">{title}</h3>}
    {description && <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{description}</p>}
    {children}
  </div>
);

export default Card;
