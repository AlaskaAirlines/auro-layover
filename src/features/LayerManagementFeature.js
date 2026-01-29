import { BaseFeature } from "./BaseFeature.js";

export class LayerManagementFeature extends BaseFeature {
  constructor(component, featureManager) {
    super(component, featureManager);
    this._isInLayer = false;
  }

  attach(behaviorConfig, context = {}) {
    if (behaviorConfig.shouldCloseInLayers && !this._isInLayer) {
      // Use proper encapsulation: Feature -> FeatureManager -> LayerManager
      this.featureManager.requestAddToLayer();
      this._isInLayer = true;
    }
  }

  detach(behaviorConfig, context = {}) {
    if (this._isInLayer) {
      // Use proper encapsulation: Feature -> FeatureManager -> LayerManager
      this.featureManager.requestRemoveFromLayer();
      this._isInLayer = false;
    }
  }

  cleanup() {
    this.detach();
  }
}
