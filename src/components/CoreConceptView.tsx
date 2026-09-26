import React, { useState } from 'react';
import { CoreConcept, PaperMeta } from '../types/paper';
import { AlertCircle, Cpu, Sigma, CheckCircle, Copy, Check, Volume2, ExternalLink, Sparkles, BookOpen } from 'lucide-react';

interface CoreConceptViewProps {
  coreConcept: CoreConcept;
  paperMeta: PaperMeta;
}

export const CoreConceptView: React.FC<CoreConceptViewProps> = ({
  coreConcept,
  paperMeta,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Calculate actual word count of the combined summary
  const words = coreConcept.combinedSummary
    ? coreConcept.combinedSummary.trim().split(/\s+/).length
    : coreConcept.wordCount || 200;

  const isUnderLimit = words <= 300;

  const handleCopy = () => {
    const textToCopy = `Title: ${paperMeta.title}\n\n1. CORE CONCEPT EXTRACTION (<300 words):\n\n[Problem Statement]\n${coreConcept.problemStatement}\n\n[Primary Methodology]\n${coreConcept.methodology}\n\n[Key Mathematical Breakthroughs]\n${coreConcept.mathematicalBreakthroughs}\n\n[Unified Summary]\n${coreConcept.combinedSummary}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(coreConcept.combinedSummary);
    utterance.rate = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Header bar for Step 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/30">
              1
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Core Concept Extraction
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Problem statement, primary methodology, and mathematical breakthroughs in plain accessible language.
          </p>
        </div>

        {/* Word Count Badge (< 300 words strict operational constraint) */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              isUnderLimit
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                : 'bg-rose-950/80 text-rose-300 border-rose-700/60'
            }`}
            title="Operational Constraint: Total concept summary must be under 300 words"
          >
            {isUnderLimit ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className="font-mono font-semibold">{words}</span>
            <span className="text-slate-400 font-normal">/ 300 words</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/40 ml-0.5">
              {isUnderLimit ? 'Compliant' : 'Over limit'}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition active:scale-95"
            title="Copy core concept text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {'speechSynthesis' in window && (
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-lg border text-xs transition active:scale-95 ${
                isSpeaking
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isSpeaking ? 'Stop Audio' : 'Listen to Accessible Summary'}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Paper Metadata Ribbon */}
      <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            {paperMeta.title}
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {paperMeta.authors && paperMeta.authors.length > 0 ? paperMeta.authors.slice(0, 4).join(', ') : 'Unknown Authors'}
            {paperMeta.authors && paperMeta.authors.length > 4 ? ` et al.` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {paperMeta.venue && (
            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono text-[11px]">
              {paperMeta.venue}
            </span>
          )}
          {paperMeta.year && (
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
              {paperMeta.year}
            </span>
          )}
          {paperMeta.url && (
            <a
              href={paperMeta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 ml-1"
            >
              <span>Paper Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* The 3 Core Breakdown Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        
        {/* Pillar A: Problem Statement */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-amber-500/40 transition flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold tracking-wide uppercase text-amber-300 font-mono">
                Problem Statement
              </h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {coreConcept.problemStatement}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bottleneck & Failure Mode</span>
            <span className="text-amber-400/80 font-mono">Core Flaw</span>
          </div>
        </div>

        {/* Pillar B: Primary Methodology */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-indigo-500/40 transition flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold tracking-wide uppercase text-indigo-300 font-mono">
                Primary Methodology
              </h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {coreConcept.methodology}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Architectural Novelty</span>
            <span className="text-indigo-400/80 font-mono">Engine</span>
          </div>
        </div>

        {/* Pillar C: Mathematical / Algorithmic Breakthroughs */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-emerald-500/40 transition flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sigma className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold tracking-wide uppercase text-emerald-300 font-mono">
                Math & Algorithmic Breakthrough
              </h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {coreConcept.mathematicalBreakthroughs}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Intuitive Formulation</span>
            <span className="text-emerald-400/80 font-mono">Proof / Scan</span>
          </div>
        </div>

      </div>

      {/* Unified Accessible Summary */}
      <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-800/40">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold tracking-wide uppercase text-indigo-200 font-mono">
            Unified Plain-Language Synopsis (Accessible to 3rd-Year CS)
          </h4>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          {coreConcept.combinedSummary}
        </p>
      </div>

    </section>
  );
};
