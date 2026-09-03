#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNDeviceFingerprint, NSObject)

RCT_EXTERN_METHOD(getFingerprint:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

