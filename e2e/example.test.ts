import { device, element, by, expect as detoxExpect } from 'detox';

describe('Example E2E Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show welcome screen', async () => {
    // This is a placeholder test
    // Real tests will be added when screens are implemented
    await detoxExpect(element(by.id('app-root'))).toBeVisible();
  });
});
