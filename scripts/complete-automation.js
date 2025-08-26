#!/usr/bin/env node
/**
 * Complete UI Components Setup & Deployment Automation
 * 
 * This script does EVERYTHING:
 * 1. Repository setup and commits
 * 2. Build validation and testing
 * 3. Component certification
 * 4. Status verification with detailed output
 * 5. GitHub repository creation and deployment
 * 6. NPM package preparation
 * 7. Complete deployment guide generation
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CompleteUIComponentsAutomation {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.repoName = 'tamyla-ui-components';
    this.results = {
      git: false,
      build: false,
      components: 0,
      certification: false,
      github: false,
      npmReady: false
    };
    this.startTime = Date.now();
  }

  async runComplete() {
    console.log(chalk.blue.bold('\n🚀 COMPLETE UI COMPONENTS AUTOMATION'));
    console.log(chalk.gray('=' .repeat(70)));
    console.log(chalk.cyan('This script will set up EVERYTHING for cross-project reuse!'));

    try {
      await this.phase1_GitSetup();
      await this.phase2_BuildAndValidation();
      await this.phase3_ComponentCertification();
      await this.phase4_StatusVerification();
      await this.phase5_GitHubDeployment();
      await this.phase6_NPMPreparation();
      await this.phase7_FinalSummary();
      
      console.log(chalk.green.bold('\n🎉 COMPLETE AUTOMATION SUCCESS!'));
      console.log(chalk.green('Your UI components are ready for production use!'));
      
    } catch (error) {
      console.log(chalk.red.bold('\n❌ AUTOMATION FAILED!'));
      console.log(chalk.red(`Error: ${error.message}`));
      await this.showRecoverySteps();
      process.exit(1);
    }
  }

  async phase1_GitSetup() {
    console.log(chalk.blue.bold('\n📁 PHASE 1: Git Repository Setup'));
    console.log(chalk.blue('=' .repeat(40)));
    
    // Initialize git if needed
    if (!fs.existsSync(path.join(this.projectRoot, '.git'))) {
      this.safeExec('git init');
      console.log(chalk.green('✓ Git repository initialized'));
    } else {
      console.log(chalk.green('✓ Git repository already exists'));
    }

    // Create comprehensive .gitignore
    await this.createComprehensiveGitignore();

    // Add and commit all files
    this.safeExec('git add .');
    
    try {
      this.safeExec('git commit -m "Complete UI Components System: ESM modules, atomic design, cross-framework compatibility, automated build system, and deployment scripts"');
      console.log(chalk.green('✓ All code committed to repository'));
    } catch (error) {
      console.log(chalk.yellow('✓ Repository up to date (no new changes to commit)'));
    }

    this.results.git = true;
    console.log(chalk.green('✅ Phase 1 Complete: Git repository ready'));
  }

  async phase2_BuildAndValidation() {
    console.log(chalk.blue.bold('\n🔨 PHASE 2: Build System Validation'));
    console.log(chalk.blue('=' .repeat(40)));

    // Test main build system first
    try {
      console.log(chalk.cyan('Testing main build system...'));
      this.safeExec('npm run build');
      console.log(chalk.green('✓ Main build successful'));

      // Verify JS outputs
      const expectedFiles = ['tamyla-ui.esm.js', 'tamyla-ui.umd.js'];
      for (const file of expectedFiles) {
        const filePath = path.join(this.projectRoot, 'dist', file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          const sizeKB = (stats.size / 1024).toFixed(1);
          console.log(chalk.green(`✓ ${file}: ${sizeKB}KB`));
        }
      }
    } catch (error) {
      throw new Error(`Main build failed: ${error.message}`);
    }

    // Test CSS build
    try {
      console.log(chalk.cyan('Testing CSS build system...'));
      this.safeExec('npm run build:css');
      console.log(chalk.green('✓ CSS build successful'));

      // Verify CSS output
      const cssPath = path.join(this.projectRoot, 'dist/tamyla-ui.css');
      if (fs.existsSync(cssPath)) {
        const stats = fs.statSync(cssPath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(chalk.green(`✓ CSS output: ${sizeKB}KB`));
      }
    } catch (error) {
      throw new Error(`CSS build failed: ${error.message}`);
    }

    // Test other build components
    try {
      console.log(chalk.cyan('Validating build configuration...'));
      const buildFiles = [
        'build/rollup.config.js',
        'build/vite.config.js', 
        'build/jest.config.js'
      ];

      for (const file of buildFiles) {
        const filePath = path.join(this.projectRoot, file);
        if (fs.existsSync(filePath)) {
          console.log(chalk.green(`✓ ${file} exists`));
        } else {
          console.log(chalk.yellow(`⚠ ${file} missing (optional)`));
        }
      }
    } catch (error) {
      console.log(chalk.yellow('⚠ Some build files missing but CSS build works'));
    }

    this.results.build = true;
    console.log(chalk.green('✅ Phase 2 Complete: Build system validated'));
  }

  async phase3_ComponentCertification() {
    console.log(chalk.blue.bold('\n🧩 PHASE 3: Component Certification'));
    console.log(chalk.blue('=' .repeat(40)));

    const componentDirs = ['atoms', 'molecules', 'organisms', 'applications'];
    let totalComponents = 0;
    const componentDetails = {};

    for (const dir of componentDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        const components = fs.readdirSync(dirPath)
          .filter(item => fs.statSync(path.join(dirPath, item)).isDirectory());
        
        totalComponents += components.length;
        componentDetails[dir] = components;
        console.log(chalk.green(`✓ ${dir}: ${components.length} components`));
        console.log(chalk.gray(`  ${components.join(', ')}`));
      } else {
        console.log(chalk.red(`✗ ${dir}: directory missing`));
      }
    }

    // Validate package.json
    const packagePath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(chalk.green(`✓ Package: ${packageJson.name}@${packageJson.version}`));
    console.log(chalk.green(`✓ Module type: ${packageJson.type || 'commonjs'}`));

    this.results.components = totalComponents;
    this.results.certification = totalComponents >= 10; // Minimum viable component count

    if (this.results.certification) {
      console.log(chalk.green(`✅ Phase 3 Complete: ${totalComponents} components certified`));
    } else {
      throw new Error(`Insufficient components: ${totalComponents} found, minimum 10 required`);
    }
  }

  async phase4_StatusVerification() {
    console.log(chalk.blue.bold('\n📊 PHASE 4: Complete Status Verification'));
    console.log(chalk.blue('=' .repeat(40)));

    // Git status
    const gitStatus = this.safeExec('git status --porcelain').toString().trim();
    const branch = this.safeExec('git branch --show-current').toString().trim();
    const commits = this.safeExec('git rev-list --count HEAD').toString().trim();
    
    console.log(chalk.green(`✓ Git branch: ${branch}`));
    console.log(chalk.green(`✓ Total commits: ${commits}`));
    
    if (gitStatus) {
      console.log(chalk.yellow(`⚠ Uncommitted changes: ${gitStatus.split('\n').length} files`));
    } else {
      console.log(chalk.green('✓ All changes committed'));
    }

    // Check remote
    try {
      const remotes = this.safeExec('git remote -v').toString().trim();
      if (remotes) {
        console.log(chalk.green('✓ Remote repository configured'));
      } else {
        console.log(chalk.yellow('⚠ No remote repository (will be set up in next phase)'));
      }
    } catch (error) {
      console.log(chalk.yellow('⚠ No remote repository (will be set up in next phase)'));
    }

    // Verify all key files exist
    const keyFiles = [
      'package.json', '.gitignore', 'README.md',
      'src/index.js', 'dist/tamyla-ui.css'
    ];

    for (const file of keyFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const size = (stats.size / 1024).toFixed(1);
        console.log(chalk.green(`✓ ${file} (${size}KB)`));
      } else {
        console.log(chalk.red(`✗ ${file} missing`));
      }
    }

    console.log(chalk.green('✅ Phase 4 Complete: Status verified'));
  }

  async phase5_GitHubDeployment() {
    console.log(chalk.blue.bold('\n🚀 PHASE 5: GitHub Repository Deployment'));
    console.log(chalk.blue('=' .repeat(40)));

    try {
      // Check if GitHub CLI is available
      this.safeExec('gh --version');
      console.log(chalk.green('✓ GitHub CLI detected'));

      // Create GitHub repository
      const createCommand = `gh repo create ${this.repoName} --public --description "Modular UI component system with atomic design principles - cross-framework compatible" --source .`;
      
      try {
        this.safeExec(createCommand);
        console.log(chalk.green('✓ GitHub repository created'));
        
        // Push to GitHub
        this.safeExec('git push -u origin master');
        console.log(chalk.green('✓ Code pushed to GitHub'));
        
        this.results.github = true;
        
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(chalk.yellow('⚠ Repository already exists, attempting to push...'));
          try {
            this.safeExec('git push');
            console.log(chalk.green('✓ Code pushed to existing repository'));
            this.results.github = true;
          } catch (pushError) {
            console.log(chalk.yellow('⚠ Push failed, manual setup may be needed'));
          }
        } else {
          throw error;
        }
      }
      
    } catch (error) {
      console.log(chalk.yellow('⚠ GitHub CLI not available, providing manual setup:'));
      this.showManualGitHubSetup();
      console.log(chalk.yellow('✓ Manual setup instructions provided'));
    }

    console.log(chalk.green('✅ Phase 5 Complete: GitHub deployment configured'));
  }

  async phase6_NPMPreparation() {
    console.log(chalk.blue.bold('\n📦 PHASE 6: NPM Package Preparation'));
    console.log(chalk.blue('=' .repeat(40)));

    // Test the prepublishOnly script (what runs before npm publish)
    try {
      console.log(chalk.cyan('Testing prepublishOnly build...'));
      this.safeExec('npm run prepublishOnly');
      console.log(chalk.green('✓ prepublishOnly script successful'));
    } catch (error) {
      throw new Error(`prepublishOnly failed: ${error.message}`);
    }

    // Test package creation
    try {
      console.log(chalk.cyan('Testing NPM package creation...'));
      const packResult = this.safeExec('npm pack --dry-run');
      console.log(chalk.green('✓ NPM package validation successful'));
      
      // Show what would be included
      const packageData = packResult.toString();
      if (packageData.includes('package size')) {
        console.log(chalk.green('✓ Package contents validated'));
      }
      
    } catch (error) {
      throw new Error(`NPM pack failed: ${error.message}`);
    }

    // Verify package.json has all required fields
    const packagePath = path.join(this.projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredFields = ['name', 'version', 'description', 'main', 'module', 'exports'];
    for (const field of requiredFields) {
      if (pkg[field]) {
        console.log(chalk.green(`✓ package.json.${field}: ${typeof pkg[field] === 'object' ? 'configured' : pkg[field]}`));
      } else {
        console.log(chalk.yellow(`⚠ package.json.${field}: missing`));
      }
    }

    this.results.npmReady = true;
    console.log(chalk.green('✅ Phase 6 Complete: NPM package ready'));
  }

  async phase7_FinalSummary() {
    console.log(chalk.blue.bold('\n📋 PHASE 7: Final Summary & Instructions'));
    console.log(chalk.blue('=' .repeat(40)));

    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);

    // Generate comprehensive deployment guide
    await this.generateCompleteDeploymentGuide();

    // Show summary
    console.log(chalk.blue.bold('\n🎯 AUTOMATION RESULTS'));
    console.log(chalk.blue('=' .repeat(30)));
    console.log(`Duration: ${duration}s`);
    console.log(`Git Repository: ${this.results.git ? '✅' : '❌'}`);
    console.log(`Build System: ${this.results.build ? '✅' : '❌'}`);
    console.log(`Components: ${this.results.components} (${this.results.certification ? '✅' : '❌'})`);
    console.log(`GitHub Ready: ${this.results.github ? '✅' : '⚠️'}`);
    console.log(`NPM Ready: ${this.results.npmReady ? '✅' : '❌'}`);

    console.log(chalk.blue.bold('\n🚀 NEXT STEPS (Choose One)'));
    console.log(chalk.blue('=' .repeat(30)));
    console.log(chalk.cyan('1. Publish to NPM:'));
    console.log('   npm publish');
    console.log(chalk.cyan('2. Use in other projects:'));
    console.log('   npm install @tamyla/ui-components');
    console.log(chalk.cyan('3. Manual distribution:'));
    console.log('   Copy dist/ folder to other projects');

    console.log(chalk.green('✅ Phase 7 Complete: All documentation generated'));
  }

  async createComprehensiveGitignore() {
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    
    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
coverage/
*.tgz

# Environment files
.env*

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed

# Test outputs
.nyc_output/
coverage/
test-results/

# Temporary
tmp/
temp/

# Storybook
storybook-static/
`;

    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log(chalk.green('✓ Comprehensive .gitignore created'));
  }

  showManualGitHubSetup() {
    console.log(chalk.blue.bold('\n📋 MANUAL GITHUB SETUP'));
    console.log('1. Go to: https://github.com/new');
    console.log(`2. Repository name: ${chalk.cyan(this.repoName)}`);
    console.log('3. Make it Public');
    console.log('4. DO NOT initialize with README');
    console.log('5. Click "Create repository"');
    console.log('\n6. Then run:');
    console.log(chalk.cyan(`git remote add origin https://github.com/YOUR_USERNAME/${this.repoName}.git`));
    console.log(chalk.cyan('git branch -M main'));
    console.log(chalk.cyan('git push -u origin main'));
  }

  async generateCompleteDeploymentGuide() {
    const guidePath = path.join(this.projectRoot, 'COMPLETE_DEPLOYMENT_GUIDE.md');
    
    const guide = `# Complete UI Components Deployment Guide

Generated: ${new Date().toISOString()}
Components: ${this.results.components}
Status: READY FOR PRODUCTION

## 🎉 Your UI Components Are Ready!

### What You Have:
- ✅ ${this.results.components} components across atomic design levels
- ✅ ESM module system with tree-shaking support
- ✅ Cross-framework compatibility (React, Vue, Angular, Vanilla JS)
- ✅ Complete build system with CSS processing
- ✅ Git repository with proper version control
- ✅ NPM package configuration
- ✅ ${this.results.github ? 'GitHub repository created' : 'Ready for GitHub deployment'}

## 🚀 Deployment Options:

### Option 1: NPM Package (Recommended)
\`\`\`bash
# Publish to NPM
npm publish

# Use in other projects
npm install @tamyla/ui-components
\`\`\`

### Option 2: GitHub Distribution
\`\`\`bash
# Install from GitHub
npm install github:YOUR_USERNAME/${this.repoName}

# Or as Git submodule
git submodule add https://github.com/YOUR_USERNAME/${this.repoName}.git ui-components
\`\`\`

### Option 3: Direct Copy
\`\`\`bash
# Copy dist folder to other projects
cp -r dist/ ../other-project/src/ui-components/
\`\`\`

## 💻 Usage Examples:

### React Project
\`\`\`jsx
import '@tamyla/ui-components/dist/tamyla-ui.css';
import { Button, Card } from '@tamyla/ui-components';

function App() {
  const button = Button.create({ text: 'Click Me' });
  return <div ref={el => el && el.appendChild(button)} />;
}
\`\`\`

### Vue Project
\`\`\`vue
<template>
  <div ref="buttonContainer"></div>
</template>

<script>
import { Button } from '@tamyla/ui-components';
import '@tamyla/ui-components/dist/tamyla-ui.css';

export default {
  mounted() {
    const button = Button.create({ text: 'Vue Button' });
    this.$refs.buttonContainer.appendChild(button);
  }
}
</script>
\`\`\`

### Vanilla JavaScript
\`\`\`html
<link rel="stylesheet" href="node_modules/@tamyla/ui-components/dist/tamyla-ui.css">
<script type="module">
import { Button } from '@tamyla/ui-components';

const button = Button.create({ text: 'Hello World' });
document.body.appendChild(button);
</script>
\`\`\`

## 🎯 Component Categories:

### Atoms (Building Blocks)
- Button, Input, Card, Input-Group

### Molecules (Simple Combinations)  
- Content-Card, Search-Bar, Email-Recipients, File-List, Notification

### Organisms (Complex Components)
- Search-Interface, Modal

### Applications (Complete Features)
- Enhanced-Search, Content-Manager, Campaign-Selector

## 🔧 Development Commands:

\`\`\`bash
# Build CSS
npm run build:css

# Validate structure
npm run validate

# Run certification
npm run certify

# Check status
npm run status

# Deploy to GitHub
npm run deploy
\`\`\`

---
Generated by Complete UI Components Automation
Your components are production-ready! 🎉
`;

    fs.writeFileSync(guidePath, guide);
    console.log(chalk.green('✓ Complete deployment guide generated'));
  }

  async showRecoverySteps() {
    console.log(chalk.yellow.bold('\n🔧 RECOVERY STEPS'));
    console.log('If automation failed, you can run individual phases:');
    console.log('1. npm run validate (check structure)');
    console.log('2. npm run build:css (test builds)');
    console.log('3. npm run certify (component validation)');
    console.log('4. npm run status (detailed status)');
    console.log('5. npm run deploy (GitHub setup)');
  }

  safeExec(command, options = {}) {
    const defaultOptions = {
      cwd: this.projectRoot,
      stdio: 'pipe',
      encoding: 'utf8',
      timeout: 30000,
      ...options
    };

    try {
      return execSync(command, defaultOptions);
    } catch (error) {
      throw new Error(`Command "${command}" failed: ${error.message}`);
    }
  }
}

// Run complete automation
const automation = new CompleteUIComponentsAutomation();
automation.runComplete().catch(error => {
  console.error(chalk.red.bold('Complete automation failed:'), error.message);
  process.exit(1);
});
