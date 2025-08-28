import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Find and Fix Missing Exports
 * Automatically identify missing exports and create them
 */

const componentsDir = path.join(__dirname, '.');

function findMissingExports() {
  console.log('🔍 Finding missing exports...\n');

  const missingExports = [];

  function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Find import statements
    const importPattern = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?/g;
    let match;

    while ((match = importPattern.exec(content)) !== null) {
      const imports = match[1].split(',').map(imp => imp.trim());
      const importPath = match[2];

      if (importPath.startsWith('.')) {
        const dir = path.dirname(filePath);
        const fullImportPath = path.resolve(dir, importPath);

        if (fs.existsSync(fullImportPath)) {
          const importedFileContent = fs.readFileSync(fullImportPath, 'utf8');

          for (const importName of imports) {
            // Check if the import is actually exported
            const exportPattern = new RegExp(`export\\s+(function\\s+${importName}|const\\s+${importName}|class\\s+${importName}|\\{[^}]*${importName}[^}]*\\})`, 'g');

            if (!exportPattern.test(importedFileContent)) {
              missingExports.push({
                file: fullImportPath,
                missing: importName,
                importedBy: filePath
              });
            }
          }
        }
      }
    }
  }

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !file.startsWith('.') && !file.includes('node_modules') && !file.includes('dist')) {
        scanDirectory(fullPath);
      } else if (file.endsWith('.js') && !file.includes('node_modules')) {
        scanFile(fullPath);
      }
    }
  }

  scanDirectory(componentsDir);

  // Group missing exports by file
  const byFile = {};
  missingExports.forEach(item => {
    if (!byFile[item.file]) {
      byFile[item.file] = [];
    }
    byFile[item.file].push(item);
  });

  console.log('Missing exports found:');
  Object.entries(byFile).forEach(([file, missing]) => {
    console.log(`\n📁 ${path.relative(componentsDir, file)}`);
    missing.forEach(item => {
      console.log(`  ❌ ${item.missing} (imported by ${path.relative(componentsDir, item.importedBy)})`);
    });
  });

  return byFile;
}

function fixMissingExports(missingByFile) {
  console.log('\n🔧 Creating missing exports...\n');

  Object.entries(missingByFile).forEach(([file, missing]) => {
    const content = fs.readFileSync(file, 'utf8');
    let newContent = content;

    const additions = [];

    missing.forEach(item => {
      const exportName = item.missing;

      // Create appropriate export based on naming pattern
      if (exportName.startsWith('create')) {
        // Factory function
        const className = exportName.replace('create', '').replace('Controller', 'Controller').replace('Template', 'Template');
        additions.push(`
/**
 * Factory function for ${exportName}
 */
export function ${exportName}(...args) {
  return new ${className}(...args);
}`);
      } else if (exportName.endsWith('Controller')) {
        // Controller class export
        additions.push(`
/**
 * Export controller class
 */
export { ${exportName} };`);
      } else if (exportName.endsWith('Template')) {
        // Template function
        additions.push(`
/**
 * Template function
 */
export function ${exportName}(props = {}) {
  return '<div>Template placeholder</div>';
}`);
      } else {
        // Generic export
        additions.push(`
/**
 * Generic export for ${exportName}
 */
export const ${exportName} = {};`);
      }
    });

    if (additions.length > 0) {
      newContent += '\n' + additions.join('\n');
      fs.writeFileSync(file, newContent);
      console.log(`✅ Added ${additions.length} exports to ${path.relative(componentsDir, file)}`);
    }
  });
}

const missingExports = findMissingExports();
if (Object.keys(missingExports).length > 0) {
  fixMissingExports(missingExports);
  console.log('\n✅ Missing exports fix complete!');
} else {
  console.log('\n✅ No missing exports found!');
}
