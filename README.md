# Iusable Anonymization and Pseudonymization Tool

A Vue 3 application for anonymizing text by detecting and replacing sensitive entities with placeholder tokens.

## Features

- **Automatic Entity Detection**: Uses pattern matching to automatically detect license plates and other entities
- **Manual Entity Definition**: Add custom entities by selecting text or typing them manually
- **Entity Types**: Support for Person, Location, Organization, Date, Time, License Plate, Car, and Other entities
- **Real-time Preview**: See anonymized text with entities replaced by labeled badges
- **Persistent Storage**: Entities are saved in localStorage for session persistence

## Entity Types Supported

- PERSON
- LOCATION  
- ORGANIZATION
- DATE
- TIME
- LICENSE_PLATE (automatically detects AA 1234 format)
- CAR
- OTHER

## Development

Built with Vue 3, Vite, Tailwind CSS, and DaisyUI.

### Important
You need to add the models and the pdfjs worker to the project manually. See Readme.md in /public for precise instructions.

### Server Configuration

#### ONNX Model Caching (.htaccess)
To improve performance and prevent redownloading models on each visit, add proper cache headers for ONNX files:

```apache
# Cache ONNX model files for 1 year
<FilesMatch "\.(onnx)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Cache WASM files for 1 year
<FilesMatch "\.(wasm)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Cache tokenizer files for 1 year
<FilesMatch "\.(json|txt)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>
```

#### PDF.js Worker MIME Type (.htaccess)
When deploying to production, you may encounter MIME type errors with the PDF.js worker file (`pdf.worker.min.mjs`). The server must serve `.mjs` files with the correct MIME type for ES6 module loading.

Add this to your `.htaccess` file in the web root:

```apache
# Fix MIME type for .mjs files (ES6 modules)
AddType application/javascript .mjs

# Alternative approach if the above doesn't work
<FilesMatch "\.mjs$">
    ForceType application/javascript
</FilesMatch>

# Or use text/javascript (also acceptable)
# AddType text/javascript .mjs
```

#### Nginx
Add this to your Nginx server configuration:

```nginx
location ~* \.mjs$ {
    add_header Content-Type application/javascript;
}

# Or in the http block:
# http {
#     include /etc/nginx/mime.types;
#     types {
#         application/javascript mjs;
#     }
# }
```

#### Express.js / Node.js
If using Express.js, add this middleware:

```javascript
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));
```

#### Vite Development Server
For development, the Vite config should handle this automatically, but if issues persist, you can add:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    middlewareMode: false,
    configure: (app) => {
      app.use((req, res, next) => {
        if (req.url.endsWith('.mjs')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
        next();
      });
    }
  }
});
```

The error occurs because browsers require ES6 modules (`.mjs` files) to be served with `application/javascript` or `text/javascript` MIME type, not `text/plain`.

### Project Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Dependencies and Licenses

### Runtime Dependencies
- **Vue** (^3.4.21) - MIT License - Progressive JavaScript framework
- **Gliner** (^0.0.19) - Apache-2.0 License - Named Entity Recognition library
- **@huggingface/transformers** (^3.5.1) - Apache-2.0 License - Machine learning transformers library
- **pdfjs-dist** (^5.2.133) - Apache-2.0 License - PDF parsing and rendering
- **mammoth** (^1.9.0) - BSD-2-Clause License - DOCX to HTML converter
- **@heroicons/vue** (^2.1.5) - MIT License - SVG icon library

### Development Dependencies
- **Vite** (^5.2.0) - MIT License - Build tool and development server
- **@vitejs/plugin-vue** (^5.0.4) - MIT License - Vue plugin for Vite
- **Tailwind CSS** (^3.4.4) - MIT License - Utility-first CSS framework
- **DaisyUI** (^4.12.2) - MIT License - Tailwind CSS component library
- **PostCSS** (^8.4.38) - MIT License - CSS post-processor
- **Autoprefixer** (^10.4.19) - MIT License - CSS vendor prefix automation

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur
