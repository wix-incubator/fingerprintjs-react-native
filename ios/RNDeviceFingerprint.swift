import FingerprintJS
import Foundation
import React

@objc(RNDeviceFingerprint)
final class RNDeviceFingerprint: NSObject {
    @objc(getFingerprint:rejecter:)
    func getFingerprint(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let fingerprinter = FingerprinterFactory.getInstance(
            Configuration(version: .v6, stabilityLevel: .optimal, algorithm: .sha256)
        )
        fingerprinter.getFingerprint { fingerprint in
            guard let fingerprint, !fingerprint.isEmpty else {
                reject(
                    "DEVICE_FINGERPRINT_UNAVAILABLE",
                    "Device fingerprint is unavailable",
                    nil
                )
                return
            }

            resolve(fingerprint)
        }
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        false
    }
}

