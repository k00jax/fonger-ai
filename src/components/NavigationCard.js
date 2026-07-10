import Link from 'next/link';

export default function NavigationCard({ href, icon, title, description, variant = 'red' }) {
  const borderColor = variant === 'orange' ? 'hover:border-brand-orange/30' : 'hover:border-brand-red/30';
  const iconBg = variant === 'orange' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-red/10 text-brand-red';

  return (
    <Link
      href={href}
      className={`group block bg-[#111] border border-[#1f1f1f] rounded-xl p-6 transition-all duration-300 hover:bg-[#151515] ${borderColor} hover:-translate-y-0.5`}
    >
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center mb-4 text-xl`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-red transition-colors">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
