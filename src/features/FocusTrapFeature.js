import { FocusTrap } from "@aurodesignsystem/auro-library/scripts/runtime/FocusTrap/FocusTrap.mjs";
import { BaseFeature } from "./BaseFeature.js";

export class FocusTrapFeature extends BaseFeature {
  constructor(component) {
    super(component);
    this._focusTrap = null;
    this._tabHandler = null;
  }

  attach(behaviorConfig, context = {}) {
    if (!behaviorConfig.requiresFocusTrap || this._focusTrap) {
      return;
    }

    if (this.component.popover) {
      this._focusTrap = new FocusTrap(this.component.popover, true);
      this.#attachTabListener();
    }
  }

  detach(behaviorConfig, context = {}) {
    if (this._focusTrap) {
      this._focusTrap.disconnect();
      this._focusTrap = null;
    }
    this.#detachTabListener();
  }

  cleanup() {
    this.detach();
  }

  #attachTabListener() {
    this._tabHandler = this.#handleFirstTab.bind(this);
    this.component.addEventListener("keydown", this._tabHandler);
  }

  #detachTabListener() {
    if (this._tabHandler) {
      this.component.removeEventListener("keydown", this._tabHandler);
      this._tabHandler = null;
    }
  }

  #handleFirstTab = (e) => {
    if (e.key === "Tab" && this._focusTrap) {
      const { shiftKey } = e;
      const direction = shiftKey ? "backward" : "forward";

      setTimeout(() => {
        direction === "forward"
          ? this._focusTrap.focusFirstElement()
          : this._focusTrap.focusLastElement();
      });

      this.#detachTabListener();
    }
  };
}
