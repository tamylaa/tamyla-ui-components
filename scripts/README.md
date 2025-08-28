# UI Components Automation Scripts

This directory contains streamlined scripts for automating the setup, testing, and certification of UI components for cross-project reuse.

## Scripts

### `eslint-compatibility-check.js`
**ESLint configuration compatibility test for GitHub deployment:**

- 🧪 **Node.js Compatibility**: Tests across GitHub Actions matrix (16.x, 18.x, 20.x, 22.x)
- 📦 **ESM Module Resolution**: Validates ESLint 9 flat config loading
- 🔍 **Dependency Validation**: Checks ESLint 9.x and TypeScript ESLint compatibility
- 🎯 **Lint Execution**: Tests actual linting and reports error/warning counts
- 🏗️ **Build Integration**: Validates build process compatibility
- 🔧 **UI Components Config**: Verifies Jest and DOM globals configuration

**Usage:**
```bash
# Test ESLint configuration for GitHub deployment
node scripts/eslint-compatibility-check.js
```

### `working-certify.js`
**Complete certification and setup script that works reliably:**

- 🔧 **Repository Setup**: Initializes Git repository, creates commits
- 📦 **Build Validation**: Tests CSS builds and validates outputs  
- 🧪 **Component Validation**: Validates all components across atomic design levels
- 📋 **Certification Report**: Generates detailed certification with reuse guides

**Usage:**
```bash
# Run complete certification (recommended)
npm run certify

# With remote repository (optional)
GIT_REMOTE_URL=https://github.com/your-org/ui-components.git npm run certify
```

### `basic-validate.js` 
**Quick structure validation without complex operations:**

- ✅ Project structure validation
- ✅ Package.json configuration check
- ✅ Component count across directories
- ✅ Fast execution (< 1 second)

**Usage:**
```bash
# Quick structure validation
npm run validate
```

## Output Files

**After certification, you'll find:**
- `COMPONENT_CERTIFICATION.json` - Machine-readable certification results
- `REUSE_GUIDE.md` - Complete guide for using components across projects
- `.git/` - Initialized repository with proper commits
- `dist/` - Built CSS and component files

## Certification Levels

- 🚀 **READY_FOR_REUSE** - Components certified for cross-project use
- ✅ **All checks passed** - Repository, build system, components validated

## What Gets Tested

### Repository & Git Setup
- Git initialization with proper .gitignore
- Code committed with descriptive messages
- Ready for remote repository connection

### Build System Validation  
- CSS build system (✅ Working)
- Output file generation and validation
- ESM module compatibility

### Component Structure
- 15+ components across atomic design levels:
  - **Atoms**: 4 components (button, input, card, etc.)
  - **Molecules**: 5 components (content-card, search-bar, etc.)  
  - **Organisms**: 2 components (search-interface, modal)
  - **Applications**: 4 components (enhanced-search, content-manager, etc.)

## Cross-Project Compatibility

Your certified components work with:
- ✅ **React** projects (with automatic React wrappers)
- ✅ **Vue** projects (vanilla JS integration)
- ✅ **Angular** projects (component factory pattern)
- ✅ **Vanilla JS** projects (direct imports)
- ✅ **Static HTML** sites (CDN or direct file usage)

## Usage Examples

Generated in `REUSE_GUIDE.md` with complete examples for:
- NPM package installation and usage
- Direct component copying
- Git submodule integration
- CDN usage for static sites
- Framework-specific implementation patterns

## What Gets Tested

### Repository & Build
- Git repository initialization and commits
- NPM package configuration validation
- Build system execution (Rollup, Vite, etc.)
- Output file generation and sizing

### Installation & Imports  
- NPM package creation (`npm pack`)
- Installation in clean environment
- ES Module and UMD import testing
- Dependency resolution validation

### Component Quality
- Export structure validation
- Factory pattern implementation
- Documentation presence
- Error handling implementation
- Code quality metrics

### Cross-Project Compatibility
- Multiple import methods (ESM, UMD, individual)
- CSS integration testing
- TypeScript definition validation
- React wrapper compatibility
- Framework-agnostic usage patterns

## Integration with CI/CD

The certification script is designed to integrate with your CI/CD pipeline:

```yaml
# Example GitHub Action
- name: Certify UI Components
  run: |
    cd ui-components
    node scripts/certify-ui-components.js
    
- name: Upload Certification Report
  uses: actions/upload-artifact@v3
  with:
    name: certification-report
    path: ui-components/CERTIFICATION_REPORT.*
```

## Pre-requisites

- Node.js 16+ with NPM
- Git installed and configured
- All component source files present
- Valid `package.json` with build scripts

## Extending the Script

The certification script is modular and can be extended:

```javascript
// Add custom validation
class CustomCertification extends UIComponentsCertification {
  async validateCustomRequirement() {
    // Your custom validation logic
  }
}
```

## Troubleshooting

**Common Issues:**
- **Build Failures**: Check `package.json` scripts and dependencies
- **Import Errors**: Verify export structure in component files  
- **Git Issues**: Ensure Git is configured with user name/email
- **Permission Errors**: Run with appropriate file system permissions

**Debug Mode:**
```bash
DEBUG=1 node scripts/certify-ui-components.js
```

This will provide additional debugging output for troubleshooting.
