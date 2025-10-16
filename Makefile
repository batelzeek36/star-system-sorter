.PHONY: help e2e e2e-ios e2e-android e2e-all artifacts clean-artifacts

help:
	@echo "Star System Sorter - E2E Testing"
	@echo "================================="
	@echo ""
	@echo "Available targets:"
	@echo "  make e2e           - Run E2E tests on iOS (default)"
	@echo "  make e2e-ios       - Run E2E tests on iOS simulator"
	@echo "  make e2e-android   - Run E2E tests on Android emulator"
	@echo "  make e2e-all       - Run E2E tests on both platforms"
	@echo "  make artifacts     - Analyze latest test artifacts"
	@echo "  make clean-artifacts - Clean old test artifacts"
	@echo ""
	@echo "Examples:"
	@echo "  make e2e-ios FLOW=onboarding"
	@echo "  make e2e-android FLOW=input_chart"

# Default flow
FLOW ?= full_journey

# Run E2E tests on iOS (default)
e2e: e2e-ios

# Run E2E tests on iOS
e2e-ios:
	@./scripts/e2e-ios.sh $(FLOW)

# Run E2E tests on Android
e2e-android:
	@./scripts/e2e-android.sh $(FLOW)

# Run E2E tests on both platforms
e2e-all:
	@echo "Running E2E tests on both platforms..."
	@./scripts/e2e-ios.sh $(FLOW) || true
	@./scripts/e2e-android.sh $(FLOW) || true
	@./scripts/collect-artifacts.sh

# Analyze latest test artifacts
artifacts:
	@./scripts/collect-artifacts.sh

# Clean old artifacts (keep last 5 runs)
clean-artifacts:
	@echo "Cleaning old test artifacts..."
	@cd .artifacts && ls -t | tail -n +6 | xargs rm -rf
	@echo "✅ Cleaned old artifacts (kept last 5 runs)"
