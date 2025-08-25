#!/usr/bin/env node
/**
 * Build individual components for tree-shaking and selective imports
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentDirs = {
  atoms: ['button', 'input', 'card'],
  molecules: ['content-card', 'search-bar', 'email-recipients', 'file-list', 'notification'],
  organisms: ['search-interface', 'modal'],
  applications: ['enhanced-search', 'campaign-selector', 'content-manager']
};

const distDir = path.join(__dirname, '../../dist');
const componentsDir = path.join(distDir, 'components');

// Ensure directories exist
fs.ensureDirSync(componentsDir);

console.log('🔨 Building individual components...');

Object.entries(componentDirs).forEach(([category, components]) => {
  console.log(`\n📂 Building ${category}...`);
  
  components.forEach(component => {
    try {
      const inputFile = getComponentEntryPoint(category, component);
      
      if (!fs.existsSync(inputFile)) {
        console.log(`⚠️  Skipping ${component} - entry point not found: ${inputFile}`);
        return;
      }

      const outputFile = path.join(componentsDir, `${component}.js`);
      
      // Build with Rollup
      const rollupConfig = `
        import resolve from '@rollup/plugin-node-resolve';
        import commonjs from '@rollup/plugin-commonjs';
        import { terser } from 'rollup-plugin-terser';
        
        export default {
          input: '${inputFile.replace(/\\/g, '/')}',
          output: {
            file: '${outputFile.replace(/\\/g, '/')}',
            format: 'esm',
            sourcemap: false
          },
          plugins: [
            resolve(),
            commonjs(),
            terser({
              format: { comments: false },
              compress: { drop_console: true }
            })
          ]
        };
      `;
      
      const configFile = path.join(__dirname, `rollup.${component}.config.js`);
      fs.writeFileSync(configFile, rollupConfig);
      
      execSync(`npx rollup -c ${configFile}`, { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '../..')
      });
      
      // Clean up config file
      fs.removeSync(configFile);
      
      console.log(`✅ Built ${component}`);
      
    } catch (error) {
      console.error(`❌ Failed to build ${component}:`, error.message);
    }
  });
});

// Create index files for each category
Object.keys(componentDirs).forEach(category => {
  createCategoryIndex(category, componentDirs[category]);
});

// Create main components index
createMainComponentsIndex();

console.log('\n🎉 Individual component builds complete!');

function getComponentEntryPoint(category, component) {
  const basePath = path.join(__dirname, '../..', category);
  
  if (category === 'applications') {
    const systemFile = `${component.replace('-', '_')}_system.js`;
    return path.join(basePath, component, systemFile);
  }
  
  return path.join(basePath, component, `${component}-system.js`);
}

function createCategoryIndex(category, components) {
  const indexPath = path.join(componentsDir, `${category}.js`);
  
  const exports = components
    .filter(component => {
      const componentFile = path.join(componentsDir, `${component}.js`);
      return fs.existsSync(componentFile);
    })
    .map(component => {
      const exportName = toPascalCase(component);
      return `export { ${exportName} } from './${component}.js';`;
    })
    .join('\n');
  
  const content = `
// ${category.charAt(0).toUpperCase() + category.slice(1)} Components
// Auto-generated index file

${exports}

// Re-export all as default object
export default {
  ${components.filter(component => {
    const componentFile = path.join(componentsDir, `${component}.js`);
    return fs.existsSync(componentFile);
  }).map(component => {
    const exportName = toPascalCase(component);
    return `${exportName}`;
  }).join(',\n  ')}
};
`.trim();

  fs.writeFileSync(indexPath, content);
  console.log(`📝 Created ${category} index`);
}

function createMainComponentsIndex() {
  const indexPath = path.join(componentsDir, 'index.js');
  
  const categories = Object.keys(componentDirs).filter(category => {
    const categoryFile = path.join(componentsDir, `${category}.js`);
    return fs.existsSync(categoryFile);
  });
  
  const content = `
// Main Components Index
// Auto-generated - provides access to all individual components

${categories.map(category => `export * from './${category}.js';`).join('\n')}

// Category re-exports
${categories.map(category => {
  const exportName = toPascalCase(category);
  return `export { default as ${exportName} } from './${category}.js';`;
}).join('\n')}

// Usage examples:
// import { Button } from '@tamyla/ui-components/components';
// import { EnhancedSearch } from '@tamyla/ui-components/components';
// import { Atoms } from '@tamyla/ui-components/components';
`.trim();

  fs.writeFileSync(indexPath, content);
  console.log('📝 Created main components index');
}

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
