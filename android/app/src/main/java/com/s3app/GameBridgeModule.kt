package com.s3app

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngineCache
import io.flutter.plugin.common.EventChannel
import io.flutter.plugin.common.MethodChannel

/**
 * GameBridgeModule
 * 
 * React Native module for communicating with Flutter game module.
 * Implements MethodChannel for commands and EventChannel for events.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
class GameBridgeModule(reactContext: ReactApplicationContext) : 
  ReactContextBaseJavaModule(reactContext), LifecycleEventListener {

  private var methodChannel: MethodChannel? = null

  companion object {
    const val MODULE_NAME = "GameBridge"
    const val ENGINE_ID = "s3_engine"
    const val METHOD_CHANNEL_NAME = "s3/game/cmd"
    const val RN_EVENT_NAME = "GameEvent"
  }

  init {
    reactContext.addLifecycleEventListener(this)
    setupChannels()
  }

  override fun getName(): String = MODULE_NAME

  /**
   * Set up MethodChannel with cached FlutterEngine
   */
  private fun setupChannels() {
    val flutterEngine = FlutterEngineCache.getInstance().get(ENGINE_ID)
    
    if (flutterEngine == null) {
      return
    }

    // Set up MethodChannel for bidirectional communication
    methodChannel = MethodChannel(
      flutterEngine.dartExecutor.binaryMessenger,
      METHOD_CHANNEL_NAME
    )

    // Set up method call handler to receive events from Flutter
    methodChannel?.setMethodCallHandler { call, result ->
      when (call.method) {
        "sendEvent" -> {
          val eventJson = call.arguments as? String
          if (eventJson != null) {
            sendEventToReactNative(eventJson)
            result.success(null)
          } else {
            result.error("INVALID_EVENT", "Event data is null", null)
          }
        }
        else -> {
          result.notImplemented()
        }
      }
    }
  }

  /**
   * Open Flutter game activity
   * 
   * Launches FlutterActivity using the cached FlutterEngine.
   * The activity will display the Flutter game module.
   */
  @ReactMethod
  fun open(promise: Promise) {
    val activity = currentActivity
    
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "No current activity available")
      return
    }

    val flutterEngine = FlutterEngineCache.getInstance().get(ENGINE_ID)
    
    if (flutterEngine == null) {
      promise.reject("NO_ENGINE", "FlutterEngine not found in cache")
      return
    }

    try {
      val intent = FlutterActivity
        .withCachedEngine(ENGINE_ID)
        .build(activity)
      
      activity.startActivity(intent)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("LAUNCH_ERROR", "Failed to launch Flutter activity: ${e.message}", e)
    }
  }

  /**
   * Send command to Flutter via MethodChannel
   * 
   * @param commandJson JSON string containing the command
   * @param promise Promise to resolve/reject based on result
   */
  @ReactMethod
  fun sendCommand(commandJson: String, promise: Promise) {
    val methodChannel = this.methodChannel
    
    if (methodChannel == null) {
      promise.reject("NO_CHANNEL", "MethodChannel not initialized")
      return
    }

    try {
      methodChannel.invokeMethod(
        "sendCommand",
        commandJson,
        object : MethodChannel.Result {
          override fun success(result: Any?) {
            promise.resolve(null)
          }

          override fun error(errorCode: String, errorMessage: String?, errorDetails: Any?) {
            promise.reject(errorCode, errorMessage ?: "Unknown error")
          }

          override fun notImplemented() {
            promise.reject("NOT_IMPLEMENTED", "Method not implemented in Flutter")
          }
        }
      )
    } catch (e: Exception) {
      promise.reject("SEND_ERROR", "Failed to send command: ${e.message}", e)
    }
  }

  /**
   * Add listener for game events (required by React Native)
   * Events are forwarded from EventChannel to React Native's DeviceEventEmitter
   */
  @ReactMethod
  fun addListener(eventName: String) {
    // Required for RN event emitter, but actual setup is in setupChannels()
  }

  /**
   * Remove listener for game events (required by React Native)
   */
  @ReactMethod
  fun removeListeners(count: Int) {
    // Required for RN event emitter
  }

  /**
   * Send event to React Native
   * Called by EventChannel when Flutter sends an event
   */
  private fun sendEventToReactNative(eventJson: String) {
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(RN_EVENT_NAME, eventJson)
  }

  // Lifecycle methods
  override fun onHostResume() {
    // Re-setup channels if needed
    if (methodChannel == null) {
      setupChannels()
    }
  }

  override fun onHostPause() {
    // Keep channels alive
  }

  override fun onHostDestroy() {
    // Clean up
    methodChannel?.setMethodCallHandler(null)
    methodChannel = null
  }
}
