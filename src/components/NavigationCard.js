import Link from 'next/link';

export default function NavigationCard({ href, icon, title, description, variant = 'red' }) {
  const isOrange = variant === 'orange';
  const borderColor = isOrange ? 'hover:border-brand-orange/40' : 'hover:border-brand-red/40';
  const glowClass = isOrange ? 'card-glow-orange' : 'card-glow';
  const iconBg = isOrange ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-red/10 text-brand-red';
  const titleHover = isOrange ? 'group-hover:text-brand-orange' : 'group-hover:text-brand-red';

  return (
    <Link
      href={href}
      className={`group block bg-[#111] border border-[#1f1f1f] rounded-xl p-7 transition-all duration-300 hover:bg-[#151515] ${borderColor} ${glowClass} hover:-translate-y-1`}
    >
      <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mb-5 text-2xl transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className={`text-lg font-semibold text-white mb-2 transition-colors duration-200 ${titleHover}`}>
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
