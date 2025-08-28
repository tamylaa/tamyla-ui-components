#!/usr/bin/env node
/**
 * GitHub Repository Deployment Script
 * Creates a GitHub repository and pushes the UI components
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GitHubDeployment {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.repoName = 'tamyla-ui-components';
    this.repoDescription = 'Modular UI component system with atomic design principles - cross-framework compatible';
  }

  async deploy() {
    console.log(chalk.blue.bold('\n🚀 GitHub Repository Deployment'));
    console.log(chalk.gray('=' .repeat(50)));

    try {
      await this.validateLocalRepo();
      await this.createGitHubRepo();
      await this.pushToGitHub();
      await this.displaySuccess();

    } catch (error) {
      console.log(chalk.red.bold('\n❌ Deployment FAILED!'));
      console.log(chalk.red(`Error: ${error.message}`));
      console.log(chalk.yellow('\nNext steps:'));
      console.log('1. Make sure you have GitHub CLI installed: gh auth login');
      console.log('2. Or manually create repository on GitHub.com');
      console.log('3. Run the manual setup commands shown above');
      process.exit(1);
    }
  }

  async validateLocalRepo() {
    console.log(chalk.cyan('\n🔍 Validating local repository...'));

    // Check if we're in a git repo
    try {
      this.exec('git status');
      console.log(chalk.green('  ✓ Git repository found'));
    } catch (error) {
      throw new Error('Not in a git repository. Run git init first.');
    }

    // Check if there are commits
    try {
      const commits = this.exec('git log --oneline').toString().trim();
      const commitCount = commits.split('\n').length;
      console.log(chalk.green(`  ✓ Found ${commitCount} commits`));
    } catch (error) {
      throw new Error('No commits found. Create initial commit first.');
    }

    // Commit any pending changes
    try {
      this.exec('git add .');
      this.exec('git commit -m "Final updates before GitHub deployment"');
      console.log(chalk.green('  ✓ Latest changes committed'));
    } catch (error) {
      console.log(chalk.yellow('  ⚠ No new changes to commit'));
    }
  }

  async createGitHubRepo() {
    console.log(chalk.cyan('\n📦 Creating GitHub repository...'));

    try {
      // Try using GitHub CLI first
      const createCommand = `gh repo create ${this.repoName} --public --description "${this.repoDescription}" --source .`;
      this.exec(createCommand);
      console.log(chalk.green('  ✓ GitHub repository created using GitHub CLI'));

    } catch (error) {
      console.log(chalk.yellow('  ⚠ GitHub CLI not available, providing manual setup instructions'));
      this.showManualSetup();
      throw new Error('Please complete manual setup or install GitHub CLI');
    }
  }

  async pushToGitHub() {
    console.log(chalk.cyan('\n⬆️ Pushing to GitHub...'));

    try {
      // Push to GitHub
      this.exec('git push -u origin master');
      console.log(chalk.green('  ✓ Code pushed to GitHub'));

    } catch (error) {
      // Try alternative branch name
      try {
        this.exec('git branch -M main');
        this.exec('git push -u origin main');
        console.log(chalk.green('  ✓ Code pushed to GitHub (main branch)'));
      } catch (secondError) {
        throw new Error('Failed to push to GitHub. Check credentials and permissions.');
      }
    }
  }

  showManualSetup() {
    console.log(chalk.blue.bold('\n📋 MANUAL SETUP INSTRUCTIONS'));
    console.log(chalk.blue('=' .repeat(40)));
    console.log('1. Go to https://github.com/new');
    console.log(`2. Repository name: ${chalk.cyan(this.repoName)}`);
    console.log(`3. Description: ${chalk.cyan(this.repoDescription)}`);
    console.log('4. Make it Public');
    console.log('5. DO NOT initialize with README, .gitignore, or license');
    console.log('6. Click "Create repository"');
    console.log('\n7. Then run these commands:');
    console.log(chalk.cyan(`git remote add origin https://github.com/YOUR_USERNAME/${this.repoName}.git`));
    console.log(chalk.cyan('git branch -M main'));
    console.log(chalk.cyan('git push -u origin main'));
  }

  async displaySuccess() {
    console.log(chalk.green.bold('\n✅ GitHub Repository Deployment SUCCESS!'));

    const repoUrl = `https://github.com/YOUR_USERNAME/${this.repoName}`;

    console.log(chalk.blue.bold('\n📊 DEPLOYMENT SUMMARY'));
    console.log(chalk.blue('=' .repeat(40)));
    console.log(`Repository: ${chalk.cyan(this.repoName)}`);
    console.log(`URL: ${chalk.cyan(repoUrl)}`);
    console.log(`Components: ${chalk.green('15 components across atomic design levels')}`);
    console.log(`Status: ${chalk.green('READY FOR CROSS-PROJECT REUSE')}`);

    console.log(chalk.blue.bold('\n🎯 NEXT STEPS'));
    console.log('1. Visit your repository on GitHub');
    console.log('2. Add team members as collaborators');
    console.log('3. Set up GitHub Actions for CI/CD (if needed)');
    console.log('4. Publish to NPM for easy installation:');
    console.log(chalk.cyan('   npm publish'));
    console.log('5. Use in other projects:');
    console.log(chalk.cyan('   npm install @tamyla/ui-components'));

    console.log(chalk.green.bold('\n🎉 Your UI components are now available on GitHub!'));
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

// Run deployment
const deployment = new GitHubDeployment();
deployment.deploy().catch(error => {
  console.error(chalk.red.bold('Deployment failed:'), error.message);
  process.exit(1);
});
