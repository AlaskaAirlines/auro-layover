/**
 * LayerManager
 * Manages a global stack of layover layers to ensure proper layering and closing behavior.
 */
export class LayerManager {
  /**
   * Ensures the global layover stack is available for managing active layover layers.
   * This method prepares the shared window state so other methods can reliably track layers.
   */
  #initializeStack() {
    if (!window.auroLayoverStack) {
      window.auroLayoverStack = [];
    }
  }

  /**
   * Adds a layer to the global layover stack and ensures it is treated as the topmost layer.
   * This method maintains layer ordering so the most recently added layover is tracked last.
   * @param {HTMLElement} layer
   */
  addLayer(layer) {
    // Ensure the global stack is initialized
    this.#initializeStack();

    // Get the index of the layer if it already exists in the stack
    const existingIndex = window.auroLayoverStack.indexOf(layer);

    // If the layover isn't already in the stack, add it
    if (existingIndex === -1) {
      window.auroLayoverStack.push(layer);

      // Otherwise move it to the top of the list since it's been re-added
    } else {
      window.auroLayoverStack.splice(existingIndex, 1);
      window.auroLayoverStack.push(layer);
    }
  }

  /**
   * Removes a layer from the global layover stack if it is currently tracked.
   * This method updates the shared stack so that closed or inactive layovers are no longer considered.
   * @param {HTMLElement} layer
   * @returns
   */
  removeLayer(layer) {
    // Remove this layover from the global stack
    if (!window.auroLayoverStack) return;

    // Get the index of this layover in the stack
    const index = window.auroLayoverStack.indexOf(layer);

    // If the layover isn't found, exit
    if (index === -1) return;

    // Remove the layover from the stack
    window.auroLayoverStack.splice(index, 1);
  }

  /**
   * Attempts to hide a layover layer while enforcing that only the active top layer is allowed to close.
   * This method coordinates layer closing behavior, invoking an optional callback when the hide is permitted.
   * @param {HTMLElement} layer The layer to attempt to hide while constraining to the top layer
   * @param {Function} callback The callback to call if the layer should be hidden
   */
  hideLayer(layer, callback) {
    // Get the current stack
    const stack = window.auroLayoverStack || [];
    const layoverIndex = stack.indexOf(layer);

    // Guard Clause: Ensure stack and layover are valid
    if (!stack && layoverIndex === -1) return;

    // Detect ClosingConditions
    const isClosingLayer = window.closingLayover === layer;
    const isTopLayer = layoverIndex === stack.length - 1;

    // Detect if we should close based on conditions
    const shouldClose = [isClosingLayer, isTopLayer].some(
      (value) => value === true,
    );

    // Guard Clause: Prevent closing based on detection by returning early and canceling the event
    if (!shouldClose) return;

    // Mark this layover as currently closing
    window.closingLayover = layer;

    // Remove this layover from the stack since it's closing
    this.removeLayer(layer);

    // Hide the popover
    if (callback && typeof callback === "function") callback();

    // Clear the closing layover reference after the hide operation completes
    setTimeout(() => {
      if (window.closingLayover === layer) {
        window.closingLayover = null;
      }
    }, 0);
  }
}
