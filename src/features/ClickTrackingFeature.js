import { ClickTracker } from "@aurodesignsystem/auro-library/scripts/runtime/ClickTracker/ClickTracker.mjs";
import { BaseFeature } from "./BaseFeature.js";

export class ClickTrackingFeature extends BaseFeature {
  constructor(component, featureManager) {
    super(component, featureManager);
    this._clickTracker = null;
  }

  attach(behaviorConfig) {
    if (!behaviorConfig.requiresClickTracker || this._clickTracker) {
      return;
    }

    this._clickTracker = new ClickTracker({
      target: this.component.popover,
      onOuterClick: this.#handleOutsideClick.bind(this),
    });
  }

  detach() {
    if (this._clickTracker) {
      this._clickTracker.disconnect();
      this._clickTracker = null;
    }
  }

  cleanup() {
    this.detach();
  }

  #handleOutsideClick = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Request layered hiding
    this.featureManager.requestLayeredHide(() =>
      this.featureManager.requestHide(),
    );
  };
}
