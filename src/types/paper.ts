export interface PaperMeta {
  title: string;
  authors: string[];
  year: string;
  venue: string;
  url?: string;
  arxivId?: string;
  tagline?: string;
  category?: string;
  estimatedTokensUsed?: number;
}

export interface CoreConcept {
  problemStatement: string;
  methodology: string;
  mathematicalBreakthroughs: string;
  wordCount: number;
  combinedSummary: string;
}

export interface NodeDetail {
  id: string;
  label: string;
  role: string;
  shape?: string;
  notes?: string;
}

export interface ImplementationPhase {
  week: string;
  task: string;
}

export interface StudentOpportunity {
  id: string;
  title: string;
  exactExtension: string;
  targetMetric: string;
  recommendedTechStack: string[];
  implementationRoadmap: ImplementationPhase[];
  benchmarks: string[];
  resumeBulletPoint: string;
  interviewTalkingPoints: string[];
  starterScaffold?: string;
}

export interface PaperAnalysis {
  paperMeta: PaperMeta;
  coreConcept: CoreConcept;
  rawLabeledFlowchart: string;
  mermaidCode: string;
  nodeDetails: NodeDetail[];
  studentOpportunities: StudentOpportunity[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
