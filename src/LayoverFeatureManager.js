import { BodyScrollFeature } from "./features/BodyScrollFeature.js";
import { ClickTrackingFeature } from "./features/ClickTrackingFeature.js";
import { FocusManagementFeature } from "./features/FocusManagementFeature.js";
import { FocusTrapFeature } from "./features/FocusTrapFeature.js";
import { LayerManagementFeature } from "./features/LayerManagementFeature.js";
import { PositioningFeature } from "./features/PositioningFeature.js";
import { WidthMatchingFeature } from "./features/WidthMatchingFeature.js";
import { LayerManager } from "./LayerManager.js";

/**
 * LayoverFeatureManager
 *
 * Manages all cross-cutting features for AuroLayover components using composed feature classes.
 * Each feature is a simple class that handles its own dependencies and lifecycle.
 */
export class LayoverFeatureManager {
  constructor(component) {
    this.component = component;
    this.layerManager = new LayerManager();

    // Composed feature instances
    this.positioning = new PositioningFeature(component, this);
    this.focusTrap = new FocusTrapFeature(component, this);
    this.clickTracking = new ClickTrackingFeature(component, this);
    this.bodyScroll = new BodyScrollFeature(component, this);
    this.widthMatching = new WidthMatchingFeature(component, this);
    this.layerManagement = new LayerManagementFeature(component, this);
    this.focusManagement = new FocusManagementFeature(component, this);
  }

  /**
   * Main entry point for managing all features based on behavior and operation
   * @param {Object} options - Configuration options
   * @param {string} options.behavior - The behavior type
   * @param {Object} options.behaviorConfig - The behavior configuration object
   * @param {string} options.operation - "attach" or "detach"
   * @param {Object} options.context - Additional context
   */
  manageFeatures({ behavior, behaviorConfig, operation, context = {} }) {
    switch (operation) {
      case "attach":
        this.#attachFeatures(behavior, behaviorConfig, context);
        break;
      case "detach":
        this.#detachFeatures(behavior, behaviorConfig, context);
        break;
      default:
        console.warn(`FeatureManager: Unknown operation "${operation}"`);
    }
  }

  /**
   * Attaches all features needed based on behavior configuration
   * @param {string} behavior
   * @param {Object} behaviorConfig
   * @param {Object} context
   */
  #attachFeatures(behavior, behaviorConfig, context) {
    // Attach each feature - they handle their own conditional logic
    this.layerManagement.attach(behaviorConfig, context);
    this.clickTracking.attach(behaviorConfig, context);
    this.bodyScroll.attach(behaviorConfig, context);
    this.positioning.attach(behaviorConfig, context);
    this.focusTrap.attach(behaviorConfig, context);
    this.widthMatching.attach(behaviorConfig, context);
    this.focusManagement.attach(behaviorConfig, context);

    // Show popover (unless internal)
    if (!context.internal && this.component.popover) {
      this.component.popover.showPopover();
    }
  }

  /**
   * Detaches all features for the given behavior
   * @param {string} behavior
   * @param {Object} behaviorConfig
   * @param {Object} context
   */
  #detachFeatures(behavior, behaviorConfig, context) {
    // Detach all features
    this.layerManagement.detach(behaviorConfig, context);
    this.clickTracking.detach(behaviorConfig, context);
    this.bodyScroll.detach(behaviorConfig, context);
    this.positioning.detach(behaviorConfig, context);
    this.focusTrap.detach(behaviorConfig, context);
    this.widthMatching.detach(behaviorConfig, context);
    this.focusManagement.detach(behaviorConfig, context);

    // Hide popover
    if (this.component.popover) {
      this.component.popover.hidePopover();
    }
  }

  /**
   * Clean up all features
   * @returns {void}
   */
  cleanup() {
    this.positioning.cleanup();
    this.focusTrap.cleanup();
    this.clickTracking.cleanup();
    this.bodyScroll.cleanup();
    this.widthMatching.cleanup();
    this.layerManagement.cleanup();
  }

  /**
   * Delegation methods for features to communicate back to the component
   * This maintains proper encapsulation: Feature -> FeatureManager -> Component
   */

  /**
   * Request to hide the component (called by features)
   */
  requestHide() {
    this.component.hide();
  }

  /**
   * Request layered hide with callback (called by ClickTrackingFeature)
   */
  requestLayeredHide() {
    this.layerManager.hideLayer(this.component, () => this.requestHide());
  }

  /**
   * Request to add component to layer stack (called by LayerManagementFeature)
   */
  requestAddToLayer() {
    this.layerManager.addLayer(this.component);
  }

  /**
   * Request to remove component from layer stack (called by LayerManagementFeature)
   */
  requestRemoveFromLayer() {
    this.layerManager.removeLayer(this.component);
  }
}
