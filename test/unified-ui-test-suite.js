/**
 * Unified UI Factory Test Suite
 * Comprehensive automated tests for the unified UI.create() API
 */

import { UI } from '../dist/tamyla-ui.esm.js';

/**
 * Test Runner
 */
class UnifiedUITestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: []
    };
  }

  /**
   * Run a test
   */
  test(name, testFn) {
    this.results.total++;
    try {
      const result = testFn();
      if (result === true || result === undefined) {
        this.results.passed++;
        this.results.tests.push({ name, status: 'PASS' });
        console.log(`✅ ${name}`);
        return true;
      } else {
        this.results.failed++;
        this.results.tests.push({ name, status: 'FAIL', error: result });
        console.log(`❌ ${name}: ${result}`);
        return false;
      }
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'ERROR', error: error.message });
      console.log(`💥 ${name}: ${error.message}`);
      return false;
    }
  }

  /**
   * Get test results
   */
  getResults() {
    return this.results;
  }

  /**
   * Print summary
   */
  printSummary() {
    const { passed, failed, total } = this.results;
    const percentage = Math.round((passed / total) * 100);

    console.log(`\n📊 Test Results: ${passed}/${total} (${percentage}%)`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status !== 'PASS')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.error || 'Unknown error'}`);
        });
    }
  }
}

/**
 * Unified UI Factory Tests
 */
export function runUnifiedUITests() {
  const runner = new UnifiedUITestRunner();

  console.log('🧪 Running Unified UI Factory Tests...\n');

  // Test 1: UI factory exists
  runner.test('UI factory exists', () => {
    return typeof UI === 'object' && UI !== null;
  });

  // Test 2: UI.create method exists
  runner.test('UI.create method exists', () => {
    return typeof UI.create === 'function';
  });

  // Test 3: UI.getAvailableTypes method exists
  runner.test('UI.getAvailableTypes method exists', () => {
    return typeof UI.getAvailableTypes === 'function';
  });

  // Test 4: UI.getVariants method exists
  runner.test('UI.getVariants method exists', () => {
    return typeof UI.getVariants === 'function';
  });

  // Test 5: UI.createMultiple method exists
  runner.test('UI.createMultiple method exists', () => {
    return typeof UI.createMultiple === 'function';
  });

  // Test 6: Get available types returns expected structure
  runner.test('getAvailableTypes returns proper structure', () => {
    const types = UI.getAvailableTypes();
    return types &&
           typeof types === 'object' &&
           types.atoms && Array.isArray(types.atoms) &&
           types.molecules && Array.isArray(types.molecules) &&
           types.organisms && Array.isArray(types.organisms);
  });

  // Test 7: Create button (atom)
  runner.test('Create button component', () => {
    const button = UI.create('button', { text: 'Test' });
    return button && typeof button.appendChild === 'function';
  });

  // Test 8: Create input (atom)
  runner.test('Create input component', () => {
    const input = UI.create('input', { type: 'text' });
    return input && typeof input.appendChild === 'function';
  });

  // Test 9: Create card (atom)
  runner.test('Create card component', () => {
    const card = UI.create('card', { title: 'Test' });
    return card && typeof card.appendChild === 'function';
  });

  // Test 10: Create search-bar (molecule)
  runner.test('Create search-bar component', () => {
    const searchBar = UI.create('search-bar', { placeholder: 'Search...' });
    return searchBar && typeof searchBar.appendChild === 'function';
  });

  // Test 11: Create notification (molecule)
  runner.test('Create notification component', () => {
    const notification = UI.create('notification', { message: 'Test' });
    return notification && typeof notification.appendChild === 'function';
  });

  // Test 12: Create search-interface (organism)
  runner.test('Create search-interface component', () => {
    const searchInterface = UI.create('search-interface', { title: 'Test Search' });
    return searchInterface &&
           typeof searchInterface.appendChild === 'function' &&
           typeof searchInterface.setResults === 'function';
  });

  // Test 13: Create reward-system (organism)
  runner.test('Create reward-system component', () => {
    const rewardSystem = UI.create('reward-system', { preset: 'beginner' });
    return rewardSystem && typeof rewardSystem.appendChild === 'function';
  });

  // Test 14: Create dashboard (organism)
  runner.test('Create dashboard component', () => {
    const dashboard = UI.create('dashboard', { type: 'widget', title: 'Test' });
    return dashboard && typeof dashboard.appendChild === 'function';
  });

  // Test 15: SearchInterface has critical methods
  runner.test('SearchInterface has critical methods', () => {
    const searchInterface = UI.create('search-interface');
    return typeof searchInterface.setResults === 'function' &&
           typeof searchInterface.updateResults === 'function' &&
           typeof searchInterface.getResults === 'function';
  });

  // Test 16: Get variants for button
  runner.test('Get variants for button', () => {
    const variants = UI.getVariants('button');
    return Array.isArray(variants) && variants.length > 0;
  });

  // Test 17: Get variants for input
  runner.test('Get variants for input', () => {
    const variants = UI.getVariants('input');
    return Array.isArray(variants);
  });

  // Test 18: Create multiple components
  runner.test('Create multiple components', () => {
    const components = UI.createMultiple([
      { type: 'button', props: { text: 'Button 1' } },
      { type: 'input', props: { type: 'text' } },
      { type: 'card', props: { title: 'Card 1' } }
    ]);
    return Array.isArray(components) &&
           components.length === 3 &&
           components.every(comp => comp && typeof comp.appendChild === 'function');
  });

  // Test 19: Error handling for invalid type
  runner.test('Error handling for invalid type', () => {
    try {
      UI.create('invalid-type');
      return 'Should have thrown error';
    } catch (error) {
      return error.message.includes('Unknown component type') ? true : `Wrong error: ${error.message}`;
    }
  });

  // Test 20: Error handling for null type
  runner.test('Error handling for null type', () => {
    try {
      UI.create(null);
      return 'Should have thrown error';
    } catch (error) {
      return error.message.includes('must be a string') ? true : `Wrong error: ${error.message}`;
    }
  });

  // Test 21: Error handling for createMultiple with invalid input
  runner.test('Error handling for createMultiple invalid input', () => {
    try {
      UI.createMultiple('not-an-array');
      return 'Should have thrown error';
    } catch (error) {
      return error.message.includes('expects an array') ? true : `Wrong error: ${error.message}`;
    }
  });

  // Test 22: SearchInterface setResults functionality
  runner.test('SearchInterface setResults functionality', () => {
    const searchInterface = UI.create('search-interface');
    try {
      searchInterface.setResults([
        { id: 1, title: 'Test Result', description: 'Test description' }
      ]);
      return true;
    } catch (error) {
      return `setResults failed: ${error.message}`;
    }
  });

  // Test 23: SearchInterface updateResults functionality
  runner.test('SearchInterface updateResults functionality', () => {
    const searchInterface = UI.create('search-interface');
    try {
      searchInterface.updateResults([
        { id: 2, title: 'Updated Result', description: 'Updated description' }
      ]);
      return true;
    } catch (error) {
      return `updateResults failed: ${error.message}`;
    }
  });

  // Test 24: RewardSystem has expected methods
  runner.test('RewardSystem has expected methods', () => {
    const rewardSystem = UI.create('reward-system');
    return typeof rewardSystem.awardXP === 'function' &&
           typeof rewardSystem.getUserData === 'function';
  });

  // Test 25: Dashboard has expected methods
  runner.test('Dashboard has expected methods', () => {
    const dashboard = UI.create('dashboard');
    return typeof dashboard.updateData === 'function' &&
           typeof dashboard.getWidget === 'function';
  });

  runner.printSummary();
  return runner.getResults();
}

/**
 * Component Discovery Tests
 */
export function runComponentDiscoveryTests() {
  const runner = new UnifiedUITestRunner();

  console.log('\n🔍 Running Component Discovery Tests...\n');

  // Test component type enumeration
  runner.test('Can enumerate all component types', () => {
    const types = UI.getAvailableTypes();
    const allTypes = [
      ...types.atoms,
      ...types.molecules,
      ...types.organisms,
      ...types.applications
    ];
    return allTypes.length >= 10; // Should have at least 10 component types
  });

  // Test variant discovery
  runner.test('Can discover variants for components', () => {
    const buttonVariants = UI.getVariants('button');
    const inputVariants = UI.getVariants('input');
    const cardVariants = UI.getVariants('card');

    return buttonVariants.length > 0 &&
           Array.isArray(inputVariants) &&
           Array.isArray(cardVariants);
  });

  // Test component creation without props
  runner.test('Can create components without props', () => {
    const button = UI.create('button');
    const input = UI.create('input');
    const card = UI.create('card');

    return button && input && card &&
           typeof button.appendChild === 'function' &&
           typeof input.appendChild === 'function' &&
           typeof card.appendChild === 'function';
  });

  runner.printSummary();
  return runner.getResults();
}

/**
 * Run all test suites
 */
export function runAllTests() {
  console.log('🚀 Starting Complete Unified UI Test Suite...\n');

  const unifiedResults = runUnifiedUITests();
  const discoveryResults = runComponentDiscoveryTests();

  const totalPassed = unifiedResults.passed + discoveryResults.passed;
  const totalFailed = unifiedResults.failed + discoveryResults.failed;
  const totalTests = unifiedResults.total + discoveryResults.total;
  const overallPercentage = Math.round((totalPassed / totalTests) * 100);

  console.log(`\n🎯 OVERALL RESULTS:`);
  console.log(`📊 Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`📈 Success Rate: ${overallPercentage}%`);

  if (overallPercentage >= 90) {
    console.log('🎉 EXCELLENT! Unified UI Factory is working perfectly!');
  } else if (overallPercentage >= 75) {
    console.log('👍 GOOD! Unified UI Factory is working well with minor issues.');
  } else {
    console.log('⚠️ NEEDS ATTENTION: Some tests are failing.');
  }

  return {
    unified: unifiedResults,
    discovery: discoveryResults,
    overall: {
      passed: totalPassed,
      failed: totalFailed,
      total: totalTests,
      percentage: overallPercentage
    }
  };
}

// Auto-run tests if in browser environment
if (typeof window !== 'undefined') {
  window.runUnifiedUITests = runUnifiedUITests;
  window.runComponentDiscoveryTests = runComponentDiscoveryTests;
  window.runAllTests = runAllTests;

  // Auto-run on page load
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      runAllTests();
    }, 100);
  });
}
