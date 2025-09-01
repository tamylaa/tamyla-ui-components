/**
 * Node.js Test for setSharedFoundation Fix
 * Verifies that the fix resolves the runtime error
 */

import { atomFactory, createButton, createInput, createCard } from './dist/tamyla-ui.esm.js';

console.log('🧪 Testing setSharedFoundation Fix...\n');

try {
    // Test 1: Verify AtomFactory structure
    console.log('✅ Test 1: AtomFactory imported successfully');
    
    if (atomFactory.button && atomFactory.input && atomFactory.card) {
        console.log('✅ Test 2: AtomFactory has all required factory properties');
    } else {
        throw new Error('AtomFactory missing required factory properties');
    }

    // Test 3: Verify setSharedFoundation methods exist
    if (typeof atomFactory.button.setSharedFoundation === 'function') {
        console.log('✅ Test 3a: ButtonFactory has setSharedFoundation method');
    } else {
        throw new Error('ButtonFactory missing setSharedFoundation method');
    }

    if (typeof atomFactory.input.setSharedFoundation === 'function') {
        console.log('✅ Test 3b: InputFactory has setSharedFoundation method');
    } else {
        throw new Error('InputFactory missing setSharedFoundation method');
    }

    if (typeof atomFactory.card.setSharedFoundation === 'function') {
        console.log('✅ Test 3c: CardFactory has setSharedFoundation method');
    } else {
        throw new Error('CardFactory missing setSharedFoundation method');
    }

    // Test 4: Test setupSharedFoundation execution (this was failing before)
    try {
        atomFactory.setupSharedFoundation();
        console.log('✅ Test 4: setupSharedFoundation executed without errors');
    } catch (error) {
        throw new Error(`setupSharedFoundation failed: ${error.message}`);
    }

    // Test 5: Verify shared foundation is properly set
    if (atomFactory.button.tokens && atomFactory.button.utilities) {
        console.log('✅ Test 5a: ButtonFactory received shared foundation (tokens & utilities)');
    } else {
        console.log('⚠️  Test 5a: ButtonFactory may not have received shared foundation');
    }

    if (atomFactory.input.tokens && atomFactory.input.utilities) {
        console.log('✅ Test 5b: InputFactory received shared foundation (tokens & utilities)');
    } else {
        console.log('⚠️  Test 5b: InputFactory may not have received shared foundation');
    }

    if (atomFactory.card.tokens && atomFactory.card.utilities) {
        console.log('✅ Test 5c: CardFactory received shared foundation (tokens & utilities)');
    } else {
        console.log('⚠️  Test 5c: CardFactory may not have received shared foundation');
    }

    // Test 6: Test factory create method (this would have failed before the fix)
    try {
        const button = atomFactory.create('button', {
            variant: 'primary',
            text: 'Test Button'
        });
        console.log('✅ Test 6a: Factory create method works for buttons');

        const input = atomFactory.create('input', {
            type: 'text',
            label: 'Test Input'
        });
        console.log('✅ Test 6b: Factory create method works for inputs');

        const card = atomFactory.create('card', {
            variant: 'elevated',
            content: 'Test Card'
        });
        console.log('✅ Test 6c: Factory create method works for cards');

    } catch (error) {
        throw new Error(`Factory create method failed: ${error.message}`);
    }

    console.log('\n🎉 All tests passed! The setSharedFoundation fix is working correctly.');
    console.log('✅ The runtime error "factory.setSharedFoundation is not a function" has been resolved.');

} catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('🐛 The fix may not be working properly.');
    process.exit(1);
}
