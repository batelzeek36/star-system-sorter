import { device } from 'detox';

beforeAll(async () => {
  await device.launchApp({
    // Configure to hit local dev API (not mocked network)
    // Android emulator uses 10.0.2.2 to reach host machine
    // iOS simulator uses localhost
    newInstance: true,
  });
});

beforeEach(async () => {
  await device.reloadReactNative();
});
