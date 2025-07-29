import { LitElement } from "lit";
import { html } from "lit/static-html.js";
import AuroLibraryRuntimeUtils from "@aurodesignsystem/auro-library/scripts/utils/runtimeUtils.mjs";

import componentTokens from "./styles/tokens.scss"
import componentColor from "./styles/color.scss"
import componentStyle from "./styles/style.scss"

/**
 * AuroLayover is a reusable web component written using Lit.
 */
export class AuroLayover extends LitElement {

  /**
   * Registers the custom element with the browser.
   * @param {string} [name="auro-layover"] - Custom element name to register.
   * @example
   * AuroLayover.register("custom-layover") // registers <custom-layover/>
   */
  static register(name = "auro-layover") {
    AuroLibraryRuntimeUtils.prototype.registerComponent(name, AuroLayover);
  }

  connectedCallback() {
    super.connectedCallback();

    // Add the tag name as an attribute if it is different than the component name
    this.runtimeUtils.handleComponentTagRename(this, 'auro-layover');
  }

  static get styles() {
    return [componentTokens, componentColor, componentStyle];
  }

  render() {
    return html`
      <div>
        <p>Hello AuroLayover!</p>
      </div>
    `;
  }
}
