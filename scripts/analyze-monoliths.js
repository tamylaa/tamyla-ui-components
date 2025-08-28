#!/usr/bin/env node

/**
 * Monolith Detection Script
 * Identifies components that violate single responsibility principle
 */

const fs = require('fs');
const path = require('path');

const UI_COMPONENTS_PATH = path.join(__dirname, '../');

/**
 * Analyze a JavaScript file for monolithic patterns
 */
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const lineCount = lines.length;

    // Skip small files
    if (lineCount < 100) return null;

    const analysis = {
      file: filePath.replace(UI_COMPONENTS_PATH, ''),
      lineCount,
      issues: [],
      score: 0
    };

    // Check for multiple responsibilities
    const hasTemplates = /createTemplate|innerHTML|render\(\)|html`/.test(content);
    const hasControllers = /addEventListener|controller|Controller/.test(content);
    const hasStyles = /static styles|css`/.test(content);
    const hasIcons = /<svg|<path/.test(content);
    const hasConfig = /config|Config|defaultProps/.test(content);
    const hasMultipleClasses = (content.match(/class \w+/g) || []).length > 1;
    const hasMultipleFunctions = (content.match(/function \w+|const \w+ = \(/g) || []).length > 10;

    let responsibilityCount = 0;

    if (hasTemplates) {
      responsibilityCount++;
      analysis.issues.push('Contains template generation');
    }

    if (hasControllers) {
      responsibilityCount++;
      analysis.issues.push('Contains controller logic');
    }

    if (hasStyles) {
      responsibilityCount++;
      analysis.issues.push('Contains inline styles');
    }

    if (hasIcons) {
      responsibilityCount++;
      analysis.issues.push('Contains icon definitions');
    }

    if (hasConfig) {
      responsibilityCount++;
      analysis.issues.push('Contains configuration');
    }

    if (hasMultipleClasses) {
      responsibilityCount++;
      analysis.issues.push(`Contains ${(content.match(/class \w+/g) || []).length} classes`);
    }

    if (hasMultipleFunctions) {
      responsibilityCount++;
      analysis.issues.push('Contains many functions (possible multiple concerns)');
    }

    // Calculate monolith score (higher = more monolithic)
    analysis.score = responsibilityCount * 10 + Math.floor(lineCount / 100);

    // Only report files with multiple responsibilities
    if (responsibilityCount >= 3 || lineCount > 300) {
      return analysis;
    }

    return null;
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Recursively find all JavaScript files
 */
function findJavaScriptFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findJavaScriptFiles(fullPath, files);
    } else if (item.endsWith('.js') && !item.includes('.test.') && !item.includes('.spec.')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Main analysis function
 */
function analyzeUIComponents() {
  console.log('🔍 Analyzing UI Components for monolithic patterns...\n');

  const jsFiles = findJavaScriptFiles(UI_COMPONENTS_PATH);
  const monoliths = [];

  for (const file of jsFiles) {
    const analysis = analyzeFile(file);
    if (analysis) {
      monoliths.push(analysis);
    }
  }

  // Sort by monolith score (worst first)
  monoliths.sort((a, b) => b.score - a.score);

  if (monoliths.length === 0) {
    console.log('✅ No monolithic components found! Great job!');
    return;
  }

  console.log(`❌ Found ${monoliths.length} monolithic components:\n`);

  for (const monolith of monoliths) {
    console.log(`📁 ${monolith.file}`);
    console.log(`   Lines: ${monolith.lineCount}`);
    console.log(`   Score: ${monolith.score} (higher = worse)`);
    console.log('   Issues:');
    for (const issue of monolith.issues) {
      console.log(`     • ${issue}`);
    }
    console.log('');
  }

  console.log('🎯 Refactoring Recommendations:');
  console.log('');

  for (let i = 0; i < Math.min(3, monoliths.length); i++) {
    const monolith = monoliths[i];
    console.log(`${i + 1}. ${monolith.file}`);
    console.log(`   Priority: ${monolith.score > 50 ? 'HIGH' : monolith.score > 30 ? 'MEDIUM' : 'LOW'}`);
    console.log('   Suggested structure:');

    const componentName = path.basename(monolith.file, '.js');
    const dir = path.dirname(monolith.file);

    console.log(`   ${dir}/${componentName}/`);
    console.log('   ├── index.js');
    console.log(`   ├── ${componentName}-system.js`);

    if (monolith.issues.includes('Contains template generation')) {
      console.log(`   ├── templates/${componentName}-template.js`);
    }
    if (monolith.issues.includes('Contains controller logic')) {
      console.log(`   ├── controllers/${componentName}-controller.js`);
    }
    if (monolith.issues.includes('Contains inline styles')) {
      console.log(`   ├── styles/${componentName}.css`);
    }
    if (monolith.issues.includes('Contains icon definitions')) {
      console.log(`   ├── icons/${componentName}-icons.js`);
    }
    if (monolith.issues.includes('Contains configuration')) {
      console.log(`   └── config/${componentName}-config.js`);
    }

    console.log('');
  }
}

// Run analysis
if (require.main === module) {
  analyzeUIComponents();
}

module.exports = { analyzeUIComponents, analyzeFile };
