/**
 * @jest-environment jsdom
 */

import { ButtonFactory } from '../src/index.js';

describe('ButtonFactory', () => {
  test('should create a button element', () => {
    const factory = new ButtonFactory();
    const button = factory.create({
      text: 'Test Button',
      variant: 'primary'
    });

    expect(button).toBeDefined();
    expect(button.tagName).toBe('BUTTON');
    expect(button.textContent).toBe('Test Button');
  });
});
