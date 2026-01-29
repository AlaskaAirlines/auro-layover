import { BaseBehavior } from "./BaseBehavior.js";

export class FullscreenBehavior extends BaseBehavior {
  get config() {
    return {
      ...super.config,
      type: "manual",
      requiresPositioning: false,
      requiresFocusTrap: true,
      requiresClickTracker: false, // Fullscreen doesn't need outside click tracking
      requiresBodyScrollDisabled: true,
      shouldAdjustFocus: true,
      shouldCloseInLayers: true,
      matchWidth: false,
    };
  }

  setup() {
    // Fullscreen-specific setup if needed
  }

  cleanup() {
    // Fullscreen-specific cleanup if needed
  }
}
