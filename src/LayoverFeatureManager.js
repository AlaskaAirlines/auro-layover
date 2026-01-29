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
   * @param {Object} options.behaviorConfig - The behavior configuration object
   * @param {string} options.operation - "attach" or "detach"
   * @param {Object} options.context - Additional context
   */
  manageFeatures({ behaviorConfig, operation, context = {} }) {
    switch (operation) {
      case "attach":
        this.#attachFeatures(behaviorConfig, context);
        break;
      case "detach":
        this.#detachFeatures(behaviorConfig, context);
        break;
      default:
        console.warn(`FeatureManager: Unknown operation "${operation}"`);
    }
  }

  /**
   * Attaches all features needed based on behavior configuration
   * @param {Object} behaviorConfig
   * @param {Object} context
   */
  #attachFeatures(behaviorConfig, context) {
    // Attach each feature - they handle their own conditional logic
    this.layerManagement.attach(behaviorConfig);
    this.clickTracking.attach(behaviorConfig);
    this.bodyScroll.attach(behaviorConfig);
    this.positioning.attach(behaviorConfig);
    this.focusTrap.attach(behaviorConfig);
    this.widthMatching.attach(behaviorConfig);
    this.focusManagement.attach(behaviorConfig, context);

    // Show popover (unless internal)
    if (!context.internal && this.component.popover) {
      this.component.popover.showPopover();
    }
  }

  /**
   * Detaches all features for the given behavior
   * @param {Object} behaviorConfig
   * @param {Object} context
   */
  #detachFeatures(behaviorConfig, context) {
    // Detach all features
    this.layerManagement.detach();
    this.clickTracking.detach();
    this.bodyScroll.detach();
    this.positioning.detach();
    this.focusTrap.detach();
    this.widthMatching.detach();
    this.focusManagement.detach(behaviorConfig);

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
