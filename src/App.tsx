import React, { useState } from 'react';
import { Header } from './components/Header';
import { PaperInputBar } from './components/PaperInputBar';
import { CoreConceptView } from './components/CoreConceptView';
import { MermaidFlowchartView } from './components/MermaidFlowchartView';
import { StudentOpportunitiesView } from './components/StudentOpportunitiesView';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { ExportModal } from './components/ExportModal';
import { ATTENTION_PAPER, MAMBA_PAPER, LORA_PAPER, DEFAULT_PAPERS_MAP } from './data/samplePapers';
import { PaperAnalysis } from './types/paper';
import { AlertTriangle, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [analysis, setAnalysis] = useState<PaperAnalysis>(ATTENTION_PAPER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>('attention-is-all-you-need');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Quick preset selection
  const handleSelectPreset = async (presetId: string) => {
    setActivePresetId(presetId);
    setErrorMessage(null);

    // If pre-computed in memory, load immediately for blazing fast responsiveness
    if (DEFAULT_PAPERS_MAP[presetId]) {
      setAnalysis(DEFAULT_PAPERS_MAP[presetId]);
      return;
    }

    // Otherwise trigger backend analysis
    const presetQueries: Record<string, string> = {
      'deepseek-v3': 'https://arxiv.org/abs/2412.19437',
      'flash-attention': 'https://arxiv.org/abs/2205.14135',
      'dpo-alignment': 'https://arxiv.org/abs/2305.18290',
    };

    const targetUrl = presetQueries[presetId];
    if (targetUrl) {
      await handleAnalyze({ paperUrl: targetUrl });
    }
  };

  // Perform full paper analysis via server-side Gemini 3.8 Flash agent
  const handleAnalyze = async (payload: { paperUrl?: string; paperTitle?: string; paperText?: string }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze paper.');
      }

      setAnalysis(json.data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message || 'Error executing CS Research Agent workflow. Falling back to benchmark archive.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        tokensUsed={analysis.paperMeta.estimatedTokensUsed || 3450}
        onExport={() => setIsExportOpen(true)}
        onSelectBenchmark={handleSelectPreset}
        currentPaperTitle={analysis.paperMeta.title}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs underline hover:text-white font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Paper Input & Ingestion Bar */}
        <PaperInputBar
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* Step 1: Core Concept Extraction (<300 words) */}
        <CoreConceptView
          coreConcept={analysis.coreConcept}
          paperMeta={analysis.paperMeta}
        />

        {/* Step 2: Architectural Flowchart (Mermaid.js graph TD) */}
        <MermaidFlowchartView
          mermaidCode={analysis.mermaidCode}
          rawLabeledFlowchart={analysis.rawLabeledFlowchart}
          nodeDetails={analysis.nodeDetails}
        />

        {/* Step 3: Future Work & Internship Opportunities for 3rd-year CS students */}
        <StudentOpportunitiesView
          opportunities={analysis.studentOpportunities}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-300">PaperFlow CS Research Agent</span>
            <span className="text-slate-600">|</span>
            <span>Gemini 3.8 Flash Engine</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Prioritizing token efficiency (&lt;25,000 tokens) • Architectural Mermaid flowcharts • Undergraduate CS portfolios
          </p>
        </div>
      </footer>

      {/* Interactive Agent Chat Drawer */}
      <AgentChatDrawer
        paperMeta={analysis.paperMeta}
        paperSummary={analysis.coreConcept.combinedSummary}
      />

      {/* Full Report Export Modal */}
      <ExportModal
        analysis={analysis}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
