#!/usr/bin/env node
/**
 * CSS Build Script
 * Combines and processes all CSS files from components
 */

import fs from 'fs-extra';
import path from 'path';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../../dist');
const srcDir = path.join(__dirname, '../..');

// CSS file patterns to collect
const cssPatterns = [
  'core/tokens.css',
  'core/utilities.css',
  'atoms/**/*.css',
  'molecules/**/*.css',
  'organisms/**/*.css',
  'applications/**/*.css'
];

async function buildCSS() {
  console.log('🎨 Building CSS...');
  
  try {
    // Collect all CSS files
    const cssFiles = [];
    
    // Add core CSS first
    const tokensPath = path.join(srcDir, 'core/tokens.css');
    const utilitiesPath = path.join(srcDir, 'core/utilities.css');
    
    if (fs.existsSync(tokensPath)) {
      cssFiles.push(tokensPath);
    }
    if (fs.existsSync(utilitiesPath)) {
      cssFiles.push(utilitiesPath);
    }
    
    // Collect component CSS files
    await collectCSSFiles(cssFiles);
    
    // Combine all CSS
    let combinedCSS = '';
    cssFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        combinedCSS += `/* ${path.relative(srcDir, file)} */\n${content}\n\n`;
      }
    });
    
    // Process with PostCSS
    const result = await postcss([
      autoprefixer(),
      cssnano({
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true
        }]
      })
    ]).process(combinedCSS, { from: undefined });
    
    // Write main CSS file
    const mainCSSPath = path.join(distDir, 'tamyla-ui.css');
    fs.writeFileSync(mainCSSPath, result.css);
    
    // Create individual category CSS files
    await buildCategoryCSS();
    
    console.log('✅ CSS build complete');
    console.log(`📁 Main CSS: ${path.relative(process.cwd(), mainCSSPath)}`);
    console.log(`📦 Size: ${(result.css.length / 1024).toFixed(2)}KB`);
    
  } catch (error) {
    console.error('❌ CSS build failed:', error);
    process.exit(1);
  }
}

async function collectCSSFiles(cssFiles) {
  const directories = ['atoms', 'molecules', 'organisms', 'applications'];
  
  for (const dir of directories) {
    const dirPath = path.join(srcDir, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Look for CSS files in component directories
        const componentCSS = findCSSInComponent(itemPath);
        cssFiles.push(...componentCSS);
      } else if (item.endsWith('.css')) {
        cssFiles.push(itemPath);
      }
    }
  }
}

function findCSSInComponent(componentDir) {
  const cssFiles = [];
  
  try {
    const files = fs.readdirSync(componentDir);
    
    files.forEach(file => {
      if (file.endsWith('.css')) {
        cssFiles.push(path.join(componentDir, file));
      }
    });
    
    // Check subdirectories
    const subdirs = ['styles', 'css'];
    subdirs.forEach(subdir => {
      const subdirPath = path.join(componentDir, subdir);
      if (fs.existsSync(subdirPath)) {
        const subFiles = fs.readdirSync(subdirPath);
        subFiles.forEach(file => {
          if (file.endsWith('.css')) {
            cssFiles.push(path.join(subdirPath, file));
          }
        });
      }
    });
    
  } catch (error) {
    // Directory might not exist or be accessible
  }
  
  return cssFiles;
}

async function buildCategoryCSS() {
  const categories = {
    'core': ['core/tokens.css', 'core/utilities.css'],
    'atoms': 'atoms/**/*.css',
    'molecules': 'molecules/**/*.css', 
    'organisms': 'organisms/**/*.css',
    'applications': 'applications/**/*.css'
  };
  
  for (const [category, pattern] of Object.entries(categories)) {
    const cssFiles = [];
    
    if (Array.isArray(pattern)) {
      // Core files
      pattern.forEach(file => {
        const filePath = path.join(srcDir, file);
        if (fs.existsSync(filePath)) {
          cssFiles.push(filePath);
        }
      });
    } else {
      // Collect from directory
      const dirPath = path.join(srcDir, category);
      if (fs.existsSync(dirPath)) {
        await collectCSSFromDirectory(dirPath, cssFiles);
      }
    }
    
    if (cssFiles.length === 0) continue;
    
    // Combine CSS for this category
    let combinedCSS = '';
    cssFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      combinedCSS += `/* ${path.relative(srcDir, file)} */\n${content}\n\n`;
    });
    
    // Process and write
    const result = await postcss([
      autoprefixer(),
      cssnano({ preset: 'default' })
    ]).process(combinedCSS, { from: undefined });
    
    const outputPath = path.join(distDir, `${category}.css`);
    fs.writeFileSync(outputPath, result.css);
    
    console.log(`📄 Built ${category}.css (${(result.css.length / 1024).toFixed(2)}KB)`);
  }
}

async function collectCSSFromDirectory(dirPath, cssFiles) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      const componentCSS = findCSSInComponent(itemPath);
      cssFiles.push(...componentCSS);
    } else if (item.endsWith('.css')) {
      cssFiles.push(itemPath);
    }
  }
}

// Run the build
buildCSS();
