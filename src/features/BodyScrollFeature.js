import { BaseFeature } from "./BaseFeature.js";

export class BodyScrollFeature extends BaseFeature {
  constructor(component) {
    super(component);
    this._isDisabled = false;
  }

  attach(behaviorConfig, context = {}) {
    if (this.#shouldDisableBodyScroll(behaviorConfig) && !this._isDisabled) {
      document.documentElement.style.overflow = "hidden";
      this._isDisabled = true;
    }
  }

  detach(behaviorConfig, context = {}) {
    if (this._isDisabled) {
      document.documentElement.style.overflow = null;
      this._isDisabled = false;
    }
  }

  cleanup() {
    this.detach();
  }

  #shouldDisableBodyScroll(behaviorConfig) {
    return (
      behaviorConfig.requiresBodyScrollDisabled &&
      !this.component.allowBodyScroll
    );
  }
}
