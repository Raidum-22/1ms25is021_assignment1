import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { DEFAULT_PAPERS_MAP } from './src/data/samplePapers.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client per AI Studio guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to extract arXiv ID from a URL or raw ID
function extractArxivId(input: string): string | null {
  const match = input.match(/(?:arxiv\.org\/(?:abs|pdf)\/|arxiv:)?([0-9]{4}\.[0-9]{4,5}(?:v[0-9]+)?)/i);
  return match ? match[1] : null;
}

// Fetch arXiv abstract/title directly if arXiv URL or ID is provided
async function fetchArxivMetadata(arxivId: string): Promise<{ title?: string; summary?: string; authors?: string[]; published?: string } | null> {
  try {
    const cleanId = arxivId.replace(/v\d+$/, '');
    const apiUrl = `https://export.arxiv.org/api/query?id_list=${cleanId}&max_results=1`;
    const res = await fetch(apiUrl);
    if (!res.ok) return null;
    const xml = await res.text();
    
    const titleMatch = xml.match(/<title>([^<]+)<\/title>/g);
    // second <title> in feed is entry title
    let title = '';
    if (titleMatch && titleMatch.length > 1) {
      title = titleMatch[1].replace(/<\/?title>/g, '').trim().replace(/\s+/g, ' ');
    }
    
    const summaryMatch = xml.match(/<summary>([\s\S]*?)<\/summary>/);
    const summary = summaryMatch ? summaryMatch[1].trim().replace(/\s+/g, ' ') : '';
    
    const authors: string[] = [];
    const authorMatches = xml.matchAll(/<author>[\s\S]*?<name>([^<]+)<\/name>[\s\S]*?<\/author>/g);
    for (const m of authorMatches) {
      authors.push(m[1].trim());
    }

    const pubMatch = xml.match(/<published>([^<]+)<\/published>/);
    const published = pubMatch ? pubMatch[1].substring(0, 10) : '';

    return { title, summary, authors, published };
  } catch (err) {
    console.error('Error fetching arXiv metadata:', err);
    return null;
  }
}

// Curated default benchmark papers
const BENCHMARK_PAPERS = [
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'et al.'],
    year: '2017',
    venue: 'NeurIPS 2017',
    arxivId: '1706.03762',
    url: 'https://arxiv.org/abs/1706.03762',
    tagline: 'The foundational paper that introduced the Transformer architecture and Multi-Head Attention.',
    category: 'Architecture / NLP'
  },
  {
    id: 'mamba-ssm',
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    authors: ['Albert Gu', 'Tri Dao'],
    year: '2023',
    venue: 'arXiv:2312.00752 / COLM 2024',
    arxivId: '2312.00752',
    url: 'https://arxiv.org/abs/2312.00752',
    tagline: 'Linear-time selective state space model replacing attention bottlenecks for ultra-long context.',
    category: 'Sequence Models'
  },
  {
    id: 'lora-adaptation',
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    authors: ['Edward J. Hu', 'Yelong Shen', 'Phillip Wallis', 'Zeyuan Allen-Zhu', 'et al.'],
    year: '2021',
    venue: 'ICLR 2022',
    arxivId: '2106.09685',
    url: 'https://arxiv.org/abs/2106.09685',
    tagline: 'Decomposes weight update matrices into low-rank representations to fine-tune 10,000x fewer parameters.',
    category: 'Efficient Tuning'
  },
  {
    id: 'deepseek-v3',
    title: 'DeepSeek-V3 Technical Report: Multi-Head Latent Attention & MoE',
    authors: ['DeepSeek-AI Team'],
    year: '2024',
    venue: 'arXiv:2412.19437',
    arxivId: '2412.19437',
    url: 'https://arxiv.org/abs/2412.19437',
    tagline: 'Multi-Head Latent Attention (MLA) compressed KV cache and DeepSeekMoE dynamic auxiliary-loss-free routing.',
    category: 'LLM & Scaling'
  },
  {
    id: 'flash-attention',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    authors: ['Tri Dao', 'Daniel Y. Fu', 'Stefano Ermon', 'Atri Rudra', 'Christopher Ré'],
    year: '2022',
    venue: 'NeurIPS 2022',
    arxivId: '2205.14135',
    url: 'https://arxiv.org/abs/2205.14135',
    tagline: 'IO-aware tiling algorithm computing exact softmax attention without materializing the N×N intermediate matrix.',
    category: 'Hardware Acceleration'
  },
  {
    id: 'dpo-alignment',
    title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
    authors: ['Rafael Rafailov', 'Archit Sharma', 'Eric Mitchell', 'Stefano Ermon', 'et al.'],
    year: '2023',
    venue: 'NeurIPS 2023 (Oral)',
    arxivId: '2305.18290',
    url: 'https://arxiv.org/abs/2305.18290',
    tagline: 'Eliminates separate reward model and reinforcement learning training loop in RLHF with a closed-form loss.',
    category: 'Alignment & RL'
  }
];

// Endpoint to list curated benchmark papers
app.get('/api/benchmark-papers', (_req, res) => {
  res.json({ papers: BENCHMARK_PAPERS });
});

// Endpoint to analyze paper
app.post('/api/analyze-paper', async (req, res) => {
  try {
    const { paperUrl, paperTitle, paperText } = req.body;

    if (!paperUrl && !paperTitle && !paperText) {
      return res.status(400).json({ error: 'Please provide a paper URL, arXiv ID, title, or paper text.' });
    }

    let resolvedTitle = paperTitle || '';
    let fetchedSummary = '';
    let fetchedAuthors: string[] = [];
    let arxivId: string | null = null;

    if (paperUrl) {
      arxivId = extractArxivId(paperUrl);
    } else if (paperTitle && /^[0-9]{4}\.[0-9]{4,5}/.test(paperTitle.trim())) {
      arxivId = extractArxivId(paperTitle.trim());
    }

    if (arxivId) {
      const meta = await fetchArxivMetadata(arxivId);
      if (meta) {
        if (meta.title) resolvedTitle = meta.title;
        if (meta.summary) fetchedSummary = meta.summary;
        if (meta.authors) fetchedAuthors = meta.authors;
      }
    }

    // System instruction strictly matching user specifications
    const systemInstruction = `You are an advanced Computer Science Research Agent specializing in parsing academic papers, extracting system architectures, and identifying student development opportunities.

OPERATIONAL CONSTRAINTS:
- You must always prioritize token efficiency. Ensure your total analysis and tool execution stays well under 25,000 tokens.
- Output MUST be valid strictly parseable JSON conforming to the requested schema.

When analyzing the research paper, execute these steps:

1. CORE CONCEPT EXTRACTION:
Summarize the problem statement, the primary methodology introduced, and the key mathematical/algorithmic breakthroughs in under 300 words using plain, accessible language. Keep the combined summary strictly under 300 words.

2. ARCHITECTURAL FLOWCHART (Mermaid.js):
Generate a clean, syntactically correct Mermaid.js flowchart (graph TD) that charts the components, data inputs, model layers, and data outputs of the system described in the paper. Do not use Markdown code blocks inside the Mermaid string itself. Output a clean Mermaid string starting with "graph TD". Also create node descriptions so students can interactively inspect each layer.

3. FUTURE WORK & INTERNSHIP OPPORTUNITIES:
Brainstorm 3 concrete, realistic ways a 3rd-year CS student could build upon, extend, or optimize this paper for a resume project. For each idea provide:
- The exact extension (e.g., "Replacing the heavy transformer layer with a lightweight Mamba block for edge deployment").
- The targeted performance metric (e.g., latency reduction, accuracy trade-off).
- The recommended tech stack (e.g., PyTorch, ONNX Runtime).
- Concrete implementation details broken into clear phases, benchmarks to measure, a polished resume bullet point template, and interview talking points with trade-offs.`;

    const promptContext = `Analyze this Computer Science research paper:
URL: ${paperUrl || 'N/A'}
arXiv ID: ${arxivId || 'N/A'}
Title: ${resolvedTitle || 'Derive from context'}
${fetchedSummary ? `Official Abstract / Summary:\n${fetchedSummary}\n` : ''}
${fetchedAuthors.length ? `Authors: ${fetchedAuthors.join(', ')}\n` : ''}
${paperText ? `Provided Paper Excerpt / Text:\n${paperText.slice(0, 12000)}\n` : ''}

Respond with a JSON object with this exact structure:
{
  "paperMeta": {
    "title": "Clean full title of the paper",
    "authors": ["Author 1", "Author 2"],
    "year": "Publication Year (e.g. 2023)",
    "venue": "Conference or arXiv identifier",
    "url": "${paperUrl || ''}",
    "estimatedTokensUsed": 3200
  },
  "coreConcept": {
    "problemStatement": "Clear description of the core bottleneck or flaw in existing systems (2-3 sentences)",
    "methodology": "The primary novel architecture or algorithm introduced (3-4 sentences)",
    "mathematicalBreakthroughs": "Key mathematical or algorithmic formulation explained in accessible plain English (3-4 sentences)",
    "wordCount": 240,
    "combinedSummary": "A unified under-300-word cohesive summary combining problem, method, and breakthrough in plain, accessible language."
  },
  "rawLabeledFlowchart": "[FLOWCHART]\\ngraph TD\\n...",
  "mermaidCode": "graph TD\\n    A[Input: Query, Key, Value] --> B[Scaled Dot-Product]\\n    ...",
  "nodeDetails": [
    {
      "id": "A",
      "label": "Input Embeddings",
      "role": "Converts discrete token IDs to continuous d_model dimensional vectors",
      "shape": "[Batch, SeqLen, d_model]",
      "notes": "Added with Sinusoidal Positional Encoding"
    }
  ],
  "studentOpportunities": [
    {
      "id": "proj-1",
      "title": "Punchy Project Title (e.g. EdgeMamba: Quantized Selective State Spaces for Raspberry Pi)",
      "exactExtension": "Exact architectural or algorithmic modification description",
      "targetMetric": "Specific quantifiable performance target (e.g., 3.8x latency reduction on ARM Cortex-A76 with < 1.2% perplexity drop)",
      "recommendedTechStack": ["PyTorch", "ONNX Runtime", "TorchScript", "Weights & Biases"],
      "implementationRoadmap": [
        {"week": "Phase 1 (W1-2)", "task": "Baseline reproduction and minimal test harness creation"},
        {"week": "Phase 2 (W3-4)", "task": "Core architectural extension & custom CUDA/PyTorch operator integration"},
        {"week": "Phase 3 (W5-6)", "task": "Ablation study, throughput/memory profiling, and metric benchmarking"},
        {"week": "Phase 4 (W7-8)", "task": "Packaging into open-source GitHub repo, Docker container, and demo Gradio app"}
      ],
      "benchmarks": [
        "Inference Latency (ms/token) across batch sizes 1, 4, 16",
        "Peak VRAM Memory Allocation (MiB)",
        "Downstream Task Accuracy / Perplexity on standard benchmark"
      ],
      "resumeBulletPoint": "Developed and benchmarked [Project Name] using PyTorch and ONNX, replacing [...] with [...], achieving 42% latency reduction and 60% memory savings on edge hardware.",
      "interviewTalkingPoints": [
        "Why this extension was chosen over naive post-training quantization",
        "The mathematical trade-off between recurrent state compression and long-range associative recall",
        "How memory bandwidth vs compute bound operations affect real-world inference speed"
      ],
      "starterScaffold": "# Scaffold command or repo setup snippet"
    }
  ]
}`;

    // Check if the paper matches a known pre-indexed benchmark paper
    const knownKey = (arxivId || paperTitle || paperUrl || '').toLowerCase();
    const benchmarkMatches: Record<string, string> = {
      '1706.03762': 'attention-is-all-you-need',
      'attention': 'attention-is-all-you-need',
      'transformer': 'attention-is-all-you-need',
      '2312.00752': 'mamba-ssm',
      'mamba': 'mamba-ssm',
      '2106.09685': 'lora-adaptation',
      'lora': 'lora-adaptation',
      '2412.19437': 'deepseek-v3',
      'deepseek': 'deepseek-v3',
      '2205.14135': 'flash-attention',
      'flash': 'flash-attention',
      '2305.18290': 'dpo-alignment',
      'dpo': 'dpo-alignment',
    };

    let matchedBenchmarkId: string | null = null;
    for (const [k, v] of Object.entries(benchmarkMatches)) {
      if (knownKey.includes(k)) {
        matchedBenchmarkId = v;
        break;
      }
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text || '{}';
      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch {
        // Strip markdown code fence if present
        const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        parsedData = JSON.parse(cleaned);
      }

      // Ensure rawLabeledFlowchart adheres to [FLOWCHART] format as specified in user prompt
      if (parsedData.mermaidCode && !parsedData.rawLabeledFlowchart) {
        parsedData.rawLabeledFlowchart = `[FLOWCHART]\n${parsedData.mermaidCode}`;
      } else if (parsedData.rawLabeledFlowchart && !parsedData.rawLabeledFlowchart.startsWith('[FLOWCHART]')) {
        parsedData.rawLabeledFlowchart = `[FLOWCHART]\n${parsedData.rawLabeledFlowchart}`;
      }

      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (genError: any) {
      console.warn('Gemini generation error, checking fallback benchmark:', genError.message);
      
      // If we matched a known benchmark paper, serve its verified data directly
      if (matchedBenchmarkId && DEFAULT_PAPERS_MAP[matchedBenchmarkId]) {
        return res.json({
          success: true,
          data: DEFAULT_PAPERS_MAP[matchedBenchmarkId],
          fallbackNotice: 'Served from verified landmark benchmark archive.',
        });
      }

      // Provide human-friendly error message if API key missing or high demand
      let userMsg = genError.message || 'Error communicating with AI research model.';
      try {
        const parsedErr = JSON.parse(userMsg);
        if (parsedErr?.error?.message) {
          userMsg = parsedErr.error.message;
        }
      } catch {
        // keep userMsg as is
      }

      return res.status(503).json({
        error: userMsg.includes('high demand') 
          ? 'The AI model is currently experiencing high demand. Please try again in a few moments, or select one of the pre-indexed Landmark Benchmark Papers above.'
          : userMsg.includes('API key') || userMsg.includes('authentication')
          ? 'Gemini API authentication issue. Please verify your GEMINI_API_KEY in the Secrets panel, or explore pre-indexed landmark benchmark papers (Transformer, Mamba, LoRA, DeepSeek-V3, FlashAttention, DPO).'
          : userMsg,
      });
    }
  } catch (error: any) {
    console.error('Paper analysis failed:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze research paper. Please check the paper URL or try another paper.',
    });
  }
});

// Interactive research agent Q&A endpoint
app.post('/api/chat-paper', async (req, res) => {
  try {
    const { paperTitle, paperSummary, userQuestion, previousHistory } = req.body;

    if (!userQuestion) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const systemInstruction = `You are an elite Computer Science Research Advisor and Mentor assisting a 3rd-year CS undergraduate student.
The student is studying the research paper: "${paperTitle || 'Academic Paper'}".
Context: ${paperSummary || ''}

Provide precise, mathematically grounded yet approachable answers. When appropriate, provide concrete Python/PyTorch code snippets, mathematical intuition, and practical engineering advice for implementing projects. Keep explanations clear, structured, and token-efficient.`;

    const messages = [
      ...(previousHistory || []).map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      })),
      {
        role: 'user',
        parts: [{ text: userQuestion }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: messages,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({
      reply: response.text || 'Unable to generate an answer at this time.',
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    let msg = error.message || 'Chat agent error';
    try {
      const parsed = JSON.parse(msg);
      if (parsed?.error?.message) msg = parsed.error.message;
    } catch {
      // keep
    }
    res.status(500).json({ 
      error: msg.includes('high demand')
        ? 'AI advisor model is currently experiencing high demand. Please try asking again shortly.'
        : msg
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', agent: 'PaperFlow CS Research Agent' });
});

// Development vs Production handling
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`PaperFlow CS Research Agent running at http://localhost:${PORT}`);
});
