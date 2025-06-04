# Cloning Gliner Multi PII Model from Hugging Face
Make sure git-lfs is installed (https://git-lfs.com)
`git lfs install`
Then clone the Gliner Multi PII model repository from Hugging Face:
`git clone https://huggingface.co/onnx-community/gliner_multi_pii-v1`

# Add Worker to public folder
`cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/`
or directly download it from `https://unpkg.com/pdfjs-dist@5.2.133/build/pdf.worker.min.mjs``

# WASM Files Note
The WASM file paths specified in the Anonymization component (`cpu.wasm`, `gpu.wasm`) don't exist by default in the public directory, when cloning the model from Hugging Face. The Gliner library has a CDN fallback (`https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/`) which could potentially load WASM files remotely if local paths fail.

To ensure completely local operation and avoid any CDN loading, you should manually copy the WASM files:

```bash
# Copy ONNX Runtime WASM files to public directory to avoid CDN fallback
cp node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm public/models/gliner_multi_pii-v1/onnx/cpu.wasm
cp node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.wasm public/models/gliner_multi_pii-v1/onnx/gpu.wasm
```

Alternatively, you could remove the `wasmPaths` configuration entirely from the Anonymization component to let Vite bundle the WASM files automatically.
    