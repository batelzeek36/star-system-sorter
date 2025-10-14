package com.s3app

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
// DISABLED: Flutter imports (old super_dash removed, will be replaced with runner_game)
// import io.flutter.embedding.engine.FlutterEngine
// import io.flutter.embedding.engine.FlutterEngineCache
// import io.flutter.embedding.engine.dart.DartExecutor

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
          // DISABLED: GameBridge package (old super_dash removed, will be replaced with runner_game)
          // add(GameBridgePackage())
        },
    )
  }

  // DISABLED: FlutterEngine cache (old super_dash removed, will be replaced with runner_game)
  // private lateinit var flutterEngine: FlutterEngine

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    
    // DISABLED: Initialize and cache FlutterEngine (old super_dash removed, will be replaced with runner_game)
    // initializeFlutterEngine()
  }

  // DISABLED: Flutter initialization (old super_dash removed, will be replaced with runner_game)
  /*
  private fun initializeFlutterEngine() {
    // Create FlutterEngine instance
    flutterEngine = FlutterEngine(this)

    // Start executing Dart code to pre-warm the FlutterEngine
    flutterEngine.dartExecutor.executeDartEntrypoint(
      DartExecutor.DartEntrypoint.createDefault()
    )

    // Cache the FlutterEngine with ID "s3_engine"
    FlutterEngineCache
      .getInstance()
      .put("s3_engine", flutterEngine)
  }

  fun getFlutterEngine(): FlutterEngine = flutterEngine
  */
}
