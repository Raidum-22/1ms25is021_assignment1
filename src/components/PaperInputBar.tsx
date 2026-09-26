import React, { useState } from 'react';
import { Search, Link as LinkIcon, FileText, ArrowRight, Loader2, Sparkles, BookMarked, CheckCircle2 } from 'lucide-react';

interface PaperInputBarProps {
  onAnalyze: (payload: { paperUrl?: string; paperTitle?: string; paperText?: string }) => void;
  isLoading: boolean;
  activePresetId?: string;
  onSelectPreset: (id: string) => void;
}

export const PaperInputBar: React.FC<PaperInputBarProps> = ({
  onAnalyze,
  isLoading,
  activePresetId,
  onSelectPreset,
}) => {
  const [tab, setTab] = useState<'url' | 'text'>('url');
  const [urlOrQuery, setUrlOrQuery] = useState('');
  const [paperText, setPaperText] = useState('');
  const [loadingStep, setLoadingStep] = useState<number>(1);

  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStep(1);
      return;
    }
    const timer1 = setTimeout(() => setLoadingStep(2), 1400);
    const timer2 = setTimeout(() => setLoadingStep(3), 3200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'url') {
      if (!urlOrQuery.trim()) return;
      // If it looks like a URL or arXiv ID
      const trimmed = urlOrQuery.trim();
      const isUrl = /^https?:\/\//i.test(trimmed) || trimmed.includes('arxiv.org');
      onAnalyze({
        paperUrl: isUrl ? trimmed : undefined,
        paperTitle: !isUrl ? trimmed : undefined,
      });
    } else {
      if (!paperText.trim()) return;
      onAnalyze({
        paperText: paperText.trim(),
        paperTitle: 'Custom Uploaded Academic Paper',
      });
    }
  };

  const PRESETS = [
    { id: 'attention-is-all-you-need', label: 'Transformer (Attention Is All You Need)', arxiv: '1706.03762' },
    { id: 'mamba-ssm', label: 'Mamba (Selective State Spaces)', arxiv: '2312.00752' },
    { id: 'lora-adaptation', label: 'LoRA (Low-Rank Adaptation)', arxiv: '2106.09685' },
    { id: 'deepseek-v3', label: 'DeepSeek-V3 (MLA & MoE)', arxiv: '2412.19437' },
    { id: 'flash-attention', label: 'FlashAttention (IO-Aware)', arxiv: '2205.14135' },
    { id: 'dpo-alignment', label: 'Direct Preference Optimization (DPO)', arxiv: '2305.18290' },
  ];

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 relative overflow-hidden backdrop-blur-sm">
      {/* Decorative subtle ambient gradient */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Top bar with tabs & operational note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 relative z-10">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              tab === 'url'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Paper URL / arXiv ID / Title
          </button>

          <button
            type="button"
            onClick={() => setTab('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              tab === 'text'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Paste Abstract / Excerpt
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Token-Optimized Parsing (&lt;25,000 tokens constraint enforced)</span>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative z-10">
        {tab === 'url' ? (
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={urlOrQuery}
                onChange={(e) => setUrlOrQuery(e.target.value)}
                placeholder="Enter arXiv link (e.g. https://arxiv.org/abs/2312.00752), arXiv ID (1706.03762), or paper title..."
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !urlOrQuery.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 active:scale-95 shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Agent Parsing...</span>
                </>
              ) : (
                <>
                  <span>Ingest & Parse</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              rows={4}
              value={paperText}
              onChange={(e) => setPaperText(e.target.value)}
              placeholder="Paste paper abstract, architecture descriptions, or mathematical equations here..."
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition font-mono"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !paperText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Paper Text...</span>
                  </>
                ) : (
                  <>
                    <span>Extract Architecture & Opportunities</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Preset Chips */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs relative z-10">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
          Benchmark Papers:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              setUrlOrQuery(`https://arxiv.org/abs/${preset.arxiv}`);
              onSelectPreset(preset.id);
            }}
            className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
              activePresetId === preset.id
                ? 'bg-indigo-950 text-indigo-200 border-indigo-500/70 shadow-sm'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{preset.label}</span>
            <span className="text-[10px] text-slate-500 font-mono">arXiv:{preset.arxiv}</span>
          </button>
        ))}
      </div>

      {/* Multi-step loading progress indicator */}
      {isLoading && (
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/90 border border-indigo-900/60 relative z-10 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              Agent Workflow in Progress
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Step {loadingStep} of 3</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            <div className={`p-2 rounded-lg border flex items-center gap-2 ${
              loadingStep >= 1 ? 'bg-indigo-950/50 border-indigo-700/60 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              {loadingStep > 1 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
              )}
              <span>1. Core Concept Extraction (&lt;300 words)</span>
            </div>

            <div className={`p-2 rounded-lg border flex items-center gap-2 ${
              loadingStep >= 2 ? 'bg-indigo-950/50 border-indigo-700/60 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              {loadingStep > 2 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : loadingStep === 2 ? (
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span>2. Architectural Flowchart (Mermaid graph TD)</span>
            </div>

            <div className={`p-2 rounded-lg border flex items-center gap-2 ${
              loadingStep >= 3 ? 'bg-indigo-950/50 border-indigo-700/60 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              {loadingStep === 3 ? (
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span>3. Student Project Opportunities & Roadmap</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
