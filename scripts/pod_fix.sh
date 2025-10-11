#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ "${repo_root}" == *" "* ]]; then
  echo "Repository path contains spaces. Please relocate the project to a path without spaces."
  exit 1
fi

cd "${repo_root}"

log_file="logs/codex-$(date +%Y%m%d-%H%M%S).log"
mkdir -p logs
exec > >(tee -a "${log_file}") 2>&1

echo "Starting pod fix script at $(date)"

echo "Removing Pods directory and Podfile.lock"
rm -rf ios/Pods ios/Podfile.lock

echo "Clearing CocoaPods cache"
rm -rf "${HOME}/Library/Caches/CocoaPods"

echo "Clearing DerivedData"
rm -rf "${HOME}/Library/Developer/Xcode/DerivedData"

if [[ -d "node_modules" ]]; then
  echo "Removing quarantine attribute from node_modules"
  xattr -dr com.apple.quarantine node_modules || true
fi

export RCT_USE_PREBUILT_RNCORE=1
export RCT_USE_RN_DEP=1
echo "RCT_USE_PREBUILT_RNCORE=${RCT_USE_PREBUILT_RNCORE}"
echo "RCT_USE_RN_DEP=${RCT_USE_RN_DEP}"

echo "Running pod install with repo update"
(
  cd ios
  pod install --repo-update --verbose
)

if [[ ! -f "ios/Podfile.lock" ]]; then
  echo "Podfile.lock not found after pod install. Aborting."
  exit 1
fi

if grep -E "(^|\\s)(glog|Flipper-Glog)(\\s|$)" ios/Podfile.lock >/dev/null 2>&1; then
  echo "Detected glog or Flipper-Glog in Podfile.lock. Please remove offending dependencies and retry."
  exit 1
fi

echo "Pod install completed without glog-related pods."
