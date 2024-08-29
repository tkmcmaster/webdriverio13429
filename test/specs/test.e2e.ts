import { browser } from '@wdio/globals';
import { expect } from "chai";

describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        await browser.url("https://example.com");

        // Create a shadowDom that we can look for
        const shadowResult = await browser.execute(() => {
          const locatorElement = document.querySelector("body div");
          if (!locatorElement) { return "failed"; }
          const shadowElement = locatorElement.appendChild(document.createElement("div"));
          shadowElement.id = "helloshadow";
          const shadowCreated = shadowElement.attachShadow({ mode: "open"});
          shadowCreated.innerHTML = `
              <p id='shadowelement'>Hello World</p>`;
          const shadowExists = document.querySelector("#helloshadow")?.shadowRoot;
          return shadowExists ? "created" : "failed";
        });
        expect(shadowResult, "created: " + JSON.stringify(shadowResult)).to.equal("created");
        const shadowRoot = await browser.execute(() =>
          document.querySelector("#helloshadow")?.shadowRoot != null
        );
        expect(shadowRoot, "shadowRoot: " + JSON.stringify(shadowRoot)).to.equal(true);
        const shadowElement = await browser.execute(() =>
          document.querySelector("#helloshadow")?.shadowRoot?.querySelector("#shadowelement") != null
        );
        expect(shadowElement, "shadowElement: " + JSON.stringify(shadowElement)).to.equal(true);
        await browser.$("#helloshadow").waitForDisplayed();
        await browser.$(">>>#shadowelement").waitForExist();
    })
})

