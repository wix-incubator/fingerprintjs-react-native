const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const { afterEach, describe, it } = require('node:test');

const nativeModules = {};
const originalLoad = Module._load;

function loadPackage() {
  const packagePath = require.resolve('../lib/commonjs');
  delete require.cache[packagePath];

  Module._load = function load(request, parent, isMain) {
    if (request === 'react-native') {
      return { NativeModules: nativeModules };
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    return require('../lib/commonjs');
  } finally {
    Module._load = originalLoad;
  }
}

const DeviceFingerprintModule = loadPackage();
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

  it('returns the unchanged native fingerprint after a JavaScript reload', async () => {
    const fingerprint = 'device-fingerprint';

    nativeModules.RNDeviceFingerprint = {
      getFingerprint: async () => fingerprint,
    };
    const beforeReload = await loadPackage().getFingerprint();

    nativeModules.RNDeviceFingerprint = {
      getFingerprint: async () => fingerprint,
    };
    const afterReload = await loadPackage().getFingerprint();

    assert.equal(beforeReload, fingerprint);
    assert.equal(afterReload, fingerprint);
  });

  it('pins the native fingerprint configuration on both platforms', () => {
    const androidSource = fs.readFileSync(
      path.join(
        __dirname,
        '..',
        'android/src/main/java/com/fingerprintreactnative/RNDeviceFingerprintModule.kt'
      ),
      'utf8'
    );
    const iosSource = fs.readFileSync(
      path.join(__dirname, '..', 'ios/RNDeviceFingerprint.swift'),
      'utf8'
    );

    assert.match(androidSource, /Fingerprinter\.Version\.V_6/);
    assert.match(androidSource, /StabilityLevel\.OPTIMAL/);
    assert.match(androidSource, /MurMur3x64x128Hasher\(\)/);
    assert.match(iosSource, /version: \.v6/);
    assert.match(iosSource, /stabilityLevel: \.optimal/);
    assert.match(iosSource, /algorithm: \.sha256/);
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
