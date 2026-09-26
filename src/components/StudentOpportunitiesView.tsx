import React, { useState } from 'react';
import { StudentOpportunity } from '../types/paper';
import { 
  Briefcase, 
  Target, 
  Wrench, 
  Milestone, 
  FileText, 
  Copy, 
  Check, 
  Terminal, 
  HelpCircle, 
  TrendingUp, 
  ChevronRight,
  Code2,
  ExternalLink
} from 'lucide-react';

interface StudentOpportunitiesViewProps {
  opportunities: StudentOpportunity[];
}

export const StudentOpportunitiesView: React.FC<StudentOpportunitiesViewProps> = ({
  opportunities,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string>(opportunities[0]?.id || 'proj-1');

  const handleCopyResumeBullet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Header bar for Step 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
              3
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Future Work & Internship Opportunities
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">
              3rd-Year CS Student Portfolios
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Concrete, realistic ways to extend or optimize this paper for competitive SWE / ML Engineering internships.
          </p>
        </div>

        <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>3 Tested Student Blueprints</span>
        </div>
      </div>

      {/* 3 Project Cards */}
      <div className="mt-5 space-y-4">
        {opportunities.map((proj, idx) => {
          const isExpanded = expandedId === proj.id;
          return (
            <div
              key={proj.id || idx}
              className={`rounded-xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-950/90 border-indigo-500/60 shadow-lg shadow-indigo-950/30'
                  : 'bg-slate-950/50 hover:bg-slate-950/80 border-slate-800/80'
              }`}
            >
              {/* Card Title Header / Accordion Toggle */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? '' : proj.id)}
                className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-4 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-900/50 text-indigo-300 font-mono text-xs font-bold border border-indigo-700/40 shrink-0 mt-0.5 sm:mt-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {proj.exactExtension}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 text-[11px] font-medium border border-emerald-800/50">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    Target: {proj.targetMetric.length > 32 ? proj.targetMetric.slice(0, 32) + '...' : proj.targetMetric}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-90 text-indigo-400' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Project Blueprint Details */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-5 animate-fadeIn">
                  
                  {/* Extension & Target Metric Duo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    
                    {/* The Exact Extension */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="flex items-center gap-2 mb-1.5 text-indigo-400 text-xs font-bold font-mono uppercase tracking-wider">
                        <Target className="w-4 h-4 text-indigo-400" />
                        Exact Extension Blueprint
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {proj.exactExtension}
                      </p>
                    </div>

                    {/* Targeted Performance Metric */}
                    <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                      <div className="flex items-center gap-2 mb-1.5 text-emerald-300 text-xs font-bold font-mono uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        Targeted Performance Metric
                      </div>
                      <p className="text-sm text-emerald-200 font-medium leading-relaxed">
                        {proj.targetMetric}
                      </p>
                    </div>

                  </div>

                  {/* Recommended Tech Stack */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                      <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                      Recommended Tech Stack
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {proj.recommendedTechStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-700/80 font-mono text-xs flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Implementation Roadmap */}
                  {proj.implementationRoadmap && proj.implementationRoadmap.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2.5 text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                        <Milestone className="w-3.5 h-3.5 text-amber-400" />
                        Step-by-Step Implementation Roadmap
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {proj.implementationRoadmap.map((step, idxStep) => (
                          <div
                            key={idxStep}
                            className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
                          >
                            <span className="text-[11px] font-mono font-semibold text-amber-300 mb-1">
                              {step.week}
                            </span>
                            <p className="text-xs text-slate-300 leading-snug">
                              {step.task}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benchmarks to measure */}
                  {proj.benchmarks && proj.benchmarks.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Key Benchmarks to Report in Project README:
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-300">
                        {proj.benchmarks.map((bm, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{bm}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ready-to-paste Resume Bullet Point */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-700/50 relative">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Resume Bullet Point (Drop-in Ready)
                      </span>
                      <button
                        onClick={() => handleCopyResumeBullet(proj.id, proj.resumeBulletPoint)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition active:scale-95 shadow-sm"
                      >
                        {copiedId === proj.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-300" />
                            <span>Copied to Clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-sans text-slate-100 italic bg-black/30 p-2.5 rounded-lg border border-slate-800/80">
                      "{proj.resumeBulletPoint}"
                    </p>
                  </div>

                  {/* Interview Talking Points & Technical Trade-offs */}
                  {proj.interviewTalkingPoints && proj.interviewTalkingPoints.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        Interview Talking Points & Technical Trade-offs:
                      </div>
                      <div className="space-y-1.5">
                        {proj.interviewTalkingPoints.map((point, idxPoint) => (
                          <div key={idxPoint} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-amber-400 font-bold shrink-0">Q{idxPoint + 1}:</span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Starter Scaffold snippet */}
                  {proj.starterScaffold && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Terminal className="w-3 h-3 text-cyan-400" />
                          Terminal Quickstart Scaffold
                        </span>
                      </div>
                      <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-2 rounded bg-black/60">
                        {proj.starterScaffold}
                      </pre>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
