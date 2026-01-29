import { PopoverPositioner } from "@aurodesignsystem/auro-library/scripts/runtime/popover/positioner.js";
import { BaseFeature } from "./BaseFeature.js";

export class PositioningFeature extends BaseFeature {
  constructor(component) {
    super(component);
    this._positioner = null;
  }

  attach(behaviorConfig) {
    if (!behaviorConfig.requiresPositioning || this._positioner) {
      return;
    }

    if (this.component._positioningTarget && this.component.popover) {
      this._positioner = new PopoverPositioner({
        target: this.component._positioningTarget,
        popover: this.component.popover,
        options: this.component._dropdownOptions,
        onPlacementChange: this.#onPlacementChange.bind(this),
      });
    }
  }

  detach() {
    this.#resetPositionStyles();
    if (this._positioner) {
      this._positioner.stop();
      this._positioner = null;
    }
  }

  cleanup() {
    this.detach();
  }

  #onPlacementChange = ({ placement, arrowDirection, side }) => {
    this.component.currentPlacement = placement;
    this.component.currentArrowDirection = arrowDirection;
    this.component.currentSide = side;
  };

  #resetPositionStyles() {
    if (!this.component.popover) return;
    this.component.popover.style.margin = null;
    this.component.popover.style.position = null;
    this.component.popover.style.top = null;
    this.component.popover.style.left = null;
  }
}
