import { BaseBehavior } from "./BaseBehavior.js";

export class TooltipBehavior extends BaseBehavior {
  get config() {
    return {
      ...super.config,
      type: "hint",
      requiresPositioning: true,
      requiresFocusTrap: false,
      requiresClickTracker: false,
      requiresBodyScrollDisabled: false,
      shouldAdjustFocus: false,
      shouldCloseInLayers: false,
      matchWidth: false,
    };
  }

  setup() {
    this.component.showOnHover = true;
    this.#bindHover();
  }

  cleanup() {
    this.#detachHover();
  }

  onShow({ internal = false } = {}) {
    if (this.component.shown) {
      this.featureManager.attachPopoverPositioner();
    }
  }

  #bindHover() {
    const el = this.component._triggerElInSlot;
    if (el) {
      el.addEventListener("mouseover", this.#handleOnHover);
      el.addEventListener("mouseout", this.#handleOnHoverLeave);
    }
  }

  #detachHover() {
    const el = this.component._triggerElInSlot;
    if (el) {
      el.removeEventListener("mouseover", this.#handleOnHover);
      el.removeEventListener("mouseout", this.#handleOnHoverLeave);
    }
  }

  #handleOnHover = () => {
    if (this.component.showOnHover) this.component.show();
  };

  #handleOnHoverLeave = () => {
    if (this.component.showOnHover) this.component.hide();
  };
}
