import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check what's in the built bundle
const umdFile = path.join(__dirname, 'dist', 'tamyla-ui.umd.js');
const esmFile = path.join(__dirname, 'dist', 'tamyla-ui.esm.js');

console.log('🔍 Checking ui-components exports...\n');

// Read ESM file
if (fs.existsSync(esmFile)) {
  const esmContent = fs.readFileSync(esmFile, 'utf8');
  console.log('📦 ESM exports found:');

  // Look for export statements
  const exportMatches = esmContent.match(/export\s+\{[^}]+\}/g) || [];
  exportMatches.forEach(match => console.log('  ', match));

  const namedExports = esmContent.match(/export\s+\w+\s+\w+/g) || [];
  namedExports.forEach(match => console.log('  ', match));

  console.log('\n📋 Total file size:', (esmContent.length / 1024).toFixed(2), 'KB');
}

// Check if there are SearchBar related exports
console.log('\n🔍 Looking for SearchBar exports...');
if (fs.existsSync(esmFile)) {
  const content = fs.readFileSync(esmFile, 'utf8');
  const searchBarMatches = content.match(/SearchBar\w*/g) || [];
  console.log('SearchBar related exports:', [...new Set(searchBarMatches)]);
}
