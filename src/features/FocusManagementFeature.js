import { BaseFeature } from "./BaseFeature.js";

export class FocusManagementFeature extends BaseFeature {
  attach(behaviorConfig, context = {}) {
    if (behaviorConfig.shouldAdjustFocus && !context.internal) {
      this.#focusPopover();
    }
  }

  detach(behaviorConfig) {
    if (behaviorConfig.shouldAdjustFocus) {
      this.#focusTrigger();
    }
  }

  #focusPopover() {
    if (this.component.popover) {
      this.component.popover.focus({ preventScroll: true });
    }
  }

  #focusTrigger() {
    const focusEl = this.component._triggerElInSlot || this.component.button;
    if (focusEl) {
      focusEl.focus({ preventScroll: true });
    }
  }
}
