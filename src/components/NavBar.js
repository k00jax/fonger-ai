'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = [
    { href: '/trivance/', label: 'Trivance AI' },
    { href: '/dashboard/', label: 'Dashboard' },
    { href: '/projects/', label: 'Projects' },
    { href: '/books/', label: 'Books' },
    { href: '/swarm/', label: 'Swarm' },
    { href: '/arcadia/', label: 'Arcadia' },
    { href: '/family/', label: 'Family' },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav
      ref={menuRef}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-lg border-b border-[#1f1f1f]"
      style={{ WebkitBackdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white hover:text-brand-red transition-colors duration-300"
          >
            fonger<span className="text-brand-red">.</span>ai
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-0.5">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm rounded-lg transition-all duration-300
                    ${active
                      ? 'text-white bg-[#1a1a1a]'
                      : 'text-gray-500 hover:text-gray-200 hover:bg-[#141414]'
                    }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-brand-red rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-lg"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center
                  ${open ? 'translate-y-[7px] rotate-45' : ''}`}
              />
              <span
                className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300
                  ${open ? 'opacity-0 scale-x-0' : ''}`}
              />
              <span
                className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center
                  ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-out
          ${open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="border-t border-[#1f1f1f] bg-[#0a0a0a] px-4 py-4 space-y-1">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-sm rounded-xl transition-all duration-300
                  ${active
                    ? 'text-white bg-[#1a1a1a] border border-[#2a2a2a]'
                    : 'text-gray-400 hover:text-white hover:bg-[#111] border border-transparent'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
