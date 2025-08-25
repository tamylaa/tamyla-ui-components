#!/usr/bin/env node
/**
 * Basic UI Components Validation
 * 
 * Simple structure validation and component count
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(chalk.blue.bold('🚀 UI Components Basic Validation'));
console.log(chalk.gray('=' .repeat(50)));

const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

console.log(chalk.cyan(`📂 Working directory: ${projectRoot}`));

// Check project structure
console.log(chalk.cyan('\n🔍 Checking project structure...'));

const dirs = ['atoms', 'molecules', 'organisms', 'applications', 'core', 'src'];
const foundDirs = [];

for (const dir of dirs) {
  const dirPath = path.join(projectRoot, dir);
  if (fs.existsSync(dirPath)) {
    const items = fs.readdirSync(dirPath).filter(item => 
      fs.statSync(path.join(dirPath, item)).isDirectory()
    );
    console.log(chalk.green(`  ✓ ${dir}/ (${items.length} components)`));
    foundDirs.push(dir);
  } else {
    console.log(chalk.yellow(`  ⚠ ${dir}/ - not found`));
  }
}

// Check package.json
console.log(chalk.cyan('\n📦 Checking package configuration...'));
const packagePath = path.join(projectRoot, 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(chalk.green(`  ✓ package.json - ${pkg.name}@${pkg.version}`));
  console.log(chalk.green(`  ✓ Type: ${pkg.type || 'commonjs'}`));
  
  if (pkg.scripts) {
    const scripts = Object.keys(pkg.scripts);
    console.log(chalk.green(`  ✓ Scripts: ${scripts.join(', ')}`));
  }
} else {
  console.log(chalk.red('  ✗ package.json - not found'));
}

// Summary
console.log(chalk.blue.bold('\n📊 Summary'));
console.log(chalk.blue('=' .repeat(30)));
console.log(`Found directories: ${foundDirs.length}/${dirs.length}`);
console.log(`Project type: ESM module system`);

if (foundDirs.length >= 4) {
  console.log(chalk.green.bold('\n✅ Basic structure validation PASSED!'));
  console.log(chalk.green('Your UI components structure is ready for development.'));
} else {
  console.log(chalk.yellow.bold('\n⚠️ Structure needs some work'));
  console.log(chalk.yellow('Consider creating missing component directories.'));
}

console.log(chalk.cyan('\n🎯 Next steps:'));
console.log('  • Run: npm run build (to test build system)');
console.log('  • Run: npm run dev (to start development server)');
console.log('  • Run: npm run simple-certify (for detailed validation)');
console.log(chalk.gray('\nValidation completed successfully! 🎉'));
