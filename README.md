# fingerprintjs-react-native

A small React Native bridge for the open-source FingerprintJS native libraries:

- [fingerprintjs-android](https://github.com/fingerprintjs/fingerprintjs-android)
- [fingerprintjs-ios](https://github.com/fingerprintjs/fingerprintjs-ios)

It computes a device fingerprint locally and returns it as a string. The package does not make network requests, persist the fingerprint, or emit analytics.

## Installation

```sh
npm install fingerprintjs-react-native
```

For iOS, install the pod and rebuild the native application:

```sh
cd ios
pod install
```

React Native autolinking is supported. Hosts that manage native packages manually can register `RNDeviceFingerprintPackage` on Android and add the `RNDeviceFingerprint` pod from this package on iOS.

## Usage

```ts
import { getFingerprint } from 'fingerprintjs-react-native';

const deviceFingerprintVisitorId = await getFingerprint();
```

`getFingerprint()` rejects if the native module is not linked or if the native library cannot produce a non-empty fingerprint.

## Native dependencies

The wrapper deliberately pins the fingerprint algorithm versions so dependency upgrades do not silently change identifiers:

- Android: `com.github.fingerprintjs:fingerprint-android:2.2.0`, fingerprint version `V_6`
- iOS: `FingerprintJS` `1.7.0`, fingerprint version `v6`, optimal stability, SHA-256

The Android dependency is downloaded from JitPack. A host whose dependency resolution ignores package-level repositories must also allow `https://jitpack.io` for the `com.github.fingerprintjs` group.

## Privacy and security

The underlying libraries combine device signals into a probabilistic identifier. Fingerprints can collide or change, and client-generated values can be spoofed. Treat the result as one security signal, not as proof of identity.

Fingerprinting can be regulated personal data. Applications are responsible for their legal basis, privacy disclosure, retention policy, feature gating, and server-side use.

Apple states that deriving device signals to uniquely identify a device is prohibited, regardless of tracking permission, and that apps which reference fingerprinting SDKs may be rejected. Do not include this package in an App Store binary without an explicit legal and App Store compliance decision. A disabled runtime feature flag does not remove the SDK from the binary.

On Android, the upstream library contributes biometric permissions, `READ_GSERVICES`, and package-visibility queries to the merged application manifest. Review the resulting manifest and Google Play data and permission declarations before distribution.

## Releasing

Releases are published by GitHub Actions, not from a developer workstation. Before the first release:

1. Complete the required organizational, security, privacy, and legal approvals.
2. Ask Wix Security to approve the workflows and enable GitHub Actions for the repository.
3. Have an authorized npm maintainer bootstrap the package on npm with an interactive, two-factor-authenticated publish. npm trusted publishing cannot be configured until the package exists.
4. Configure npm trusted publishing for `wix-incubator/fingerprintjs-react-native`, the `publish.yml` workflow, and its `npm` GitHub environment for subsequent releases.
5. Create a GitHub release whose tag matches the package version.

The release workflow verifies the package before publishing it publicly to npm. CI and release dependency installation use Wix's registry firewall and `npq` checks, Yarn 4.10.3, a committed lockfile, and commit-pinned GitHub Actions.

## License

MIT
