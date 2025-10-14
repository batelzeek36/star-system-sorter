//
//  GameBridgeModule.swift
//  S3App
//
//  React Native module for communicating with Flutter game module.
//  Implements MethodChannel for commands and EventChannel for events.
//
//  Requirements: 3.1, 3.2, 3.3, 3.4
//

import Foundation
import React
import Flutter
import FlutterPluginRegistrant

@objc(GameBridge)
class GameBridgeModule: RCTEventEmitter {
  
  // Constants
  private static let ENGINE_ID = "s3_engine"
  private static let METHOD_CHANNEL_NAME = "s3/game/cmd"
  private static let RN_EVENT_NAME = "GameEvent"
  
  // MethodChannel for bidirectional communication with Flutter
  private var methodChannel: FlutterMethodChannel?
  
  // Reference to FlutterEngine
  private var flutterEngine: FlutterEngine? {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
      return nil
    }
    return appDelegate.flutterEngine
  }
  
  override init() {
    super.init()
    setupChannels()
  }
  
  // MARK: - RCTEventEmitter overrides
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func supportedEvents() -> [String]! {
    return [GameBridgeModule.RN_EVENT_NAME]
  }
  
  override func startObserving() {
    // Called when first listener is added
  }
  
  override func stopObserving() {
    // Called when last listener is removed
  }
  
  // MARK: - Channel Setup
  
  /// Set up MethodChannel with cached FlutterEngine
  private func setupChannels() {
    guard let engine = flutterEngine else {
      print("GameBridge: FlutterEngine not available")
      return
    }
    
    // Set up MethodChannel for bidirectional communication
    methodChannel = FlutterMethodChannel(
      name: GameBridgeModule.METHOD_CHANNEL_NAME,
      binaryMessenger: engine.binaryMessenger
    )
    
    // Set up method call handler to receive events from Flutter
    methodChannel?.setMethodCallHandler { [weak self] (call, result) in
      guard let self = self else {
        result(FlutterError(code: "NO_SELF", message: "Module deallocated", details: nil))
        return
      }
      
      switch call.method {
      case "sendEvent":
        if let eventJson = call.arguments as? String {
          self.sendEventToReactNative(eventJson: eventJson)
          result(nil)
        } else {
          result(FlutterError(
            code: "INVALID_EVENT",
            message: "Event data is null",
            details: nil
          ))
        }
        
      default:
        result(FlutterMethodNotImplemented)
      }
    }
  }
  
  // MARK: - React Native Methods
  
  /// Open Flutter game view controller
  ///
  /// Presents a FlutterViewController using the cached FlutterEngine.
  /// The view controller will display the Flutter game module.
  @objc
  func open(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async { [weak self] in
      guard let self = self else {
        reject("NO_SELF", "Module deallocated", nil)
        return
      }
      
      guard let engine = self.flutterEngine else {
        reject("NO_ENGINE", "FlutterEngine not found", nil)
        return
      }
      
      guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
        reject("NO_ROOT_VC", "No root view controller available", nil)
        return
      }
      
      // Create FlutterViewController with cached engine
      let flutterViewController = FlutterViewController(
        engine: engine,
        nibName: nil,
        bundle: nil
      )
      
      // Present full screen
      flutterViewController.modalPresentationStyle = .fullScreen
      
      rootViewController.present(flutterViewController, animated: true) {
        resolve(nil)
      }
    }
  }
  
  /// Send command to Flutter via MethodChannel
  ///
  /// - Parameters:
  ///   - commandJson: JSON string containing the command
  ///   - resolve: Promise resolve callback
  ///   - reject: Promise reject callback
  @objc
  func sendCommand(
    _ commandJson: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let channel = methodChannel else {
      reject("NO_CHANNEL", "MethodChannel not initialized", nil)
      return
    }
    
    channel.invokeMethod("sendCommand", arguments: commandJson) { result in
      if let error = result as? FlutterError {
        reject(error.code, error.message, error.details as? NSError)
      } else if result is FlutterMethodNotImplemented {
        reject("NOT_IMPLEMENTED", "Method not implemented in Flutter", nil)
      } else {
        resolve(nil)
      }
    }
  }
  
  // MARK: - Event Handling
  
  /// Send event to React Native
  ///
  /// Called when Flutter sends an event via MethodChannel.
  /// Forwards the event to React Native's DeviceEventEmitter.
  ///
  /// - Parameter eventJson: JSON string containing the event data
  private func sendEventToReactNative(eventJson: String) {
    sendEvent(withName: GameBridgeModule.RN_EVENT_NAME, body: eventJson)
  }
  
  // MARK: - Lifecycle
  
  deinit {
    methodChannel?.setMethodCallHandler(nil)
    methodChannel = nil
  }
}
