<script setup>
import { ref } from 'vue';
import Anon from './components/Anon.vue';
import Licenses from './components/Licenses.vue';
import Privacy from './components/Privacy.vue';

// Heroicons imports
import { 
  InformationCircleIcon, 
  Cog6ToothIcon, 
  ShieldCheckIcon, 
  CodeBracketIcon, 
  ExclamationTriangleIcon, 
  CheckIcon 
} from '@heroicons/vue/24/outline';

// Modal state
const showModal = ref(true);
const showLicensesModal = ref(false);
const showPrivacyModal = ref(false);

// Anon ref to call methods on the component
const anonRef = ref(null);

// Function to close the modal
const closeModal = () => {
  showModal.value = false;
  // Call anon's initGliner when user agrees
  if (anonRef.value && typeof anonRef.value.initGliner === 'function') {
    anonRef.value.initGliner();
  }
};

// Function to exit the site (close tab/window)
const exitSite = () => {
  window.close();
  // If window.close() fails (e.g., not opened by script), redirect to about:blank
  setTimeout(() => {
    window.location.href = 'about:blank';
  }, 100);
};

// Function to open licenses modal
const openLicensesModal = () => {
  showLicensesModal.value = true;
};

// Function to close licenses modal
const closeLicensesModal = () => {
  showLicensesModal.value = false;
};

// Function to open privacy modal
const openPrivacyModal = () => {
  showPrivacyModal.value = true;
};

// Function to close privacy modal
const closePrivacyModal = () => {
  showPrivacyModal.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-base-200 flex flex-col items-center justify-center">
    <!-- Warning Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-neutral bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div class="p-6 max-w-2xl w-full">
        <div class="relative z-50 w-full max-w-2xl">
    <div class="modal-content bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header with Swiss theme -->
        <div class="bg-gradient-to-r from-error to-error-content p-6 text-error-content">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">Important Notice</h1>
                    <p class="text-base-200 mt-1">Service Availability & Terms</p>
                </div>
            </div>
        </div>
        <!-- Main Content -->
        <div class="p-6 max-h-[60vh] overflow-y-auto">
            <!-- Service Information -->
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <div class="bg-info rounded-full p-2">
                        <InformationCircleIcon class="w-5 h-5 text-info-content" />
                    </div>
                    <h2 class="text-xl font-semibold text-base-content">Service Information</h2>
                </div>
                <div class="bg-base-200 border border-base-300 rounded-lg p-4">
                    <p class="text-base-content/70 mb-3">This service is <span class="font-semibold text-base-content">designed for users in Switzerland</span> and provides privacy-focused text anonymization capabilities.</p>
                    
                    <div class="space-y-2">
                        <div class="flex items-start gap-3">
                            <CheckIcon class="w-4 h-4 text-success mt-0.5" />
                            <span class="text-sm text-base-content/70">All processing happens <span class="font-semibold">locally on your device</span></span>
                        </div>
                        <div class="flex items-start gap-3">
                            <CheckIcon class="w-4 h-4 text-success mt-0.5" />
                            <span class="text-sm text-base-content/70">Your data <span class="font-semibold">never leaves your browser</span></span>
                        </div>
                        <div class="flex items-start gap-3">
                            <CheckIcon class="w-4 h-4 text-success mt-0.5" />
                            <span class="text-sm text-base-content/70">Fully <span class="font-semibold">open source</span> and transparent</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- How It Works -->
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <div class="bg-info rounded-full p-2">
                        <Cog6ToothIcon class="w-5 h-5 text-info-content" />
                    </div>
                    <h2 class="text-xl font-semibold text-base-content">How This Service Works</h2>
                </div>
                
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-info/20 border border-info rounded-lg p-4">
                        <h3 class="font-semibold text-base-content mb-2 flex items-center gap-2">
                            <ShieldCheckIcon class="w-5 h-5 text-info-content" />
                            Local Processing Only
                        </h3>
                        <ul class="text-sm text-base-content/70 space-y-1">
                            <li>• All AI models run <span class="font-medium">entirely on your device</span></li>
                            <li>• <span class="font-medium">No data</span> is sent to our servers</li>
                            <li>• We only host the application files and models.</li>
                            <li>• Your data <span class="font-medium">never leaves your computer</span></li>
                        </ul>
                    </div>
                    
                    <div class="bg-success/20 border border-success rounded-lg p-4">
                        <h3 class="font-semibold text-base-content mb-2 flex items-center gap-2">
                            <CodeBracketIcon class="w-5 h-5 text-success-content" />
                            Open Source & Transparency
                        </h3>
                        <ul class="text-sm text-base-content/70 space-y-1">
                            <li>• Full source code available for review</li>
                            <li>• Community-driven development</li>
                            <li>• No hidden data collection</li>
                            <li>• Complete transparency</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Disclaimers -->
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <div class="bg-warning rounded-full p-2">
                        <ExclamationTriangleIcon class="w-5 h-5 text-warning-content" />
                    </div>
                    <h2 class="text-xl font-semibold text-base-content">Important Disclaimers</h2>
                </div>
                
                <div class="space-y-3">
                    <div class="bg-warning/20 border border-warning rounded-lg p-3 flex items-start gap-3">
                        <span class="text-warning font-bold">⚠️</span>
                        <div>
                            <span class="font-semibold text-base-content">NO WARRANTIES:</span>
                            <span class="text-sm text-base-content/70 block">This service is provided "AS-IS" without any warranties, express or implied.</span>
                        </div>
                    </div>
                    
                    <div class="bg-warning/20 border border-warning rounded-lg p-3 flex items-start gap-3">
                        <span class="text-warning font-bold">⚠️</span>
                        <div>
                            <span class="font-semibold text-base-content">EXPERIMENTAL TECHNOLOGY:</span>
                            <span class="text-sm text-base-content/70 block">This is research/educational software not intended for production use.</span>
                        </div>
                    </div>
                    
                    <div class="bg-warning/20 border border-warning rounded-lg p-3 flex items-start gap-3">
                        <span class="text-warning font-bold">⚠️</span>
                        <div>
                            <span class="font-semibold text-base-content">USER RESPONSIBILITY:</span>
                            <span class="text-sm text-base-content/70 block">You assume all risks associated with using this service.</span>
                        </div>
                    </div>
                    
                    <div class="bg-error/20 border border-error rounded-lg p-3 flex items-start gap-3">
                        <span class="text-error font-bold">⚠️</span>
                        <div>
                            <span class="font-semibold text-base-content">USAGE LIMITATIONS:</span>
                            <span class="text-sm text-base-content/70 block">May not be suitable for all use cases. AI models are not 100% accurate - always review results. It may miss some sensitive information or produce false positives. Do not use for high-risk applications.</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Terms -->
            <div class="bg-base-200 border border-base-300 rounded-lg p-4">
                <h3 class="font-semibold text-base-content mb-3">By clicking "I Agree", you acknowledge the above, the privacy policy and terms of service, as well as:</h3>
                <ol class="text-sm text-base-content/70 space-y-2">
                    <li class="flex items-start gap-2">
                        <span class="font-semibold text-base-content">1.</span>
                        <span>You understand this service processes data locally on your device</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-semibold text-base-content">2.</span>
                        <span>You accept this service is provided without warranties</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-semibold text-base-content">3.</span>
                        <span>You will use this service in compliance with applicable laws</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-semibold text-base-content">4.</span>
                        <span>You will verify results before relying on them</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="font-semibold text-base-content">5.</span>
                        <span>You have read and understood all disclaimers</span>
                    </li>
                </ol>
            </div>
        </div>
        
        <!-- Footer Actions -->
        <div class="bg-base-200 border-t border-base-300 p-6">
          <p class="py-2"> By clicking "I Agree", you confirm that you have read and understood the <a href="#" @click="openPrivacyModal" class="link link-primary">terms of service and disclaimers</a>.</p>
            <div class="flex flex-col sm:flex-row gap-3">
                <button
                  class="btn btn-primary flex-1"
                  @click="closeModal"
                >
                    I Agree - Continue to Service
                </button>
                <button
                  class="btn btn-outline flex-1"
                  @click="exitSite"
                >
                    I Disagree - Exit
                </button>
            </div>
            
            <p class="text-center text-sm text-base-content/60 mt-4">
                <span class="font-medium">Open Source:</span> You can also access the <a href="https://github.com/colin-r-carter/iusable_anonymization" class="link link-primary">source code</a> and run this application locally on your own computer.
            </p>
        </div>
    </div>
</div>
      </div>
    </div>

    <div class="w-full max-w-6xl">
      <a href="https://recht-intelligent.ch" class="mt-3 mb-6 pb-6">
      <img src="/logo.svg" alt="Recht Intelligent" class="mx-auto my-2 w-32 h-auto" />
      <p class="max-w-md mx-auto text-center text-xs text-base-content/80 pb-6">
        Plattform für Weiterbildungen zur praktischen Anwendung von künstlicher Intelligenz im Berufsalltag von Juristinnen und Juristen
      </p>
      </a>
      <div class="p-6 bg-base-100 shadow-md rounded-lg">
        <anon ref="anonRef" />
      </div>
      <!-- Footer -->
      <footer class="mt-12 mb-6 py-8 bg-neutral text-neutral-content rounded-lg shadow-lg w-full">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="mb-4 md:mb-0">
              <h3 class="text-xl font-semibold text-neutral-content mb-2">recht.intelligent GmbH</h3>
              <address class="not-italic text-neutral-content/70">
                Dufourstrasse 32<br>
                8008 Zürich<br>
              </address>
            </div>
            
            <div class="flex flex-col items-center md:items-end">
              <div class="mb-2">
                <button @click="openLicensesModal" class="link link-accent mr-4">Open Source Licenses</button>
                <button @click="openPrivacyModal" class="link link-accent mr-4">Privacy Policy & Usage Guidelines</button>
              </div>
              <div class="text-neutral-content/70 text-center md:text-right">
                <p class="mb-2"><a href="https://github.com/colin-r-carter/iusable_anonymization" class="link link-accent">Open-source software</a> made in Switzerland with ❤️</p>
                <p>&copy; 2025 recht.intelligent GmbH. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- Licenses Modal -->
    <Licenses :show="showLicensesModal" @close="closeLicensesModal" />
    
    <!-- Privacy Modal -->
    <Privacy :show="showPrivacyModal" @close="closePrivacyModal" />
  </div>
</template>

<style scoped>
.tabs {
  margin-bottom: 1rem;
}
</style>
