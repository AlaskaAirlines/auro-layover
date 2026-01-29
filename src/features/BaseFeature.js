/**
 * Simple base class for feature consistency
 * Optional to extend, just provides structure guidance
 */
export class BaseFeature {
  constructor(component, featureManager) {
    this.component = component;
    this.featureManager = featureManager;
  }

  /**
   * Attach the feature
   * @param {Object} behaviorConfig - The behavior configuration
   * @param {Object} context - Additional context
   */
  attach(behaviorConfig, context = {}) {
    throw new Error("Feature must implement attach method");
  }

  /**
   * Detach the feature
   * @param {Object} behaviorConfig - The behavior configuration
   * @param {Object} context - Additional context
   */
  detach(behaviorConfig, context = {}) {
    throw new Error("Feature must implement detach method");
  }

  /**
   * Clean up resources
   */
  cleanup() {
    // Override if cleanup needed
  }
}
