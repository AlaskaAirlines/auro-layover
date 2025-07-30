import { elementUpdated, expect, fixture, html } from "@open-wc/testing";
import "../src/registered.js";

describe("auro-layover", () => {
  it("if defined and has shadow DOM attached", async () => {
    const el = await fixture(html`
      <auro-layover> content </auro-layover>
    `);

    await elementUpdated(el);

    expect(customElements.get("auro-layover")).to.exist;
    expect(el.shadowRoot).to.exist;
  });
});
