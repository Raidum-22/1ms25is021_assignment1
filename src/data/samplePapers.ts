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

export const DEFAULT_PAPERS_MAP: Record<string, PaperAnalysis> = {
  '1706.03762': ATTENTION_PAPER,
  'attention-is-all-you-need': ATTENTION_PAPER,
  '2312.00752': MAMBA_PAPER,
  'mamba-ssm': MAMBA_PAPER,
  '2106.09685': LORA_PAPER,
  'lora-adaptation': LORA_PAPER,
};
