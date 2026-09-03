import { NativeModules } from 'react-native';

const NATIVE_MODULE_NAME = 'RNDeviceFingerprint';
const UNAVAILABLE_MESSAGE =
  'RNDeviceFingerprint native module is unavailable. Rebuild the app after linking the package.';

type RNDeviceFingerprintNativeModule = {
  getFingerprint(): Promise<string>;
};

function getNativeModule(): RNDeviceFingerprintNativeModule | undefined {
  return NativeModules[NATIVE_MODULE_NAME] as
    | RNDeviceFingerprintNativeModule
    | undefined;
}

export function isAvailable(): boolean {
  return getNativeModule() !== undefined;
}

export async function getFingerprint(): Promise<string> {
  const nativeModule = getNativeModule();

  if (!nativeModule) {
    throw new Error(UNAVAILABLE_MESSAGE);
  }

  const fingerprint = await nativeModule.getFingerprint();

  if (typeof fingerprint !== 'string' || fingerprint.length === 0) {
    throw new Error('Device fingerprint is unavailable.');
  }

  return fingerprint;
}

const DeviceFingerprint = {
  getFingerprint,
  isAvailable,
};

export default DeviceFingerprint;
