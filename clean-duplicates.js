import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Clean up duplicate exports
 */

const componentsDir = path.join(__dirname, '.');

function cleanDuplicateExports() {
  console.log('🧹 Cleaning duplicate exports...\n');
  
  function cleanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const seenExports = new Set();
    const cleanedLines = [];
    let inExportBlock = false;
    let exportName = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for export declarations
      const exportMatch = line.match(/export\s+(const|function|class)\s+(\w+)/);
      
      if (exportMatch) {
        exportName = exportMatch[2];
        
        if (seenExports.has(exportName)) {
          // Skip this duplicate export
          inExportBlock = true;
          console.log(`  🗑️  Removing duplicate export: ${exportName}`);
          continue;
        } else {
          seenExports.add(exportName);
          inExportBlock = false;
        }
      }
      
      // Skip lines that are part of a duplicate export block
      if (inExportBlock) {
        // Check if this line ends the export block
        if (line.trim() === '}' || (line.includes('}') && !line.includes('{'))) {
          inExportBlock = false;
        }
        continue;
      }
      
      cleanedLines.push(line);
    }
    
    const cleanedContent = cleanedLines.join('\n');
    
    if (cleanedContent !== content) {
      fs.writeFileSync(filePath, cleanedContent);
      console.log(`✅ Cleaned duplicates in ${path.relative(componentsDir, filePath)}`);
      return true;
    }
    
    return false;
  }
  
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    let totalCleaned = 0;
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('.') && !file.includes('node_modules') && !file.includes('dist')) {
        totalCleaned += processDirectory(fullPath);
      } else if (file.endsWith('.js') && !file.includes('node_modules')) {
        if (cleanFile(fullPath)) {
          totalCleaned++;
        }
      }
    }
    
    return totalCleaned;
  }
  
  const cleaned = processDirectory(componentsDir);
  console.log(`\n✅ Cleaned ${cleaned} files!`);
}

cleanDuplicateExports();
