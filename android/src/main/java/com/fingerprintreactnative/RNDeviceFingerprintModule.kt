package com.fingerprintreactnative

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.fingerprintjs.android.fingerprint.Fingerprinter
import com.fingerprintjs.android.fingerprint.FingerprinterFactory

private const val MODULE_NAME = "RNDeviceFingerprint"
private const val ERROR_CODE = "DEVICE_FINGERPRINT_UNAVAILABLE"

class RNDeviceFingerprintModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = MODULE_NAME

    @ReactMethod
    fun getFingerprint(promise: Promise) {
        try {
            val fingerprinter = FingerprinterFactory.create(reactApplicationContext)
            fingerprinter.getFingerprint(Fingerprinter.Version.V_6) { fingerprint ->
                if (fingerprint.isNotEmpty()) {
                    promise.resolve(fingerprint)
                } else {
                    promise.reject(ERROR_CODE, "Device fingerprint is unavailable")
                }
            }
        } catch (error: Exception) {
            promise.reject(ERROR_CODE, "Device fingerprint is unavailable", error)
        }
    }
}
