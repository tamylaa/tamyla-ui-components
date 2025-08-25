# UI Components Certification Script

This directory contains scripts for automating the setup, testing, and certification of UI components for cross-project reuse.

## Scripts

### `certify-ui-components.js`
**Primary automation script that handles the complete certification pipeline:**

- 🔧 **Repository Setup**: Initializes Git repository, creates commits
- 📦 **Build Validation**: Ensures all components build correctly  
- 🧪 **Installation Testing**: Tests NPM package installation and imports
- ✅ **Component Validation**: Validates each component's code quality
- 🔗 **Cross-Project Testing**: Tests compatibility across different usage patterns
- 📋 **Certification Report**: Generates detailed certification with recommendations

**Usage:**
```bash
# Run full certification pipeline
node scripts/certify-ui-components.js

# With remote repository (optional)
GIT_REMOTE_URL=https://github.com/your-org/ui-components.git node scripts/certify-ui-components.js
```

**Output:**
- `CERTIFICATION_REPORT.json` - Detailed machine-readable results
- `CERTIFICATION_REPORT.md` - Human-readable certification report
- Console output with real-time progress and summary

**Certification Levels:**
- 🚀 **PRODUCTION_READY** (95%+ success rate)
- 🧪 **BETA_READY** (85%+ success rate)  
- ⚠️ **ALPHA_READY** (70%+ success rate)
- 🔧 **DEVELOPMENT** (<70% success rate)

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
