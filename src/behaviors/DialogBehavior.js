import { BaseBehavior } from "./BaseBehavior.js";

export class DialogBehavior extends BaseBehavior {
  get config() {
    return {
      ...super.config,
      type: "manual",
      requiresPositioning: false,
      requiresFocusTrap: true,
      requiresClickTracker: true,
      requiresBodyScrollDisabled: true,
      shouldAdjustFocus: true,
      shouldCloseInLayers: true,
      matchWidth: false,
    };
  }

  setup() {
    // Dialog-specific setup if needed
  }

  cleanup() {
    // Dialog-specific cleanup if needed
  }
}
