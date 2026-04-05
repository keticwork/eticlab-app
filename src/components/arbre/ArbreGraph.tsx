"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

type Phase = {
  code: string;
  nom: string;
  couleur: string;
  ordre: number;
};

type Module = {
  id: string;
  code: string;
  nom: string;
  description: string;
  statut: string;
  phases: { nom: string; couleur: string; code: string } | null;
};

type Connexion = {
  id: string;
  module_source: string;
  module_cible: string;
};

type GraphNode = {
  id: string;
  code: string;
  nom: string;
  description: string;
  couleur: string;
  phaseNom: string;
  statut: string;
  x?: number;
  y?: number;
};

type GraphLink = {
  source: string;
  target: string;
};

export function ArbreGraph({
  phases,
  modules,
  connexions,
}: {
  phases: Phase[];
  modules: Module[];
  connexions: Connexion[];
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: Math.max(450, window.innerHeight - 280),
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Build graph data
  const nodes: GraphNode[] = modules.map((m) => ({
    id: m.code,
    code: m.code,
    nom: m.nom,
    description: m.description || "",
    couleur: m.phases?.couleur || "#666",
    phaseNom: m.phases?.nom || "",
    statut: m.statut,
  }));

  const links: GraphLink[] = connexions.map((c) => ({
    source: c.module_source,
    target: c.module_cible,
  }));

  const graphData = { nodes, links };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node as GraphNode);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paintNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D) => {
      const x = node.x || 0;
      const y = node.y || 0;
      const radius = 16;
      const isSelected = selectedNode?.id === node.id;

      // Outer glow if selected
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 4, 0, 2 * Math.PI);
        ctx.fillStyle = node.couleur + "40";
        ctx.fill();
      }

      // Circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.couleur + (node.statut === "disponible" ? "dd" : "55");
      ctx.fill();

      // Border
      ctx.strokeStyle = node.couleur;
      ctx.lineWidth = isSelected ? 2.5 : 1;
      ctx.stroke();

      // Label
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 7px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(node.code, x, y - 2);

      // Nom below
      ctx.font = "5px sans-serif";
      ctx.fillStyle = "#ffffffaa";
      ctx.fillText(
        node.nom.length > 12 ? node.nom.slice(0, 12) + "…" : node.nom,
        x,
        y + 6
      );
    },
    [selectedNode]
  );

  if (!mounted) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center"
        style={{ height: 500 }}
      >
        <p className="text-gray-600">Chargement de l&apos;arbre...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0A0F0D"
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, 18, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        onNodeClick={handleNodeClick}
        onBackgroundClick={() => setSelectedNode(null)}
        linkColor={() => "rgba(255,255,255,0.08)"}
        linkWidth={1}
        d3AlphaDecay={0.04}
        d3VelocityDecay={0.3}
        cooldownTicks={100}
        enableZoomInteraction={true}
        enablePanInteraction={true}
      />

      {/* Tooltip / Popup */}
      {selectedNode && (
        <div className="absolute right-4 top-4 z-20 w-64 rounded-xl border border-white/10 bg-[#131a16] p-5 shadow-xl backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="rounded-md px-2 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: selectedNode.couleur }}
            >
              {selectedNode.code}
            </span>
            <span className="text-xs text-gray-500">
              {selectedNode.phaseNom}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white">
            {selectedNode.nom}
          </h3>
          {selectedNode.description && (
            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              {selectedNode.description}
            </p>
          )}
          <div className="mt-1 text-xs text-gray-600">
            {selectedNode.statut === "disponible" ? "✅ Disponible" : "🔲 Bientôt"}
          </div>
          <div className="mt-4 flex gap-2">
            <Link
              href={`/modules/${selectedNode.code.toLowerCase()}`}
              className="flex-1 rounded-lg bg-[#1D9E75] px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-[#178a64]"
            >
              Voir le module
            </Link>
            <button
              onClick={() => setSelectedNode(null)}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-white/5"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
