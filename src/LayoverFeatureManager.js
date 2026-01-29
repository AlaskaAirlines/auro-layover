import { ClickTracker } from "@aurodesignsystem/auro-library/scripts/runtime/ClickTracker/ClickTracker.mjs";
import { FocusTrap } from "@aurodesignsystem/auro-library/scripts/runtime/FocusTrap/FocusTrap.mjs";
import { PopoverPositioner } from "@aurodesignsystem/auro-library/scripts/runtime/popover/positioner.js";

const INPUT_TYPES = ["input", "input-fullscreen", "input-dropdown"];
const TOOLTIP_TYPES = ["tooltip"];

/**
 * LayoverFeatureManager
 *
 * Manages all cross-cutting features for AuroLayover components.
 * This includes positioning, focus management, body scroll, click tracking, etc.
 * Features are controlled by behavior configuration but are not behavior-specific themselves.
 */
export class LayoverFeatureManager {
  constructor(component) {
    this.component = component;

    // Feature instances
    this._positioner = null;
    this._focusTrap = null;
    this._clickTracker = null;
    this._tabListener = false;
  }

  /**
   * Main entry point for managing all features based on behavior and operation
   * @param {Object} options - Configuration options
   * @param {string} options.behavior - The behavior type
   * @param {string} options.operation - "attach" or "detach"
   * @param {Object} options.context - Additional context (e.g., {internal: false} for show)
   */
  manageFeatures({ behavior, operation, context = {} }) {
    switch (operation) {
      case "attach":
        this._attachFeatures(behavior, context);
        break;
      case "detach":
        this._detachFeatures(behavior, context);
        break;
      default:
        console.warn(`FeatureManager: Unknown operation "${operation}"`);
    }
  }

  /**
   * Attaches all features needed for the given behavior
   * @param {string} behavior
   * @param {Object} context
   */
  _attachFeatures(behavior, context) {
    // Layer management and click tracking
    if (this.shouldCloseInLayers(behavior)) {
      this.component._behaviorManager.layerManager.addLayer(this.component);
      this.attachClickTracker();
    }

    // Width matching
    this.matchPopoverToTriggerWidth();

    // Body scroll control
    this.disableBodyScroll();

    // Positioning
    if (this.shouldPosition(behavior)) {
      this.attachPopoverPositioner();
    } else {
      this.detachPopoverPositioner();
    }

    // Focus management
    this.focusPopover();
    this.attachFocusTrap();

    // Show popover (unless internal)
    if (!context.internal) {
      this.component.popover.showPopover();
    }
  }

  /**
   * Detaches all features for the given behavior
   * @param {string} behavior
   * @param {Object} context
   */
  _detachFeatures(behavior, context) {
    // Layer management
    this.component._behaviorManager.layerManager.removeLayer(this.component);

    // Feature cleanup
    this.detachClickTracker();
    this.resetBodyScroll();
    this.detachPopoverPositioner();
    this.detachFocusTrap();
    this.detachTabListener();

    // Hide popover
    this.component.popover.hidePopover();

    // Focus management
    this.focusTrigger();
  }

  /**
   * Determines if positioning should be enabled based on behavior
   * @param {string} behavior
   * @returns {boolean}
   */
  shouldPosition(behavior) {
    return ["dropdown", "tooltip", "input", "input-dropdown"].includes(
      behavior,
    );
  }

  /**
   * Determines if focus trap should be attached based on behavior
   * @param {string} behavior
   * @returns {boolean}
   */
  shouldAttachFocusTrap(behavior) {
    return (
      !this._focusTrap &&
      !["input", "input-dropdown", ...TOOLTIP_TYPES].includes(behavior)
    );
  }

  /**
   * Determines if layover should close in layers based on behavior
   * @param {string} behavior
   * @returns {boolean}
   */
  shouldCloseInLayers(behavior) {
    return ["dialog", "dialog-fullscreen", "dropdown"].includes(behavior);
  }

  /**
   * Determines if focus should be adjusted based on behavior
   * @param {string} behavior
   * @returns {boolean}
   */
  shouldAdjustFocus(behavior) {
    return ![...INPUT_TYPES, ...TOOLTIP_TYPES].includes(behavior);
  }

  /**
   * Determines if body scroll should be disabled based on behavior
   * @param {string} behavior
   * @returns {boolean}
   */
  shouldDisableBodyScroll(behavior) {
    return ["dialog"].includes(behavior) && !this.component.allowBodyScroll;
  }

  /**
   * Attaches popover positioning
   * @returns {void}
   */
  attachPopoverPositioner() {
    if (this.component._positioningTarget && this.component.popover) {
      this._positioner = new PopoverPositioner({
        target: this.component._positioningTarget,
        popover: this.component.popover,
        options: this.component._dropdownOptions,
        onPlacementChange: this.#onPlacementChange,
      });
    }
  }

  /**
   * Detaches popover positioning
   * @returns {void}
   */
  detachPopoverPositioner() {
    this.resetPositionStyles();
    if (this._positioner) {
      this._positioner.disconnect();
      this._positioner = null;
    }
  }

  /**
   * Resets position styles
   * @returns {void}
   */
  resetPositionStyles() {
    if (!this.component.popover) return;
    this.component.popover.style.margin = null;
    this.component.popover.style.position = null;
    this.component.popover.style.top = null;
    this.component.popover.style.left = null;
  }

  /**
   * Handles placement changes from the positioner
   * @param {Object} placement data
   * @returns {void}
   */
  #onPlacementChange = ({ placement, arrowDirection, side }) => {
    this.component.currentPlacement = placement;
    this.component.currentArrowDirection = arrowDirection;
    this.component.currentSide = side;
  };

  /**
   * Attaches focus trap
   * @returns {void}
   */
  attachFocusTrap() {
    if (this.shouldAttachFocusTrap(this.component.behavior)) {
      this._focusTrap = new FocusTrap(this.component.popover, true);
      this.attachTabListener();
    }
  }

  /**
   * Detaches focus trap
   * @returns {void}
   */
  detachFocusTrap() {
    if (this._focusTrap) {
      this._focusTrap.disconnect();
      this._focusTrap = null;
    }
  }

  /**
   * Attaches tab listener
   * @returns {void}
   */
  attachTabListener() {
    this._tabListener = true;
    this.component.addEventListener("keydown", this._handleFirstTab);
  }

  /**
   * Detaches tab listener
   * @returns {void}
   */
  detachTabListener() {
    this.component.removeEventListener("keydown", this._handleFirstTab);
    this._tabListener = false;
  }

  /**
   * Handles first tab key press
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  _handleFirstTab = (e) => {
    if (e.key === "Tab") {
      // Guard Clause: Ensure focus trap exists
      if (!this._focusTrap) return;

      // Get the direction of the tab (forward or backward)
      const { shiftKey } = e;
      const direction = shiftKey ? "backward" : "forward";

      // Wait for the browser to try to control the focus, then override it
      // This is needed to ensure the focus trap works consistently across browsers
      setTimeout(() => {
        // Shift focus according to the tab direction
        direction === "forward"
          ? this._focusTrap.focusFirstElement()
          : this._focusTrap.focusLastElement();
      });

      // Detach the tab listener after the first tab event
      this.detachTabListener();
    }
  };

  /**
   * Attaches click tracker for outside clicks
   * @returns {void}
   */
  attachClickTracker() {
    this._clickTracker = null;
    this._clickTracker = new ClickTracker({
      target: this.component.popover,
      onOuterClick: (event) => this.hideInLayers({ event }),
    });
  }

  /**
   * Handles the layered closing of layovers to prevent interference between multiple open layovers
   * @param {Object} options - Options for hiding
   * @param {boolean} options.internal - Whether this is an internal call
   * @param {Event} options.event - The event that triggered the hide (optional)
   * @returns {void}
   */
  hideInLayers({ event = null } = {}) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.component._behaviorManager.layerManager.hideLayer(this.component, () =>
      this.component.hide(),
    );
  }

  /**
   * Detaches click tracker
   * @returns {void}
   */
  detachClickTracker() {
    this._clickTracker?.disconnect();
    this._clickTracker = null;
  }

  /**
   * Disables body scroll
   * @returns {void}
   */
  disableBodyScroll() {
    if (this.shouldDisableBodyScroll(this.component.behavior)) {
      document.documentElement.style.overflow = "hidden";
    }
  }

  /**
   * Resets body scroll
   * @returns {void}
   */
  resetBodyScroll() {
    document.documentElement.style.overflow = null;
  }

  /**
   * Matches popover width to trigger width
   * @returns {void}
   */
  matchPopoverToTriggerWidth() {
    // If this.matchWidth is false, make sure the width isn't being set and then exit
    if (!this.component.matchWidth) {
      this.component.popover.style.width = null;
      return;
    }

    // Set the popover width to match the trigger element's width
    const triggerEl = this.component._triggerElInSlot || this.component.button;
    const { width } = triggerEl?.getBoundingClientRect() || {};
    this.component.popover.style.width = width ? `${width}px` : "auto";
  }

  /**
   * Focuses the popover element
   * @returns {void}
   */
  focusPopover() {
    if (this.shouldAdjustFocus(this.component.behavior)) {
      this.component.popover.focus({ preventScroll: true });
    }
  }

  /**
   * Focuses the trigger element
   * @returns {void}
   */
  focusTrigger() {
    if (this.shouldAdjustFocus(this.component.behavior)) {
      // Get and focus the trigger element
      const focusEl = this.component._triggerElInSlot || this.component.button;
      focusEl?.focus({ preventScroll: true });
    }
  }

  /**
   * Clean up all features
   * @returns {void}
   */
  cleanup() {
    this.detachPopoverPositioner();
    this.detachFocusTrap();
    this.detachTabListener();
    this.detachClickTracker();
    this.resetBodyScroll();
    this.resetPositionStyles();
  }
}
