import React from 'react';
import { Sparkles, Cpu, BookOpen, Download, Terminal, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  tokensUsed?: number;
  onExport: () => void;
  onSelectBenchmark: (id: string) => void;
  currentPaperTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  tokensUsed = 3450,
  onExport,
  onSelectBenchmark,
  currentPaperTitle,
}) => {
  // Token efficiency constraint is 25,000 tokens
  const maxTokens = 25000;
  const tokenPercentage = Math.min(100, Math.round((tokensUsed / maxTokens) * 100));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Brand and Agent identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Cpu className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                PaperFlow
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
                  CS Research Agent
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Academic Paper Ingestion</span>
              <span className="text-slate-600">•</span>
              <span>Mermaid Architecture</span>
              <span className="text-slate-600">•</span>
              <span>Student Resume Blueprints</span>
            </p>
          </div>
        </div>

        {/* Status, Token Efficiency Monitor, and Actions */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs">
          
          {/* Token Efficiency Guard (<25,000 token constraint) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800" title="Token efficiency constraint: Well under 25,000 tokens">
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  Budget Efficiency
                </span>
                <span className="font-mono font-medium text-cyan-300">
                  {tokensUsed.toLocaleString()} / 25k tok
                </span>
              </div>
              <div className="w-32 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    tokenPercentage < 40 ? 'bg-emerald-400' : tokenPercentage < 75 ? 'bg-cyan-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${tokenPercentage}%` }}
                />
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400 ml-1" />
          </div>

          {/* Quick Benchmark Dropdown */}
          <div className="relative">
            <select
              aria-label="Load Landmark Benchmark Paper"
              className="appearance-none bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700/70 hover:border-slate-600 rounded-lg px-3 py-1.5 pr-7 font-medium text-xs transition cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onChange={(e) => {
                if (e.target.value) {
                  onSelectBenchmark(e.target.value);
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Load Landmark Paper...</option>
              <option value="attention-is-all-you-need">Attention Is All You Need (Transformer)</option>
              <option value="mamba-ssm">Mamba: Linear-Time State Spaces</option>
              <option value="lora-adaptation">LoRA: Low-Rank Adaptation</option>
              <option value="deepseek-v3">DeepSeek-V3: Multi-Head Latent Attention & MoE</option>
              <option value="flash-attention">FlashAttention: IO-Awareness</option>
              <option value="dpo-alignment">Direct Preference Optimization (DPO)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Export Report */}
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition shadow-sm shadow-indigo-600/30 active:scale-95"
            title="Export complete 3-step paper report as Markdown or PDF format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

        </div>

      </div>
    </header>
  );
};
