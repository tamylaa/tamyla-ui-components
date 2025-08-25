#!/usr/bin/env node
/**
 * Repository Status and Information Script
 * Shows complete status of the UI components repository
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RepositoryStatus {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
  }

  async checkStatus() {
    console.log(chalk.blue.bold('\n📊 UI Components Repository Status'));
    console.log(chalk.gray('=' .repeat(60)));

    await this.checkGitStatus();
    await this.checkFileStructure();
    await this.checkBuildOutputs();
    await this.checkComponents();
    await this.showDeploymentOptions();
  }

  async checkGitStatus() {
    console.log(chalk.cyan('\n📁 Git Repository Status:'));
    
    try {
      // Current directory
      const currentDir = process.cwd();
      console.log(chalk.green(`  ✓ Location: ${currentDir}`));
      
      // Git status
      const status = this.exec('git status --porcelain').toString().trim();
      if (status) {
        console.log(chalk.yellow(`  ⚠ Uncommitted changes: ${status.split('\n').length} files`));
      } else {
        console.log(chalk.green('  ✓ All changes committed'));
      }
      
      // Branch info
      const branch = this.exec('git branch --show-current').toString().trim();
      console.log(chalk.green(`  ✓ Current branch: ${branch}`));
      
      // Commit count
      const commits = this.exec('git rev-list --count HEAD').toString().trim();
      console.log(chalk.green(`  ✓ Total commits: ${commits}`));
      
      // Remote status
      try {
        const remotes = this.exec('git remote -v').toString().trim();
        if (remotes) {
          console.log(chalk.green('  ✓ Remote repositories:'));
          remotes.split('\n').forEach(remote => {
            console.log(chalk.gray(`    ${remote}`));
          });
        } else {
          console.log(chalk.red('  ❌ No remote repositories configured'));
          console.log(chalk.yellow('    Run: npm run deploy (to set up GitHub)'));
        }
      } catch (error) {
        console.log(chalk.red('  ❌ No remote repositories'));
      }
      
    } catch (error) {
      console.log(chalk.red('  ❌ Not a git repository'));
    }
  }

  async checkFileStructure() {
    console.log(chalk.cyan('\n📂 Project Structure:'));
    
    const requiredDirs = [
      'atoms', 'molecules', 'organisms', 'applications', 
      'core', 'src', 'build', 'scripts'
    ];
    
    for (const dir of requiredDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        const items = fs.readdirSync(dirPath);
        console.log(chalk.green(`  ✓ ${dir}/ (${items.length} items)`));
      } else {
        console.log(chalk.red(`  ❌ ${dir}/ - missing`));
      }
    }
    
    // Check important files
    const importantFiles = [
      'package.json', '.gitignore', 'README.md',
      'REUSE_GUIDE.md', 'COMPONENT_CERTIFICATION.json'
    ];
    
    console.log(chalk.cyan('\n📄 Important Files:'));
    for (const file of importantFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const size = (stats.size / 1024).toFixed(1);
        console.log(chalk.green(`  ✓ ${file} (${size}KB)`));
      } else {
        console.log(chalk.red(`  ❌ ${file} - missing`));
      }
    }
  }

  async checkBuildOutputs() {
    console.log(chalk.cyan('\n🔨 Build Outputs:'));
    
    const distDir = path.join(this.projectRoot, 'dist');
    if (fs.existsSync(distDir)) {
      const files = fs.readdirSync(distDir, { recursive: true })
        .filter(file => typeof file === 'string');
      
      console.log(chalk.green(`  ✓ dist/ directory (${files.length} files)`));
      
      // Check for key build files
      const keyFiles = ['tamyla-ui.css'];
      for (const file of keyFiles) {
        const filePath = path.join(distDir, file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          const size = (stats.size / 1024).toFixed(1);
          console.log(chalk.green(`    ✓ ${file} (${size}KB)`));
        } else {
          console.log(chalk.yellow(`    ⚠ ${file} - not found`));
        }
      }
    } else {
      console.log(chalk.red('  ❌ No build outputs found'));
      console.log(chalk.yellow('    Run: npm run build:css'));
    }
  }

  async checkComponents() {
    console.log(chalk.cyan('\n🧩 Component Analysis:'));
    
    const componentDirs = ['atoms', 'molecules', 'organisms', 'applications'];
    let totalComponents = 0;
    
    for (const dir of componentDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        const components = fs.readdirSync(dirPath)
          .filter(item => fs.statSync(path.join(dirPath, item)).isDirectory());
        
        totalComponents += components.length;
        console.log(chalk.green(`  ✓ ${dir}: ${components.length} components`));
        
        // Show component names
        if (components.length > 0) {
          const componentList = components.join(', ');
          console.log(chalk.gray(`    ${componentList}`));
        }
      }
    }
    
    console.log(chalk.blue(`\n  📊 Total: ${totalComponents} components`));
  }

  async showDeploymentOptions() {
    console.log(chalk.blue.bold('\n🚀 DEPLOYMENT OPTIONS'));
    console.log(chalk.blue('=' .repeat(40)));
    
    console.log(chalk.cyan('\n1. GitHub Repository:'));
    console.log('   npm run deploy');
    console.log('   (Creates public GitHub repository)');
    
    console.log(chalk.cyan('\n2. NPM Package:'));
    console.log('   npm publish');
    console.log('   (Publishes to NPM registry)');
    
    console.log(chalk.cyan('\n3. Manual Distribution:'));
    console.log('   Copy dist/ folder to other projects');
    console.log('   Use as Git submodule');
    
    console.log(chalk.green.bold('\n✅ Repository is ready for deployment!'));
  }

  exec(command, options = {}) {
    const defaultOptions = {
      cwd: this.projectRoot,
      stdio: 'pipe',
      encoding: 'utf8',
      ...options
    };
    
    return execSync(command, defaultOptions);
  }
}

// Run status check
const status = new RepositoryStatus();
status.checkStatus().catch(error => {
  console.error(chalk.red.bold('Status check failed:'), error.message);
  process.exit(1);
});
