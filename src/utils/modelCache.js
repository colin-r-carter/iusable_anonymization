class ModelCache {
    constructor() {
        this.dbName = 'IusableAnonymizationModels';
        this.version = 1;
        this.storeName = 'onnxModels';
        this.db = null;
    }

    async init() {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'url' });
                    store.createIndex('lastAccessed', 'lastAccessed', { unique: false });
                    store.createIndex('modelType', 'modelType', { unique: false });
                }
            };
        });
    }

    async getModelSize(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentLength = response.headers.get('Content-Length');
            return contentLength ? parseInt(contentLength) : null;
        } catch (error) {
            console.warn('Could not get model size:', error);
            return null;
        }
    }

    async getCachedModel(url) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(url);

            request.onsuccess = () => {
                if (request.result) {
                    // Update last accessed time
                    const modelData = request.result;
                    modelData.lastAccessed = Date.now();
                    store.put(modelData);
                    
                    console.log(`Retrieved cached model: ${url}`);
                    resolve(modelData.data);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    async downloadAndCacheModel(url, modelType, onProgress = null) {
        await this.init();

        console.log(`Downloading and caching model: ${url}`);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentLength = response.headers.get('Content-Length');
            const total = contentLength ? parseInt(contentLength) : 0;
            let loaded = 0;

            const reader = response.body.getReader();
            const chunks = [];
            const maxChunkSize = 50 * 1024 * 1024; // 50MB max chunk size to prevent memory spikes
            let currentChunkSize = 0;

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                chunks.push(value);
                loaded += value.length;
                currentChunkSize += value.length;
                
                // Periodically trigger garbage collection for large downloads
                if (currentChunkSize > maxChunkSize && window.gc) {
                    try {
                        window.gc();
                        currentChunkSize = 0;
                    } catch (e) {
                        // Ignore errors
                    }
                }
                
                if (onProgress && total > 0) {
                    onProgress(Math.round((loaded / total) * 100));
                }
                
                // Add small delay to prevent blocking the main thread
                if (chunks.length % 100 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }

            // Force garbage collection before final assembly
            if (window.gc) {
                try {
                    window.gc();
                } catch (e) {
                    // Ignore errors
                }
            }

            const arrayBuffer = new Uint8Array(loaded);
            let offset = 0;
            for (const chunk of chunks) {
                arrayBuffer.set(chunk, offset);
                offset += chunk.length;
            }

            // Clear chunks array to free memory
            chunks.length = 0;

            // Cache the model
            await this.cacheModel(url, arrayBuffer.buffer, modelType);
            
            console.log(`Successfully cached model: ${url}`);
            return arrayBuffer.buffer;

        } catch (error) {
            console.error(`Failed to download model ${url}:`, error);
            throw error;
        }
    }

    async cacheModel(url, data, modelType) {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const modelData = {
                url: url,
                data: data,
                modelType: modelType,
                cachedAt: Date.now(),
                lastAccessed: Date.now(),
                size: data.byteLength
            };

            const request = store.put(modelData);

            request.onsuccess = () => {
                console.log(`Model cached successfully: ${url}`);
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }

    async getOrDownloadModel(url, modelType, onProgress = null) {
        const cachedModel = await this.getCachedModel(url);
        
        if (cachedModel) {
            console.log(`Using cached model: ${url}`);
            return cachedModel;
        }

        console.log(`Model not cached, downloading: ${url}`);
        return await this.downloadAndCacheModel(url, modelType, onProgress);
    }

    async getCacheStats() {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                const models = request.result;
                const totalSize = models.reduce((sum, model) => sum + (model.size || 0), 0);
                
                resolve({
                    modelCount: models.length,
                    totalSize: totalSize,
                    models: models.map(m => ({
                        url: m.url,
                        modelType: m.modelType,
                        size: m.size,
                        cachedAt: m.cachedAt,
                        lastAccessed: m.lastAccessed
                    }))
                });
            };

            request.onerror = () => reject(request.error);
        });
    }

    async clearCache() {
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => {
                console.log('Model cache cleared');
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }

    async deleteOldModels(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
        await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const cutoffTime = Date.now() - maxAge;
            
            const index = store.index('lastAccessed');
            const range = IDBKeyRange.upperBound(cutoffTime);
            const request = index.openCursor(range);

            let deletedCount = 0;

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    deletedCount++;
                    cursor.continue();
                } else {
                    console.log(`Deleted ${deletedCount} old models`);
                    resolve(deletedCount);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Create singleton instance
const modelCache = new ModelCache();

export default modelCache;