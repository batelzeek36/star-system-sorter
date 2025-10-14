import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
// DISABLED: Flutter import (old super_dash removed, will be replaced with runner_game)
// import Flutter

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  
  // DISABLED: FlutterEngine cache (old super_dash removed, will be replaced with runner_game)
  // lazy var flutterEngine = FlutterEngine(name: "s3_engine")

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // DISABLED: Initialize and cache FlutterEngine (old super_dash removed, will be replaced with runner_game)
    // initializeFlutterEngine()
    
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "S3App",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
  
  // DISABLED: Flutter initialization (old super_dash removed, will be replaced with runner_game)
  /*
  private func initializeFlutterEngine() {
    // Start executing Dart code to pre-warm the FlutterEngine
    flutterEngine.run()
    
    // Note: GeneratedPluginRegistrant not needed for module without plugins
  }
  */
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
