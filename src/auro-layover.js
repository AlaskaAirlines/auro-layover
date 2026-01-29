import { StringBoolean } from "@aurodesignsystem/auro-library/scripts/runtime/lit-converters/string-boolean.js";
import AuroLibraryRuntimeUtils from "@aurodesignsystem/auro-library/scripts/utils/runtimeUtils.mjs";
import { html, LitElement } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { createRef, ref } from "lit/directives/ref.js";
import { LayoverBehaviorManager } from "./LayoverBehaviorManager";
import { LayoverFeatureManager } from "./LayoverFeatureManager";

import styles from "./styles/style.scss";

const _DEFAULTS = {
  disabled: false,
  type: "manual",
  behavior: "dropdown",
  showOnHover: false,
  showOnFocus: true,
  showOnChange: true,
  useHide: true,
  useFlip: true,
  offset: 0,
  useAutoPlacement: false,
  placement: "bottom-start",
  inline: false,
  shown: false,
  hideOnNoValue: true,
};

const _POSITIONER_DEFAULTS = {
  offset: 0,
  placement: "bottom-start",
  strategy: "absolute",
};

const _MULTIPLE_TRIGGER_ELEMENTS_ERROR =
  "\nAuroLayover: The input behavior requires a single trigger element to be passed to the trigger slot.\n\nExample:\n<auro-layover>\n\t<auro-button slot='trigger'>Click me</auro-button>\n</auro-layover>\n\nPassing more than one element may lead to undesireable behavior.\n";
const _TEXT_NODE_IN_TRIGGER_SLOT_ERROR =
  "\nAuroLayover: The trigger slot should not contain text nodes.\n\nExample:\n<auro-layover>\n\t<auro-button slot='trigger'>Click me</auro-button>\n</auro-layover>\n";

/**
 * AuroLayover is a web component that provides a customizable popover element with composed behavior management.
 * It supports various behaviors such as dialog, dropdown, tooltip, and input.
 * @fires auro-layover-shown - Fired when the layover is shown. Event detail contains {target: AuroLayover, newState: "shown"}.
 * @fires auro-layover-hidden - Fired when the layover is hidden. Event detail contains {target: AuroLayover, newState: "hidden"}.
 * @fires auro-layover-change - Fired when the layover's visibility state changes. Event detail contains {target: AuroLayover, newState: string} where newState is either "shown" or "hidden".
 */
export class AuroLayover extends LitElement {
  /** STATIC METHODS **/
  // Utility methods that can be used without instantiating the class

  static register(name = "auro-layover") {
    AuroLibraryRuntimeUtils.prototype.registerComponent(name, AuroLayover);
  }

  /** CONSTRUCTOR **/
  constructor() {
    super();

    this.#setDefaults(_DEFAULTS);
    this.#createElementRefs();
    this._runtimeUtils = new AuroLibraryRuntimeUtils();
    this._featureManager = new LayoverFeatureManager(this);
    this._behaviorManager = new LayoverBehaviorManager(
      this,
      this._featureManager,
    );
  }

  /** INIT METHODS **/
  // These methods are called from the constructor when the component is initialized

  /** Creates refs for elements in the template @returns {void} @private */
  #createElementRefs() {
    // A reference to the popover element itself
    this._popoverRef = createRef();

    // A reference to the internal arrow element
    this._arrowElRef = createRef();

    // A reference to the internal arrow slot element
    this._arrowSlotRef = createRef();

    // The internal button that wraps the trigger slot (dialog and dropdown behaviors)
    this._buttonRef = createRef();

    // A reference to the positioning target element, this wraps the trigger slot for exact positioning
    this._positioningTargetRef = createRef();

    // A reference to the trigger slot element
    this._triggerSlotRef = createRef();
  }

  /**
   * Sets the default values of the component during startup
   * @param {object} defaults - The default values to set
   * @returns {void}
   * @private
   * */
  #setDefaults(defaults) {
    Object.keys(defaults).forEach((key) => {
      if (this[key] === undefined) this[key] = defaults[key];
    });
  }

  /** PROPERTIES AND PUBLIC GETTERS **/
  // Publicly accessible properties and getters for the component

  static get properties() {
    return {
      /** Allow scrolling of the body when the dialog is open */
      allowBodyScroll: {
        type: Boolean,
        reflect: true,
        converter: StringBoolean,
      },

      /** Whether or not the layover is disabled (show/hide should be fully disabled) */
      disabled: { type: Boolean, reflect: true },

      /** The title of the layover - REQUIRED FOR A11Y */
      title: { type: String, reflect: false },

      /** The type of layover, e.g., "manual", "auto", or "hint" */
      type: { type: String, reflect: false },

      /** The behavior of the popover, "dialog", "dialog-fullscreen", "dropdown", "tooltip", or "input", "input-fullscreen", "input-dropdown" */
      behavior: { type: String, reflect: true },

      /** The offset distance of the layover */
      offset: { type: Number, reflect: false },

      /** The position of the layover, e.g., "bottom-start", "top-end" etc. (do not use with useAutoPlacement) */
      placement: { type: String, reflect: false },

      /** Whether the layover should show on hover */
      showOnHover: { type: Boolean, reflect: false },

      /** Whether the layover should open on focus (input behavior only) */
      showOnFocus: { type: String, reflect: false, converter: StringBoolean },

      /** Whether the layover should show on change (input behavior only) */
      showOnChange: { type: String, reflect: false, converter: StringBoolean },

      /** Whether or not the layover should close when there is no value (input behavior only) */
      hideOnNoValue: { type: String, reflect: false, converter: StringBoolean },

      /** Whether the layover is shown or not */
      shown: { type: Boolean, reflect: true },

      /** Whether or not the popover should match the width of the trigger */
      matchWidth: { type: Boolean, reflect: false, converter: StringBoolean },

      /** The minimum number of characters the user must type before the popover is shown */
      minInputLength: { type: Number, reflect: false },

      /** Whether or not to use the hide behavior (hides element when trigger is not visible) */
      useHide: { type: String, reflect: false, converter: StringBoolean },

      /** Whether or not to use automatic placement for the layover (do not use with placement) */
      useAutoPlacement: {
        type: String,
        reflect: false,
        converter: StringBoolean,
      },

      /** Whether or not to use the flip behavior (flips the element when it goes off-screen) */
      useFlip: { type: String, reflect: false, converter: StringBoolean },

      /** Whether or not the layover should try to align to an inline element like a hyperlink */
      inline: { type: String, reflect: false, converter: StringBoolean },

      /**
       * INTERNAL STATE PROPERTIES
       */

      /** A reference to the input to attach to for input behavior @private */
      input: { type: Object, state: true },

      /** Whether the layover is open or not @private */
      open: { type: Boolean, reflect: false, state: true },

      /** Whether the trigger slot contains any elements @private */
      hasTriggerContent: { type: Boolean, reflect: false, state: true },

      /** Internal state tracking the current behavior implementation @private */
      currentBehaviorState: { type: String, state: true },

      /** current placement of the layover (e.g., "bottom-start", "top-end") @private */
      currentPlacement: { type: String, state: true },

      /** current direction of the arrow (e.g., "top", "bottom", "left", "right") @private */
      currentArrowDirection: { type: String, state: true },

      /** current side of the layover (e.g., "top", "bottom", "left", "right") @private */
      currentSide: { type: String, state: true },
    };
  }

  static get styles() {
    return [styles];
  }

  /**
   * A reference to the popover component's internal button element (trigger)
   * @returns {HTMLButtonElement} The button element that wraps the trigger slot
   */
  get button() {
    return this._buttonRef.value;
  }

  /**
   * A reference to the popover component's internal popover element
   * @returns {HTMLElement} The popover element that contains the content
   */
  get popover() {
    return this._popoverRef.value;
  }

  /**
   * A reference to the popover component's internal arrow element
   * @returns {HTMLElement} The arrow element that points to the trigger
   */
  get arrow() {
    return this._arrowElRef.value;
  }

  /** PUBLIC METHODS **/
  // Public methods that can be called on the component instance

  /**
   * Toggles the visibility of the layover.
   * @returns {void}
   */
  toggle() {
    this.open ? this.hide() : this.show();
  }

  /**
   * Shows the popover
   * @returns {void}
   * @private
   */
  show({ internal = false } = {}) {
    if (!this.popover || this.disabled) return;

    // Let the behavior manager handle all show logic and feature coordination
    this._behaviorManager.show({ internal });

    // The popover is positioned and ready, so we can set shown to true
    this.shown = true;

    // Dispatch relevant events
    this._dispatchShowEvent();
  }

  /**
   * Shows the popover
   * @returns {void}
   * @private
   */
  hide() {
    if (!this.popover || this.disabled) return;

    // Let the behavior manager handle all hide logic and feature coordination
    this._behaviorManager.hide();

    // Update shown to hide the popover via styles
    this.shown = false;

    // Dispatch relevant events
    this._dispatchHideEvent();
  }

  /** LIFECYCLE METHODS **/
  // Attachments to the component lifecycle, such as connectedCallback, updated, etc.

  connectedCallback() {
    super.connectedCallback();
    this._runtimeUtils = new AuroLibraryRuntimeUtils();
    this._runtimeUtils.handleComponentTagRename(this, "auro-layover-composed");
  }

  updated(changedProperties) {
    // Infer input behavior if the input element changes
    if (["input"].some((prop) => changedProperties.has(prop))) {
      // Change to base input functionality if the user didn't already set it
      if (!!this.input && !this.behavior.match("input"))
        this.behavior = "input";
    }

    // If the behavior changes or trigger content changes, update behavior
    if (
      ["behavior", "hasTriggerContent", "input"].some((prop) =>
        changedProperties.has(prop),
      )
    ) {
      this._behaviorManager.setBehavior(this.behavior);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Clean up from global stack when component is disconnected
    if (window.auroLayoverStack) {
      const index = window.auroLayoverStack.indexOf(this);
      if (index !== -1) {
        window.auroLayoverStack.splice(index, 1);
      }
    }

    // Clear closing reference if this was the closing layover
    if (window.closingLayover === this) {
      window.closingLayover = null;
    }

    // Let the behavior manager handle all cleanup
    this._behaviorManager.cleanup();
  }

  /** PRIVATE GETTERS **/
  // Utility getters that return values based on internal state or properties

  /**
   * Generates the dropdown options based on internal properties and defined defaults
   * @private
   * @returns {object}
   */
  get _dropdownOptions() {
    const { placement, offset, inline, useHide, useAutoPlacement, useFlip } =
      this;
    return {
      ..._POSITIONER_DEFAULTS,
      arrowEl: this.arrow,
      placement,
      inline,
      useHide,
      useAutoPlacement,
      useFlip,

      // Fallback to measuring the arrow element height if no offset is provided
      offset: offset || this.arrow?.offsetHeight,
    };
  }

  /**
   * Gets the trigger slot element
   * @returns {HTMLSlotElement}
   * @private
   */
  get _triggerSlot() {
    return this._triggerSlotRef.value;
  }

  /**
   * Gets the positioning target element, which is the element that the popover will be positioned relative to
   * @returns {HTMLElement}
   * @private
   */
  get _positioningTarget() {
    return this._positioningTargetRef.value;
  }

  /**
   * Gets the trigger element in the slot
   */
  get _triggerElInSlot() {
    if (!this._triggerSlot) return undefined;

    // Get the assigned nodes from the trigger slot
    const nodes = this._triggerSlot.assignedNodes({ flatten: true });

    // Warn the user if they pass more than one element to the trigger slot
    if (nodes.length > 1) console.warn(_MULTIPLE_TRIGGER_ELEMENTS_ERROR);

    const el = nodes.find((node) => node.tagName); // Match any non-text node

    // If the user passes at least one element to the trigger slot but it doesn't pass our check, warn them
    if (nodes.length && !el) console.warn(_TEXT_NODE_IN_TRIGGER_SLOT_ERROR);

    // Return the first element that matches the tagName check, or undefined if no element is found
    return el ?? undefined;
  }

  /** EVENT HANDLERS AND DISPATCHERS **/
  // These methods handle events triggered by user interactions or other component changes

  /**
   * Dispatches an event indicating the popover has been shown.
   * Notifies listeners that the popover is now visible and emits a change event.
   * @fires auro-layover-shown
   * @returns {void}
   * @private
   */
  _dispatchShowEvent() {
    this.dispatchEvent(
      new CustomEvent("auro-layover-shown", {
        detail: { target: this, newState: "shown" },
        bubbles: true,
        composed: true,
      }),
    );

    this._dispatchChangeEvent({ state: "shown" });
  }

  /**
   * Dispatches an event indicating the popover has been hidden.
   * Notifies listeners that the popover is now hidden and emits a change event.
   * @fires auro-layover-hidden
   * @returns {void}
   * @private
   */
  _dispatchHideEvent() {
    this.dispatchEvent(
      new CustomEvent("auro-layover-hidden", {
        detail: { target: this, newState: "hidden" },
        bubbles: true,
        composed: true,
      }),
    );

    this._dispatchChangeEvent({ state: "hidden" });
  }

  /**
   * Dispatches an event indicating the popover's visibility state has changed.
   * Notifies listeners when the popover transitions between shown and hidden states.
   * @fires auro-layover-change
   * @param {Object} param - An object containing the shown state.
   * @returns {void}
   * @private
   */
  _dispatchChangeEvent({ state }) {
    this.dispatchEvent(
      new CustomEvent("auro-layover-change", {
        detail: { target: this, newState: state },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Dispatches an event indicating the popover's visibility state is about to change.
   * Notifies listeners when the popover transitions between shown and hidden states.
   * @fires auro-layover-change
   * @param {Object} param - An object containing the shown state.
   * @returns {void}
   * @private
   */
  _dispatchBeforeChangeEvent({ state }) {
    this.dispatchEvent(
      new CustomEvent("auro-layover-beforechange", {
        detail: { target: this, newState: state },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Handles changes to the trigger slot, adjusting the type if necessary
   * @returns {void}
   * @private
   * */
  _handleTriggerSlotChange() {
    // Get assigned nodes from the trigger slot
    const nodes = this._triggerSlot.assignedNodes({ flatten: true });

    // Force auto state if the user passes something to the trigger slot
    this.hasTriggerContent = !!(nodes.length > 0);
  }

  /**
   * Runs before the popover is toggled by the browser
   * Handles the first part of the layered closing functionality
   * @param {Event} event - The event triggered by the popover toggle
   * @returns {void}
   * @private
   */
  _handlePopoverBeforeToggle(event) {
    const isOpening = event.newState === "open";

    // Handle opening
    if (isOpening) {
      this._dispatchBeforeChangeEvent({ state: "shown" });
      return;
    }

    // Handle closing with layered management
    if (!isOpening) {
      this._dispatchBeforeChangeEvent({ state: "hidden" });
      return;
    }
  }

  /**
   * Handles the popover toggle event, managing layered closing behavior
   * @param {Event} event - the popover toggle event
   * @returns {void}
   */
  _handlePopoverToggle(event) {
    const isOpening = event.newState === "open";

    // Handle opening
    if (isOpening) {
      this.show({ internal: true });
      return;
    }

    // We don't need to handle closing state because all popovers are now manual so we are internally triggering all closes already
  }

  /** RENDER METHODS **/
  // These methods return the template for the component, including slots and elements

  /**
   * Renders the trigger slot for the trigger element
   * @returns {TemplateResult}
   * @private
   */
  _renderTriggerSlot() {
    return html`
      <span class="popover-trigger" ${ref(this._positioningTargetRef)}>
        <slot 
          name="trigger"
          ${ref(this._triggerSlotRef)}
          @slotchange="${() => this._handleTriggerSlotChange()}"
        ></slot>
      </span>
    `;
  }

  /** Renders the trigger element for the popover (based on behavior type)
   * @returns {TemplateResult}
   * @private
   * */
  _renderTrigger() {
    // Return just the slot if the type is manual or input, neither of these types require a special wrapper
    if (["input"].includes(this.type)) return this._renderTriggerSlot();

    // Return a button that is tied to the popover if the type is auto or hint
    if (this.type === "auto" || this.type === "manual" || this.type === "hint")
      return html`
          <button
            ${ref(this._buttonRef)}
            ${ref(this._positioningTargetRef)}
            part="popover-trigger"
            class="popover-trigger"
            type="button"
            popovertarget="${ifDefined(!this.disabled ? "popover" : undefined)}"
            tabindex="-1"
          >
            ${this._renderTriggerSlot()}
          </button>
        `;
  }

  /**
   * Renders the popover element
   * @private @returns {TemplateResult}
   */
  _renderPopover() {
    const arrowClasses = {
      "popover-arrow": true,
      [`arrow-${this.currentArrowDirection}`]: true,
    };

    return html`
      <div 
        part="${`popover popover-${this.currentSide}`}"
        ${ref(this._popoverRef)}
        popover="${ifDefined(!this.disabled ? this.type : undefined)}"
        id="popover"
        class="popover"
        role="dialog"
        aria-label="${this.title}"
        @toggle=${this._handlePopoverToggle.bind(this)}
        @beforetoggle=${this._handlePopoverBeforeToggle.bind(this)}
        tabindex="-1"
      >
        <div 
          ${ref(this._arrowElRef)}
          class="${classMap(arrowClasses)}"
          part="${`arrow arrow-${this.currentArrowDirection}`}"
        >
          <slot name="arrow" ${ref(this._arrowSlotRef)}></slot>
        </div>
        <slot></slot>
      </div>
    `;
  }

  render() {
    return html`
        ${this._renderTrigger()}
        ${this._renderPopover()}
      `;
  }
}
