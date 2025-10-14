//
//  GameBridgeModule.m
//  S3App
//
//  React Native bridge module for Flutter game integration.
//  Exposes GameBridge methods to JavaScript.
//
//  Requirements: 3.1, 3.2, 3.3, 3.4
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(GameBridge, RCTEventEmitter)

// Open Flutter game view controller
RCT_EXTERN_METHOD(open:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Send command to Flutter via MethodChannel
RCT_EXTERN_METHOD(sendCommand:(NSString *)commandJson
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Required for event emitter
RCT_EXTERN_METHOD(addListener:(NSString *)eventName)
RCT_EXTERN_METHOD(removeListeners:(NSInteger)count)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
