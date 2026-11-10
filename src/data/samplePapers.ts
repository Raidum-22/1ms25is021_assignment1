import { PaperAnalysis } from '../types/paper';

export const ATTENTION_PAPER: PaperAnalysis = {
  paperMeta: {
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
    year: '2017',
    venue: 'NeurIPS 2017',
    url: 'https://arxiv.org/abs/1706.03762',
    arxivId: '1706.03762',
    tagline: 'The landmark architecture that replaced sequential recurrent networks with self-attention.',
    category: 'Foundational Deep Learning',
    estimatedTokensUsed: 3450,
  },
  coreConcept: {
    problemStatement: 'Existing sequence transduction models relied heavily on complex recurrent or convolutional neural networks that processed tokens sequentially. This inherent sequential nature precluded parallel computation within training examples, creating severe latency bottlenecks at longer sequence lengths and impeding memory retention across distant tokens.',
    methodology: 'The paper proposes the Transformer, an architectural framework solely relying on self-attention mechanisms to establish global dependencies between input and output tokens without recurrence or convolutions. It pairs an encoder-decoder stack with multi-head attention and feed-forward sublayers, using fixed sinusoidal positional encodings to inject token ordering.',
    mathematicalBreakthroughs: 'Multi-Head Attention projects Queries, Keys, and Values h times into lower dimensions (d_k) before computing Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(Q K^T / √d_k) V. The 1/√d_k factor counteracts large dot-product magnitudes that push softmax into regions with vanishingly small gradients.',
    wordCount: 178,
    combinedSummary: 'Dominant sequence models historically depended on sequential recurrent networks (RNNs/LSTMs), which prevented parallel training and struggled with long-range dependencies. Vaswani et al. introduced the Transformer, discarding recurrence entirely in favor of Multi-Head Self-Attention. By computing Attention(Q, K, V) = softmax(QK^T / √d_k)V across parallel heads with scaling to prevent gradient saturation, the architecture achieved superior translation quality (28.4 BLEU on WMT 2014) while dramatically reducing training time through matrix-level GPU parallelism.',
  },
  rawLabeledFlowchart: `[FLOWCHART]
graph TD
    subgraph Inputs["1. Input Representation"]
        I1["Input Tokens (Seq Len L)"] --> E1["Input Embedding (d_model=512)"]
        PE1["Sinusoidal Positional Encoding"] --> ADD1["Element-wise Add"]
        E1 --> ADD1
    end

    subgraph EncoderStack["2. Encoder Layer (x6)"]
        ADD1 --> MHA1["Multi-Head Self Attention (8 Heads)"]
        ADD1 -.-> RES1["Residual Skip Connection"]
        MHA1 --> LN1["Add & Layer Norm"]
        RES1 --> LN1
        LN1 --> FFN1["Position-wise Feed Forward (d_ff=2048)"]
        LN1 -.-> RES2["Residual Skip Connection"]
        FFN1 --> LN2["Add & Layer Norm"]
        RES2 --> LN2
    end

    subgraph DecoderInputs["3. Target Representation"]
        T1["Target Tokens (Shifted Right)"] --> E2["Output Embedding"]
        PE2["Sinusoidal Positional Encoding"] --> ADD2["Element-wise Add"]
        E2 --> ADD2
    end

    subgraph DecoderStack["4. Decoder Layer (x6)"]
        ADD2 --> MMHA["Masked Multi-Head Self Attention"]
        ADD2 -.-> DRES1["Residual Skip"]
        MMHA --> DLN1["Add & Layer Norm"]
        DRES1 --> DLN1
        DLN1 --> CA["Cross-Attention (Keys/Values from Encoder)"]
        LN2 ==>|Keys & Values| CA
        DLN1 -.-> DRES2["Residual Skip"]
        CA --> DLN2["Add & Layer Norm"]
        DRES2 --> DLN2
        DLN2 --> DFFN["Position-wise Feed Forward"]
        DLN2 -.-> DRES3["Residual Skip"]
        DFFN --> DLN3["Add & Layer Norm"]
        DRES3 --> DLN3
    end

    subgraph OutputStage["5. Output Projection"]
        DLN3 --> LIN["Linear Projection Layer (d_vocab)"]
        LIN --> SMAX["Softmax Normalization"]
        SMAX --> PROBS["Output Token Probabilities"]
    end`,
  mermaidCode: `graph TD
    subgraph Inputs["1. Input Representation"]
        I1["Input Tokens (Seq Len L)"] --> E1["Input Embedding (d_model=512)"]
        PE1["Sinusoidal Positional Encoding"] --> ADD1["Element-wise Add"]
        E1 --> ADD1
    end

    subgraph EncoderStack["2. Encoder Layer (x6)"]
        ADD1 --> MHA1["Multi-Head Self Attention (8 Heads)"]
        ADD1 -.-> RES1["Residual Skip Connection"]
        MHA1 --> LN1["Add & Layer Norm"]
        RES1 --> LN1
        LN1 --> FFN1["Position-wise Feed Forward (d_ff=2048)"]
        LN1 -.-> RES2["Residual Skip Connection"]
        FFN1 --> LN2["Add & Layer Norm"]
        RES2 --> LN2
    end

    subgraph DecoderInputs["3. Target Representation"]
        T1["Target Tokens (Shifted Right)"] --> E2["Output Embedding"]
        PE2["Sinusoidal Positional Encoding"] --> ADD2["Element-wise Add"]
        E2 --> ADD2
    end

    subgraph DecoderStack["4. Decoder Layer (x6)"]
        ADD2 --> MMHA["Masked Multi-Head Self Attention"]
        ADD2 -.-> DRES1["Residual Skip"]
        MMHA --> DLN1["Add & Layer Norm"]
        DRES1 --> DLN1
        DLN1 --> CA["Cross-Attention (Keys/Values from Encoder)"]
        LN2 ==>|Keys & Values| CA
        DLN1 -.-> DRES2["Residual Skip"]
        CA --> DLN2["Add & Layer Norm"]
        DRES2 --> DLN2
        DLN2 --> DFFN["Position-wise Feed Forward"]
        DLN2 -.-> DRES3["Residual Skip"]
        DFFN --> DLN3["Add & Layer Norm"]
        DRES3 --> DLN3
    end

    subgraph OutputStage["5. Output Projection"]
        DLN3 --> LIN["Linear Projection Layer (d_vocab)"]
        LIN --> SMAX["Softmax Normalization"]
        SMAX --> PROBS["Output Token Probabilities"]
    end`,
  nodeDetails: [
    {
      id: 'MHA1',
      label: 'Multi-Head Self Attention',
      role: 'Computes parallel attention distributions over queries, keys, and values across 8 subspace heads',
      shape: '[Batch, Heads=8, SeqLen, d_k=64]',
      notes: 'Allows the model to jointly attend to information from different representation subspaces at different positions.',
    },
    {
      id: 'MMHA',
      label: 'Masked Multi-Head Self Attention',
      role: 'Causal auto-regressive masking preventing positions from attending to subsequent future tokens',
      shape: '[Batch, Heads, TargetSeqLen, TargetSeqLen]',
      notes: 'Applied via upper-triangular masking matrix set to -infinity prior to softmax calculation.',
    },
    {
      id: 'CA',
      label: 'Cross-Attention Layer',
      role: 'Queries originate from decoder sublayer while Keys and Values originate from final encoder stack output',
      shape: 'Q: [B, H, T_dec, d_k], K/V: [B, H, T_enc, d_k]',
      notes: 'Mimics the typical encoder-decoder attention mechanisms in traditional sequence-to-sequence models.',
    },
    {
      id: 'FFN1',
      label: 'Position-wise Feed-Forward Network',
      role: 'Two linear transformations with a ReLU activation applied identically and separately to each position',
      shape: 'Linear1: [512 -> 2048] -> ReLU -> Linear2: [2048 -> 512]',
      notes: 'Constitutes approximately two-thirds of the parameter count per transformer block.',
    },
  ],
  studentOpportunities: [
    {
      id: 'proj-1',
      title: 'FlashLinear: Kernel Fusion & IO-Aware Tiling for Edge Transformer Inference',
      exactExtension: 'Replace the standard PyTorch quadratic softmax attention layer with an IO-aware fused C++/CUDA tiling kernel optimized for consumer edge devices (Apple Silicon Metal / Vulkan / ONNX).',
      targetMetric: '3.4x faster inference latency and 65% peak RAM reduction on 2048 sequence lengths on a budget GPU (GTX 1650 / RTX 3060).',
      recommendedTechStack: ['PyTorch', 'Triton or C++/CUDA', 'ONNX Runtime', 'HuggingFace Transformers', 'NVTX / Nsight Systems'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Reproduce baseline standard Transformer in pure PyTorch and benchmark GPU memory footprints via torch.cuda.memory_allocated().' },
        { week: 'Phase 2 (W3-4)', task: 'Write custom tiled attention kernel in OpenAI Triton or C++ to avoid writing the N×N intermediate matrix to high-bandwidth memory (HBM).' },
        { week: 'Phase 3 (W5-6)', task: 'Ablate tile block sizes (32x32, 64x64, 128x128) across varying sequence lengths (512 to 8192 tokens).' },
        { week: 'Phase 4 (W7-8)', task: 'Export model to ONNX Runtime with custom operator and build an interactive Streamlit/FastAPI benchmark dashboard.' },
      ],
      benchmarks: [
        'Time-To-First-Token (TTFT) and Inter-Token Latency (ms/token)',
        'Peak Memory Footprint (MiB) plotted against sequence length (256 to 4096)',
        'BLEU score parity check on WMT14 En-De validation split',
      ],
      resumeBulletPoint: 'Engineered a fused IO-aware attention kernel in Triton/PyTorch, achieving 3.4x faster inference latency and 65% memory reduction for 2K context lengths on consumer hardware.',
      interviewTalkingPoints: [
        'Why standard softmax attention is memory-bandwidth bound rather than compute bound on modern GPUs.',
        'Online softmax trick (Milakov & Gimelshein) to compute denominator updates without multi-pass memory loads.',
        'SRAM vs HBM cache hierarchies and register pressure trade-offs when selecting block dimensions.',
      ],
      starterScaffold: 'git clone https://github.com/example/edge-transformer\npip install torch triton onnxruntime\npython benchmark.py --kernel custom_fused --seq_len 2048',
    },
    {
      id: 'proj-2',
      title: 'SparseDistill: Post-Training Attention Sparsification via Student-Teacher Pruning',
      exactExtension: 'Introduce structured top-k key-value sparsity in decoder cross-attention layers, guided by knowledge distillation from the full teacher model.',
      targetMetric: '52% FLOP reduction per generation step with under 0.4 BLEU degradation on machine translation.',
      recommendedTechStack: ['PyTorch', 'HuggingFace Datasets', 'Weights & Biases', 'Optuna (hyperparameter tuning)', 'SciPy'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Profile attention matrix weight magnitudes across heads to identify redundant and dead heads.' },
        { week: 'Phase 2 (W3-4)', task: 'Implement Top-K dynamic KV routing and soft-distillation cross-entropy loss against original Transformer outputs.' },
        { week: 'Phase 3 (W5-6)', task: 'Train sparse student model for 25 epochs on OpenSubtitles or WMT dataset using mixed precision (fp16).' },
        { week: 'Phase 4 (W7-8)', task: 'Perform attention map visualization using Matplotlib/Seaborn and publish a PyPI package for drop-in sparse layers.' },
      ],
      benchmarks: [
        'Multiply-Accumulate Operations (GMACs / GFLOPs) per token',
        'Translation quality retention: BLEU and chrF scores on test sets',
        'KV Cache memory compression ratio in generation mode',
      ],
      resumeBulletPoint: 'Architected a sparse cross-attention distillation pipeline in PyTorch, reducing decoder FLOPs by 52% while preserving 98.6% of teacher BLEU score on WMT14 translation.',
      interviewTalkingPoints: [
        'Why uniform random sparsity degrades attention distributions compared to top-k query-directed routing.',
        'Balancing temperature parameter in Kullback-Leibler (KL) divergence distillation.',
        'Hardware overhead of dynamic indexing vs structured block-sparse matrices.',
      ],
      starterScaffold: 'from sparsedistill import SparseTransformerDecoder\nmodel = SparseTransformerDecoder.from_pretrained("base-model", sparsity_ratio=0.5)',
    },
    {
      id: 'proj-3',
      title: 'RoPE-Embed: Rotary Position Embedding Retrofit for Context Window Scaling',
      exactExtension: 'Replace the static sinusoidal absolute positional encodings with Rotary Position Embeddings (RoPE) and apply YaRN / NTK-aware interpolation to extend context from 512 to 8192 tokens.',
      targetMetric: 'Zero perplexity explosion when extrapolating context length from 512 to 8,192 tokens with no additional parameter count.',
      recommendedTechStack: ['PyTorch', 'vLLM', 'HuggingFace Accelerate', 'DeepSpeed', 'Weights & Biases'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Implement 2D complex plane rotation matrix multiplication for Query and Key tensors.' },
        { week: 'Phase 2 (W3-4)', task: 'Fine-tune small transformer (120M parameters) on synthetic needle-in-a-haystack retrieval tasks.' },
        { week: 'Phase 3 (W5-6)', task: 'Evaluate NTK-aware scaling vs linear position interpolation on long-document perplexity curves.' },
        { week: 'Phase 4 (W7-8)', task: 'Build open-source interactive Needle-In-A-Haystack visualizer with Heatmaps.' },
      ],
      benchmarks: [
        'Needle In A Haystack retrieval accuracy (%) from 512 to 8192 tokens',
        'WikiText-103 rolling perplexity at 2k, 4k, and 8k sequence horizons',
        'Training step throughput (samples/sec) with mixed precision',
      ],
      resumeBulletPoint: 'Upgraded classical Transformer with Rotary Position Embeddings (RoPE) and NTK scaling, expanding effective context window by 16x (512 to 8,192 tokens) with 99.2% needle retrieval accuracy.',
      interviewTalkingPoints: [
        'Mathematical property: how inner product <R_m q, R_n k> naturally encodes relative position (m - n).',
        'Why absolute positional encodings fail to generalize beyond the maximum sequence length seen during pre-training.',
        'High-frequency vs low-frequency dimension behavior during positional interpolation.',
      ],
      starterScaffold: 'python evaluate_context.py --model transformer-rope --needle_depth 0.5 --context_len 8192',
    },
  ],
};

export const MAMBA_PAPER: PaperAnalysis = {
  paperMeta: {
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    authors: ['Albert Gu', 'Tri Dao'],
    year: '2023',
    venue: 'arXiv:2312.00752 / COLM 2024',
    url: 'https://arxiv.org/abs/2312.00752',
    arxivId: '2312.00752',
    tagline: 'Linear-time selective state space model replacing attention bottlenecks for ultra-long context.',
    category: 'Sub-Quadratic Sequence Models',
    estimatedTokensUsed: 3620,
  },
  coreConcept: {
    problemStatement: 'Transformers require quadratic O(N^2) compute and memory with respect to sequence length, causing prohibitive inference memory footprints due to the Key-Value (KV) cache. Prior sub-quadratic models like linear attention and classical Structured State Spaces (S4) scaled linearly O(N), but suffered fundamental degradation on content-based reasoning tasks because their state transitions were time-invariant (LTI) and could not selectively filter out irrelevant tokens.',
    methodology: 'Gu and Dao introduced Mamba, which equips State Space Models with a selection mechanism that makes the state-space matrices (B, C, and step size Δ) functions of the input token. To overcome the resulting inability to use global convolutions, they designed a hardware-aware parallel associative scan algorithm that computes recurrent states directly in GPU Fast SRAM without materializing large expanded states in slow DRAM.',
    mathematicalBreakthroughs: 'Continuous state space dx/dt = Ax(t) + Bu(t), y(t) = Cx(t) is discretized with zero-order hold: A_bar = exp(Δ A), B_bar = (Δ A)^(-1)(exp(Δ A) - I)·Δ B. In Mamba, B, C, and Δ are input-dependent: B = Linear_N(x), C = Linear_N(x), Δ = softplus(Parameter + Linear_D(x)). The selective scan is fused into an associative scan: (a1, b1) • (a2, b2) = (a1 * a2, a2 * b1 + b2).',
    wordCount: 198,
    combinedSummary: 'While Transformers dominate NLP, their O(N^2) complexity and ballooning KV cache cripple long-context deployment. Conventional linear state space models (SSMs) scale linearly but fail at content-based selection because their transition dynamics are static. Mamba solves this by making SSM parameters (B, C, step size Δ) dynamic functions of the current input token, enabling the model to selectively remember or forget information. To run efficiently without slow convolution kernels, Mamba introduces a hardware-aware parallel scan that fuses state expansion directly in GPU SRAM. Mamba achieves 5x higher throughput than Transformers of equal size while matching or exceeding LLM benchmark accuracies across millions of tokens.',
  },
  rawLabeledFlowchart: `[FLOWCHART]
graph TD
    subgraph Input["1. Input Sequence"]
        X["Token Input Vector x [Batch, Length, Dim]"]
    end

    subgraph Expansion["2. Gated Expansion & Convolution"]
        X --> L1["Linear Projection (Expand to 2D)"]
        L1 --> SPLIT{"Channel Split"}
        SPLIT -->|Branch A: SSM Path| CONV["1D Depthwise Conv (kernel=4)"]
        CONV --> SILU["SiLU Non-linearity"]
        SPLIT -->|Branch B: Gating Path| GATE["SiLU Activation (Gate Signal)"]
    end

    subgraph SelectionMechanism["3. Parameter Selection (Input-Dependent)"]
        SILU --> SB["Linear Projection -> B(x) [Batch, L, State_N]"]
        SILU --> SC["Linear Projection -> C(x) [Batch, L, State_N]"]
        SILU --> SD["Linear Projection -> Delta(x) [Batch, L, Dim]"]
        PARAM_A["Parameter Matrix A [Dim, State_N]"]
    end

    subgraph HardwareScan["4. Hardware-Aware Fused SRAM Associative Scan"]
        SB & SC & SD & PARAM_A --> DISCRET["Discretize: A_bar = exp(Delta*A), B_bar = Delta*B"]
        DISCRET --> SCAN["Parallel Associative Prefix Scan in Fast SRAM"]
        SCAN --> STATE["Hidden State Update: h_t = A_bar * h_{t-1} + B_bar * x_t"]
        STATE --> OUT_SSM["SSM Output: y_t = C_t * h_t + D * x_t"]
    end

    subgraph Integration["5. Gated Multiplicative Merge & Output"]
        OUT_SSM --> MULT["Element-wise Multiplication (x)"]
        GATE --> MULT
        MULT --> L_OUT["Linear Output Projection (2D -> D)"]
        L_OUT --> RES["Residual Add (x + Block_Output)"]
        X -.-> RES
        RES --> Y["Final Representation y"]
    end`,
  mermaidCode: `graph TD
    subgraph Input["1. Input Sequence"]
        X["Token Input Vector x [Batch, Length, Dim]"]
    end

    subgraph Expansion["2. Gated Expansion & Convolution"]
        X --> L1["Linear Projection (Expand to 2D)"]
        L1 --> SPLIT{"Channel Split"}
        SPLIT -->|Branch A: SSM Path| CONV["1D Depthwise Conv (kernel=4)"]
        CONV --> SILU["SiLU Non-linearity"]
        SPLIT -->|Branch B: Gating Path| GATE["SiLU Activation (Gate Signal)"]
    end

    subgraph SelectionMechanism["3. Parameter Selection (Input-Dependent)"]
        SILU --> SB["Linear Projection -> B(x) [Batch, L, State_N]"]
        SILU --> SC["Linear Projection -> C(x) [Batch, L, State_N]"]
        SILU --> SD["Linear Projection -> Delta(x) [Batch, L, Dim]"]
        PARAM_A["Parameter Matrix A [Dim, State_N]"]
    end

    subgraph HardwareScan["4. Hardware-Aware Fused SRAM Associative Scan"]
        SB & SC & SD & PARAM_A --> DISCRET["Discretize: A_bar = exp(Delta*A), B_bar = Delta*B"]
        DISCRET --> SCAN["Parallel Associative Prefix Scan in Fast SRAM"]
        SCAN --> STATE["Hidden State Update: h_t = A_bar * h_{t-1} + B_bar * x_t"]
        STATE --> OUT_SSM["SSM Output: y_t = C_t * h_t + D * x_t"]
    end

    subgraph Integration["5. Gated Multiplicative Merge & Output"]
        OUT_SSM --> MULT["Element-wise Multiplication (x)"]
        GATE --> MULT
        MULT --> L_OUT["Linear Output Projection (2D -> D)"]
        L_OUT --> RES["Residual Add (x + Block_Output)"]
        X -.-> RES
        RES --> Y["Final Representation y"]
    end`,
  nodeDetails: [
    {
      id: 'DISCRET',
      label: 'Continuous-to-Discrete Discretization',
      role: 'Transforms continuous system matrices (A, B) into discrete step updates (A_bar, B_bar) using step size Δ',
      shape: 'A_bar: [Dim, State_N=16], B_bar: [Batch, Len, State_N]',
      notes: 'Uses Zero-Order Hold (ZOH) discretization; A is parameterized in diagonal form for stability.',
    },
    {
      id: 'SCAN',
      label: 'Parallel Associative Scan',
      role: 'Computes recurrence in O(log N) parallel steps instead of O(N) sequential steps during training',
      shape: 'Prefix tree reduction in GPU L1/SRAM memory',
      notes: 'Crucial for speed; never saves the intermediate state [Batch, Len, Dim, State_N] into GPU HBM.',
    },
    {
      id: 'MULT',
      label: 'Gated Multiplicative Merge',
      role: 'Modulates SSM output with the parallel gating stream using SiLU activation',
      shape: '[Batch, Len, 2*Dim]',
      notes: 'Inspired by Gated Attention Units (GAU) and Gated Recurrent Units for enhanced expressivity.',
    },
  ],
  studentOpportunities: [
    {
      id: 'proj-1',
      title: 'MambaOnnx: ONNX & TensorRT Quantized Runtime for Jetson Nano / Raspberry Pi 5',
      exactExtension: 'Port Mamba’s custom selective scan CUDA kernel into pure portable ONNX runtime operators with INT8 weight-only quantization for ultra-low-power embedded edge devices.',
      targetMetric: '4.8x generation speedup with constant O(1) memory usage (zero KV cache explosion) on ARM-based single-board computers.',
      recommendedTechStack: ['PyTorch', 'ONNX / ONNX Runtime', 'C++ / CUDA / TorchScript', 'Quantization (bitsandbytes / AutoGPTQ)', 'Docker'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Export Mamba-130M model structure into ONNX computational graph, isolating the recurrent selective scan node.' },
        { week: 'Phase 2 (W3-4)', task: 'Write fallback CPU / NEON vectorized C++ scan operator for systems without NVIDIA CUDA GPUs.' },
        { week: 'Phase 3 (W5-6)', task: 'Apply 8-bit dynamic quantization to linear projection weights and compare memory vs FP16.' },
        { week: 'Phase 4 (W7-8)', task: 'Deploy on Raspberry Pi 5 / Jetson Orin Nano, measuring sustained tokens/sec and thermal throttling.' },
      ],
      benchmarks: [
        'Generation throughput (tokens/sec) vs sequence length (128 to 32k tokens)',
        'RAM consumption: Mamba vs Llama-3-1B at 8k context length',
        'Energy consumption (Joules/token) measured via power profiling tools',
      ],
      resumeBulletPoint: 'Built an open-source ONNX/C++ runtime for Mamba selective state spaces, delivering 4.8x higher throughput and flat O(1) memory on ARM edge processors.',
      interviewTalkingPoints: [
        'Why Mamba eliminates the KV cache footprint during autoregressive decoding.',
        'Challenges of compiling dynamic loop recurrences in static computation graph frameworks like ONNX.',
        'Fixed-point quantization effects on the exponential discretization exp(Δ * A).',
      ],
      starterScaffold: 'git clone https://github.com/student/mamba-edge-runtime\npython export_mamba.py --model mamba-130m --quantize int8',
    },
    {
      id: 'proj-2',
      title: 'VisionMamba-Lite: Lightweight Directional SSM for Real-Time Medical Image Segmentation',
      exactExtension: 'Adapt Mamba for 2D spatial image patches by implementing a 4-way bidirectional selective scan (top-down, bottom-up, left-right, right-left) to replace heavy Vision Transformer backbones.',
      targetMetric: '62% fewer parameters than ViT-Base with +2.4% mean Dice score on MRI / CT lesion segmentation.',
      recommendedTechStack: ['PyTorch', 'TorchVision', 'Monai (Medical Imaging)', 'Albumentations', 'Weights & Biases'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Implement 2D patch embedding and bidirectional 4-directional spatial scanning permutation in PyTorch.' },
        { week: 'Phase 2 (W3-4)', task: 'Construct U-Net shaped hierarchical encoder-decoder using Mamba blocks at each resolution scale.' },
        { week: 'Phase 3 (W5-6)', task: 'Train and validate on BraTS brain tumor segmentation dataset with Dice and Hausdorff distance loss.' },
        { week: 'Phase 4 (W7-8)', task: 'Generate Grad-CAM activation maps demonstrating how SSM captures long-range anatomical boundaries.' },
      ],
      benchmarks: [
        'Mean Dice Similarity Coefficient (DSC) on organ segmentation test splits',
        'Inference FPS on single 1080p medical scans',
        'Model parameter size (MB) vs standard U-Net and SwinUNETR',
      ],
      resumeBulletPoint: 'Designed VisionMamba-Lite for medical imaging, integrating 4-way spatial selective state spaces to achieve +2.4% Dice score while reducing parameter footprint by 62%.',
      interviewTalkingPoints: [
        'How 1D sequence models must address non-causal 2D spatial inductive biases in images.',
        'Why global receptive fields prevent boundary leakage in complex pathology scans.',
        'Computational overhead of multi-directional scans and how to interleave channels.',
      ],
      starterScaffold: 'python train_medical.py --dataset brats2023 --backbone vim_lite --epochs 50',
    },
    {
      id: 'proj-3',
      title: 'HybridMamba-Attention: Speculative Drafting via Sub-Quadratic Proposal Models',
      exactExtension: 'Combine a tiny 150M Mamba model as a high-speed speculative drafter with an 8B Transformer verifier to accelerate autoregressive generation.',
      targetMetric: '2.5x end-to-end wall-clock speedup on text generation with zero output distribution deviation (lossless acceleration).',
      recommendedTechStack: ['PyTorch', 'vLLM', 'HuggingFace Transformers', 'FlashAttention-2', 'Triton'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Build speculative decoding verification engine in PyTorch comparing draft tokens against target logits.' },
        { week: 'Phase 2 (W3-4)', task: 'Align token vocabulary between Mamba-130M drafter and Llama-3-8B target model.' },
        { week: 'Phase 3 (W5-6)', task: 'Profile acceptance rate (alpha) across varied domain prompts (Python code, creative writing, GSM8k).' },
        { week: 'Phase 4 (W7-8)', task: 'Deploy dynamic speculation length tuning based on drafter confidence heuristics.' },
      ],
      benchmarks: [
        'Speculative Acceptance Rate (tokens accepted per drafting step)',
        'Speedup factor (1.0x baseline vs speculative execution)',
        'End-to-end generation latency on humaneval coding tasks',
      ],
      resumeBulletPoint: 'Implemented speculative decoding engine pairing Mamba-130M drafter with Llama-3-8B verifier, yielding 2.5x lossless acceleration on code generation benchmarks.',
      interviewTalkingPoints: [
        'Mathematical proof of why speculative sampling produces the exact same probability distribution as the verifier.',
        'Why Mamba makes an ideal drafter due to zero KV cache overhead for multi-step rollout.',
        'Optimal drafting length k trade-offs based on GPU memory bandwidth limits.',
      ],
      starterScaffold: 'python speculative_eval.py --drafter state-spaces/mamba-130m --target meta-llama/Meta-Llama-3-8B',
    },
  ],
};

export const LORA_PAPER: PaperAnalysis = {
  paperMeta: {
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    authors: ['Edward J. Hu', 'Yelong Shen', 'Phillip Wallis', 'Zeyuan Allen-Zhu', 'Yuanzhi Li', 'Shean Wang', 'Lu Wang', 'Weizhu Chen'],
    year: '2021',
    venue: 'ICLR 2022',
    url: 'https://arxiv.org/abs/2106.09685',
    arxivId: '2106.09685',
    tagline: 'Decomposes weight update matrices into low-rank representations to fine-tune 10,000x fewer parameters.',
    category: 'Parameter-Efficient Fine-Tuning (PEFT)',
    estimatedTokensUsed: 3180,
  },
  coreConcept: {
    problemStatement: 'Fine-tuning pre-trained massive language models (such as GPT-3 with 175B parameters) historically required updating and storing an entire replica of all model weights for each downstream task. This created prohibitive storage footprints, exorbitant GPU memory requirements during training (storing optimizer states and gradients for billions of parameters), and high deployment switching latencies.',
    methodology: 'LoRA freezes the pre-trained model weights W_0 and injects trainable rank decomposition matrices into each layer of the Transformer architecture. For a weight matrix W_0, its update ΔW is constrained by representing it as ΔW = B · A, where B is initialized to zero and A is initialized with random Gaussian values, ensuring ΔW starts at zero at the beginning of training.',
    mathematicalBreakthroughs: 'For forward pass h = W_0 x + ΔW x = W_0 x + (α / r) B A x, where W_0 ∈ R^(d × k), B ∈ R^(d × r), and A ∈ R^(r × k), with rank r << min(d, k). Scaling constant α / r stabilizes training when varying rank r. Because W = W_0 + B A is linear, during deployment B A can be merged directly into W_0 with zero inference latency overhead.',
    wordCount: 189,
    combinedSummary: 'Full parameter fine-tuning of foundational large language models incurs staggering hardware expenses because storing separate 100B+ weight checkpoints and optimizer states for each task is infeasible. Hu et al. introduced LoRA (Low-Rank Adaptation), hypothesizing that weight updates during adaptation possess a low intrinsic rank. By freezing pre-trained weights W_0 and parameterizing updates as ΔW = (α/r)·B·A with low rank r, LoRA reduces trainable parameter count by 10,000x and GPU memory footprint by 3x. Crucially, the factorized matrices can be mathematically merged back into original weights prior to deployment, introducing exactly zero additional inference latency.',
  },
  rawLabeledFlowchart: `[FLOWCHART]
graph TD
    subgraph Input["1. Input Activation"]
        X["Input Vector x (Dimension d)"]
    end

    subgraph FrozenPath["2. Frozen Pre-trained Weight Path"]
        X --> W0["Frozen Pre-trained Weights W_0 [d x k]"]
        W0 --> FROZEN_OUT["Output h_frozen = W_0 * x"]
    end

    subgraph LoRAPath["3. Low-Rank Decomposition Adapter"]
        X --> A["Down-Projection Matrix A [r x d] (Gaussian Init)"]
        A --> INTERMED["Rank-r Bottleneck Representation (r << d)"]
        INTERMED --> B["Up-Projection Matrix B [k x r] (Zero Init)"]
        B --> SCALE["Scaling Factor: (alpha / r)"]
        SCALE --> ADAPT_OUT["Output h_adapter = (alpha/r) * B * A * x"]
    end

    subgraph MergeStage["4. Dual Path Summation"]
        FROZEN_OUT --> SUM["Element-wise Addition (+)"]
        ADAPT_OUT --> SUM
        SUM --> H["Final Output Activation h = W_0 * x + (alpha/r)*B*A*x"]
    end

    subgraph DeploymentMode["5. Zero-Latency Deployment Mode"]
        SUM -.->|At Deployment Time| FUSE["Weight Fusion: W_deployed = W_0 + (alpha/r)*B*A"]
        FUSE --> SERVE["Single Standard Matrix-Vector Multiplication: h = W_deployed * x"]
    end`,
  mermaidCode: `graph TD
    subgraph Input["1. Input Activation"]
        X["Input Vector x (Dimension d)"]
    end

    subgraph FrozenPath["2. Frozen Pre-trained Weight Path"]
        X --> W0["Frozen Pre-trained Weights W_0 [d x k]"]
        W0 --> FROZEN_OUT["Output h_frozen = W_0 * x"]
    end

    subgraph LoRAPath["3. Low-Rank Decomposition Adapter"]
        X --> A["Down-Projection Matrix A [r x d] (Gaussian Init)"]
        A --> INTERMED["Rank-r Bottleneck Representation (r << d)"]
        INTERMED --> B["Up-Projection Matrix B [k x r] (Zero Init)"]
        B --> SCALE["Scaling Factor: (alpha / r)"]
        SCALE --> ADAPT_OUT["Output h_adapter = (alpha/r) * B * A * x"]
    end

    subgraph MergeStage["4. Dual Path Summation"]
        FROZEN_OUT --> SUM["Element-wise Addition (+)"]
        ADAPT_OUT --> SUM
        SUM --> H["Final Output Activation h = W_0 * x + (alpha/r)*B*A*x"]
    end

    subgraph DeploymentMode["5. Zero-Latency Deployment Mode"]
        SUM -.->|At Deployment Time| FUSE["Weight Fusion: W_deployed = W_0 + (alpha/r)*B*A"]
        FUSE --> SERVE["Single Standard Matrix-Vector Multiplication: h = W_deployed * x"]
    end`,
  nodeDetails: [
    {
      id: 'A',
      label: 'Down-Projection Matrix A',
      role: 'Compresses input dimension d down to low-rank bottleneck r',
      shape: '[r, d] where r is typically 8, 16, or 32',
      notes: 'Initialized with N(0, σ^2) Gaussian distribution to ensure diverse feature extraction.',
    },
    {
      id: 'B',
      label: 'Up-Projection Matrix B',
      role: 'Expands rank-r representation back to output dimension k',
      shape: '[k, r]',
      notes: 'Initialized strictly with zeros so ΔW = B*A equals zero at step 0 of training.',
    },
    {
      id: 'FUSE',
      label: 'Weight Fusion (Deployment)',
      role: 'Pre-computes W_new = W_0 + (α/r)*B*A before serving',
      shape: '[k, d]',
      notes: 'Ensures zero additional memory overhead and zero added FLOPs during production inference.',
    },
  ],
  studentOpportunities: [
    {
      id: 'proj-1',
      title: 'DynLoRA: Dynamic SVD-Guided Rank Allocation During Training',
      exactExtension: 'Build an automated controller that tracks the singular value spectrum of adapter updates during training, dynamically expanding rank on complex attention heads while pruning rank on redundant heads.',
      targetMetric: 'Achieve parity with uniform rank-32 LoRA while using 44% fewer total parameters across the model.',
      recommendedTechStack: ['PyTorch', 'HuggingFace PEFT', 'PyTorch Profiler', 'SciPy (SVD)', 'Weights & Biases'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Implement baseline LoRA in raw PyTorch without PEFT library abstractions to master inner mechanics.' },
        { week: 'Phase 2 (W3-4)', task: 'Develop an SVD-based importance scoring function calculated every 500 gradient steps.' },
        { week: 'Phase 3 (W5-6)', task: 'Implement dynamic matrix reshaping / slicing in PyTorch without resetting optimizer momentum states.' },
        { week: 'Phase 4 (W7-8)', task: 'Evaluate on GLUE benchmark suite and open-source a plug-and-play Python package.' },
      ],
      benchmarks: [
        'Total trainable parameters (M) vs GLUE average accuracy',
        'Singular value distribution heatmaps across query/key/value/output projections',
        'Training VRAM requirement across batch sizes',
      ],
      resumeBulletPoint: 'Created DynLoRA, a dynamic rank-allocation algorithm in PyTorch utilizing SVD spectrum analysis to cut fine-tuning parameter overhead by 44% with zero accuracy drop.',
      interviewTalkingPoints: [
        'Why the intrinsic rank of updates varies significantly across different Transformer sublayers.',
        'Adam optimizer state considerations when dynamically changing tensor shapes mid-training.',
        'Comparison with AdaLoRA and DoRA (Weight-Decomposed Low-Rank Adaptation).',
      ],
      starterScaffold: 'pip install dynlora\nfrom dynlora import DynamicLoRAModel\nmodel = DynamicLoRAModel(base_model, initial_rank=16)',
    },
    {
      id: 'proj-2',
      title: 'MultiLoRA-Router: Sub-Millisecond Adapter Hot-Swapping for Multi-Tenant LLM Serving',
      exactExtension: 'Build a high-performance multi-tenant inference server that dynamically routes requests to 50+ different task-specific LoRA adapters on a single shared frozen foundation model.',
      targetMetric: '< 1.8ms adapter swapping overhead per request with 10x lower memory than deploying 50 dedicated models.',
      recommendedTechStack: ['Python', 'FastAPI', 'vLLM or HuggingFace TGI', 'CUDA Streams', 'Redis (adapter caching)'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Train 5 distinct LoRA adapters (Code, Math, Legal, Translation, Medical) on Llama-3-8B.' },
        { week: 'Phase 2 (W3-4)', task: 'Implement batched GEMM kernel where different rows in the batch multiply against different adapter weights.' },
        { week: 'Phase 3 (W5-6)', task: 'Build an LRU GPU-memory cache for warm adapter weights with asynchronous CUDA stream prefetching.' },
        { week: 'Phase 4 (W7-8)', task: 'Stress-test server with Locust to simulate 1,000 concurrent user requests hitting diverse adapters.' },
      ],
      benchmarks: [
        'Requests per second (RPS) under mixed adapter workloads',
        'P99 tail latency comparison between batched Multi-LoRA vs sequential swapping',
        'Total GPU VRAM utilization on an RTX 4090 or A10G',
      ],
      resumeBulletPoint: 'Engineered a multi-tenant LLM serving system supporting 50+ concurrent LoRA adapters on a single GPU with <1.8ms swapping latency and batched multi-adapter execution.',
      interviewTalkingPoints: [
        'How S-LoRA and Punica execute batched matrix-vector multiplications with varying adapter weights.',
        'Memory fragmentation strategies when swapping dynamic tensor buffers in GPU memory.',
        'Continuous batching algorithms with heterogeneous request shapes.',
      ],
      starterScaffold: 'python serve_multilora.py --model meta-llama/Llama-3-8B --adapters_dir ./adapters/ --port 8000',
    },
    {
      id: 'proj-3',
      title: 'QLoRA-Mobile: 4-Bit NormalFloat Quantized Fine-Tuning on Consumer Laptops',
      exactExtension: 'Implement NF4 (NormalFloat4) quantization combined with double quantization and paged optimizers to fine-tune 7B-parameter models on a standard MacBook (Metal) or consumer 8GB GPU.',
      targetMetric: 'Fine-tune an 8B LLM with < 6.8 GB peak VRAM on consumer hardware without out-of-memory crashes.',
      recommendedTechStack: ['PyTorch', 'bitsandbytes', 'Apple MLX or Triton', 'Transformers', 'PEFT'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Study information-theoretic optimality of NormalFloat4 for normally distributed weights.' },
        { week: 'Phase 2 (W3-4)', task: 'Implement custom dequantization on-the-fly during forward and backward passes.' },
        { week: 'Phase 3 (W5-6)', task: 'Integrate CPU memory paging for Adam optimizer states during gradient bursts.' },
        { week: 'Phase 4 (W7-8)', task: 'Fine-tune on instruction-following datasets (Alpaca/ShareGPT) and host an offline Mac desktop app.' },
      ],
      benchmarks: [
        'Peak allocated GPU/Unified memory during backward pass',
        'Perplexity comparison between FP16 LoRA vs NF4 QLoRA',
        'Training throughput (samples/hour) on consumer grade hardware',
      ],
      resumeBulletPoint: 'Ported and optimized 4-bit NormalFloat QLoRA pipeline to consumer hardware, enabling instruction fine-tuning of 8B models within 6.8GB peak memory with zero degradation.',
      interviewTalkingPoints: [
        'The mathematical premise behind NormalFloat4 distribution versus uniform integer INT4.',
        'Why double quantization saves ~0.37 bits per parameter without statistical variance.',
        'How paged optimizers use CUDA Unified Memory to prevent sudden out-of-memory crashes.',
      ],
      starterScaffold: 'python qlora_finetune.py --base_model unsloth/llama-3-8b --bits 4 --dataset alpaca',
    },
  ],
};

export const DEEPSEEK_PAPER: PaperAnalysis = {
  paperMeta: {
    title: 'DeepSeek-V3 Technical Report: Multi-Head Latent Attention & MoE',
    authors: ['DeepSeek-AI Team', 'Aixin Liu', 'Bei Feng', 'Bin Wang', 'Bingxuan Wang', 'et al.'],
    year: '2024',
    venue: 'arXiv:2412.19437',
    url: 'https://arxiv.org/abs/2412.19437',
    arxivId: '2412.19437',
    tagline: 'Multi-Head Latent Attention (MLA) compressed KV cache and DeepSeekMoE dynamic auxiliary-loss-free routing.',
    category: 'LLM Architecture & Scaling',
    estimatedTokensUsed: 3890,
  },
  coreConcept: {
    problemStatement: 'Large language models suffer severe generation bottlenecks from quadratic KV cache growth during auto-regressive decoding, while standard Mixture-of-Experts (MoE) architectures suffer from routing collapse, load imbalance, and excessive auxiliary-loss regularization that degrades primary language modeling objectives.',
    methodology: 'DeepSeek-V3 introduces Multi-Head Latent Attention (MLA), which compresses Query, Key, and Value vectors into low-dimensional latent spaces (c_KV) using low-rank joint compression, decoupling Rotary Positional Embeddings (RoPE) into a separate non-compressed head. For feed-forward layers, it employs DeepSeekMoE with fine-grained expert division, dedicated isolated shared experts, and an auxiliary-loss-free dynamic bias routing strategy.',
    mathematicalBreakthroughs: 'MLA projects Key-Value cache into compressed latent vector c_t^(KV) = W^(DKV) h_t ∈ R^(d_c). During generation, only c_t^(KV) needs to be cached (saving up to 93.3% memory). DeepSeekMoE routes tokens across top-K routed experts using dynamic bias calibration b_i adjusted via e_i = α · sign(mean_load - actual_load) without corrupting loss gradients.',
    wordCount: 194,
    combinedSummary: 'Standard Transformer LLMs encounter crippling memory limits as sequence lengths and concurrency expand due to Key-Value cache bloat. DeepSeek-V3 resolves this through Multi-Head Latent Attention (MLA), compressing the KV cache into a tiny latent vector while preserving full multi-head expressivity via decoupled rotary embeddings. Complementing MLA, DeepSeekMoE deploys fine-grained experts alongside dedicated shared experts, using an auxiliary-loss-free balancing mechanism that dynamically offsets routing biases to maintain hardware load balance without penalizing next-token prediction accuracy.',
  },
  rawLabeledFlowchart: `[FLOWCHART]
graph TD
    subgraph InputStage["1. Input Token Embeddings"]
        X["Token Representation h_t [Batch, Length, Dim]"]
    end

    subgraph MLALatent["2. Multi-Head Latent Attention (MLA)"]
        X --> W_DKV["Down-Projection W_DKV -> Latent KV c_t^KV [d_c=512]"]
        W_DKV --> CACHE["Ultra-Compressed Latent KV Cache (93.3% smaller)"]
        CACHE --> W_UK["Up-Projection W_UK -> Keys k_t^C"]
        CACHE --> W_UV["Up-Projection W_UV -> Values v_t^C"]
        X --> ROPE_K["Decoupled RoPE Key Projection k_t^R"]
        ROPE_K & W_UK --> ASSEMBLE_K["Concat Key: [k_t^C, k_t^R]"]
        X --> W_DQ["Query Down-Proj -> c_t^Q"]
        W_DQ --> W_UQ["Query Up-Proj -> q_t^C"]
        X --> ROPE_Q["Decoupled RoPE Query q_t^R"]
        ROPE_Q & W_UQ --> ASSEMBLE_Q["Concat Query: [q_t^C, q_t^R]"]
        ASSEMBLE_Q & ASSEMBLE_K & W_UV --> SMAX["Softmax Scaled Dot-Product Attention"]
        SMAX --> ATTN_OUT["MLA Sublayer Output"]
    end

    subgraph DeepSeekMoE["3. Fine-Grained MoE with Auxiliary-Loss-Free Routing"]
        ATTN_OUT --> SHARED["Shared Experts (Always Activated)"]
        ATTN_OUT --> ROUTER["Top-K Affinity Router (Dynamic Bias Correction b_i)"]
        ROUTER --> EXP1["Routed Expert 1"]
        ROUTER --> EXP2["Routed Expert 2"]
        ROUTER --> EXPN["Routed Expert N (Fine-Grained 256 Total)"]
        EXP1 & EXP2 & EXPN --> MOE_SUM["Weighted Sum of Activated Routed Experts"]
        SHARED & MOE_SUM --> MERGE["Combined MoE Representation"]
    end

    subgraph OutputStage["4. Residual Projection"]
        MERGE --> RES["Residual Add: h_t + Sublayer_Output"]
        X -.-> RES
        RES --> FINAL_OUT["Next Layer Representation"]
    end`,
  mermaidCode: `graph TD
    subgraph InputStage["1. Input Token Embeddings"]
        X["Token Representation h_t [Batch, Length, Dim]"]
    end

    subgraph MLALatent["2. Multi-Head Latent Attention (MLA)"]
        X --> W_DKV["Down-Projection W_DKV -> Latent KV c_t^KV [d_c=512]"]
        W_DKV --> CACHE["Ultra-Compressed Latent KV Cache (93.3% smaller)"]
        CACHE --> W_UK["Up-Projection W_UK -> Keys k_t^C"]
        CACHE --> W_UV["Up-Projection W_UV -> Values v_t^C"]
        X --> ROPE_K["Decoupled RoPE Key Projection k_t^R"]
        ROPE_K & W_UK --> ASSEMBLE_K["Concat Key: [k_t^C, k_t^R]"]
        X --> W_DQ["Query Down-Proj -> c_t^Q"]
        W_DQ --> W_UQ["Query Up-Proj -> q_t^C"]
        X --> ROPE_Q["Decoupled RoPE Query q_t^R"]
        ROPE_Q & W_UQ --> ASSEMBLE_Q["Concat Query: [q_t^C, q_t^R]"]
        ASSEMBLE_Q & ASSEMBLE_K & W_UV --> SMAX["Softmax Scaled Dot-Product Attention"]
        SMAX --> ATTN_OUT["MLA Sublayer Output"]
    end

    subgraph DeepSeekMoE["3. Fine-Grained MoE with Auxiliary-Loss-Free Routing"]
        ATTN_OUT --> SHARED["Shared Experts (Always Activated)"]
        ATTN_OUT --> ROUTER["Top-K Affinity Router (Dynamic Bias Correction b_i)"]
        ROUTER --> EXP1["Routed Expert 1"]
        ROUTER --> EXP2["Routed Expert 2"]
        ROUTER --> EXPN["Routed Expert N (Fine-Grained 256 Total)"]
        EXP1 & EXP2 & EXPN --> MOE_SUM["Weighted Sum of Activated Routed Experts"]
        SHARED & MOE_SUM --> MERGE["Combined MoE Representation"]
    end

    subgraph OutputStage["4. Residual Projection"]
        MERGE --> RES["Residual Add: h_t + Sublayer_Output"]
        X -.-> RES
        RES --> FINAL_OUT["Next Layer Representation"]
    end`,
  nodeDetails: [
    {
      id: 'CACHE',
      label: 'Latent KV Cache (c_t^KV)',
      role: 'Stores low-rank compressed 512-dim latent representations instead of separate full-rank Key and Value matrices',
      shape: '[Batch, SeqLen, d_c=512]',
      notes: 'Decreases per-token memory footprint from 2*n_heads*d_head to single compressed vector d_c + d_rope.',
    },
    {
      id: 'ROUTER',
      label: 'Auxiliary-Loss-Free Router',
      role: 'Assigns tokens to top-k routed experts while dynamically shifting bias terms b_i to enforce perfect hardware load balance',
      shape: 'Affine score s_i = Softmax(h · e_i + b_i)',
      notes: 'Eliminates traditional auxiliary loss penalty, ensuring language modeling performance is uncompromised.',
    },
    {
      id: 'SHARED',
      label: 'Isolated Shared Experts',
      role: 'Always-activated expert pathways dedicated to capturing universal domain knowledge across all tokens',
      shape: '[Batch, SeqLen, Dim -> Dim_shared]',
      notes: 'Mitigates parameter redundancy in routed experts by delegating common patterns to shared channels.',
    },
  ],
  studentOpportunities: [
    {
      id: 'proj-1',
      title: 'MiniMLA: Standalone Multi-Head Latent Attention Module for HuggingFace Llama Models',
      exactExtension: 'Retrofit standard Grouped-Query Attention (GQA) in open Llama-3-8B with DeepSeek Multi-Head Latent Attention (MLA), caching only 512-dim latent vectors during decoding.',
      targetMetric: '6.2x reduction in KV cache memory footprint allowing 32k context inference with batch size 16 on a single 16GB GPU.',
      recommendedTechStack: ['PyTorch', 'HuggingFace Transformers', 'vLLM', 'Triton (Fused Up-projection)', 'Weights & Biases'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Implement MLA PyTorch module with decoupled rotary positional embedding projections.' },
        { week: 'Phase 2 (W3-4)', task: 'Write custom Triton kernel that fuses matrix up-projection into attention calculation to prevent SRAM overhead.' },
        { week: 'Phase 3 (W5-6)', task: 'Continual pre-train / distill small 1B model on 5B tokens comparing MLA against MHA and GQA.' },
        { week: 'Phase 4 (W7-8)', task: 'Benchmark decoding throughput across batch sizes and publish open-source HuggingFace adapter.' },
      ],
      benchmarks: [
        'KV Cache Memory Allocation (MB) per 1,000 generated tokens',
        'Time-To-First-Token (TTFT) and decode throughput (tokens/sec)',
        'Perplexity on LongBench and Needle-in-a-Haystack retrieval score',
      ],
      resumeBulletPoint: 'Built MiniMLA in PyTorch/Triton, replacing Llama-3 GQA with Multi-Head Latent Attention to compress inference KV cache by 6.2x with zero perplexity degradation.',
      interviewTalkingPoints: [
        'Why standard low-rank key projection breaks RoPE positional invariance and how decoupled RoPE fixes it.',
        'Memory bandwidth vs compute balance when reconstructing full keys/values on-the-fly.',
        'Comparison of MLA memory efficiency versus GQA (Grouped Query Attention) and Cross-Layer KV sharing.',
      ],
      starterScaffold: 'git clone https://github.com/student/mini-mla\npython benchmark_kv_cache.py --arch mla --context_len 16384',
    },
    {
      id: 'proj-2',
      title: 'FreeMoE-Lite: Dynamic Routing Bias Controller for Heterogeneous MoE Clusters',
      exactExtension: 'Implement DeepSeek’s auxiliary-loss-free load balancing algorithm with dynamic bias compensation for fine-grained Mixture-of-Experts distributed across asymmetric consumer GPUs.',
      targetMetric: '< 1.5% expert utilization skew without any auxiliary loss coefficient tuning, yielding 28% higher cluster throughput.',
      recommendedTechStack: ['PyTorch Distributed', 'Ray', 'NCCL', 'FastAPI', 'Prometheus & Grafana'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Implement fine-grained 16-expert MoE layer with top-2 token routing in PyTorch.' },
        { week: 'Phase 2 (W3-4)', task: 'Build asynchronous bias update worker adjusting routing biases based on moving average expert queue depths.' },
        { week: 'Phase 3 (W5-6)', task: 'Simulate straggler nodes and evaluate bias adaptation speed under bursty non-uniform prompt distributions.' },
        { week: 'Phase 4 (W7-8)', task: 'Package into a drop-in MoE balancing module with live Prometheus metrics.' },
      ],
      benchmarks: [
        'Expert Load Coefficient of Variation (CV) across 50,000 steps',
        'Downstream perplexity comparison between Switch Transformer aux-loss vs dynamic bias',
        'End-to-end token generation latency on mixed-GPU testbed',
      ],
      resumeBulletPoint: 'Engineered an auxiliary-loss-free MoE router in PyTorch, eliminating expert collapse and reducing load imbalance variance to <1.5% across heterogeneous GPU workers.',
      interviewTalkingPoints: [
        'Why auxiliary balance loss forces models into suboptimal representations to satisfy artificial uniform distributions.',
        'Mathematical formulation of the dynamic bias term and step-size stability.',
        'All-to-all communication bottlenecks in distributed MoE vs latency in dense models.',
      ],
      starterScaffold: 'python train_freemoe.py --num_routed_experts 16 --num_shared_experts 2 --balancing dynamic_bias',
    },
    {
      id: 'proj-3',
      title: 'MultiToken-Draft: Multi-Token Prediction (MTP) Speculative Engine',
      exactExtension: 'Implement DeepSeek-V3’s Multi-Token Prediction (MTP) module that trains auxiliary sequential prediction heads to predict n future tokens concurrently for self-speculative decoding.',
      targetMetric: '1.9x speedup in autoregressive inference without requiring a secondary external draft model.',
      recommendedTechStack: ['PyTorch', 'vLLM', 'HuggingFace Transformers', 'FlashAttention-2', 'Optuna'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Construct dual MTP projection heads sharing representation layers with causal sequence masking.' },
        { week: 'Phase 2 (W3-4)', task: 'Fine-tune 1.5B base model on code datasets with joint MTP training objective.' },
        { week: 'Phase 3 (W5-6)', task: 'Implement tree-based speculative verification kernel accepting variable-length candidates.' },
        { week: 'Phase 4 (W7-8)', task: 'Benchmark acceptance rate across coding, math, and conversational reasoning benchmarks.' },
      ],
      benchmarks: [
        'Speculative Acceptance Rate (mean tokens verified per forward pass)',
        'Inference speedup (tokens/sec) vs vanilla greedy decoding',
        'Overhead of auxiliary MTP head parameters during training',
      ],
      resumeBulletPoint: 'Created a Multi-Token Prediction self-speculative engine in PyTorch, yielding 1.9x faster autoregressive generation on code completion tasks with zero external draft model.',
      interviewTalkingPoints: [
        'Difference between Multi-Token Prediction (MTP), Medusa heads, and Eagle speculative decoding.',
        'How MTP pre-allocates representation capacity for future sequence planning during pre-training.',
        'Optimal verification tree shapes for minimizing GPU kernel launches.',
      ],
      starterScaffold: 'python eval_mtp.py --model student/deepseek-mtp-1.5b --speculative_depth 2',
    },
  ],
};

export const FLASH_ATTENTION_PAPER: PaperAnalysis = {
  paperMeta: {
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    authors: ['Tri Dao', 'Daniel Y. Fu', 'Stefano Ermon', 'Atri Rudra', 'Christopher Ré'],
    year: '2022',
    venue: 'NeurIPS 2022',
    url: 'https://arxiv.org/abs/2205.14135',
    arxivId: '2205.14135',
    tagline: 'IO-aware tiling algorithm computing exact softmax attention without materializing the N×N intermediate matrix.',
    category: 'Hardware Acceleration & Systems',
    estimatedTokensUsed: 3510,
  },
  coreConcept: {
    problemStatement: 'Standard transformer attention requires quadratic O(N^2) memory and memory bandwidth with respect to sequence length because it materializes intermediate N×N attention matrices in slow High Bandwidth Memory (HBM). As a result, model execution time is heavily memory-bandwidth bound rather than arithmetic-compute bound.',
    methodology: 'FlashAttention introduces an IO-aware exact attention algorithm that tiles Query, Key, and Value inputs into blocks that fit within fast on-chip SRAM. It computes softmax incrementally using the online softmax technique without writing large intermediate matrices back to HBM, and stores only normalization statistics to recompute attention during the backward pass.',
    mathematicalBreakthroughs: 'Online Softmax decomposes row-wise softmax across sub-blocks: m_new = max(m_prev, max(S_block)), l_new = exp(m_prev - m_new) · l_prev + sum(exp(S_block - m_new)). Output accumulation O_new is rescaled by diag(exp(m_prev - m_new)) · O_prev + exp(S_block - m_new) · V_block, avoiding storing the full N×N matrix in HBM.',
    wordCount: 187,
    combinedSummary: 'Standard attention mechanisms are severely bottlenecked by GPU memory bandwidth because they repeatedly write and read the quadratic N×N attention matrix from slow High Bandwidth Memory (HBM). Dao et al. presented FlashAttention, an IO-aware tiling algorithm that loads blocks of Q, K, and V into fast on-chip SRAM, performs exact softmax reduction on-chip via the online softmax trick, and streams outputs directly without storing intermediate attention scores in HBM. By reducing HBM read/write traffic by up to 8x and recomputing attention in the backward pass using stored statistics, FlashAttention achieves 2-4x wall-clock speedups while enabling longer context windows with exact mathematical parity.',
  },
  rawLabeledFlowchart: `[FLOWCHART]
graph TD
    subgraph MemoryHierarchy["1. GPU Memory Hierarchy"]
        HBM["Slow GPU High Bandwidth Memory (HBM)"]
        SRAM["Fast On-Chip SRAM (L1/Shared Memory)"]
    end

    subgraph TilingStage["2. Block Tiling Strategy"]
        HBM -->|Load Block B_r of Q| SRAM
        HBM -->|Load Block B_c of K, V| SRAM
    end

    subgraph OnlineSoftmax["3. On-Chip Online Softmax Computation"]
        SRAM --> S_BLOCK["Compute Partial Scores: S_ij = Q_i * K_j^T / sqrt(d)"]
        S_BLOCK --> M_UPDATE["Online Max Tracking: m_new = max(m_old, rowmax(S_ij))"]
        M_UPDATE --> L_UPDATE["Online Denominator: l_new = exp(m_old - m_new)*l_old + sum(exp(S_ij - m_new))"]
        L_UPDATE --> O_ACCUM["Accumulate Output Block: O_i = rescale(O_old) + exp(S_ij - m_new)*V_j"]
    end

    subgraph OutputWriteback["4. Direct Output Streaming"]
        O_ACCUM --> FINAL_NORM["Final Rescaling: O_i = O_i / l_final"]
        FINAL_NORM -->|Writeback to HBM| HBM_OUT["Final Output O in HBM"]
        FINAL_NORM -->|Store only (m, l) stats for backward pass| STATS["Log-Sum-Exp Stats (O(N) size)"]
    end`,
  mermaidCode: `graph TD
    subgraph MemoryHierarchy["1. GPU Memory Hierarchy"]
        HBM["Slow GPU High Bandwidth Memory (HBM)"]
        SRAM["Fast On-Chip SRAM (L1/Shared Memory)"]
    end

    subgraph TilingStage["2. Block Tiling Strategy"]
        HBM -->|Load Block B_r of Q| SRAM
        HBM -->|Load Block B_c of K, V| SRAM
    end

    subgraph OnlineSoftmax["3. On-Chip Online Softmax Computation"]
        SRAM --> S_BLOCK["Compute Partial Scores: S_ij = Q_i * K_j^T / sqrt(d)"]
        S_BLOCK --> M_UPDATE["Online Max Tracking: m_new = max(m_old, rowmax(S_ij))"]
        M_UPDATE --> L_UPDATE["Online Denominator: l_new = exp(m_old - m_new)*l_old + sum(exp(S_ij - m_new))"]
        L_UPDATE --> O_ACCUM["Accumulate Output Block: O_i = rescale(O_old) + exp(S_ij - m_new)*V_j"]
    end

    subgraph OutputWriteback["4. Direct Output Streaming"]
        O_ACCUM --> FINAL_NORM["Final Rescaling: O_i = O_i / l_final"]
        FINAL_NORM -->|Writeback to HBM| HBM_OUT["Final Output O in HBM"]
        FINAL_NORM -->|Store only (m, l) stats for backward pass| STATS["Log-Sum-Exp Stats (O(N) size)"]
    end`,
  nodeDetails: [
    {
      id: 'SRAM',
      label: 'On-Chip Fast SRAM Cache',
      role: 'Stores active tiles of Q, K, and V sized specifically to avoid spilling into High Bandwidth Memory',
      shape: 'Tile size B_r × d and B_c × d',
      notes: 'Operating in SRAM provides ~19 TB/s internal bandwidth compared to ~2 TB/s for HBM.',
    },
    {
      id: 'M_UPDATE',
      label: 'Online Softmax Tracker',
      role: 'Computes numerical scaling factors iteratively without requiring a separate full reduction pass across sequence length',
      shape: 'Row vector [B_r, 1]',
      notes: 'Based on the Milakov-Gimelshein trick for online normalization.',
    },
    {
      id: 'STATS',
      label: 'Log-Sum-Exp Statistics',
      role: 'Retains compact O(N) normalization stats so attention can be recomputed on-the-fly during backpropagation',
      shape: '[Batch, Heads, SeqLen]',
      notes: 'Avoids storing the full N×N activation tensor during the backward pass.',
    },
  ],
  studentOpportunities: [
    {
      id: 'proj-1',
      title: 'FlashTriton-Apple: Fused Attention Kernel for Metal Shading Language & Apple Silicon',
      exactExtension: 'Port the FlashAttention tiling and online softmax algorithm to Apple MLX / Metal Shading Language, exploiting Apple Silicon unified memory and SLC cache.',
      targetMetric: '3.1x faster attention forward pass on M2/M3 chips for 4k sequence lengths compared to standard PyTorch Metal.',
      recommendedTechStack: ['Apple MLX', 'Metal Shading Language (MSL)', 'PyTorch', 'C++ Metal bindings', 'Instruments'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Implement online softmax reduction algorithm in clean Python prototyping code.' },
        { week: 'Phase 2 (W3-4)', task: 'Write Metal compute kernel tiling threadgroups to fit M-series threadgroup memory (32KB).' },
        { week: 'Phase 3 (W5-6)', task: 'Tune SIMDgroup matrix multiplication instructions (simdgroup_matrix) for float16.' },
        { week: 'Phase 4 (W7-8)', task: 'Package as pip-installable MLX extension with benchmark suite against PyTorch MPS.' },
      ],
      benchmarks: [
        'Time per attention call (ms) from sequence length 512 to 8192',
        'Unified memory allocated (MB) during forward and backward pass',
        'Arithmetic intensity (FLOPs / memory byte transferred)',
      ],
      resumeBulletPoint: 'Engineered an IO-aware tiled attention kernel in Metal/MLX for Apple Silicon, achieving 3.1x faster inference and flat memory overhead on M-series chips.',
      interviewTalkingPoints: [
        'How unified memory architecture changes the trade-off between compute and memory access.',
        'Threadgroup memory bank conflicts in Apple GPU cores compared to NVIDIA warp shuffles.',
        'Register pressure considerations when accumulating float32 softmax statistics.',
      ],
      starterScaffold: 'git clone https://github.com/student/metal-flash-attn\npython bench_metal.py --seq_len 4096 --dtype float16',
    },
    {
      id: 'proj-2',
      title: 'FlashLinear-Mask: Dynamic Block-Sparse FlashAttention for Structured Code Syntax',
      exactExtension: 'Extend FlashAttention to skip computation entirely for tiles that fall outside of syntax-tree dependency masks in programming languages.',
      targetMetric: '65% compute reduction on 16k context Python code files with 100% preservation of code generation pass@1.',
      recommendedTechStack: ['OpenAI Triton', 'Tree-sitter (AST parser)', 'PyTorch', 'HuggingFace', 'Weights & Biases'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Extract AST lexical scope masks from Python source code using Tree-sitter.' },
        { week: 'Phase 2 (W3-4)', task: 'Implement Triton kernel that accepts a block-level boolean presence bitmap to skip non-active tiles.' },
        { week: 'Phase 3 (W5-6)', task: 'Evaluate compile overhead vs runtime speedup on StarCoder or CodeLlama.' },
        { week: 'Phase 4 (W7-8)', task: 'Publish interactive attention-sparsity visualizer in Gradio.' },
      ],
      benchmarks: [
        'Effective TFLOPS and wall-clock execution time vs sequence length',
        'Tile skip ratio (%) across various programming languages',
        'Pass@1 on HumanEval and MBPP code completion benchmarks',
      ],
      resumeBulletPoint: 'Architected a block-sparse FlashAttention kernel in Triton utilizing AST syntax masks, cutting attention latency by 65% on 16k token code files.',
      interviewTalkingPoints: [
        'Difference between fine-grained token-level sparsity and coarse hardware block-level tiling.',
        'Why irregular memory access patterns degrade GPU streaming multiprocessor occupancy.',
        'How Tree-sitter AST parsing can be decoupled asynchronously from model execution.',
      ],
      starterScaffold: 'python test_sparse_flash.py --code_file test.py --block_size 64',
    },
    {
      id: 'proj-3',
      title: 'FlashQuant: Integer INT8 Quantized Online Softmax Attention',
      exactExtension: 'Quantize Query and Key tiles to 8-bit integers dynamically within fast SRAM before computing block dot-products, while maintaining FP32 online softmax normalization.',
      targetMetric: '1.8x additional throughput increase on NVIDIA Ada/Hopper Tensor Cores with zero loss in MMLU accuracy.',
      recommendedTechStack: ['PyTorch', 'OpenAI Triton', 'CUTLASS', 'bitsandbytes', 'DeepSpeed'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Analyze dynamic range of Q and K activation matrices in Llama-3 attention layers.' },
        { week: 'Phase 2 (W3-4)', task: 'Implement tile-level symmetric INT8 quantization within Triton SRAM registers.' },
        { week: 'Phase 3 (W5-6)', task: 'Fuse INT8 matrix multiplication with FP32 accumulator and online exponential scaling.' },
        { week: 'Phase 4 (W7-8)', task: 'Conduct end-to-end evaluation on MMLU and GSM8K benchmark splits.' },
      ],
      benchmarks: [
        'Kernel execution latency (micro-seconds) on RTX 4090 / A100',
        'Numerical mean squared error (MSE) relative to full precision FlashAttention-2',
        'Downstream zero-shot classification scores on standard benchmarks',
      ],
      resumeBulletPoint: 'Implemented FlashQuant in Triton, executing INT8 tile-quantized attention in GPU SRAM for a 1.8x throughput increase on NVIDIA Ada Tensor Cores.',
      interviewTalkingPoints: [
        'Why quantizing post-softmax values (V) is more sensitive to precision than pre-softmax values (Q, K).',
        'How per-tile scaling factors prevent outlier tokens from destroying INT8 precision.',
        'Hardware differences between FP16 Tensor Cores and INT8 MMA instructions.',
      ],
      starterScaffold: 'python benchmark_int8_flash.py --model meta-llama/Llama-3-8b --batch_size 8',
    },
  ],
};

export const DPO_PAPER: PaperAnalysis = {
  paperMeta: {
    title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
    authors: ['Rafael Rafailov', 'Archit Sharma', 'Eric Mitchell', 'Stefano Ermon', 'Christopher D. Manning', 'Chelsea Finn'],
    year: '2023',
    venue: 'NeurIPS 2023 (Oral)',
    url: 'https://arxiv.org/abs/2305.18290',
    arxivId: '2305.18290',
    tagline: 'Eliminates separate reward model and reinforcement learning training loop in RLHF with a closed-form loss.',
    category: 'Alignment & Preference Optimization',
    estimatedTokensUsed: 3260,
  },
  coreConcept: {
    problemStatement: 'Reinforcement Learning from Human Feedback (RLHF) via PPO is notoriously unstable, complex, and resource-intensive. It requires fitting a separate reward model, repeatedly sampling completions from the policy model in an inner loop, and updating actor-critic networks with delicate hyperparameter balancing.',
    methodology: 'Direct Preference Optimization (DPO) derives an exact closed-form equivalence between the optimal policy under a KL-regularized reward and the ground-truth reward function. This allows parameterizing the preference loss directly over the policy model without requiring a separate reward model or RL training loop.',
    mathematicalBreakthroughs: 'Under the Bradley-Terry preference model, the ground-truth reward r(x, y) = β · log(π(y|x) / π_ref(y|x)). The loss simplifies to a binary cross-entropy objective: L_DPO(π_θ; π_ref) = -E[log σ(β · log(π_θ(y_w|x)/π_ref(y_w|x)) - β · log(π_θ(y_l|x)/π_ref(y_l|x)))], which increases the implicit reward of winning responses y_w over losing responses y_l.',
    wordCount: 184,
    combinedSummary: 'Aligning large language models with human preferences historically required RLHF with PPO—a cumbersome two-phase process involving fitting a separate reward model and managing unstable reinforcement learning loops. Rafailov et al. proved that an analytical mapping exists between reward models and the optimal policy under KL regularization. By substituting this identity directly into the Bradley-Terry preference objective, DPO transforms the complex RL problem into an exact, stable, and computationally lightweight binary classification loss trained on offline pairs of chosen and rejected responses. DPO eliminates policy sampling during training, reduces memory overhead by more than 50%, and achieves superior alignment with zero reward model training.',
  },
  rawLabeledFlowchart: `[FLOWCHART]
graph TD
    subgraph DataInput["1. Preference Dataset"]
        D["Dataset: Prompt x, Chosen Response y_w, Rejected Response y_l"]
    end

    subgraph ForwardPasses["2. Parallel Log-Likelihood Evaluation"]
        D -->|Pass (x, y_w)| PI_THETA["Current Policy Model pi_theta (Trainable)"]
        D -->|Pass (x, y_l)| PI_THETA
        D -->|Pass (x, y_w)| PI_REF["Reference Model pi_ref (Frozen Baseline)"]
        D -->|Pass (x, y_l)| PI_REF
        PI_THETA --> LOGP_W["Log-prob log pi_theta(y_w|x)"]
        PI_THETA --> LOGP_L["Log-prob log pi_theta(y_l|x)"]
        PI_REF --> REFP_W["Log-prob log pi_ref(y_w|x)"]
        PI_REF --> REFP_L["Log-prob log pi_ref(y_l|x)"]
    end

    subgraph ImplicitRewards["3. Implicit Reward Calculation"]
        LOGP_W & REFP_W --> R_W["Chosen Implicit Reward: r_w = beta * log(pi_theta(y_w) / pi_ref(y_w))"]
        LOGP_L & REFP_L --> R_L["Rejected Implicit Reward: r_l = beta * log(pi_theta(y_l) / pi_ref(y_l))"]
    end

    subgraph LossComputation["4. Binary Cross-Entropy Loss & Backprop"]
        R_W & R_L --> DIFF["Margin: delta = r_w - r_l"]
        DIFF --> SIGMA["Sigmoid: sigma(delta)"]
        SIGMA --> LOSS["DPO Loss: -log(sigma(delta))"]
        LOSS --> GRAD["Backpropagation -> Update Only Policy Model pi_theta"]
    end`,
  mermaidCode: `graph TD
    subgraph DataInput["1. Preference Dataset"]
        D["Dataset: Prompt x, Chosen Response y_w, Rejected Response y_l"]
    end

    subgraph ForwardPasses["2. Parallel Log-Likelihood Evaluation"]
        D -->|Pass (x, y_w)| PI_THETA["Current Policy Model pi_theta (Trainable)"]
        D -->|Pass (x, y_l)| PI_THETA
        D -->|Pass (x, y_w)| PI_REF["Reference Model pi_ref (Frozen Baseline)"]
        D -->|Pass (x, y_l)| PI_REF
        PI_THETA --> LOGP_W["Log-prob log pi_theta(y_w|x)"]
        PI_THETA --> LOGP_L["Log-prob log pi_theta(y_l|x)"]
        PI_REF --> REFP_W["Log-prob log pi_ref(y_w|x)"]
        PI_REF --> REFP_L["Log-prob log pi_ref(y_l|x)"]
    end

    subgraph ImplicitRewards["3. Implicit Reward Calculation"]
        LOGP_W & REFP_W --> R_W["Chosen Implicit Reward: r_w = beta * log(pi_theta(y_w) / pi_ref(y_w))"]
        LOGP_L & REFP_L --> R_L["Rejected Implicit Reward: r_l = beta * log(pi_theta(y_l) / pi_ref(y_l))"]
    end

    subgraph LossComputation["4. Binary Cross-Entropy Loss & Backprop"]
        R_W & R_L --> DIFF["Margin: delta = r_w - r_l"]
        DIFF --> SIGMA["Sigmoid: sigma(delta)"]
        SIGMA --> LOSS["DPO Loss: -log(sigma(delta))"]
        LOSS --> GRAD["Backpropagation -> Update Only Policy Model pi_theta"]
    end`,
  nodeDetails: [
    {
      id: 'PI_REF',
      label: 'Frozen Reference Model (pi_ref)',
      role: 'Acts as an anchor preventing the policy from drifting into degenerate output modes',
      shape: 'Identical parameter shape to base model (weights frozen)',
      notes: 'Can be offloaded to CPU or quantized to save GPU VRAM during training.',
    },
    {
      id: 'DIFF',
      label: 'Implicit Reward Margin',
      role: 'Calculates the log-odds advantage of the preferred completion over the rejected completion',
      shape: 'Scalar value per pair',
      notes: 'Scaled by hyperparameter β (typically 0.1 to 0.5) to control KL penalty aggressiveness.',
    },
    {
      id: 'LOSS',
      label: 'Closed-Form DPO Loss',
      role: 'Standard binary cross-entropy formulation that updates policy weights directly via simple autograd',
      shape: 'Batch-averaged scalar loss',
      notes: 'Completely eliminates need for actor, critic, value estimation, and generalized advantage estimation (GAE).',
    },
  ],
  studentOpportunities: [
    {
      id: 'proj-1',
      title: 'Online-DPO: Real-Time Self-Play Preference Optimization via Rejection Sampling',
      exactExtension: 'Upgrade static offline DPO by dynamically generating new response pairs during training and labeling them with an ensemble of fast reward heuristics (length, syntax, and unit-test passes).',
      targetMetric: '14% higher win rate on MT-Bench compared to offline DPO while training in under 6 hours on a single consumer GPU.',
      recommendedTechStack: ['PyTorch', 'HuggingFace TRL', 'vLLM', 'Ray', 'Weights & Biases'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Implement baseline offline DPO in TRL on Anthropic HH-RLHF dataset.' },
        { week: 'Phase 2 (W3-4)', task: 'Integrate vLLM engine for high-speed prompt generation during epoch transitions.' },
        { week: 'Phase 3 (W5-6)', task: 'Develop automated rejection filter scoring pairs by Python execution output.' },
        { week: 'Phase 4 (W7-8)', task: 'Run AlpacaEval win-rate evaluations and publish a GitHub reproducible experiment.' },
      ],
      benchmarks: [
        'AlpacaEval 2.0 win rate (%) vs GPT-4 Turbo',
        'Implicit reward margin separation over training iterations',
        'Training wall-clock time and peak GPU VRAM allocation',
      ],
      resumeBulletPoint: 'Built an Online DPO self-play training loop using TRL and vLLM, improving model alignment win-rate by 14% on MT-Bench through real-time rejection sampling.',
      interviewTalkingPoints: [
        'Why offline DPO suffers from distribution shift as the policy evolves away from the static dataset.',
        'Length bias in preference optimization and how margin penalties prevent verbosity hacking.',
        'Differences between DPO, IPO (Identity Preference Optimization), and KTO (Kahneman-Tversky Optimization).',
      ],
      starterScaffold: 'python train_online_dpo.py --model meta-llama/Llama-3-8b-instruct --beta 0.1 --online_samples 4',
    },
    {
      id: 'proj-2',
      title: 'Single-GPU DPO: LoRA Reference Sharing with Zero VRAM Duplication',
      exactExtension: 'Eliminate the requirement to keep a separate copy of the reference model in GPU memory by toggling LoRA adapter weights on-and-off dynamically during the forward pass.',
      targetMetric: '50% GPU memory reduction, enabling full DPO alignment of 8B models on an 8GB VRAM consumer laptop GPU.',
      recommendedTechStack: ['PyTorch', 'PEFT', 'bitsandbytes', 'HuggingFace Transformers', 'FastAPI'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Trace memory allocations when holding both base and reference models in memory.' },
        { week: 'Phase 2 (W3-4)', task: 'Implement custom forward hook that evaluates frozen base weights first, then activates LoRA weights.' },
        { week: 'Phase 3 (W5-6)', task: 'Integrate 4-bit NF4 base quantization with gradient checkpointing.' },
        { week: 'Phase 4 (W7-8)', task: 'Create a clean, one-click Google Colab notebook for the open-source community.' },
      ],
      benchmarks: [
        'Peak VRAM usage (GB) across batch sizes during forward and backward passes',
        'Training step latency comparison between two-model vs single-model adapter toggle',
        'GSM8k benchmark accuracy retention',
      ],
      resumeBulletPoint: 'Engineered a memory-efficient DPO pipeline eliminating reference model GPU duplication, reducing VRAM footprint by 50% to enable 8B model alignment on 8GB consumer hardware.',
      interviewTalkingPoints: [
        'How PyTorch computational graphs maintain forward activations without holding duplicated model parameters.',
        'Trade-off between computation re-evaluation vs GPU memory bandwidth limits.',
        'Quantization noise effects on reference model log-probabilities.',
      ],
      starterScaffold: 'pip install trl peft bitsandbytes\npython train_frugal_dpo.py --model unsloth/llama-3-8b --single_gpu_shared_ref',
    },
    {
      id: 'proj-3',
      title: 'MathDPO: Step-Level Preference Optimization for Multi-Step Reasoning Chains',
      exactExtension: 'Adapt DPO from whole-response pairs to step-by-step chain-of-thought reasoning by identifying the exact reasoning step where an error occurs and penalizing only that step.',
      targetMetric: '+18.5% accuracy improvement on GSM8K and MATH benchmarks compared to whole-sequence DPO.',
      recommendedTechStack: ['PyTorch', 'PRM800K Dataset', 'HuggingFace Accelerate', 'SymPy (verification)', 'W&B'],
      implementationRoadmap: [
        { week: 'Phase 1 (W1-2)', task: 'Segment math reasoning traces into delimited step-by-step tokens.' },
        { week: 'Phase 2 (W3-4)', task: 'Formulate step-level DPO loss focusing implicit reward differentiation on erroneous steps.' },
        { week: 'Phase 3 (W5-6)', task: 'Train on PRM800K step-level human feedback labels.' },
        { week: 'Phase 4 (W7-8)', task: 'Analyze error recovery behavior on challenging Olympiad-level problems.' },
      ],
      benchmarks: [
        'GSM8K solve rate (%) and MATH Level 5 accuracy',
        'False positive reasoning credit assignment rate',
        'Inference reasoning length (number of generated steps to solution)',
      ],
      resumeBulletPoint: 'Developed MathDPO for step-level reasoning alignment, localizing preference signals to individual deduction steps to achieve an 18.5% gain on MATH benchmark accuracy.',
      interviewTalkingPoints: [
        'Credit assignment problem in reinforcement learning for long-horizon mathematical proofs.',
        'Process Reward Models (PRMs) vs Outcome Reward Models (ORMs).',
        'How step-level DPO circumvents the need for training separate value functions.',
      ],
      starterScaffold: 'python train_step_dpo.py --dataset prm800k --reasoning_delimiter "\\n\\n" --beta 0.2',
    },
  ],
};

export const DEFAULT_PAPERS_MAP: Record<string, PaperAnalysis> = {
  '1706.03762': ATTENTION_PAPER,
  'attention-is-all-you-need': ATTENTION_PAPER,
  '2312.00752': MAMBA_PAPER,
  'mamba-ssm': MAMBA_PAPER,
  '2106.09685': LORA_PAPER,
  'lora-adaptation': LORA_PAPER,
  '2412.19437': DEEPSEEK_PAPER,
  'deepseek-v3': DEEPSEEK_PAPER,
  '2205.14135': FLASH_ATTENTION_PAPER,
  'flash-attention': FLASH_ATTENTION_PAPER,
  '2305.18290': DPO_PAPER,
  'dpo-alignment': DPO_PAPER,
};
