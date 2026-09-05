import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  GitFork, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  Layers, 
  Eye 
} from 'lucide-react';

export default function MarketGraphView({
  graphData,
  onSelectTicker,
  loading
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL', 'SUPPLY_CHAIN', 'COMPETITORS'

  useEffect(() => {
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0 || !svgRef.current) {
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("viewBox", [0, 0, width, height]);

    // Graph Elements Container for zoom
    const g = svg.append("g");

    // Add Zoom Behavior
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Filter Edges and Nodes based on filterMode
    let edges = graphData.edges.map(d => ({ ...d }));
    if (filterMode === 'SUPPLY_CHAIN') {
      edges = edges.filter(e => e.relationship === 'SUPPLIES_TO');
    } else if (filterMode === 'COMPETITORS') {
      edges = edges.filter(e => e.relationship === 'COMPETES_WITH');
    }

    let nodes = graphData.nodes.map(d => ({ ...d }));
    if (filterMode !== 'ALL') {
      const activeIds = new Set();
      edges.forEach(e => {
        const sId = typeof e.source === 'object' ? e.source.id : e.source;
        const tId = typeof e.target === 'object' ? e.target.id : e.target;
        activeIds.add(sId);
        activeIds.add(tId);
      });
      if (activeIds.size > 0) {
        nodes = nodes.filter(n => activeIds.has(n.id));
      }
    }

    // Arrow markers for directed supply chain edges
    const defs = svg.append("defs");
    defs.append("marker")
      .attr("id", "arrow-supplies")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 26)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#3B82F6");

    defs.append("marker")
      .attr("id", "arrow-competes")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 26)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#EF4444");

    // Force Simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id(d => d.id).distance(110))
      .force("charge", d3.forceManyBody().strength(-350))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(36));

    // Draw Edges (Links)
    const link = g.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", d => {
        if (d.relationship === 'SUPPLIES_TO') return '#3B82F6';
        if (d.relationship === 'COMPETES_WITH') return '#EF4444';
        return '#64748B';
      })
      .attr("stroke-width", d => Math.max(1.5, (d.weight || 1) * 2))
      .attr("stroke-dasharray", d => d.relationship === 'COMPETES_WITH' ? '4,4' : 'none')
      .attr("marker-end", d => {
        if (d.relationship === 'SUPPLIES_TO') return 'url(#arrow-supplies)';
        if (d.relationship === 'COMPETES_WITH') return 'url(#arrow-competes)';
        return null;
      });

    // Draw Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => {
        setSelectedNode(d);
        if (onSelectTicker) onSelectTicker(d.id);
      });

    // Node Outer Glow for Anomalies
    node.each(function(d) {
      const isAnomaly = d.rvol >= 2.0 || Math.abs(d.change_pct || 0) >= 3.0;
      if (isAnomaly) {
        d3.select(this).append("circle")
          .attr("r", 26)
          .attr("fill", "none")
          .attr("stroke", d.change_pct < 0 ? "#EF4444" : "#10B981")
          .attr("stroke-width", 2)
          .attr("stroke-opacity", 0.8)
          .attr("class", "animate-pulse-glow");
      }
    });

    // Node Core Circle
    node.append("circle")
      .attr("r", d => d.nodeType === 'ETF' ? 22 : d.isWatchlist ? 20 : 16)
      .attr("fill", d => {
        if (d.nodeType === 'ETF') return '#1E293B';
        if (d.change_pct > 0) return '#064E3B';
        if (d.change_pct < 0) return '#7F1D1D';
        return '#1E293B';
      })
      .attr("stroke", d => {
        if (d.isWatchlist) return '#3B82F6';
        if (d.nodeType === 'ETF') return '#94A3B8';
        return '#475569';
      })
      .attr("stroke-width", d => d.isWatchlist ? 2.5 : 1.5);

    // Node Ticker Label
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-size", d => d.nodeType === 'ETF' ? "10px" : "11px")
      .attr("font-weight", "bold")
      .attr("fill", "#FFFFFF")
      .text(d => d.id);

    // Change Badge Text Below Node
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.1em")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-size", "9px")
      .attr("font-weight", "bold")
      .attr("fill", d => (d.change_pct || 0) >= 0 ? '#34D399' : '#F87171')
      .text(d => d.change_pct !== undefined ? `${d.change_pct > 0 ? '+' : ''}${d.change_pct.toFixed(1)}%` : '');

    // Tick update
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [graphData, filterMode]);

  return (
    <div className="bg-[#121826] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden" ref={containerRef}>
      
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-mono text-xs font-semibold uppercase tracking-wider border border-purple-500/20">
              <GitFork className="w-3.5 h-3.5 text-purple-400" />
              Relational Topology
            </span>
            <span className="text-xs text-slate-400 font-sans">
              Visualizing supply chains, competitors & second-order contagion
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Market Knowledge Graph & Contagion Flow
          </h3>
        </div>

        {/* Filter Edge Modes */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              filterMode === 'ALL' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Edges
          </button>
          <button
            onClick={() => setFilterMode('SUPPLY_CHAIN')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              filterMode === 'SUPPLY_CHAIN' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Supply Chains
          </button>
          <button
            onClick={() => setFilterMode('COMPETITORS')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              filterMode === 'COMPETITORS' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Competitors
          </button>
        </div>
      </div>

      {/* Interactive Legend & Key */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-400/40"></span>
          <span>Watched Asset</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-700"></span>
          <span>1-Hop Peer/Supplier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-blue-500"></span>
          <span>Supplies To (Solid)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-rose-500 border-b border-dashed border-rose-500"></span>
          <span>Competes With (Dashed)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full ring-2 ring-rose-500 animate-ping"></span>
          <span>Shockwave Anomaly Node</span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="w-full h-[480px] bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden relative">
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
        
        {/* Floating Hint */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5 pointer-events-none">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Click any node to inspect ripple exposure. Drag nodes or scroll to zoom.</span>
        </div>
      </div>

    </div>
  );
}
