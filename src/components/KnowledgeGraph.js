'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const CORE_SUBJECTS = ['Math', 'Science', 'Reading', 'SEL', 'Social Studies'];

const SUBJECT_META = {
  Math: { icon: '🧮', color: '#3b82f6' },
  Science: { icon: '🔬', color: '#10b981' },
  Reading: { icon: '📖', color: '#f59e0b' },
  SEL: { icon: '💛', color: '#ec4899' },
  'Social Studies': { icon: '🌍', color: '#8b5cf6' },
};

/**
 * Build D3 graph data from demo state.
 *
 * Node types:
 *   'center'   - kid node (name + emoji)
 *   'subject'  - one per core subject
 *   'unit'     - completed unit, linked to its subject
 *   'current'  - in-progress unit, linked with dashed edge
 */
function buildGraphData(kidData, kidColor) {
  const nodes = [];
  const links = [];

  if (!kidData || !kidData.kidId) return { nodes, links };

  const centerId = `kid-${kidData.kidId}`;
  const completedUnits = kidData.completedUnits || {};
  const currentProgress = kidData.currentUnitProgress || {};

  // Center node
  nodes.push({
    id: centerId,
    type: 'center',
    label: kidData.kidId || 'Kid',
    color: kidColor,
    radius: 26,
  });

  // Subject nodes + edges
  CORE_SUBJECTS.forEach((subject) => {
    const meta = SUBJECT_META[subject] || { icon: '📚', color: '#666' };
    const subjectId = `subject-${subject}`;
    const completed = (completedUnits[subject] || []).length;
    const pct = Math.min(100, Math.round((completed / 12) * 100));
    const radius = 8 + (pct / 100) * 16; // 8-24 range

    nodes.push({
      id: subjectId,
      type: 'subject',
      label: subject,
      icon: meta.icon,
      color: meta.color,
      radius,
      pct,
    });

    links.push({
      source: centerId,
      target: subjectId,
      type: 'subject-link',
    });

    // Completed unit nodes
    (completedUnits[subject] || []).forEach((unitId, i) => {
      const nodeId = `unit-${unitId}`;
      nodes.push({
        id: nodeId,
        type: 'unit',
        label: unitId.replace(/_/g, ' ').replace(subject, '').trim(),
        subject,
        color: kidColor,
        radius: 7,
      });
      links.push({
        source: subjectId,
        target: nodeId,
        type: 'unit-link',
      });
    });

    // In-progress unit node (dashed link)
    const current = currentProgress[subject];
    if (current) {
      const nodeId = `current-${subject}`;
      nodes.push({
        id: nodeId,
        type: 'current',
        label: `Lesson ${current.lesson} / ${current.unit.replace(/_/g, ' ')}`,
        subject,
        color: kidColor,
        radius: 6,
      });
      links.push({
        source: subjectId,
        target: nodeId,
        type: 'current-link',
      });
    }
  });

  return { nodes, links };
}

export default function KnowledgeGraph({ kidData, kidColor = '#f97316', kidName = '', kidEmoji = '' }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      setDimensions({
        width: el.clientWidth || 800,
        height: Math.max(500, el.clientHeight || 600),
      });
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Main D3 render
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const { nodes: rawNodes, links: rawLinks } = buildGraphData(kidData, kidColor);
    if (rawNodes.length === 0) {
      setHasData(false);
      return;
    }
    setHasData(true);

    const { width, height } = dimensions;

    // Clear previous
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    // Defs for gradients
    const defs = svg.append('defs');

    // Glow filter
    const glow = defs
      .append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    const merge = glow.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Container for zoom
    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Simulation
    const simulation = d3
      .forceSimulation(rawNodes)
      .force(
        'link',
        d3
          .forceLink(rawLinks)
          .id((d) => d.id)
          .distance((d) => {
            if (d.type === 'subject-link') return 100;
            if (d.type === 'unit-link') return 50;
            if (d.type === 'current-link') return 70;
            return 80;
          })
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d) => d.radius + 8));

    // Draw links
    const link = g
      .append('g')
      .selectAll('line')
      .data(rawLinks)
      .join('line')
      .attr('stroke', (d) => {
        if (d.type === 'current-link') return kidColor + '66';
        return '#1e3a5f';
      })
      .attr('stroke-width', (d) => (d.type === 'subject-link' ? 1.5 : 1))
      .attr('stroke-dasharray', (d) => (d.type === 'current-link' ? '5,3' : null))
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const node = g
      .append('g')
      .selectAll('g')
      .data(rawNodes)
      .join('g')
      .attr('cursor', (d) => (d.type === 'center' ? 'default' : 'pointer'))
      .call(
        d3
          .drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node circles
    node
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => {
        if (d.type === 'center') return d.color;
        if (d.type === 'subject') return d.color;
        if (d.type === 'unit') return d.color;
        if (d.type === 'current') return d.color + '66';
        return '#555';
      })
      .attr('fill-opacity', (d) => (d.type === 'center' ? 1 : d.type === 'current' ? 1 : 0.85))
      .attr('stroke', (d) => {
        if (d.type === 'center') return d.color;
        if (d.type === 'current') return d.color;
        return 'rgba(255,255,255,0.15)';
      })
      .attr('stroke-width', (d) => (d.type === 'center' ? 2 : 1))
      .attr('filter', (d) => (d.type === 'center' ? 'url(#glow)' : null))
      .style('transition', 'fill-opacity 0.2s')
      .on('mouseenter', (event, d) => {
        const rect = svgEl.getBoundingClientRect();
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          node: d,
        });
        d3.select(event.target).attr('fill-opacity', 1).attr('stroke-width', 2.5);
      })
      .on('mouseleave', (event, d) => {
        setTooltip(null);
        d3.select(event.target)
          .attr('fill-opacity', d.type === 'center' ? 1 : d.type === 'current' ? 1 : 0.85)
          .attr('stroke-width', d.type === 'center' ? 2 : 1);
      })
      .on('click', (event, d) => {
        // Highlight connected nodes
        const connectedIds = new Set();
        rawLinks.forEach((l) => {
          const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
          const targetId = typeof l.target === 'object' ? l.target.id : l.target;
          if (sourceId === d.id) connectedIds.add(targetId);
          if (targetId === d.id) connectedIds.add(sourceId);
        });

        node.selectAll('circle').attr('fill-opacity', (n) => {
          if (n.id === d.id) return 1;
          if (connectedIds.has(n.id)) return 1;
          return 0.2;
        });

        link.attr('stroke-opacity', (l) => {
          const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
          const targetId = typeof l.target === 'object' ? l.target.id : l.target;
          if (sourceId === d.id || targetId === d.id) return 1;
          return 0.1;
        });

        // Reset after 2s
        setTimeout(() => {
          node.selectAll('circle').attr('fill-opacity', (n) =>
            n.type === 'center' ? 1 : n.type === 'current' ? 1 : 0.85
          );
          link.attr('stroke-opacity', 0.6);
        }, 2000);
      });

    // Node labels for center and subject nodes
    node
      .append('text')
      .filter((d) => d.type === 'center' || d.type === 'subject')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.radius + 14)
      .attr('fill', (d) => (d.type === 'center' ? '#fff' : 'rgba(255,255,255,0.8)'))
      .attr('font-family', "'JetBrains Mono', 'Fira Code', monospace")
      .attr('font-size', (d) => (d.type === 'center' ? '11px' : '9px'))
      .text((d) => {
        if (d.type === 'center') return kidName || d.label;
        return d.icon + ' ' + d.label;
      });

    // Subject progress labels
    node
      .append('text')
      .filter((d) => d.type === 'subject')
      .attr('text-anchor', 'middle')
      .attr('dy', d.radius + 26)
      .attr('fill', 'rgba(255,255,255,0.4)')
      .attr('font-family', "'JetBrains Mono', 'Fira Code', monospace")
      .attr('font-size', '7px')
      .text((d) => `${d.pct}%`);

    // Tick updates
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [kidData, kidColor, kidName, kidEmoji, dimensions]);

  // Fallback - no data
  if (!hasData) {
    return (
      <div
        ref={containerRef}
        className="w-full rounded-2xl flex flex-col items-center justify-center"
        style={{ backgroundColor: '#0d1b2a', minHeight: 400 }}
      >
        <div className="text-center px-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a2a3a] flex items-center justify-center">
            <span className="text-2xl">🌌</span>
          </div>
          <p className="text-white text-sm font-medium font-mono mb-1">
            Complete some lessons to build your knowledge graph!
          </p>
          <p className="text-gray-500 text-xs font-mono">
            Your learning journey will appear here as you progress.
          </p>
        </div>
        {/* Minimal center node placeholder */}
        <svg width="300" height="200" className="mt-4">
          <defs>
            <filter id="placeholder-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="150" cy="90" r="18" fill={kidColor} opacity="0.5" filter="url(#placeholder-glow)" />
          <text
            x="150"
            y="125"
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="10"
          >
            {(kidName || 'You')} {kidEmoji}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl relative overflow-hidden"
      style={{ backgroundColor: '#0d1b2a', minHeight: 450 }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ display: 'block', minHeight: 450 }}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-20 bg-[#1a2a3a] border border-[#2a3a4a] rounded-lg px-3 py-2 shadow-lg"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 40,
          }}
        >
          <p className="text-white text-xs font-mono font-medium">
            {tooltip.node.label}
          </p>
          <p className="text-gray-500 text-[10px] font-mono capitalize mt-0.5">
            {tooltip.node.type}
            {tooltip.node.pct !== undefined && ` - ${tooltip.node.pct}% complete`}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] font-mono">
        <span className="flex items-center gap-1 text-gray-400">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: kidColor }} />
          Completed
        </span>
        <span className="flex items-center gap-1 text-gray-500">
          <span className="w-2 h-2 rounded-full border border-dashed" style={{ borderColor: kidColor, backgroundColor: kidColor + '66' }} />
          In progress
        </span>
        <span className="text-gray-600 text-[9px]">Click to highlight - Drag to move - Scroll to zoom</span>
      </div>
    </div>
  );
}
