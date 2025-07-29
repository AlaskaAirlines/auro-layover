import { AuroLayover } from "../../src/auro-layover.js";

/**
 * AuroLayover is a reusable web component written using Lit.
 */
class AuroLayoverWCA extends AuroLayover {}

if (!customElements.get("auro-layover")) {
  customElements.define("auro-layover", AuroLayoverWCA);
}
