<template>
    <div class="flex flex-col h-[100vh]">
        <!-- Error Banner -->
        <div v-if="initError" class="bg-error border border-error text-error-content px-4 py-3 flex items-center justify-between" role="alert">
            <span>
                <strong class="font-bold">Error:</strong>
                {{ initError }}
            </span>
            <button @click="initError = null" class="ml-4 text-error-content hover:text-error font-bold text-xl leading-none">
                <XMarkIcon class="w-5 h-5" />
            </button>
        </div>
        
        <!-- Downloading Banner -->
        <div v-if="downloading" class="bg-info border border-info text-info-content px-4 py-3" role="alert">
            <div class="flex items-center mb-2">
                <ArrowPathIcon class="animate-spin -ml-1 mr-3 h-5 w-5 text-info-content" />
                <div class="flex-1">
                    <div class="flex justify-between items-center mb-1">
                        <span>
                            <strong class="font-bold">Downloading models...</strong>
                            {{ downloadStatus || 'Initializing download...' }}
                        </span>
                        <span class="text-sm font-medium">{{ Math.round(downloadProgress) }}%</span>
                    </div>
                    <div class="w-full bg-info/20 rounded-full h-2">
                        <div 
                            class="bg-info h-2 rounded-full transition-all duration-300" 
                            :style="{ width: downloadProgress + '%' }"
                        ></div>
                    </div>
                    <p class="text-sm mt-1">
                        Please wait while the anonymization models are being downloaded and initialized. This only happens once.
                    </p>
                </div>
            </div>
        </div>
        
        <!-- File Processing Banner -->
        <div v-if="fileProcessing" class="bg-warning border border-warning text-warning-content px-4 py-3 flex items-center" role="alert">
            <div class="flex items-center">
                <ArrowPathIcon class="animate-spin -ml-1 mr-3 h-5 w-5 text-warning-content" />
                <span>
                    <strong class="font-bold">Processing file...</strong>
                    Extracting text from your document.
                </span>
            </div>
        </div>
        <!-- Header with title -->
        <div class="p-4 border-b border-base-300">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                <h1 class="font-bold text-3xl sm:text-4xl">
                    Local Anonymization & Pseudonymization
                </h1>
                <div class="flex flex-col items-start sm:items-end space-y-2 sm:space-y-2">
                    <div class="flex items-center gap-2">
                        <button 
                            @click="openSettings"
                            class="btn btn-ghost btn-xs"
                            title="Configure anonymization settings"
                        >
                            <Cog6ToothIcon class="h-5 w-5" />
                        </button>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        <button 
                            @click="selectModel('quantized')" 
                            :class="['btn btn-sm', selectedModel === 'quantized' ? 'btn-primary' : 'btn-outline']"
                            :disabled="downloading || loading || fileProcessing"
                        >
                            Fast (580MB)
                        </button>
                        <!-- <button 
                            @click="selectModel('full')" 
                            :class="['btn btn-sm', selectedModel === 'full' ? 'btn-primary' : 'btn-outline']"
                            :disabled="downloading || loading || fileProcessing"
                        >
                            Best (1.16GB)
                        </button> -->
                    </div>
                    <p class="text-xs text-base-content/50 text-left sm:text-right">
                        <label class="text-sm font-medium text-base-content/70">Model Quality:</label> 
                        {{ selectedModel === 'quantized' ? 'Faster processing, lower accuracy' : 'Higher accuracy, more compute' }} <br>
                        <i>New models coming soon...</i>
                    </p>
                </div>
            </div>
            <p>
                This tool allows you to anonymize text by detecting and replacing sensitive entities with placeholders, 
                or pseudonymize by replacing placeholders with custom values. You can add custom entities and types in the settings, 
                and the output will be displayed after clicking <kbd class="kbd kbd-xs">Start Anonymization</kbd>.
                <b> 
                    All processing is done locally in your browser, ensuring your data remains private and secure.
                    This tool is offered without any guarantees or warranties.
                    Use at your own risk.
                </b>
            </p>
        </div>

        <div class="flex flex-1 overflow-hidden border">
            <!-- Entities Side Panel -->
            <div class="w-80 border-r border-base-300 bg-base-200 flex flex-col">
                <!-- Mode Toggle and Entity Detection -->
                <div class="p-4 border-b border-base-300 bg-base-100 space-y-3">
                    <div class="flex gap-2">
                        <button 
                            @click="mode = 'anonymize'" 
                            :class="['btn', 'flex-1', mode === 'anonymize' ? 'btn-primary' : 'btn-outline']"
                        >
                            Anonymize
                        </button>
                        <button 
                            @click="mode = 'pseudonymize'" 
                            :class="['btn', 'flex-1', mode === 'pseudonymize' ? 'btn-secondary' : 'btn-outline']"
                        >
                            Reverse
                        </button>
                    </div>
                    <button 
                        v-if="mode === 'anonymize'" 
                        @click="getEntities" 
                        :disabled="downloading || loading || fileProcessing"
                        class="btn btn-success w-full"
                        :class="{ 'btn-disabled': downloading || loading || fileProcessing }"
                    >
                        {{ downloading ? 'Downloading Models...' : fileProcessing ? 'Processing File...' : loading ? 'Detecting Entities...' : 'Start Anonymization' }}
                    </button>
                    <div v-if="mode === 'pseudonymize'" class="text-sm text-base-content/60">
                        Enter text with placeholders like [1_person] and map them to real values below.
                    </div>
                </div>

                <!-- Add Entity Form -->
                <div class="p-4 border-b border-base-300 bg-base-100 space-y-3">
                    <div class="flex justify-between items-center">
                        <p class="font-semibold">{{ mode === 'anonymize' ? 'Add New Entity' : 'Auto-Detect Placeholders' }}</p>
                        <button @click="clearEntities" class="btn btn-ghost btn-xs text-error">Clear All</button>
                    </div>
                    <template v-if="mode === 'anonymize'">
                        <input v-model="newEntityName" class="input input-bordered input-xs w-full" placeholder="Entity Text">
                        <select v-model="newEntityType" class="select select-xs select-bordered w-full">
                            <option v-for="label in availableLabels" :key="label" :value="label">
                                {{ label.charAt(0).toUpperCase() + label.slice(1).toLowerCase() }}
                            </option>
                        </select>
                        <button @click="addEntity" class="btn btn-xs btn-outline w-full">Add Entity</button>
                    </template>
                </div>

                <!-- Entities List -->
                <div class="flex-1 overflow-y-auto p-4 space-y-3">
                    <template v-if="!loading && entities.length === 0">
                        <div class="text-base-content/50 text-center py-4">
                            {{ mode === 'anonymize' ? 'No entities detected yet' : 'No placeholders found' }}
                        </div>
                    </template>
                    <template v-else>
                        <div v-for="entity in entities" :key="entity.id" 
                             class="bg-base-100 rounded shadow-sm p-3 space-y-2">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <span class="badge badge-outline">{{ entity.id }}_{{ entity.type }}</span>
                                    <span v-if="entity.source === 'regex'" class="badge badge-xs bg-warning text-warning-content h-5 w-5"  title="Detected by custom regex">
                                        <SigmaIcon class="w-4 h-4" />
                                    </span>
                                    <span v-else-if="entity.source === 'ai'" class="badge badge-xs bg-info text-info-content h-5 w-5" title="Detected by AI model">
                                        <StarIcon class="w-4 h-4" />
                                    </span>
                                </div>
                                <button @click="removeEntity(entity.id)" class="btn btn-ghost btn-xs text-error">
                                    <XMarkIcon class="w-4 h-4" />
                                </button>
                            </div>
                            <input 
                                v-model="entity.name" 
                                class="input input-bordered input-sm w-full"
                                :placeholder="mode === 'anonymize' ? 'Original text...' : 'Replacement value...'"
                            >
                            <div v-if="mode === 'pseudonymize'" class="text-xs text-base-content/50">
                                Will replace [{{ entity.id }}_{{ entity.type }}] → {{ entity.name || 'original value' }}
                            </div>
                        </div>
                    </template>
                </div>
                <div class="p-4 border-t border-base-300 bg-base-100 space-y-3">
                     <template v-if="mode !== 'anonymize'">
                        <button @click="detectPlaceholders" class="btn btn-outline w-full">
                            Clear & Detect Placeholders from Text
                        </button>
                        <p class="text-xs text-base-content/50">Automatically finds placeholders like [1_person] in your text</p>
                    </template>
                </div>
            </div>

            <!-- Text Areas -->
            <div class="flex-1 flex flex-col">
                <!-- Headers -->
                <div class="flex border-b">
                    <div class="w-1/2 p-4 text-right">
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-lg font-semibold text-base-content">Input Text <small>({{ text?.length }})</small></h2>
                            <button 
                                @click="triggerFileInput"
                                :disabled="fileProcessing"
                                class="btn btn-sm btn-outline"
                                :class="{ 'btn-disabled': fileProcessing }"
                            >                                
                                    {{ fileProcessing ? 'Processing...' : 'Import File' }}
                            </button>
                            <input 
                                type="file" 
                                ref="fileInput"
                                @change="handleFileUpload"
                                accept=".txt,.pdf,.docx"
                                :disabled="fileProcessing"
                                class="hidden"
                            >
                        </div>
                        <!-- File validation error -->
                        <div v-if="fileError" class="mb-2 text-sm text-error bg-error border border-error rounded p-2">
                            {{ fileError }}
                        </div>
                        <p class="text-sm text-base-content/50 text-left">
                            {{ mode === 'anonymize' ? 'Type/paste text or drag files here. Use button above for file selection.' : 'Enter anonymized text with placeholders like [1_person]' }}
                        </p>
                        <button @click="clearText" class="btn btn-ghost btn-xs text-error">Clear Text</button>
                    </div>
                    <div class="w-1/2 p-4 border-l border-base-300 flex justify-between items-center">
                        <div>
                            <h2 class="text-lg font-semibold text-base-content">
                                {{ mode === 'anonymize' ? 'Anonymized Text' : 'Restored Text' }}
                            </h2>
                            <p class="text-sm text-base-content/50">
                                {{ mode === 'anonymize' ? 'Preview of the anonymized output' : 'Preview with placeholders replaced by real values' }}
                            </p>
                        </div>
                        <button @click="copy" class="btn btn-success btn-sm">
                            Copy Text
                        </button>
                    </div>
                </div>

                <!-- Scrollable Content Container -->
                <div class="flex-1 overflow-y-auto">
                    <div class="flex min-h-full">
                        <!-- Input Area with Drag and Drop -->
                        <div 
                            class="w-1/2 relative"
                            @drop.prevent="handleFileDrop"
                            @dragover.prevent="handleDragOver"
                            @dragleave.prevent="handleDragLeave"
                        >
                            <textarea 
                                v-model="text" 
                                @select="setTextareaSelection"
                                ref="textArea" 
                                :class="[
                                    'w-full h-full p-4 resize-none border-0 focus:ring-0',
                                    dragOver ? 'bg-info/20' : ''
                                ]"
                                placeholder="Enter or paste your text here, or drag and drop a file (TXT, PDF, DOCX)..."
                            ></textarea>
                            
                            <!-- Drag overlay -->
                            <div 
                                v-if="dragOver"
                                class="absolute inset-0 bg-info bg-opacity-90 border-2 border-dashed border-info flex items-center justify-center pointer-events-none"
                            >
                                <div class="text-center">
                                    <ArrowUpTrayIcon class="w-12 h-12 text-info-content mx-auto mb-2" />
                                    <p class="text-info-content font-medium">Drop your file here</p>
                                    <p class="text-info-content/80 text-sm">TXT, PDF, DOCX supported</p>
                                </div>
                            </div>
                        </div>

                        <!-- Output Area -->
                        <div 
                            ref="textContainer" 
                            @mouseup="setTextSelection"
                            class="w-1/2 p-4 border-l border-base-300 bg-info/5"
                        >
                            <p v-html="anonymizedText" class="whitespace-pre-wrap"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Settings Modal -->
        <div v-if="showSettings" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-base-100 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-base-content">Anonymization Settings</h3>
                    <button @click="showSettings = false" class="btn btn-ghost btn-sm">
                        <XMarkIcon class="w-5 h-5" />
                    </button>
                </div>
                
                <div class="mb-4">
                    <p class="text-sm text-base-content/60 mb-3">
                        Select which types of entities should be detected and anonymized. {{ selectedLabels.length }} of {{ availableLabels.length }} labels selected.
                    </p>
                    
                    <div class="flex gap-2 mb-3">
                        <button @click="selectAllLabels" class="btn btn-sm btn-outline">
                            Select All
                        </button>
                        <button @click="deselectAllLabels" class="btn btn-sm btn-outline">
                            Deselect All
                        </button>
                        <button @click="selectCommonLabels" class="btn btn-sm btn-primary">
                            Common Only
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-base-300 rounded p-3">
                    <label v-for="label in availableLabels" :key="label" class="flex items-center space-x-2 hover:bg-base-200 p-1 rounded">
                        <input 
                            type="checkbox" 
                            :value="label" 
                            v-model="selectedLabels"
                            class="checkbox checkbox-sm"
                        >
                        <span class="text-sm capitalize">{{ formatLabel(label) }}</span>
                    </label>
                </div>
                
                <!-- Custom Regex Patterns Section -->
                <div class="mt-6 border-t pt-4">
                    <h4 class="text-md font-semibold text-base-content mb-3">Custom Regex Patterns</h4>
                    <p class="text-sm text-gray-600 mb-3">
                        Add custom regular expressions to detect specific patterns in your text.
                        <span class="text-warning">⚠️ Be careful with complex patterns to avoid performance issues.</span>
                    </p>
                    
                    <!-- Add New Regex Pattern -->
                    <div class="bg-base-200 rounded p-3 mb-3">
                        <div class="grid grid-cols-1 gap-2">
                            <div class="flex gap-2">
                                <input 
                                    v-model="newRegexPattern" 
                                    class="input input-bordered input-sm flex-1" 
                                    placeholder="Enter regex pattern (e.g., \\d{3}-\\d{2}-\\d{4})"
                                    @keyup.enter="addRegexPattern"
                                >
                                <input 
                                    v-model="newRegexLabel" 
                                    class="input input-bordered input-sm w-32" 
                                    placeholder="Label"
                                    @keyup.enter="addRegexPattern"
                                >
                            </div>
                            <div class="flex gap-2 items-center">
                                <label class="flex items-center space-x-1">
                                    <input type="checkbox" v-model="newRegexGlobal" class="checkbox checkbox-xs">
                                    <span class="text-xs">Global</span>
                                </label>
                                <label class="flex items-center space-x-1">
                                    <input type="checkbox" v-model="newRegexCaseInsensitive" class="checkbox checkbox-xs">
                                    <span class="text-xs">Case Insensitive</span>
                                </label>
                                <button @click="addRegexPattern" class="btn btn-sm btn-primary ml-auto">
                                    Add Pattern
                                </button>
                            </div>
                            <div v-if="regexError" class="text-xs text-error">
                                {{ regexError }}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Existing Regex Patterns -->
                    <div v-if="customRegexPatterns.length > 0" class="space-y-2">
                        <div v-for="(pattern, index) in customRegexPatterns" :key="index" 
                             class="flex items-center justify-between bg-base-100 border border-base-300 rounded p-2">
                            <div class="flex-1">
                                <code class="text-sm bg-base-200 px-1 rounded">{{ pattern.pattern }}</code>
                                <span class="ml-2 text-xs text-base-content/50">
                                    → {{ pattern.label }} 
                                    <span class="ml-1">
                                        ({{ pattern.flags || 'no flags' }})
                                    </span>
                                </span>
                            </div>
                            <button @click="removeRegexPattern(index)" class="btn btn-ghost btn-xs text-red-500">
                                ×
                            </button>
                        </div>
                    </div>
                    
                    <div v-else class="text-sm text-base-content/50 italic">
                        No custom patterns added yet.
                    </div>
                </div>
                
                <!-- Model Cache Management Section -->
                <div class="mt-6 border-t pt-4">
                    <h4 class="text-md font-semibold text-base-content mb-3">Model Cache Management</h4>
                    <p class="text-sm text-base-content/60 mb-3">
                        Models are cached locally in your browser to improve loading times. Cache is shared across sessions.
                    </p>
                    
                    <!-- Memory Usage Warning -->
                    <div class="bg-warning/10 border border-warning/30 rounded p-3 mb-3">
                        <div class="flex items-start space-x-2">
                            <ExclamationTriangleIcon class="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                            <div class="text-sm">
                                <p class="font-medium text-warning">Memory Requirements</p>
                                <p class="text-warning/80 mt-1">
                                    AI models require significant memory (500MB+). Close other browser tabs and applications if you encounter out-of-memory errors.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 rounded p-3 mb-3">
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <strong>Cache Status:</strong>
                                <span v-if="cacheStats" class="ml-1">
                                    {{ cacheStats.modelCount }} models
                                </span>
                                <span v-else class="ml-1 text-gray-500">Loading...</span>
                            </div>
                            <div>
                                <strong>Total Size:</strong>
                                <span v-if="cacheStats" class="ml-1">
                                    {{ formatCacheSize(cacheStats.totalSize) }}
                                </span>
                                <span v-else class="ml-1 text-gray-500">Loading...</span>
                            </div>
                        </div>
                        
                        <div v-if="cacheStats && cacheStats.models.length > 0" class="mt-3 space-y-1">
                            <div v-for="model in cacheStats.models" :key="model.url" class="text-xs bg-white rounded p-2 flex justify-between">
                                <div>
                                    <code class="text-blue-600">{{ model.modelType }}</code>
                                    <span class="ml-2 text-gray-500">{{ formatCacheSize(model.size) }}</span>
                                </div>
                                <div class="text-gray-400">
                                    {{ new Date(model.lastAccessed).toLocaleDateString() }}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex gap-2">
                        <button @click="refreshCacheStats" class="btn btn-sm btn-outline" :disabled="refreshingCache">
                            {{ refreshingCache ? 'Refreshing...' : 'Refresh Stats' }}
                        </button>
                        <button @click="confirmClearCache" class="btn btn-sm btn-outline text-red-600" :disabled="clearingCache">
                            {{ clearingCache ? 'Clearing...' : 'Clear Cache' }}
                        </button>
                    </div>
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <button @click="showSettings = false" class="btn btn-outline">
                        Cancel
                    </button>
                    <button @click="applySettings" class="btn btn-primary">
                        Apply Settings
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Gliner } from 'gliner';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import modelCache from '../utils/modelCache.js';

// import * as pdfjsWorker from '../assets/pdf.worker.min.mjs';

// Heroicons imports
import { 
    ArrowPathIcon, 
    ArrowUpTrayIcon, 
    Cog6ToothIcon, 
    ExclamationTriangleIcon, 
    StarIcon, 
    XMarkIcon 
} from '@heroicons/vue/24/outline';

// Custom SigmaIcon for Σ (not in heroicons, so define as a functional component)
const SigmaIcon = {
    name: 'SigmaIcon',
    functional: true,
    render(h) {
        return h('span', { class: 'font-bold', style: 'font-size:1rem;line-height:1' }, 'Σ');
    }
};

export default {
    name: 'Anon',
    props: {
        value: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            downloading: false,
            downloadProgress: 0,
            downloadStatus: '',
            text: this.value,
            newEntityName: '',
            newEntityType: 'person',
            entities: [],
            mode: 'anonymize', // 'anonymize' or 'pseudonymize'
            selectedModel: 'quantized', // 'quantized' or 'full'
            availableLabels: [
                "location",
                "street",
                "person",
                "date",
                "time",
                "car brand",
                "car model",
                "colour",
                "organization",
                "phone number",
                "address",
                "passport number",
                "email",
                "credit card number",
                "social security number",
                "health insurance id number",
                "date of birth",
                "mobile phone number",
                "bank account number",
                "medication",
                "driver's license number",
                "tax identification number",
                "medical condition",
                "identity card number",
                "national id number",
                "ip address",
                "email address",
                "iban",
                "credit card expiration date",
                "username",
                "health insurance number",
                "registration number",
                "student id number",
                "insurance number",
                "flight number",
                "landline phone number",
                "blood type",
                "reservation number",
                "digital signature",
                "social media handle",
                "license plate number",
                "postal code",
                "passport_number",
                "serial number",
                "vehicle registration number",
                "credit card brand",
                "fax number",
                "visa number",
                "insurance company",
                "identity document number",
                "transaction number",
                "national health insurance number",
                "birth certificate number",
                "train ticket number",
                "passport expiration date",
                "social_security_number"
            ],
            gliner: null, // Add this line
            glinerInstances: {}, // Cache for different model instances
            initError: null, // Error message for initialization
            fileProcessing: false, // File processing state
            dragOver: false, // Drag over state
            fileError: null, // File validation error
            showSettings: false, // Settings modal visibility
            selectedLabels: [ // Default selected labels (common ones)
                "person", "location", "organization", "date", "phone number", 
                "email", "address", "credit card number", "social security number"
            ],
            // Custom regex patterns
            customRegexPatterns: [],
            newRegexPattern: '',
            newRegexLabel: '',
            newRegexGlobal: true,
            newRegexCaseInsensitive: false,
            regexError: null,
            // Cache management
            cacheStats: null,
            refreshingCache: false,
            clearingCache: false
        }
    },
    mounted() {
        // Initialize Gliner on mount
        // this.initGliner();

        // Set the worker source path
        pdfjsLib.GlobalWorkerOptions.workerSrc = '../assets/pdf.worker.min.mjs';
    },
    computed: {
        anonymizedText() {
            if (this.mode === 'pseudonymize') {
                return this.pseudonymizedText();
            }
            
            let anonymized = this.text;
            this.entities.forEach(entity => {
                if (!entity.name) return; // Skip if name is undefined/null/empty
                let names = entity.name.split(/\s+|-/);
                names.forEach(name => {
                    if (!name) return; // Skip empty strings
                    // Escape regex special characters in name
                    let escapedName = name.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                    let fuzzyName = escapedName.split('').join('[\\s-]*');
                    // Additional escape for the fuzzy pattern to handle any remaining special chars
                    fuzzyName = fuzzyName.replace(/\+/g, '\\+');
                    // Use \b only at the start and end
                    let regex = new RegExp(`\\b${fuzzyName}\\b`, 'gi');
                    anonymized = anonymized.replace(regex, `<span class="badge badge-outline">${entity.id}_${entity.type}</span>`);
                });
            });
            return anonymized;
        }
    },
    methods: {
        async initGliner() {
            // Check if we already have a cached instance for the selected model
            if (this.glinerInstances[this.selectedModel]) {
                console.log(`Using cached Gliner instance for ${this.selectedModel} model`);
                this.gliner = this.glinerInstances[this.selectedModel];
                return;
            }

            try {
                console.log(`Initializing Gliner for ${this.selectedModel} model...`);
                this.downloading = true;
                this.downloadProgress = 0;
                this.downloadStatus = 'Initializing...';
                this.initError = null;
                
                const modelPath = this.selectedModel === 'quantized' 
                    ? "./models/gliner_multi_pii-v1/onnx/model_fp16.onnx"
                    : "./models/gliner_multi_pii-v1/onnx/model.onnx";
                
                // Pre-load the ONNX model using our cache
                this.downloadStatus = 'Loading ONNX model...';
                let modelData = await modelCache.getOrDownloadModel(
                    modelPath, 
                    this.selectedModel,
                    (progress) => {
                        this.downloadProgress = Math.min(progress * 0.8, 80); // Use 80% for model download
                    }
                );
                
                // Force garbage collection before creating blob to free memory
                if (window.gc) {
                    try {
                        window.gc();
                    } catch (e) {
                        // Ignore errors
                    }
                }
                
                // Create a Blob URL for the cached model data
                const modelBlob = new Blob([modelData], { type: 'application/octet-stream' });
                const modelUrl = URL.createObjectURL(modelBlob);
                
                // Clear the modelData reference to help with memory management
                modelData = null;
                
                this.downloadProgress = 85;
                this.downloadStatus = 'Loading tokenizer...';
                
                // Improved backend detection and fallback
                let executionProviders = ['wasm']; // Start with basic WASM as most compatible
                
                // Check for WebGPU support with proper validation
                if ('gpu' in navigator) {
                    try {
                        // Add webgpu as preferred if available
                        executionProviders.unshift('webgpu');
                        console.log('WebGPU detected, will attempt webgpu backend with wasm fallback');
                    } catch (e) {
                        console.log('WebGPU API present but not functional, using wasm only');
                    }
                } else {
                    console.log('WebGPU not available, using wasm backend');
                }
                
                console.log(`Using execution providers: ${executionProviders.join(', ')}`);
                
                const newGliner = new Gliner({
                    tokenizerPath: "./gliner_multi_pii-v1",
                    onnxSettings: {
                        modelPath: modelUrl, // Use the blob URL instead of the original path
                        wasmPaths: {
                            cpu: "./models/gliner_multi_pii-v1/onnx/cpu.wasm",
                            gpu: "./models/gliner_multi_pii-v1/onnx/gpu.wasm",
                        },
                        executionProviders: executionProviders,
                        // Add additional ONNX runtime options for better compatibility
                        sessionOptions: {
                            enableCpuMemArena: false,
                            enableMemPattern: false,
                            graphOptimizationLevel: 'basic'
                        }
                    },
                    transformersSettings: {
                        useBrowserCache: true,
                        allowLocalModels: true,
                        allowRemoteModels: false,
                    },
                    maxWidth: 12,
                });
                
                this.downloadProgress = 95;
                this.downloadStatus = 'Initializing model...';
                
                await newGliner.initialize();
                
                // Clean up the blob URL
                URL.revokeObjectURL(modelUrl);
                
                // Mark which model type this instance is for
                newGliner._modelType = this.selectedModel;
                
                // Cache the initialized instance
                this.glinerInstances[this.selectedModel] = newGliner;
                this.gliner = newGliner;
                
                this.downloadProgress = 100;
                this.downloadStatus = 'Complete!';
                
                // Brief delay to show completion
                setTimeout(() => {
                    this.downloading = false;
                    this.downloadProgress = 0;
                    this.downloadStatus = '';
                }, 500);
                
                console.log(`Gliner initialized and cached successfully for ${this.selectedModel} model`);
            } catch (error) {
                console.error('Failed to initialize Gliner:', error);
                
                // Handle specific backend and memory errors
                if (error.message && error.message.includes('no available backend found')) {
                    this.initError = 'No compatible backend found. Please ensure your browser supports WebAssembly or try a different browser.';
                } else if (error.message && error.message.includes('WebGPU is not supported')) {
                    this.initError = 'WebGPU not supported. Falling back to WebAssembly backend. Please refresh the page.';
                } else if (error.message && (error.message.includes('out of memory') || error.message.includes('ERR_OUT_OF_MEMORY'))) {
                    this.initError = 'Not enough memory to load this model. Try closing other browser tabs or use a smaller model.';
                } else if (error.message && error.message.includes('Failed to fetch')) {
                    this.initError = 'Failed to load the model. This may be due to memory constraints or network issues.';
                } else if (error.message && (error.message.includes('backend') || error.message.includes('execution provider'))) {
                    this.initError = 'Backend initialization failed. Your browser may not support the required features. Try refreshing or using a different browser.';
                } else {
                    this.initError = 'Failed to initialize the Anonymization model. Please check the console for details.';
                }
                
                this.gliner = null;
                this.downloading = false;
                this.downloadProgress = 0;
                this.downloadStatus = '';
                
                // Force garbage collection if available
                if (window.gc) {
                    try {
                        window.gc();
                    } catch (e) {
                        // Ignore errors
                    }
                }
            }
        },
        selectModel(model) {
            if (this.downloading || this.loading) return;
            
            this.selectedModel = model;
            // Switch to cached instance if available, otherwise initGliner will handle it
            if (this.glinerInstances[model]) {
                this.gliner = this.glinerInstances[model];
            }
        },
        setTextSelection() {
            let selection = window.getSelection().toString();
            if (selection) {
                this.newEntityName = selection;
            }
        },
        setTextareaSelection() {
            let start = this.$refs.textArea.selectionStart;
            let end = this.$refs.textArea.selectionEnd;
            if (start !== end) {
                this.newEntityName = this.text.substring(start, end);
            }
        },
        async getEntities() {
            this.loading = true;
            
            try {
                // Start with empty entities array
                let allEntities = [];
                let entityId = 1;
                
                // 1. Get AI-detected entities if model is available and labels are selected
                if (this.selectedLabels.length > 0) {
                    // Only initialize if we don't have a cached instance for the current model
                    if (!this.glinerInstances[this.selectedModel]) {
                        await this.initGliner();
                    } else {
                        // Use cached instance
                        this.gliner = this.glinerInstances[this.selectedModel];
                    }
                    
                    if (!this.gliner) {
                        console.error('Model failed to initialize');
                    } else {
                        const MAX_CHUNK_LENGTH = 12000; // Change if needed, tested on MacBook Pro M4, Chromium Engine Version 137.0.7151.56 

                        // Function to split text into chunks of a maximum length
                        function splitTextIntoChunks(text, maxLength) {
                            const chunks = [];
                            for (let i = 0; i < text.length; i += maxLength) {
                                chunks.push(text.substring(i, i + maxLength));
                            }
                            return chunks;
                        }

                        // Use Gliner.inference for entity detection with selected labels only
                        const textChunks = splitTextIntoChunks(this.text, MAX_CHUNK_LENGTH);
                        let entityId = 0;

                        for (const chunk of textChunks) {
                            console.log("Running chunk through GLiNER Inference...")
                            const results = await this.gliner.inference({
                                texts: [chunk],
                                entities: this.selectedLabels,
                                threshold: 0.1,
                            });

                            // results is an array of arrays - get the first text's results
                            const aiEntities = results[0].map((ent) => ({
                                id: entityId++,
                                name: ent.spanText,
                                type: ent.label,
                                source: 'ai'
                            }));
                            
                            allEntities.push(...aiEntities);
                        }
                    }
                }
                
                // 2. Get regex-detected entities
                if (this.customRegexPatterns.length > 0) {
                    const regexEntities = await this.findRegexEntities();
                    // Update IDs to continue from AI entities
                    regexEntities.forEach(entity => {
                        entity.id = entityId++;
                    });
                    allEntities.push(...regexEntities);
                }
                
                // 3. Remove duplicates (same text and overlapping positions)
                this.entities = this.removeDuplicateEntities(allEntities);
                
            } catch (e) {
                console.error('Error during entity detection:', e);
            } finally {
                this.loading = false;
            }
        },
        removeDuplicateEntities(entities) {
            // Simple deduplication based on entity name and type
            const seen = new Set();
            return entities.filter(entity => {
                const key = `${entity.name.toLowerCase()}_${entity.type}`;
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
        },
        addEntity() {
            if (this.newEntityName.trim()) {
                this.entities.push({
                    id: this.entities.length + 1,
                    name: this.newEntityName,
                    type: this.newEntityType
                });
                this.newEntityName = '';
            }
        },
        removeEntity(id) {
            this.entities = this.entities.filter(e => e.id !== id);
        },
        copy() {
            let outputText = this.anonymizedText.replaceAll('<span class="badge badge-outline">', '[').replaceAll('</span>', ']');
            navigator.clipboard.writeText(outputText);
        },
        pseudonymizedText() {
            let pseudonymized = this.text;
            
            // Replace placeholders with entity values
            this.entities.forEach(entity => {
                if (!entity.name) return; // Skip if replacement value is empty
                
                // Match patterns like [1_person] or <span class="badge badge-outline">1_person</span>
                const placeholderPattern = new RegExp(`\\[${entity.id}_${entity.type}\\]`, 'g');
                const badgePattern = new RegExp(`<span class="badge badge-outline">${entity.id}_${entity.type}</span>`, 'g');
                
                pseudonymized = pseudonymized.replace(placeholderPattern, entity.name);
                pseudonymized = pseudonymized.replace(badgePattern, entity.name);
            });
            
            return pseudonymized;
        },
        detectPlaceholders() {
            // Find all placeholders in the text using regex pattern [number_type]
            const placeholderRegex = /\[(\d+)_([^\]]+)\]/g;
            const foundPlaceholders = new Set();
            let match;
            
            while ((match = placeholderRegex.exec(this.text)) !== null) {
                const id = parseInt(match[1]);
                const type = match[2];
                foundPlaceholders.add(`${id}_${type}`);
            }
            
            // Clear existing entities and create new ones from placeholders
            this.entities = Array.from(foundPlaceholders).map(placeholder => {
                const [id, type] = placeholder.split('_');
                return {
                    id: parseInt(id),
                    name: '', // Empty name for user to fill in
                    type: type
                };
            }).sort((a, b) => a.id - b.id);
        },
        clearEntities() {
            this.entities = [];
        },
        clearText(){
            this.text = '';
        },
        triggerFileInput() {
            if (!this.fileProcessing) {
                this.$refs.fileInput.click();
            }
        },
        handleDragOver(event) {
            this.dragOver = true;
        },
        handleDragLeave(event) {
            this.dragOver = false;
        },
        handleFileDrop(event) {
            this.dragOver = false;
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        },
        async handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            this.processFile(file);
        },
        validateFile(file) {
            const allowedTypes = [
                'text/plain',
                'application/pdf', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            const allowedExtensions = ['.txt', '.pdf', '.docx'];
            const maxSize = 50 * 1024 * 1024; // 50MB
            
            this.fileError = null;
            
            if (!allowedTypes.includes(file.type) && !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
                this.fileError = 'Unsupported file type. Please use TXT, PDF, or DOCX files.';
                return false;
            }
            
            if (file.size > maxSize) {
                this.fileError = 'File size too large. Please use files smaller than 50MB.';
                return false;
            }
            
            return true;
        },
        async processFile(file) {
            if (!this.validateFile(file)) {
                return;
            }
            
            this.fileProcessing = true;
            this.fileError = null;
            
            try {
                let extractedText = '';
                
                if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
                    extractedText = await this.extractTextFromTxt(file);
                } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                    extractedText = await this.extractTextFromPdf(file);
                } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.docx')) {
                    extractedText = await this.extractTextFromDocx(file);
                }
                
                if (extractedText.trim().length === 0) {
                    this.fileError = 'No text found in the file. Please check the file content.';
                    return;
                }
                
                this.text = extractedText;
                // Clear any existing entities when new file is loaded
                this.entities = [];
            } catch (error) {
                console.error('Error processing file:', error);
                this.fileError = 'Error processing file. Please try again or check the file format.';
            } finally {
                this.fileProcessing = false;
                // Reset file input
                if (this.$refs.fileInput) {
                    this.$refs.fileInput.value = '';
                }
            }
        },
        async extractTextFromTxt(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsText(file);
            });
        },
        async extractTextFromPdf(file) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }
            
            return fullText.trim();
        },
        async extractTextFromDocx(file) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value;
        },
        formatLabel(label) {
            return label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        },
        selectAllLabels() {
            this.selectedLabels = [...this.availableLabels];
        },
        deselectAllLabels() {
            this.selectedLabels = [];
        },
        selectCommonLabels() {
            this.selectedLabels = [
                "person", "location", "organization", "date", "time", 
                "phone number", "email", "address", "credit card number", 
                "social security number", "date of birth", "mobile phone number"
            ];
        },
        applySettings() {
            this.showSettings = false;
            // Clear existing entities when settings change
            this.entities = [];
        },
        validateRegexPattern(pattern) {
            // Basic validation
            if (!pattern || pattern.trim().length === 0) {
                return 'Pattern cannot be empty';
            }
            
            if (pattern.length > 100) {
                return 'Pattern too long (max 100 characters)';
            }
            
            // Check for potentially dangerous patterns
            const dangerousPatterns = [
                /\(\?\=.*\)\*/, // Lookahead with quantifier
                /\(\?\!.*\)\*/, // Negative lookahead with quantifier
                /\(\?\<\=.*\)\*/, // Lookbehind with quantifier
                /\(\?\<\!.*\)\*/, // Negative lookbehind with quantifier
                /\(\.\*\)\+/, // Nested quantifiers
                /\(\.\+\)\*/, // Nested quantifiers
                /\(\.\*\)\{.*\}/, // Quantifiers with ranges on .* 
            ];
            
            for (let dangerous of dangerousPatterns) {
                if (dangerous.test(pattern)) {
                    return 'Pattern may cause performance issues (contains potentially problematic constructs)';
                }
            }
            
            // Try to create the regex to validate syntax
            try {
                new RegExp(pattern);
            } catch (e) {
                return `Invalid regex syntax: ${e.message}`;
            }
            
            return null;
        },
        addRegexPattern() {
            this.regexError = null;
            
            const pattern = this.newRegexPattern.trim();
            const label = this.newRegexLabel.trim() || 'custom';
            
            // Validate pattern
            const validationError = this.validateRegexPattern(pattern);
            if (validationError) {
                this.regexError = validationError;
                return;
            }
            
            // Check for duplicates
            const exists = this.customRegexPatterns.some(p => p.pattern === pattern);
            if (exists) {
                this.regexError = 'Pattern already exists';
                return;
            }
            
            // Build flags
            let flags = '';
            if (this.newRegexGlobal) flags += 'g';
            if (this.newRegexCaseInsensitive) flags += 'i';
            
            // Add pattern
            this.customRegexPatterns.push({
                pattern: pattern,
                label: label,
                flags: flags
            });
            
            // Clear form
            this.newRegexPattern = '';
            this.newRegexLabel = '';
            this.newRegexGlobal = true;
            this.newRegexCaseInsensitive = false;
        },
        removeRegexPattern(index) {
            this.customRegexPatterns.splice(index, 1);
        },
        executeRegexWithTimeout(regex, text, timeoutMs = 1000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                
                // Set up timeout
                const timeout = setTimeout(() => {
                    reject(new Error('Regex execution timeout'));
                }, timeoutMs);
                
                try {
                    const matches = [];
                    let match;
                    
                    // Reset regex lastIndex to ensure clean start
                    regex.lastIndex = 0;
                    
                    while ((match = regex.exec(text)) !== null) {
                        // Check for timeout during execution
                        if (Date.now() - startTime > timeoutMs) {
                            clearTimeout(timeout);
                            reject(new Error('Regex execution timeout during matching'));
                            return;
                        }
                        
                        matches.push({
                            text: match[0],
                            start: match.index,
                            end: match.index + match[0].length
                        });
                        
                        // Prevent infinite loops with zero-length matches
                        if (match[0].length === 0) {
                            regex.lastIndex++;
                        }
                        
                        // Safety: limit number of matches
                        if (matches.length > 1000) {
                            clearTimeout(timeout);
                            reject(new Error('Too many matches (limit: 1000)'));
                            return;
                        }
                        
                        // Break if not global
                        if (!regex.global) break;
                    }
                    
                    clearTimeout(timeout);
                    resolve(matches);
                } catch (error) {
                    clearTimeout(timeout);
                    reject(error);
                }
            });
        },
        async findRegexEntities() {
            const regexEntities = [];
            let entityId = this.entities.length + 1;
            
            for (const pattern of this.customRegexPatterns) {
                try {
                    const regex = new RegExp(pattern.pattern, pattern.flags);
                    const matches = await this.executeRegexWithTimeout(regex, this.text);
                    
                    for (const match of matches) {
                        regexEntities.push({
                            id: entityId++,
                            name: match.text,
                            type: pattern.label,
                            source: 'regex'
                        });
                    }
                } catch (error) {
                    console.warn(`Regex pattern "${pattern.pattern}" failed:`, error.message);
                    // Continue with other patterns instead of stopping
                }
            }
            
            return regexEntities;
        },
        async getCacheStats() {
            try {
                return await modelCache.getCacheStats();
            } catch (error) {
                console.error('Failed to get cache stats:', error);
                return null;
            }
        },
        async clearModelCache() {
            try {
                await modelCache.clearCache();
                console.log('Model cache cleared successfully');
                return true;
            } catch (error) {
                console.error('Failed to clear cache:', error);
                return false;
            }
        },
        formatCacheSize(bytes) {
            return modelCache.formatBytes(bytes);
        },
        async refreshCacheStats() {
            this.refreshingCache = true;
            try {
                this.cacheStats = await this.getCacheStats();
            } catch (error) {
                console.error('Failed to refresh cache stats:', error);
            } finally {
                this.refreshingCache = false;
            }
        },
        async confirmClearCache() {
            if (confirm('Are you sure you want to clear the model cache? This will remove all cached models and they will need to be downloaded again.')) {
                this.clearingCache = true;
                try {
                    const success = await this.clearModelCache();
                    if (success) {
                        await this.refreshCacheStats();
                        alert('Model cache cleared successfully.');
                    } else {
                        alert('Failed to clear model cache.');
                    }
                } finally {
                    this.clearingCache = false;
                }
            }
        },
        async openSettings() {
            this.showSettings = true;
            await this.refreshCacheStats();
        }
    },
    watch: {
        value(newValue) {
            this.text = newValue;
        }
    },
    components: {
        ArrowPathIcon,
        ArrowUpTrayIcon,
        Cog6ToothIcon,
        ExclamationTriangleIcon,
        StarIcon,
        XMarkIcon,
        SigmaIcon
    },
}
</script>