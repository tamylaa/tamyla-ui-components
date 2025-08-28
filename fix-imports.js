import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fix Import Paths - Automatically correct relative import paths
 */

const componentsDir = path.join(__dirname, '.');

function fixImportPaths(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);

  // Find all import statements with relative paths
  const importPattern = /import\s+\{[^}]*\}\s+from\s+['"]([^'"]+)['"];?/g;
  let newContent = content;
  let hasChanges = false;

  let match;
  while ((match = importPattern.exec(content)) !== null) {
    const importPath = match[1];

    // Only fix relative paths that start with ../
    if (importPath.startsWith('../')) {
      const fullImportPath = path.resolve(dir, importPath);

      // Check if the file exists
      if (!fs.existsSync(fullImportPath)) {
        console.log(`❌ Missing import in ${filePath}: ${importPath}`);

        // Try to find the correct path
        const fileName = path.basename(importPath);
        const correctPaths = findFile(fileName, componentsDir);

        if (correctPaths.length > 0) {
          const relativePath = path.relative(dir, correctPaths[0]);
          const normalizedPath = relativePath.replace(/\\/g, '/');

          console.log(`🔧 Fixing: ${importPath} -> ${normalizedPath}`);
          newContent = newContent.replace(match[0], match[0].replace(importPath, normalizedPath));
          hasChanges = true;
        }
      }
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Fixed imports in ${path.relative(componentsDir, filePath)}`);
  }
}

function findFile(fileName, searchDir) {
  const results = [];

  function search(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !file.startsWith('.') && !file.includes('node_modules')) {
        search(fullPath);
      } else if (file === fileName) {
        results.push(fullPath);
      }
    }
  }

  search(searchDir);
  return results;
}

function fixAllImports() {
  console.log('🔧 Fixing all import paths in ui-components...\n');

  function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !file.startsWith('.') && !file.includes('node_modules') && !file.includes('dist')) {
        processDirectory(fullPath);
      } else if (file.endsWith('.js') && !file.includes('node_modules')) {
        fixImportPaths(fullPath);
      }
    }
  }

  processDirectory(componentsDir);
  console.log('\n✅ Import path fixing complete!');
}

fixAllImports();
