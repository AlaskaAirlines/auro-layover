import { BaseFeature } from "./BaseFeature.js";

export class WidthMatchingFeature extends BaseFeature {
  attach(behaviorConfig, context = {}) {
    if (behaviorConfig.matchWidth) {
      this.#matchWidth();
    } else {
      this.#resetWidth();
    }
  }

  detach(behaviorConfig, context = {}) {
    this.#resetWidth();
  }

  cleanup() {
    this.#resetWidth();
  }

  #matchWidth() {
    if (!this.component.matchWidth) {
      this.#resetWidth();
      return;
    }

    const triggerEl = this.component._triggerElInSlot || this.component.button;
    const { width } = triggerEl?.getBoundingClientRect() || {};

    if (this.component.popover && width) {
      this.component.popover.style.width = `${width}px`;
    }
  }

  #resetWidth() {
    if (this.component.popover) {
      this.component.popover.style.width = null;
    }
  }
}
