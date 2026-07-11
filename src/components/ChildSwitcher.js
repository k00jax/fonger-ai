'use client';

import { useState } from 'react';
import { KIDS } from '../lib/demoData';

export default function ChildSwitcher({ activeKid, onSelect }) {
  const [hovered, setHovered] = useState(null);

  const active = KIDS.find((k) => k.id === activeKid);

  return (
    <div className="mb-10">
      <p className="text-xs tracking-[0.2em] uppercase text-gray-600 mb-4">
        Who's learning today?
      </p>
      <div className="flex flex-wrap gap-3">
        {KIDS.map((kid) => {
          const isActive = kid.id === activeKid;
          const isHovered = hovered === kid.id;

          return (
            <button
              key={kid.id}
              onClick={() => onSelect(kid.id)}
              onMouseEnter={() => setHovered(kid.id)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300 ${
                isActive
                  ? 'bg-[#1a1a1a] border-[#333]'
                  : 'bg-[#0f0f0f] border-[#1a1a1a] hover:border-[#252525]'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                  isActive ? 'scale-110' : ''
                }`}
                style={{
                  backgroundColor: `${kid.color}15`,
                  border: `2px solid ${isActive ? kid.color : 'transparent'}`,
                }}
              >
                {kid.emoji}
              </div>

              {/* Name + grade */}
              <div className="text-left">
                <p
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                  }`}
                >
                  {kid.name}
                </p>
                <p className="text-xs text-gray-600">
                  {kid.grade === 'k' ? 'Kindergarten' : `Grade ${kid.grade}`}
                </p>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: kid.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active kid bio */}
      {active && (
        <p className="mt-4 text-sm text-gray-500 max-w-md">{active.bio}</p>
      )}
    </div>
  );
}
