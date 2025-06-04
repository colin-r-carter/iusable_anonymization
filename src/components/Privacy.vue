<template>
    <!-- Privacy Modal -->
    <div v-if="show" class="fixed inset-0 bg-base-300 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-base-100 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <!-- Modal Header -->
            <div class="flex justify-between items-center p-6 border-b border-base-200">
                <h1 class="text-2xl font-bold text-base-content">Privacy Policy & Usage Guidelines</h1>
                <button @click="$emit('close')" class="btn btn-ghost btn-sm">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>
            
            <!-- Modal Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                
                <div class="space-y-6">
                    <!-- Privacy First Approach -->
                    <section>
                        <h2 class="text-2xl font-semibold text-base-content mb-4">Privacy-First Design</h2>
                        
                        <div class="bg-success/10 border border-success rounded-lg p-4 mb-4">
                            <div class="flex items-start gap-3">
                                <div class="bg-success/20 rounded-full p-2 mt-1">
                                    <ShieldCheckIcon class="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-success mb-2">Your Input-Data Never Leaves Your Device</h3>
                                    <p class="text-success text-sm">
                                        This application is designed with privacy as the core principle. All text processing, 
                                        entity detection, and anonymization happens entirely within your web browser.
                                        No data is sent to our servers or any third-party services. 
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="border border-base-200 rounded-lg p-4">
                                <h3 class="font-medium text-base-content mb-2">✅ What We Do</h3>
                                <ul class="text-sm text-base-content space-y-1">
                                    <li>• Provide the application as static files served from our servers</li>
                                    <li>• Maintain minimal server logs for security and troubleshooting (IP addresses, IP adresses in CDN logging are anonymized, timestamp, user agent)</li>
                                    <li>• Use a Content Delivery Network (CDN) to serve static files efficiently</li>
                                    <li>• We are using Bunny CDN as a hosting and CDN provider. They are an EU-based company: BunnyWay d.o.o., Dunajska cesta 165, 1000 Ljubljana, Slovenia</li>
                                    <li>• Deliver AI models to your browser once for local processing (models will be cached in your browser)</li>
                                    <li>• Maintain full code transparency through open source: https://github.com/colin-r-carter/</li>
                                </ul>
                            </div>
                            
                            <div class="border border-base-200 rounded-lg p-4">
                                <h3 class="font-medium text-base-content mb-2">❌ What We Don't Do</h3>
                                <ul class="text-sm text-base-content space-y-1">
                                    <li>• Store or access your text data</li>
                                    <li>• Send data you enter to our (or any) servers</li>
                                    <li>• Track your usage or behavior</li>
                                    <li>• Share data with third parties</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- How It Works -->
                    <section>
                        <h2 class="text-2xl font-semibold text-base-content mb-4">How Local Processing Works</h2>
                        
                        <div class="space-y-4">
                            <div class="flex items-start gap-4 p-4 bg-primary/10 rounded-lg">
                                <div class="bg-primary/20 rounded-full p-2 mt-1 text-center h-10 w-10">
                                    <span class="text-primary font-bold text-sm">1</span>
                                </div>
                                <div>
                                    <h3 class="font-medium text-base-content">Model Download</h3>
                                    <p class="text-sm text-base-content/70">AI models are downloaded to your browser's cache on first use (one-time download)</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start gap-4 p-4 bg-primary/10 rounded-lg">
                                <div class="bg-primary/20 rounded-full p-2 mt-1 text-center h-10 w-10">
                                    <span class="text-primary font-bold text-sm">2</span>
                                </div>
                                <div>
                                    <h3 class="font-medium text-base-content">Local Processing</h3>
                                    <p class="text-sm text-base-content/70">Your text is processed entirely within your browser using WebAssembly and JavaScript</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start gap-4 p-4 bg-primary/10 rounded-lg">
                                <div class="bg-primary/20 rounded-full p-2 mt-1 text-center h-10 w-10">
                                    <span class="text-primary font-bold text-sm">3</span>
                                </div>
                                <div>
                                    <h3 class="font-medium text-base-content">Results Display</h3>
                                    <p class="text-sm text-base-content/70">Anonymized results are displayed in your browser without any external communication</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Usage Guidelines -->
                    <section>
                        <h2 class="text-2xl font-semibold text-base-content mb-4">Usage Guidelines & Limitations</h2>
                        
                        <div class="space-y-4">
                            <!-- Limitations -->
                            <div class="border border-warning rounded-lg p-4 bg-warning/10">
                                <h3 class="font-medium text-base-content mb-3 flex items-center gap-2">
                                    <ExclamationTriangleIcon class="w-5 h-5 text-warning" />
                                    Important Limitations
                                </h3>
                                <ul class="text-sm text-warning space-y-1">
                                    <li>• AI models are not 100% accurate - always review results</li>
                                    <li>• May miss some sensitive information or produce false positives</li>
                                    <li>• Performance depends on your device's processing power</li>
                                    <li>• Large documents may take time to process</li>
                                    <li>• Custom regex patterns require careful testing</li>
                                </ul>
                            </div>

                            <!-- Prohibited Uses -->
                            <div class="border border-error rounded-lg p-4 bg-error/10">
                                <h3 class="font-medium text-base-content mb-3 flex items-center gap-2">
                                    <ExclamationTriangleIcon class="w-5 h-5 text-error" />
                                    Prohibited Usage
                                </h3>
                                <ul class="text-sm text-error space-y-1">
                                    <li>• May not be used for prohibited purposes under applicable law.</li>
                                    <li>• Do not use in any manner in violation of applicable law.</li>
                                    <li>• Not made or intended for high-risk use cases.</li>
                                    <li>• Not suitable for scenarios where failures or errors may affect the security or safety of people, systems, or assets.</li>
                                    <li>• Do not use results automatically without human review.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- Data Handling -->
                    <section>
                        <h2 class="text-2xl font-semibold text-base-content mb-4">Technical Data Handling</h2>
                        
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="border border-base-200 rounded-lg p-4">
                                <h3 class="font-medium text-base-content mb-2">Browser Storage</h3>
                                <ul class="text-sm text-base-content space-y-1">
                                    <li>• AI models cached in browser storage</li>
                                    <li>• No personal data stored persistently</li>
                                    <li>• Cache can be cleared anytime</li>
                                    <li>• No cookies for tracking</li>
                                </ul>
                            </div>
                            
                            <div class="border border-base-200 rounded-lg p-4">
                                <h3 class="font-medium text-base-content mb-2">File Processing</h3>
                                <ul class="text-sm text-base-content space-y-1">
                                    <li>• Files processed in browser memory only</li>
                                    <li>• No file uploads to servers</li>
                                    <li>• Text extracted locally</li>
                                    <li>• Results not saved automatically</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- Contact & Transparency -->
                    <section>
                        <h2 class="text-2xl font-semibold text-base-content mb-4">Transparency & Contact</h2>
                        
                        <div class="bg-base-200 rounded-lg p-4">
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h3 class="font-medium text-base-content mb-2">Open Source</h3>
                                    <p class="text-sm text-base-content mb-2">
                                        This application is fully open source. You can review the code, 
                                        report issues, or contribute improvements.
                                    </p>
                                    <a href="https://github.com/colin-r-carter/iusable_anonymization" target="_blank" class="text-primary hover:text-primary-focus text-sm">
                                        View Source Code →
                                    </a>
                                </div>
                                
                                <div>
                                    <h3 class="font-medium text-base-content mb-2">Questions or Concerns</h3>
                                    <p class="text-sm text-base-content mb-2">
                                        If you have questions about privacy, usage, or technical implementation, 
                                        please reach out through our repository.
                                    </p>
                                    <p class="text-sm text-base-content/70">
                                        <strong>recht.intelligent GmbH</strong><br>
                                        Dufourstrasse 32, 8008 Zürich
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Disclaimer -->
                    <section class="bg-base-200 rounded-lg p-4">
                        <h3 class="font-medium text-base-content mb-2">Disclaimer</h3>
                        <div class="text-sm text-base-content">
                            <p>
                                This service is provided "as-is" for research and educational purposes. While we 
                                prioritize privacy and security, users assume full responsibility for their use 
                                of this tool. Always verify results and comply with applicable laws and regulations 
                                in your jurisdiction.
                            </p>

                            <p class="mt-3">
                                By using this application, you agree to these terms and acknowledge that
                                you have read and understood this privacy policy and usage guidelines.
                            </p>

                            <p class="mt-3">
                                We reserve the right to update this policy at any time, and your continued use
                                of the application constitutes acceptance of any changes.
                            </p>

                            <p class="mt-3">
                                <strong>No Warranty:</strong> We do not offer any warranties or guarantees regarding 
                                the accuracy, reliability, or completeness of the results produced by this application.
                                We may discontinue this service at any time without prior notice.
                            </p>

                            <p class="mt-3">
                                <strong>Limitation of Liability:</strong> In no event, to the extent permitted by applicable law, 
                                shall recht.intelligent GmbH, its officers and agents be liable for any damages whatsoever 
                                (including, without limitation, damages for loss of business profits, business interruption, 
                                loss of business information, loss of data, or any other loss) arising out of the use of or 
                                inability to use this application. This disclaimer shall be governed by the laws of Switzerland 
                                and subject to the exclusive jurisdiction of the courts of Zurich, Switzerland.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { XMarkIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

defineProps({
    show: {
        type: Boolean,
        default: false
    }
})
defineEmits(['close'])
</script>