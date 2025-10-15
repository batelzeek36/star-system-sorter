package com.s3app

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * GameBridgePackage
 * 
 * React Native package that registers the GameBridgeModule.
 * 
 * Requirements: 3.1, 3.2
 */
class GameBridgePackage : ReactPackage {
  
  override fun createNativeModules(
    reactContext: ReactApplicationContext
  ): List<NativeModule> {
    return listOf(GameBridgeModule(reactContext))
  }

  @Deprecated("Deprecated in React Native 0.76+")
  override fun createViewManagers(
    reactContext: ReactApplicationContext
  ): List<ViewManager<*, *>> {
    return emptyList()
  }
}
