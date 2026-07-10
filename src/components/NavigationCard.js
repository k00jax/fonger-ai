import Link from 'next/link';

export default function NavigationCard({
  href,
  icon,
  title,
  description,
  variant = 'red',
}) {
  const accent =
    variant === 'orange'
      ? { bg: 'bg-brand-orange/10', text: 'text-brand-orange', glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.06)]' }
      : { bg: 'bg-brand-red/10', text: 'text-brand-red', glow: 'group-hover:shadow-[0_0_30px_rgba(220,38,38,0.06)]' };

  return (
    <Link
      href={href}
      className={`group relative block bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-7 transition-all duration-500 ease-out
        hover:border-[#2a2a2a] hover:bg-[#131313] hover:-translate-y-1 ${accent.glow}`}
    >
      {/* Subtle border glow line on hover — top edge only */}
      <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${accent.text}`} />

      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center text-xl mb-5 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}>
        {icon}
      </div>

      {/* Title + arrow */}
      <div className="flex items-center gap-2 mb-2.5">
        <h3 className="text-base font-semibold text-white transition-colors duration-300">
          {title}
        </h3>
        <svg
          className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ${accent.text}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>

      {/* Corner accent on hover */}
      <div
        className={`absolute bottom-0 right-0 w-16 h-16 rounded-tl-3xl opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none ${accent.bg}`}
      />
    </Link>
  );
}
