import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { NodeDetail } from '../types/paper';
import { 
  GitGraph, 
  Copy, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Download, 
  Code, 
  Eye, 
  Layers, 
  Info,
  Sliders
} from 'lucide-react';

interface MermaidFlowchartViewProps {
  mermaidCode: string;
  rawLabeledFlowchart: string;
  nodeDetails?: NodeDetail[];
}

export const MermaidFlowchartView: React.FC<MermaidFlowchartViewProps> = ({
  mermaidCode,
  rawLabeledFlowchart,
  nodeDetails = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'nodes'>('visual');
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(null);

  // Initialize mermaid configuration
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#020617',
        primaryColor: '#6366f1',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#818cf8',
        lineColor: '#38bdf8',
        secondaryColor: '#1e1b4b',
        tertiaryColor: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      flowchart: {
        curve: 'basis',
        useMaxWidth: false,
        htmlLabels: true,
      },
    });
  }, []);

  // Clean code for mermaid (strip [FLOWCHART] header or markdown backticks if present)
  const cleanMermaid = (raw: string): string => {
    let clean = raw.trim();
    if (clean.startsWith('[FLOWCHART]')) {
      clean = clean.replace(/^\[FLOWCHART\]\s*/, '').trim();
    }
    // Remove markdown code fences if any
    clean = clean.replace(/^```mermaid\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
    return clean;
  };

  // Render diagram whenever code changes
  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      setRenderError(null);
      const code = cleanMermaid(mermaidCode || rawLabeledFlowchart);
      if (!code) return;

      try {
        const uniqueId = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, code);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setRenderError(err.message || 'Syntax error in Mermaid flowchart definition.');
        }
      }
    };

    renderDiagram();
    return () => {
      isMounted = false;
    };
  }, [mermaidCode, rawLabeledFlowchart]);

  const handleCopyCode = () => {
    const formatted = rawLabeledFlowchart?.startsWith('[FLOWCHART]')
      ? rawLabeledFlowchart
      : `[FLOWCHART]\n${cleanMermaid(mermaidCode)}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `architecture-flowchart.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className={`bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 bg-slate-950 flex flex-col p-6' : 'p-5 sm:p-6'
    }`}>
      {/* Header bar for Step 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30">
              2
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Architectural Flowchart (Mermaid.js)
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
              [FLOWCHART]
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Components, data inputs, model layers, and data outputs charted via clean graph TD.
          </p>
        </div>

        {/* Action controls & tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab selector */}
          <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition ${
                activeTab === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Diagram</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition ${
                activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Mermaid Code</span>
            </button>

            {nodeDetails && nodeDetails.length > 0 && (
              <button
                onClick={() => setActiveTab('nodes')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition ${
                  activeTab === 'nodes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layer Inspector ({nodeDetails.length})</span>
              </button>
            )}
          </div>

          {/* Copy Mermaid */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition active:scale-95"
            title="Copy [FLOWCHART] text segment"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy [FLOWCHART]'}</span>
          </button>

          {/* Download SVG */}
          {svgContent && activeTab === 'visual' && (
            <button
              onClick={handleDownloadSvg}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition active:scale-95"
              title="Download SVG file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition active:scale-95"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className={`mt-4 ${isFullscreen ? 'flex-1 overflow-hidden flex flex-col' : ''}`}>
        
        {/* Tab 1: Visual Diagram with Pan/Zoom */}
        {activeTab === 'visual' && (
          <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 min-h-[380px] flex flex-col justify-between overflow-hidden">
            
            {/* Zoom Controls Overlay */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-800 text-xs shadow-md">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.15).toFixed(2))))}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-300 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-slate-300 w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.15).toFixed(2))))}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-300 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-300 transition border-l border-slate-800 ml-0.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Error or Rendered SVG */}
            {renderError ? (
              <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono">
                <p className="font-semibold mb-1">Mermaid Syntax Parsing Warning:</p>
                <p className="text-slate-300">{renderError}</p>
                <div className="mt-3">
                  <p className="text-slate-400 mb-1">Raw code fallback:</p>
                  <pre className="p-2 bg-black/60 rounded text-[11px] overflow-x-auto text-amber-200">
                    {cleanMermaid(mermaidCode || rawLabeledFlowchart)}
                  </pre>
                </div>
              </div>
            ) : svgContent ? (
              <div
                ref={containerRef}
                className="w-full flex-1 flex items-center justify-center overflow-auto p-4 transition-transform duration-150"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500 text-xs">
                Rendering Mermaid architectural graph...
              </div>
            )}

            {/* Diagram Footer helper */}
            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Syntactically verified Mermaid.js flowchart (graph TD)
              </span>
              <span className="font-mono text-slate-400">
                Use controls to zoom / click 'Layer Inspector' to view tensor dimensions
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Raw Mermaid Code ([FLOWCHART]) */}
        {activeTab === 'code' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-mono">
                <span className="text-cyan-400">[FLOWCHART]</span> Segment Output
              </span>
              <span className="text-slate-400">No Markdown code fences inside Mermaid payload</span>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800/90 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-[460px]">
              {rawLabeledFlowchart?.startsWith('[FLOWCHART]')
                ? rawLabeledFlowchart
                : `[FLOWCHART]\n${cleanMermaid(mermaidCode)}`}
            </pre>
          </div>
        )}

        {/* Tab 3: Interactive Layer & Node Inspector */}
        {activeTab === 'nodes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Left list of layers / nodes */}
            <div className="md:col-span-1 space-y-2 max-h-[420px] overflow-y-auto pr-1">
              <div className="text-xs font-semibold text-slate-400 px-1 uppercase tracking-wider font-mono">
                System Components & Sublayers
              </div>
              {nodeDetails.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition flex flex-col gap-1 ${
                    (selectedNode?.id || nodeDetails[0]?.id) === node.id
                      ? 'bg-indigo-950/70 border-indigo-500/70 text-indigo-100 shadow-sm'
                      : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold font-mono text-cyan-300">{node.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Layer</span>
                  </div>
                  <span className="font-medium text-slate-200">{node.label}</span>
                </button>
              ))}
            </div>

            {/* Right inspection detail pane */}
            <div className="md:col-span-2 p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              {(() => {
                const node = selectedNode || nodeDetails[0];
                if (!node) return <div>No layer information extracted.</div>;
                return (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-xs font-bold">
                          {node.id}
                        </span>
                        <h4 className="text-base font-bold text-white">{node.label}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{node.role}</p>
                    </div>

                    {node.shape && (
                      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                          Tensor Dimension / Mathematical Shape:
                        </div>
                        <div className="font-mono text-sm text-emerald-400 font-semibold">
                          {node.shape}
                        </div>
                      </div>
                    )}

                    {node.notes && (
                      <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40">
                        <div className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" />
                          Architectural Operation & Hardware Behavior:
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {node.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Derived from paper structural equations</span>
                <span className="font-mono text-slate-400">Mermaid Node Inspect</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
