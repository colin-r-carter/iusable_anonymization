<template>
    <!-- License Modal -->
    <div v-if="show" class="fixed inset-0 bg-base-300 bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div class="bg-base-100 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <!-- Modal Header -->
            <div class="flex justify-between items-center p-6 border-b border-base-200">
                <h1 class="text-2xl font-bold text-base-content">Open Source Licenses</h1>
                <button @click="$emit('close')" class="btn btn-ghost btn-sm">
                    <XMarkIcon class="w-5 h-5 text-base-content" />
                </button>
            </div>
            
            <!-- Modal Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                
                <p class="text-base-content mb-8">
                    This application is built using several open source libraries. We are grateful to the developers 
                    and maintainers of these projects. Below is a list of the main dependencies and their licenses.
                </p>

                <div class="space-y-6">
                    <!-- Runtime Dependencies -->
                    <section>
                        <h2 class="text-2xl font-semibold text-primary mb-4">Runtime Dependencies</h2>
                        
                        <div class="grid gap-4">
                            <div class="border border-base-200 rounded-lg p-4 hover:bg-base-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium text-base-content">Vue.js</h3>
                                    <span class="text-sm text-base-content/60">v3.4.21</span>
                                </div>
                                <p class="text-base-content/70 text-sm mb-2">
                                    Progressive JavaScript framework for building user interfaces
                                </p>
                                <div class="flex gap-4 text-sm">
                                    <span class="badge badge-success badge-outline">MIT License</span>
                                    <a href="https://github.com/vuejs/core" target="_blank" class="link link-primary">
                                        GitHub Repository →
                                    </a>
                                </div>
                            </div>

                            <div class="border border-base-200 rounded-lg p-4 hover:bg-base-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium text-base-content">Gliner</h3>
                                    <span class="text-sm text-base-content/60">v0.0.19</span>
                                </div>
                                <p class="text-base-content/70 text-sm mb-2">
                                    Named Entity Recognition (NER) library for browser-based AI model inference
                                </p>
                                <div class="flex gap-4 text-sm">
                                    <span class="badge badge-info badge-outline">Apache 2.0</span>
                                    <a href="https://github.com/urchade/GLiNER" target="_blank" class="link link-primary">
                                        GitHub Repository →
                                    </a>
                                </div>
                            </div>

                            <div class="border border-base-200 rounded-lg p-4 hover:bg-base-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium text-base-content">Hugging Face Transformers</h3>
                                    <span class="text-sm text-base-content/60">v3.5.1</span>
                                </div>
                                <p class="text-base-content/70 text-sm mb-2">
                                    JavaScript library for running transformers directly in the browser
                                </p>
                                <div class="flex gap-4 text-sm">
                                    <span class="badge badge-info badge-outline">Apache 2.0</span>
                                    <a href="https://github.com/huggingface/transformers.js" target="_blank" class="link link-primary">
                                        GitHub Repository →
                                    </a>
                                </div>
                            </div>

                            <div class="border border-base-200 rounded-lg p-4 hover:bg-base-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium text-base-content">PDF.js</h3>
                                    <span class="text-sm text-base-content/60">v5.2.133</span>
                                </div>
                                <p class="text-base-content/70 text-sm mb-2">
                                    JavaScript PDF rendering library for parsing and displaying PDF documents
                                </p>
                                <div class="flex gap-4 text-sm">
                                    <span class="badge badge-info badge-outline">Apache 2.0</span>
                                    <a href="https://github.com/mozilla/pdf.js" target="_blank" class="link link-primary">
                                        GitHub Repository →
                                    </a>
                                </div>
                            </div>

                            <div class="border border-base-200 rounded-lg p-4 hover:bg-base-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium text-base-content">Mammoth.js</h3>
                                    <span class="text-sm text-base-content/60">v1.9.0</span>
                                </div>
                                <p class="text-base-content/70 text-sm mb-2">
                                    Library for converting .docx documents to HTML and extracting plain text
                                </p>
                                <div class="flex gap-4 text-sm">
                                    <span class="badge badge-warning badge-outline">BSD-2-Clause</span>
                                    <a href="https://github.com/mwilliamson/mammoth.js" target="_blank" class="link link-primary">
                                        GitHub Repository →
                                    </a>
                                </div>
                            </div>

                            <div class="border border-base-200 rounded-lg p-4 hover:bg-base-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium text-base-content">Heroicons</h3>
                                    <span class="text-sm text-base-content/60">v2.1.5</span>
                                </div>
                                <p class="text-base-content/70 text-sm mb-2">
                                    Beautiful hand-crafted SVG icons by the makers of Tailwind CSS
                                </p>
                                <div class="flex gap-4 text-sm">
                                    <span class="badge badge-success badge-outline">MIT License</span>
                                    <a href="https://github.com/tailwindlabs/heroicons" target="_blank" class="link link-primary">
                                        GitHub Repository →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- AI Models -->
                    <section>
                        <h2 class="text-2xl font-semibold text-primary mb-4">AI Models</h2>
                        
                        <div class="grid gap-4">
                            <div class="border border-base-200 rounded-lg p-4 hover:bg-base-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium text-base-content">GLiNER Multi-PII v1</h3>
                                    <span class="text-sm text-base-content/60">ONNX Format</span>
                                </div>
                                <p class="text-base-content/70 text-sm mb-2">
                                    Named Entity Recognition model for detecting personally identifiable information (PII) and sensitive entities in text. 
                                    Trained to identify 40+ entity types including names, addresses, phone numbers, emails, and more.
                                </p>
                                <div class="mb-3">
                                    <p class="text-sm text-base-content mb-1"><strong>Created by:</strong> Urchade Zaratiana</p>
                                    <p class="text-sm text-base-content mb-1"><strong>Architecture:</strong> GLiNER (Generalist and Lightweight Named Entity Recognition)</p>
                                    <p class="text-sm text-base-content"><strong>Format:</strong> Converted to ONNX for browser inference by the <a href="https://huggingface.co/onnx-community" class="link link-primary">ONNX-Community</a></p>
                                </div>
                                <div class="flex gap-4 text-sm flex-wrap">
                                    <span class="badge badge-info badge-outline">Apache 2.0</span>
                                    <a href="https://huggingface.co/urchade/gliner_multi_pii-v1" target="_blank" class="link link-primary">
                                        HuggingFace Model →
                                    </a>
                                    <a href="https://github.com/urchade/GLiNER" target="_blank" class="link link-primary">
                                        GLiNER Repository →
                                    </a>
                                </div>
                            </div>

                            <div class="border border-base-200 rounded-lg p-4 bg-info/10">
                                <h4 class="font-medium text-base-content mb-2">Model Usage & Attribution</h4>
                                <div class="space-y-2 text-sm text-base-content">
                                    <p>• <strong>Local Processing:</strong> Models run entirely in your browser using ONNX Runtime</p>
                                    <p>• <strong>No Data Sharing:</strong> Your text never leaves your device</p>
                                    <p>• <strong>Multiple Variants:</strong> Quantized (580MB) and full precision (1.16GB) versions available</p>
                                    <p>• <strong>Research Purpose:</strong> This tool is for research and educational use</p>
                                </div>
                            </div>

                            <div class="border border-base-200 rounded-lg p-4 bg-warning/10">
                                <h4 class="font-medium text-base-content mb-2">Model Citation</h4>
                                <div class="bg-base-200 rounded p-3 text-sm font-mono text-base-content mb-2">
                                    @misc{zaratiana2023gliner,<br>
                                    &nbsp;&nbsp;title={GLiNER: Generalist Model for Named Entity Recognition using Bidirectional Transformer},<br>
                                    &nbsp;&nbsp;author={Urchade Zaratiana and Nadi Tomeh and Pierre Holat and Thierry Charnois},<br>
                                    &nbsp;&nbsp;year={2023},<br>
                                    &nbsp;&nbsp;eprint={2311.08526},<br>
                                    &nbsp;&nbsp;archivePrefix={arXiv},<br>
                                    &nbsp;&nbsp;primaryClass={cs.CL}<br>
                                    }
                                </div>
                                <a href="https://arxiv.org/abs/2311.08526" target="_blank" class="link link-primary text-sm">
                                    Read the research paper →
                                </a>
                            </div>
                        </div>
                    </section>

                    <!-- Development Dependencies -->
                    <section>
                        <h2 class="text-2xl font-semibold text-primary mb-4">Development Dependencies</h2>
                        
                        <div class="grid gap-4">
                            <div class="border border-base-200 rounded-lg p-4 hover:bg-base-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium text-base-content">Vite</h3>
                                    <span class="text-sm text-base-content/60">v5.2.0</span>
                                </div>
                                <p class="text-base-content/70 text-sm mb-2">
                                    Next generation frontend build tool for faster development
                                </p>
                                <div class="flex gap-4 text-sm">
                                    <span class="badge badge-success badge-outline">MIT License</span>
                                    <a href="https://github.com/vitejs/vite" target="_blank" class="link link-primary">
                                        GitHub Repository →
                                    </a>
                                </div>
                            </div>

                            <div class="border border-base-200 rounded-lg p-4 hover:bg-base-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium text-base-content">Tailwind CSS</h3>
                                    <span class="text-sm text-base-content/60">v3.4.4</span>
                                </div>
                                <p class="text-base-content/70 text-sm mb-2">
                                    Utility-first CSS framework for rapid UI development
                                </p>
                                <div class="flex gap-4 text-sm">
                                    <span class="badge badge-success badge-outline">MIT License</span>
                                    <a href="https://github.com/tailwindlabs/tailwindcss" target="_blank" class="link link-primary">
                                        GitHub Repository →
                                    </a>
                                </div>
                            </div>

                            <div class="border border-base-200 rounded-lg p-4 hover:bg-base-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium text-base-content">DaisyUI</h3>
                                    <span class="text-sm text-base-content/60">v4.12.2</span>
                                </div>
                                <p class="text-base-content/70 text-sm mb-2">
                                    Component library for Tailwind CSS with semantic class names
                                </p>
                                <div class="flex gap-4 text-sm">
                                    <span class="badge badge-success badge-outline">MIT License</span>
                                    <a href="https://github.com/saadeghi/daisyui" target="_blank" class="link link-primary">
                                        GitHub Repository →
                                    </a>
                                </div>
                            </div>

                            <div class="border border-base-200 rounded-lg p-4 hover:bg-base-200">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-medium text-base-content">PostCSS & Autoprefixer</h3>
                                    <span class="text-sm text-base-content/60">v8.4.38 / v10.4.19</span>
                                </div>
                                <p class="text-base-content/70 text-sm mb-2">
                                    CSS processing tools for transforming and optimizing stylesheets
                                </p>
                                <div class="flex gap-4 text-sm">
                                    <span class="badge badge-success badge-outline">MIT License</span>
                                    <a href="https://github.com/postcss/postcss" target="_blank" class="link link-primary">
                                        PostCSS Repository →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- License Information -->
                    <section class="bg-base-200 rounded-lg p-6">
                        <h2 class="text-2xl font-semibold text-primary mb-4">License Types</h2>
                        
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <h3 class="font-medium text-base-content mb-2">MIT License</h3>
                                <p class="text-sm text-base-content/70">
                                    Permissive license allowing commercial use, modification, distribution, 
                                    and private use with minimal restrictions.
                                </p>
                            </div>
                            
                            <div>
                                <h3 class="font-medium text-base-content mb-2">Apache 2.0</h3>
                                <p class="text-sm text-base-content/70">
                                    Permissive license similar to MIT but with additional provisions for patent rights 
                                    and contributor protection.
                                </p>
                            </div>
                            
                            <div>
                                <h3 class="font-medium text-base-content mb-2">BSD-2-Clause</h3>
                                <p class="text-sm text-base-content/70">
                                    Simple permissive license allowing redistribution with preserved copyright 
                                    and disclaimer notices.
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Acknowledgments -->
                    <section class="text-center py-6">
                        <p class="text-base-content/70">
                            We extend our gratitude to all the developers and maintainers of these open source projects. 
                            Their contributions make this application possible.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'
</script>

<script>
export default {
    name: 'Licenses',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close']
}
</script>