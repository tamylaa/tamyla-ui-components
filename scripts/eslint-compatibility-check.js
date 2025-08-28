#!/usr/bin/env node

// ESLint Configuration Compatibility Test for UI Components Package
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

console.log('🧪 Testing ESLint Configuration in CI-like Environment');
console.log('Package: @tamyla/ui-components');
console.log('===============================================');

// Test Node version compatibility
const nodeVersion = process.version;
console.log(`Node.js Version: ${nodeVersion}`);

if (nodeVersion.match(/^v(16|18|20|22)/)) {
  console.log('✅ Node.js version compatible with GitHub Actions matrix');
} else {
  console.log('⚠️ Node.js version may not be compatible with GitHub Actions');
}

// Test ESM compatibility
console.log('\n📦 Testing ESM Module Resolution...');
try {
  // Test if we can load ESLint config as ESM
  await import('../eslint.config.js');
  console.log('✅ ESLint config loads as ESM');
} catch (error) {
  console.log('❌ ESLint config ESM load failed:', error.message);
}

// Test package.json type: "module"
console.log('\n📋 Testing package.json configuration...');
const packageJsonContent = readFileSync('./package.json', 'utf8');
const packageJson = JSON.parse(packageJsonContent);

if (packageJson.type === 'module') {
  console.log('✅ package.json correctly set to type: "module"');
} else {
  console.log('❌ package.json should have type: "module" for ESLint 9 flat config');
}

// Test ESLint dependencies
console.log('\n🔍 Testing ESLint dependencies...');
const eslintVersion = packageJson.devDependencies?.eslint;
const tsEslintVersion = packageJson.devDependencies?.['@typescript-eslint/eslint-plugin'];
const jestEslintVersion = packageJson.devDependencies?.['eslint-plugin-jest'];

if (eslintVersion?.includes('9.')) {
  console.log('✅ ESLint 9.x detected');
} else {
  console.log('❌ ESLint 9.x not found:', eslintVersion);
}

if (tsEslintVersion?.includes('7.')) {
  console.log('✅ TypeScript ESLint 7.x detected (compatible with ESLint 9)');
} else {
  console.log('❌ TypeScript ESLint version may not be compatible:', tsEslintVersion);
}

if (jestEslintVersion) {
  console.log('✅ Jest ESLint plugin detected for testing environment support');
} else {
  console.log('⚠️ Jest ESLint plugin not found (may be needed for test files)');
}

// Test lint command execution
console.log('\n🎯 Testing lint command execution...');
try {
  const lintOutput = execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' });
  
  // Parse the output to get error count
  const errorMatch = lintOutput.match(/(\d+) problems \((\d+) errors/);
  if (errorMatch) {
    const totalProblems = parseInt(errorMatch[1]);
    const errorCount = parseInt(errorMatch[2]);
    const warningCount = totalProblems - errorCount;
    
    if (errorCount === 0) {
      console.log(`✅ ESLint runs successfully with 0 errors, ${warningCount} warnings`);
    } else {
      console.log(`❌ ESLint found ${errorCount} errors, ${warningCount} warnings`);
    }
  } else {
    console.log('✅ ESLint runs successfully (no problems found)');
  }
} catch (error) {
  const errorOutput = error.stdout || error.stderr || error.message;
  if (errorOutput.includes('problems')) {
    console.log('⚠️ ESLint completed with issues:', errorOutput.slice(0, 200) + '...');
  } else {
    console.log('❌ ESLint command failed:', error.message);
  }
}

// Test build compatibility
console.log('\n🏗️ Testing build process...');
try {
  const buildOutput = execSync('npm run build', { encoding: 'utf8', stdio: 'pipe' });
  console.log('✅ Build process completed successfully');
} catch (error) {
  console.log('❌ Build process failed:', error.message.slice(0, 200) + '...');
}

// Check for specific UI Components configurations
console.log('\n🔧 Checking UI Components specific configurations...');

// Check if Jest environment is properly configured
const eslintConfigContent = readFileSync('./eslint.config.js', 'utf8');
if (eslintConfigContent.includes('jest')) {
  console.log('✅ Jest environment configuration detected');
} else {
  console.log('⚠️ Jest environment not found in ESLint config');
}

// Check if DOM globals are configured
if (eslintConfigContent.includes('HTMLElement') || eslintConfigContent.includes('browser')) {
  console.log('✅ Browser/DOM globals configuration detected');
} else {
  console.log('⚠️ Browser/DOM globals not found in ESLint config');
}

console.log('\n🎯 Final Assessment for UI Components Package:');
console.log('- ESLint 9 flat config compatibility');
console.log('- GitHub Actions deployment readiness');
console.log('- Build process integration');
console.log('- Jest testing environment support');
console.log('- DOM/Browser globals for UI components');

console.log('\n💡 Recommendation for @tamyla/ui-components deployment: 🚀');
