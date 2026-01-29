/**
 * LayoverBehaviorManager
 *
 * Manages the behavior-specific logic for AuroLayover components.
 * This class encapsulates all behavior transitions, event handling,
 * and state management related to different layover behaviors.
 */

import { LayerManager } from "./LayerManager";

const INPUT_TYPES = ["input", "input-fullscreen", "input-dropdown"];
const DIALOG_TYPES = ["dialog", "dialog-fullscreen"];
const DROPDOWN_TYPES = ["dropdown"];
const TOOLTIP_TYPES = ["tooltip"];

const _NO_INPUT_ERROR =
  "\nAuroLayover: The input behavior requires an input element to be passed to the trigger slot.\n\nExample:\n<auro-layover>\n\t<auro-input slot='trigger'></auro-input>\n</auro-layover>\n";
const _MULTIPLE_TRIGGER_ELEMENTS_ERROR =
  "\nAuroLayover: The input behavior requires a single trigger element to be passed to the trigger slot.\n\nExample:\n<auro-layover>\n\t<auro-button slot='trigger'>Click me</auro-button>\n</auro-layover>\n\nPassing more than one element may lead to undesireable behavior.\n";
const _TEXT_NODE_IN_TRIGGER_SLOT_ERROR =
  "\nAuroLayover: The trigger slot should not contain text nodes.\n\nExample:\n<auro-layover>\n\t<auro-button slot='trigger'>Click me</auro-button>\n</auro-layover>\n";

export class LayoverBehaviorManager {
  constructor(component, featureManager) {
    this.component = component;
    this.featureManager = featureManager;
    this.layerManager = new LayerManager();
  }

  /**
   * Calculates the type of the popover based on its behavior
   * @param {string} behavior
   * @returns {string} - The type of the popover, either "manual", "auto", or "hint"
   */
  _calcType(behavior) {
    switch (true) {
      case TOOLTIP_TYPES.includes(behavior):
        return "hint";

      case INPUT_TYPES.includes(behavior):
      case DIALOG_TYPES.includes(behavior):
      case DROPDOWN_TYPES.includes(behavior):
        return "manual";

      default:
        return "manual"; // Default fallback
    }
  }

  /**
   * Centralized method to manage behavior transitions and state
   * Called whenever behavior changes or when component needs reconfiguration
   * Note that some of these calls are reinforced in the show and hide methods
   * @param {string} newBehavior - The behavior to transition to
   * @param {boolean} force - Whether to force reconfiguration even if behavior hasn't changed
   * @returns {void}
   * @private
   */
  _manageBehavior(newBehavior = this.component.behavior) {
    // Set the new behavior state
    this.component._currentBehaviorState = newBehavior;

    // First, clean up any existing behavior
    this._cleanupCurrentBehavior();

    // Set the type based on the new behavior
    this.component.type = this._calcType(newBehavior);

    // Configure the new behavior
    switch (newBehavior) {
      case "input":
      case "input-dropdown":
      case "input-fullscreen":
        this._bindToInput();
        break;

      case "dropdown":
        // Only set up positioning if we're already shown
        if (this.component.shown) this.featureManager.attachPopoverPositioner();
        break;

      case "tooltip":
        // Configure tooltip behavior
        this.component.showOnHover = true;
        this._bindHover();

        // Only set up positioning if we're already shown
        if (this.component.shown) this.featureManager.attachPopoverPositioner();
        break;

      case "dialog":
      case "dialog-fullscreen":
        break;

      default:
        console.warn(`AuroLayover: Unknown behavior type "${newBehavior}"`);
    }
  }

  /**
   * Cleans up the current behavior implementation
   * @returns {void}
   * @private
   */
  _cleanupCurrentBehavior() {
    // Detach all behavior-specific handlers
    this._detachInput();
    this._detachHover();

    // Clean up features through the feature manager
    this.featureManager.cleanup();
  }

  /**
   * Checks for an input element in the trigger slot
   * If no input is set, it tries to find the trigger element in the slot.
   * If it finds a valid input element, it sets it as the input element.
   * @returns {void}
   * @private
   * @throws {Error} If no input element is found after a timeout
   */
  _checkForInput() {
    // If no input is set, try to find the trigger element in the slot
    if (
      !this.component.input &&
      this.component._triggerElInSlot &&
      this.component._triggerElInSlot.tagName.toLowerCase().match("input")
    ) {
      // Set it as the input element if we found a valid input element
      this.component.input = this.component._triggerElInSlot;
    }

    // If we still don't have an input element, wait a bit to see if it appears
    if (!this.component.input) {
      setTimeout(() => {
        // If we still don't have an input element, throw an error
        if (!this.component.input) throw new Error(_NO_INPUT_ERROR);

        // Otherwise, if we have an input element, bind it to the popover
        this._bindToInput();
      }, 50);
    }
  }

  /**
   * Binds the input element in the trigger slot to the popover's input behavior
   * @returns {void}
   * @private
   */
  _bindToInput() {
    // Check for an input either set explicitly or in the trigger slot
    // It's a little confusing, but this sets this.input to the input element instead of returning it
    this._checkForInput();

    if (this.component.input) {
      // If you add an event listener here, you must also remove it in _detachInput
      // Input change handling.
      this.component.input.addEventListener("input", this._handleInputChange);

      // Focus handling.
      this.component.input.addEventListener("focus", this._handleInputFocus);

      // Blur handling.
      if (!["input-fullscreen"].includes(this.component.behavior)) {
        this.component.input.addEventListener("blur", this._handleInputBlur);
      }
    }
  }

  /**
   * Detaches the input element from the popover's input behavior
   * @returns {void}
   * @private
   */
  _detachInput() {
    const { input } = this.component;
    if (input) {
      input.removeEventListener("focus", this._handleInputFocus);
      input.removeEventListener("input", this._handleInputChange);
      input.removeEventListener("blur", this._handleInputBlur);
    }
  }

  /**
   * Binds hover events to the positioning target element
   * This is used for behaviors like tooltip where the popover should show on hover
   * @returns {void}
   * @private
   */
  _bindHover() {
    const el = this.component._triggerElInSlot;
    if (el) {
      el.addEventListener("mouseover", this._handleOnHover);
      el.addEventListener("mouseout", this._handleOnHoverLeave);
    }
  }

  /**
   * Detaches hover events from the positioning target element
   * @returns {void}
   * @private
   */
  _detachHover() {
    const el = this.component._triggerElInSlot;
    if (el) {
      el.removeEventListener("mouseover", this._handleOnHover);
      el.removeEventListener("mouseout", this._handleOnHoverLeave);
    }
  }

  /**
   * Checks if the input passes the value check based on the minimum input length
   * @param {HTMLElement} input
   * @returns {boolean}
   * @private
   */
  _inputPassesValueCheck = (input) => {
    // Check the input value against the minimum length
    const { value } = input;

    // If hideOnNoValue is not set, empty inputs are considered valid
    if ((!value || !value.length) && !this.component.hideOnNoValue) return true;

    // Do all other length checks
    return (
      (value && value.length >= this.component.minInputLength) ||
      !this.component.minInputLength ||
      this.component.minInputLength <= 0
    );
  };

  /**
   * Handles input changes, showing or hiding the popover based on the input value
   * @param {Event} event
   * @returns {void}
   * @private
   */
  _handleInputChange = (event) => {
    if (!this.component.showOnChange) return false;

    const input = event.target;
    this._inputPassesValueCheck(input)
      ? this.component.show()
      : this.component.hide();
  };

  /**
   * Handles input focus events, showing the popover if all conditions are met
   * @param {Event} event
   * @returns {void}
   * @private
   */
  _handleInputFocus = (event) => {
    if (!this.component.showOnFocus) return false;

    const input = event.target;
    if (
      // If the input has a minimum length and the value is valid and we should show on focus
      this._inputPassesValueCheck(input)
    )
      this.component.show();
  };

  /**
   * Handles input blur events, hiding the popover
   * @returns {void}
   * @private
   */
  _handleInputBlur = () => {
    this.component.hide();
  };

  /**
   * Handles hover events on the trigger element, showing the popover if showOnHover is true
   * @returns {void}
   * @private
   */
  _handleOnHover = () => {
    if (this.component.showOnHover) this.component.show();
  };

  /**
   * Handles hover leave events on the trigger element, hiding the popover if showOnHover is true
   * @returns {void}
   * @private
   */
  _handleOnHoverLeave = () => {
    if (this.component.showOnHover) this.component.hide();
  };

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
    this._cleanupCurrentBehavior();
  }

  /**
   * Handles the show operation by coordinating behavior and features
   * @param {Object} options - Show options
   * @param {boolean} options.internal - Whether this is an internal call
   */
  show({ internal = false } = {}) {
    // Set up the behavior
    this._manageBehavior(this.component.behavior);

    // Let the feature manager handle all feature coordination
    this.featureManager.manageFeatures({
      behavior: this.component.behavior,
      operation: "attach",
      context: { internal },
    });
  }

  /**
   * Handles the hide operation by coordinating behavior and features
   */
  hide() {
    // Let the feature manager handle all feature coordination
    this.featureManager.manageFeatures({
      behavior: this.component.behavior,
      operation: "detach",
    });
  }

  /**
   * Public interface to set behavior (replaces _manageBehavior for external calls)
   * @param {string} behavior
   */
  setBehavior(behavior) {
    this._manageBehavior(behavior);
  }
}
