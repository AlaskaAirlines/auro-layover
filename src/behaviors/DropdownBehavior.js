import { BaseBehavior } from "./BaseBehavior.js";

export class DropdownBehavior extends BaseBehavior {
  get config() {
    return {
      ...super.config,
      type: "manual",
      requiresPositioning: true,
      requiresFocusTrap: true,
      requiresClickTracker: true,
      requiresBodyScrollDisabled: false,
      shouldAdjustFocus: true,
      shouldCloseInLayers: true,
      matchWidth: false,
    };
  }

  setup() {
    // Dropdown-specific setup if needed
  }

  cleanup() {
    // Dropdown-specific cleanup if needed
  }

  onShow({ internal = false } = {}) {
    if (this.component.shown) {
      this.featureManager.attachPopoverPositioner();
    }
  }
}
