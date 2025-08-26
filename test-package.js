/**
 * Test ui-components package functionality
 */

// Test basic imports
try {
  console.log('🧪 Testing ui-components...');
  
  // Test if package is loadable
  const packageInfo = require('./package.json');
  console.log(`✅ Package loaded: ${packageInfo.name} v${packageInfo.version}`);
  
  // Test basic functionality (if main file exists)
  try {
    const fs = require('fs');
    const mainFile = packageInfo.main;
    if (fs.existsSync(mainFile)) {
      console.log(`✅ Build file exists: ${mainFile}`);
    } else {
      console.log(`❌ Build file missing: ${mainFile}`);
    }
  } catch (e) {
    console.log(`⚠️  Build file check failed: ${e.message}`);
  }
  
  // Test source files
  const fs = require('fs');
  const srcFiles = [
    'src/index.js',
    'src/atoms/button/button-system.js',
    'src/core/design-tokens.js'
  ];
  
  srcFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ Source file exists: ${file}`);
    } else {
      console.log(`❌ Source file missing: ${file}`);
    }
  });
  
  console.log('🎉 ui-components test complete!');
  
} catch (error) {
  console.error('❌ ui-components test failed:', error.message);
}
