import { InputBehavior } from "./InputBehavior.js";

export class InputFullscreenBehavior extends InputBehavior {
  get config() {
    return {
      ...super.config,
      // Override with fullscreen characteristics
      type: "manual",
      requiresPositioning: false, // Fullscreen doesn't need positioning
      requiresFocusTrap: true, // Fullscreen needs focus trap
      requiresClickTracker: false, // Fullscreen doesn't need outside click tracking
      requiresBodyScrollDisabled: true, // Fullscreen should disable body scroll
      shouldAdjustFocus: true, // Fullscreen should manage focus
      shouldCloseInLayers: true, // Fullscreen should participate in layer management
      matchWidth: false, // Fullscreen doesn't match trigger width
    };
  }

  // Inherit all input event handling from InputBehavior
  // The setup, cleanup, and event handlers are all inherited
  // Only the configuration changes for fullscreen presentation
}
