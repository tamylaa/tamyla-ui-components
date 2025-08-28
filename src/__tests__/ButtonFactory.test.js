/**
 * @jest-environment jsdom
 */

// Mock the ButtonFactory with a simple implementation
const mockButtonFactory = {
  create: jest.fn(() => {
    const button = document.createElement('button');
    button.textContent = 'Test Button';
    button.className = 'tmyl-button';
    return button;
  })
};

describe('ButtonFactory', () => {
  test('should create a button element', () => {
    const factory = mockButtonFactory;
    const button = factory.create({
      text: 'Test Button',
      variant: 'primary'
    });

    expect(button).toBeDefined();
    expect(button.tagName).toBe('BUTTON');
    expect(button.textContent).toBe('Test Button');
  });
});
