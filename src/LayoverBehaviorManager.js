/**
 * LayoverBehaviorManager
 *
 * Manages the behavior-specific logic for AuroLayover components.
 * This class encapsulates all behavior transitions, event handling,
 * and state management related to different layover behaviors.
 */

import { BehaviorRegistry } from "./behaviors/BehaviorRegistry.js";

export class LayoverBehaviorManager {
  constructor(component, featureManager) {
    this.component = component;
    this.featureManager = featureManager;

    // Current active behavior instance
    this.currentBehavior = null;
  }

  /**
   * Calculates the type of the popover based on its behavior
   * @param {string} behavior
   * @returns {string} - The type of the popover
   */
  #calcType(behavior) {
    const config = BehaviorRegistry.getBehaviorConfig(
      behavior,
      this.component,
      this.featureManager,
    );
    return config.type;
  }

  /**
   * Centralized method to manage behavior transitions and state
   * @param {string} newBehavior - The behavior to transition to
   * @returns {void}
   * @private
   */
  #manageBehavior(newBehavior = this.component.behavior) {
    // Set the new behavior state
    this.component._currentBehaviorState = newBehavior;

    // First, clean up any existing behavior
    this.#cleanupCurrentBehavior();

    // Create and configure the new behavior
    this.currentBehavior = BehaviorRegistry.createBehavior(
      newBehavior,
      this.component,
      this.featureManager,
    );

    // Store the behavior config on the component for feature manager access
    this.component._currentBehaviorConfig = this.currentBehavior.config;

    // Set the type based on the new behavior configuration
    this.component.type = this.currentBehavior.config.type;

    // Setup the new behavior
    this.currentBehavior.setup();
  }

  /**
   * Cleans up the current behavior implementation
   * @returns {void}
   * @private
   */
  #cleanupCurrentBehavior() {
    // Clean up current behavior if it exists
    if (this.currentBehavior) {
      this.currentBehavior.cleanup();
      this.currentBehavior = null;
    }

    // Clean up features through the feature manager
    this.featureManager.cleanup();
  }

  /**
   * Public interface to manage behavior changes
   * @param {string} newBehavior
   */
  changeBehavior(newBehavior) {
    this.setBehavior(newBehavior);
  }

  /**
   * Public interface to clean up current behavior
   */
  cleanup() {
    this.#cleanupCurrentBehavior();
  }

  /**
   * Handles the show operation by coordinating behavior and features
   * @param {Object} options - Show options
   * @param {boolean} options.internal - Whether this is an internal call
   */
  show({ internal = false } = {}) {
    // Set up the behavior
    this.#manageBehavior(this.component.behavior);

    // Let the behavior handle show logic
    if (this.currentBehavior) {
      this.currentBehavior.onShow({ internal });
    }

    // Let the feature manager handle all feature coordination using behavior config
    this.featureManager.manageFeatures({
      behavior: this.component.behavior,
      behaviorConfig: this.currentBehavior.config,
      operation: "attach",
      context: { internal },
    });
  }

  /**
   * Handles the hide operation by coordinating behavior and features
   */
  hide() {
    // Let the behavior handle hide logic
    if (this.currentBehavior) {
      this.currentBehavior.onHide();
    }

    // Let the feature manager handle all feature coordination
    this.featureManager.manageFeatures({
      behavior: this.component.behavior,
      behaviorConfig: this.currentBehavior?.config,
      operation: "detach",
    });
  }

  /**
   * Public interface to set behavior
   * @param {string} behavior
   */
  setBehavior(behavior) {
    this.#manageBehavior(behavior);
  }
}
