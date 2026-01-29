import { BaseBehavior } from "./BaseBehavior.js";

const _NO_INPUT_ERROR =
  "\nAuroLayover: The input behavior requires an input element to be passed to the trigger slot.\n\nExample:\n<auro-layover>\n\t<auro-input slot='trigger'></auro-input>\n</auro-layover>\n";

export class InputBehavior extends BaseBehavior {
  get config() {
    return {
      ...super.config,
      type: "manual",
      requiresPositioning: true,
      requiresFocusTrap: false,
      requiresClickTracker: false,
      requiresBodyScrollDisabled: false,
      shouldAdjustFocus: false,
      shouldCloseInLayers: false,
      matchWidth: true,
    };
  }

  setup() {
    this.#checkForInput();
    this.#bindToInput();
  }

  cleanup() {
    this.#detachInput();
  }

  #checkForInput() {
    if (
      !this.component.input &&
      this.component._triggerElInSlot &&
      this.component._triggerElInSlot.tagName.toLowerCase().match("input")
    ) {
      this.component.input = this.component._triggerElInSlot;
    }

    if (!this.component.input) {
      setTimeout(() => {
        if (!this.component.input) throw new Error(_NO_INPUT_ERROR);
        this.#bindToInput();
      }, 50);
    }
  }

  #bindToInput() {
    this.#checkForInput();

    if (this.component.input) {
      this.component.input.addEventListener("input", this.#handleInputChange);
      this.component.input.addEventListener("focus", this.#handleInputFocus);

      // Don't bind blur for fullscreen inputs
      if (!["input-fullscreen"].includes(this.component.behavior)) {
        this.component.input.addEventListener("blur", this.#handleInputBlur);
      }
    }
  }

  #detachInput() {
    const { input } = this.component;
    if (input) {
      input.removeEventListener("focus", this.#handleInputFocus);
      input.removeEventListener("input", this.#handleInputChange);
      input.removeEventListener("blur", this.#handleInputBlur);
    }
  }

  #inputPassesValueCheck = (input) => {
    const { value } = input;
    if ((!value || !value.length) && !this.component.hideOnNoValue) return true;

    return (
      (value && value.length >= this.component.minInputLength) ||
      !this.component.minInputLength ||
      this.component.minInputLength <= 0
    );
  };

  #handleInputChange = (event) => {
    if (!this.component.showOnChange) return false;

    const input = event.target;
    this.#inputPassesValueCheck(input)
      ? this.component.show()
      : this.component.hide();
  };

  #handleInputFocus = (event) => {
    if (!this.component.showOnFocus) return false;

    const input = event.target;
    if (this.#inputPassesValueCheck(input)) {
      this.component.show();
    }
  };

  #handleInputBlur = () => {
    this.component.hide();
  };
}
