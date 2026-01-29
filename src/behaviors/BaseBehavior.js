/**
 * Base class for all layover behaviors
 * Defines the interface and common functionality for behavior configurations
 */
export class BaseBehavior {
  constructor(component, featureManager) {
    this.component = component;
    this.featureManager = featureManager;
  }

  /**
   * Configuration for this behavior
   * Override in subclasses to define behavior-specific settings
   */
  get config() {
    return {
      type: "manual",
      requiresPositioning: false,
      requiresFocusTrap: true,
      requiresClickTracker: false,
      requiresBodyScrollDisabled: false,
      shouldAdjustFocus: true,
      shouldCloseInLayers: false,
      matchWidth: false,
    };
  }

  /**
   * Setup method called when behavior is activated
   * Override in subclasses for behavior-specific setup
   */
  setup() {
    // Base implementation - subclasses can override
  }

  /**
   * Cleanup method called when behavior is deactivated
   * Override in subclasses for behavior-specific cleanup
   */
  cleanup() {
    // Base implementation - subclasses can override
  }

  /**
   * Show method called when layover is shown
   * Override in subclasses for behavior-specific show logic
   */
  onShow({ internal = false } = {}) {
    // Base implementation - subclasses can override
  }

  /**
   * Hide method called when layover is hidden
   * Override in subclasses for behavior-specific hide logic
   */
  onHide() {
    // Base implementation - subclasses can override
  }
}
