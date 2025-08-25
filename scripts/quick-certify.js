#!/usr/bin/env node
/**
 * Quick Certification Runner
 * 
 * Simplified script for running UI components certification
 * with common options and environment setup.
 */

import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up environment
process.env.NODE_ENV = 'test';

console.log(chalk.blue.bold('🚀 Quick UI Components Certification'));
console.log(chalk.gray('=' .repeat(50)));

try {
  // Change to the UI components directory
  const uiComponentsDir = path.resolve(__dirname, '..');
  process.chdir(uiComponentsDir);
  
  console.log(chalk.cyan(`📂 Working directory: ${uiComponentsDir}`));
  
  // Run the main certification script
  console.log(chalk.cyan('🔄 Starting certification process...\n'));
  
  execSync('node scripts/certify-ui-components.js', {
    stdio: 'inherit',
    cwd: uiComponentsDir
  });
  
  console.log(chalk.green.bold('\n✅ Certification completed successfully!'));
  console.log(chalk.green('Check CERTIFICATION_REPORT.md for detailed results.'));
  
} catch (error) {
  console.log(chalk.red.bold('\n❌ Certification failed!'));
  console.log(chalk.red(`Error: ${error.message}`));
  
  if (error.status) {
    console.log(chalk.yellow(`Exit code: ${error.status}`));
  }
  
  console.log(chalk.yellow('\nTip: Check the build logs above for specific error details.'));
  process.exit(1);
}
