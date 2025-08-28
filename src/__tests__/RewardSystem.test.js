/**
 * @jest-environment jsdom
 */

import { RewardSystem } from '../../src/index.js';

describe('RewardSystem', () => {
  test('should create instance', () => {
    const rewardSystem = new RewardSystem();
    expect(rewardSystem).toBeDefined();
  });

  test('should initialize', async () => {
    const rewardSystem = new RewardSystem();
    await expect(rewardSystem.initialize()).resolves.toBeUndefined();
  });
});
