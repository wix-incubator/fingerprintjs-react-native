const assert = require('node:assert/strict');
const Module = require('node:module');
const { afterEach, describe, it } = require('node:test');

const nativeModules = {};
const originalLoad = Module._load;

Module._load = function load(request, parent, isMain) {
  if (request === 'react-native') {
    return { NativeModules: nativeModules };
  }

  return originalLoad.call(this, request, parent, isMain);
};

const DeviceFingerprintModule = require('../lib/commonjs');
Module._load = originalLoad;
const DeviceFingerprint = DeviceFingerprintModule.default;
const { getFingerprint, isAvailable } = DeviceFingerprintModule;

describe('fingerprintjs-react-native', () => {
  afterEach(() => {
    delete nativeModules.RNDeviceFingerprint;
  });

  it('returns the fingerprint from the native module', async () => {
    let callCount = 0;
    nativeModules.RNDeviceFingerprint = {
      getFingerprint: async () => {
        callCount += 1;
        return 'device-fingerprint';
      },
    };

    assert.equal(await getFingerprint(), 'device-fingerprint');
    assert.equal(callCount, 1);
    assert.equal(isAvailable(), true);
  });

  it('exposes the same functions from the default export', () => {
    assert.equal(DeviceFingerprint.getFingerprint, getFingerprint);
    assert.equal(DeviceFingerprint.isAvailable, isAvailable);
  });

  it('reports an unlinked native module', async () => {
    assert.equal(isAvailable(), false);
    await assert.rejects(
      getFingerprint(),
      /RNDeviceFingerprint native module is unavailable/
    );
  });

  for (const result of [undefined, null, '', 42]) {
    it(`rejects an invalid native result: ${String(result)}`, async () => {
      nativeModules.RNDeviceFingerprint = {
        getFingerprint: async () => result,
      };

      await assert.rejects(
        getFingerprint(),
        /Device fingerprint is unavailable\./
      );
    });
  }
});
