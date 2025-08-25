#!/usr/bin/env node
/**
 * Simple CSS Build Script
 * Creates basic CSS output for the components
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../../dist');
const srcDir = path.join(__dirname, '../..');

console.log('🎨 Building CSS...');

// Ensure dist directory exists
await fs.ensureDir(distDir);

// Create a basic combined CSS file
const basicCSS = `/* Tamyla UI Components CSS */
/* Auto-generated CSS bundle */

/* Core Tokens */
:root {
  --primary-color: #007acc;
  --secondary-color: #f0f0f0;
  --text-color: #333;
  --border-radius: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

/* Base Reset */
.tamyla-ui * {
  box-sizing: border-box;
}

/* Utility Classes */
.tamyla-ui .hidden { display: none; }
.tamyla-ui .flex { display: flex; }
.tamyla-ui .gap-sm { gap: var(--spacing-sm); }
.tamyla-ui .gap-md { gap: var(--spacing-md); }

/* Component Base Styles */
.tamyla-ui button {
  border: none;
  border-radius: var(--border-radius);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tamyla-ui input {
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-sm);
}

.tamyla-ui .card {
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
}

/* Responsive */
@media (max-width: 768px) {
  .tamyla-ui {
    --spacing-sm: 6px;
    --spacing-md: 12px;
    --spacing-lg: 18px;
  }
}
`;

// Write the CSS file
const cssPath = path.join(distDir, 'tamyla-ui.css');
fs.writeFileSync(cssPath, basicCSS);

// Also create individual component CSS files
const componentCSS = {
  'atoms/button.css': `/* Button Component CSS */
.tamyla-button {
  background: var(--primary-color);
  color: white;
}`,
  'atoms/input.css': `/* Input Component CSS */
.tamyla-input {
  width: 100%;
}`,
  'atoms/card.css': `/* Card Component CSS */
.tamyla-card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`
};

for (const [filePath, content] of Object.entries(componentCSS)) {
  const fullPath = path.join(distDir, filePath);
  await fs.ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content);
}

const stats = fs.statSync(cssPath);
console.log(`✅ CSS built successfully!`);
console.log(`   📦 tamyla-ui.css (${(stats.size / 1024).toFixed(1)}KB)`);
console.log(`   📁 Individual component CSS files created`);
console.log(`   📂 Output: ${distDir}`);
