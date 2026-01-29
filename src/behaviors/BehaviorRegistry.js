import { DialogBehavior } from "./DialogBehavior.js";
import { DropdownBehavior } from "./DropdownBehavior.js";
import { FullscreenBehavior } from "./FullscreenBehavior.js";
import { InputBehavior } from "./InputBehavior.js";
import { InputFullscreenBehavior } from "./InputFullscreenBehavior.js";
import { TooltipBehavior } from "./TooltipBehavior.js";

/**
 * Registry for all available behaviors
 * Maps behavior names to their implementation classes
 */
export class BehaviorRegistry {
  static behaviors = new Map([
    ["input", InputBehavior],
    ["input-dropdown", InputBehavior],
    ["input-fullscreen", InputFullscreenBehavior],
    ["tooltip", TooltipBehavior],
    ["dialog", DialogBehavior],
    ["dialog-fullscreen", FullscreenBehavior],
    ["dropdown", DropdownBehavior],
  ]);

  /**
   * Creates a behavior instance for the given behavior type
   * @param {string} behaviorType - The type of behavior to create
   * @param {Object} component - The component instance
   * @param {Object} featureManager - The feature manager instance
   * @returns {BaseBehavior} The behavior instance
   */
  static createBehavior(behaviorType, component, featureManager) {
    const BehaviorClass = BehaviorRegistry.behaviors.get(behaviorType);

    if (!BehaviorClass) {
      console.warn(`AuroLayover: Unknown behavior type "${behaviorType}"`);
      return new DialogBehavior(component, featureManager); // Default fallback
    }

    return new BehaviorClass(component, featureManager);
  }

  /**
   * Gets the configuration for a behavior type without instantiating
   * @param {string} behaviorType - The type of behavior
   * @param {Object} component - The component instance
   * @param {Object} featureManager - The feature manager instance
   * @returns {Object} The behavior configuration
   */
  static getBehaviorConfig(behaviorType, component, featureManager) {
    const behavior = BehaviorRegistry.createBehavior(
      behaviorType,
      component,
      featureManager,
    );
    return behavior.config;
  }
}
