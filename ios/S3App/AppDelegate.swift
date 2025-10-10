import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
// TODO: Uncomment when Super Dash is converted to Flutter module in Task 9.0
// import Flutter
// import FlutterPluginRegistrant

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  
  // FlutterEngine cache for Super Dash game (DISABLED until Task 9.0)
  // TODO: Uncomment when Super Dash is converted to Flutter module in Task 9.0
  // lazy var flutterEngine = FlutterEngine(name: "s3_engine")

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Initialize and cache FlutterEngine (DISABLED until Task 9.0)
    // TODO: Uncomment when Super Dash is converted to Flutter module in Task 9.0
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
  
  // TODO: Uncomment when Super Dash is converted to Flutter module in Task 9.0
  // private func initializeFlutterEngine() {
  //   // Start executing Dart code to pre-warm the FlutterEngine
  //   flutterEngine.run()
  //   
  //   // Register plugins with the FlutterEngine
  //   GeneratedPluginRegistrant.register(with: self.flutterEngine)
  // }
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
