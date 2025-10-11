#!/bin/bash

# Bootstrap script to generate Flutter module's .android and .ios directories
# These directories are normally generated during the first host app build,
# but we need to create them manually to avoid chicken-and-egg problem

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FLUTTER_MODULE_PATH="$PROJECT_ROOT/super_dash"

echo "🚀 Bootstrapping Flutter module platform directories..."

cd "$FLUTTER_MODULE_PATH"

# Create .android directory structure
echo "📱 Creating .android directory structure..."
mkdir -p .android

# Create include_flutter.groovy
cat > .android/include_flutter.groovy << 'EOF'
// Generated file. Do not edit.

def scriptFile = getClass().protectionDomain.codeSource.location.toURI()
def flutterProjectRoot = new File(scriptFile).parentFile.parentFile

gradle.include ":flutter"
gradle.project(":flutter").projectDir = new File(flutterProjectRoot, ".android/Flutter")

def localPropertiesFile = new File(flutterProjectRoot, ".android/local.properties")
def properties = new Properties()

assert localPropertiesFile.exists(), "❌ Flutter module not built. Run 'flutter pub get' in $flutterProjectRoot"
localPropertiesFile.withReader("UTF-8") { reader -> properties.load(reader) }

def flutterSdkPath = properties.getProperty("flutter.sdk")
assert flutterSdkPath != null, "flutter.sdk not set in local.properties"
gradle.apply from: "$flutterSdkPath/packages/flutter_tools/gradle/module_plugin_loader.gradle"
EOF

# Create Flutter directory structure
mkdir -p .android/Flutter

# Create build.gradle for Flutter module
cat > .android/Flutter/build.gradle << 'EOF'
// Generated file. Do not edit.

buildscript {
    ext.kotlin_version = '1.9.0'
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.1.0'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

apply plugin: 'com.android.library'

android {
    namespace 'io.flutter.plugins.flutter_plugin_android_lifecycle'
    compileSdkVersion 34

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    defaultConfig {
        minSdkVersion 21
    }
}

dependencies {
    implementation 'androidx.annotation:annotation:1.7.0'
    implementation 'androidx.lifecycle:lifecycle-common:2.6.2'
}
EOF

# Create local.properties
FLUTTER_SDK=$(flutter --version --machine 2>/dev/null | python3 -c "import sys, json; print(json.load(sys.stdin)['flutterRoot'])" 2>/dev/null || echo "")
if [ -z "$FLUTTER_SDK" ]; then
    # Fallback: try to find Flutter SDK from which command
    FLUTTER_BIN=$(which flutter)
    if [ -n "$FLUTTER_BIN" ]; then
        FLUTTER_SDK=$(cd "$(dirname "$FLUTTER_BIN")/.." && pwd)
    fi
fi
cat > .android/local.properties << EOF
flutter.sdk=$FLUTTER_SDK
flutter.buildMode=debug
flutter.versionName=1.0.0
flutter.versionCode=1
EOF

echo "✅ .android directory created"

# Create .ios directory structure
echo "🍎 Creating .ios directory structure..."
mkdir -p .ios/Flutter

# Create podhelper.rb
cat > .ios/Flutter/podhelper.rb << 'EOF'
# Generated file. Do not edit.

require 'json'

def flutter_root
  generated_xcode_build_settings_path = File.expand_path(File.join('..', 'Flutter', 'Generated.xcconfig'), __FILE__)
  unless File.exist?(generated_xcode_build_settings_path)
    raise "#{generated_xcode_build_settings_path} must exist. Run 'flutter pub get' in the Flutter module."
  end

  File.foreach(generated_xcode_build_settings_path) do |line|
    matches = line.match(/FLUTTER_ROOT\=(.*)/)
    return matches[1].strip if matches
  end
  raise "FLUTTER_ROOT not found in #{generated_xcode_build_settings_path}"
end

def flutter_ios_podfile_setup
  # No-op for module
end

def install_all_flutter_pods(flutter_application_path)
  flutter_application_path ||= File.join('..', '..')
  
  pod 'Flutter', :path => File.join(flutter_application_path, '.ios', 'Flutter')
  
  # Install Flutter plugins
  plugin_pods = parse_KV_file(File.join(flutter_application_path, '.ios', 'Flutter', 'FlutterPluginRegistrant.xcconfig'))
  plugin_pods.each do |name, path|
    pod name, :path => File.join(flutter_application_path, '.ios', path)
  end
end

def parse_KV_file(file)
  file_abs_path = File.expand_path(file)
  if !File.exists? file_abs_path
    return {}
  end
  generated_key_values = {}
  skip_line_start_symbols = ["#", "/"]
  File.foreach(file_abs_path) do |line|
    next if skip_line_start_symbols.any? { |symbol| line =~ /^\s*#{symbol}/ }
    plugin = line.split(pattern = '=')
    if plugin.length == 2
      podname = plugin[0].strip()
      path = plugin[1].strip()
      podpath = File.expand_path("#{path}", file_abs_path)
      generated_key_values[podname] = podpath
    else
      puts "Invalid plugin specification: #{line}"
    end
  end
  generated_key_values
end

def flutter_post_install(installer)
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_BITCODE'] = 'NO'
    end
  end
end
EOF

# Create Generated.xcconfig
# Reuse FLUTTER_SDK from earlier
cat > .ios/Flutter/Generated.xcconfig << EOF
// Generated file. Do not edit.
FLUTTER_ROOT=$FLUTTER_SDK
FLUTTER_APPLICATION_PATH=$FLUTTER_MODULE_PATH
COCOAPODS_PARALLEL_CODE_SIGN=true
FLUTTER_BUILD_DIR=build
FLUTTER_BUILD_NAME=1.0.0
FLUTTER_BUILD_NUMBER=1
EXCLUDED_ARCHS[sdk=iphonesimulator*]=i386
DART_OBFUSCATION=false
TRACK_WIDGET_CREATION=true
TREE_SHAKE_ICONS=false
PACKAGE_CONFIG=.dart_tool/package_config.json
EOF

# Create FlutterPluginRegistrant.xcconfig (empty for now, will be populated by flutter build)
touch .ios/Flutter/FlutterPluginRegistrant.xcconfig

# Create Flutter.podspec
cat > .ios/Flutter/Flutter.podspec << 'EOF'
Pod::Spec.new do |s|
  s.name             = 'Flutter'
  s.version          = '1.0.0'
  s.summary          = 'High-performance, high-fidelity mobile apps.'
  s.homepage         = 'https://flutter.io'
  s.license          = { :type => 'MIT' }
  s.author           = { 'Flutter Dev Team' => 'flutter-dev@googlegroups.com' }
  s.source           = { :git => 'https://github.com/flutter/engine', :tag => s.version.to_s }
  s.ios.deployment_target = '12.0'
  s.vendored_frameworks = 'Flutter.xcframework'
end
EOF

echo "✅ .ios directory created"

echo ""
echo "✅ Flutter module platform directories bootstrapped successfully!"
echo ""
echo "📝 Next steps:"
echo "  1. Run: cd $PROJECT_ROOT/android && ./gradlew assembleDebug"
echo "  2. Run: cd $PROJECT_ROOT/ios && pod install"
echo ""
echo "Note: These directories contain minimal bootstrap files."
echo "Flutter will populate them fully during the first build."
