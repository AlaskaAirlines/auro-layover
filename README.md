<!--
The README.md file is a compiled document. No edits should be made directly to this file.

README.md is created by running `npm run build:docs`.

This file is generated based on a template fetched from
`https://raw.githubusercontent.com/AlaskaAirlines/auro-templates/main/templates/default/README.md`
and copied to `./componentDocs/README.md` each time the docs are compiled.

The following sections are editable by making changes to the following files:

| SECTION                | DESCRIPTION                                       | FILE LOCATION                       |
|------------------------|---------------------------------------------------|-------------------------------------|
| Description            | Description of the component                      | `./docs/partials/description.md`    |
| Use Cases              | Examples for when to use this component           | `./docs/partials/useCases.md`       |
| Additional Information | For use to add any component specific information | `./docs/partials/readmeAddlInfo.md` |
| Component Example Code | HTML sample code of the components use            | `./apiExamples/basic.html`          |
-->

# Layover

<!-- AURO-GENERATED-CONTENT:START (FILE:src=./docs/partials/description.md) -->
<!-- The below content is automatically added from ./docs/partials/description.md -->
`<auro-layover>` is an [HTML custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) that combines the functionality of html popover spec and floating-ui&#x27;s js library into one utility.
<!-- AURO-GENERATED-CONTENT:END -->
<!-- AURO-GENERATED-CONTENT:START (FILE:src=./docs/partials/readmeAddlInfo.md) -->
<!-- The below content is automatically added from ./docs/partials/readmeAddlInfo.md -->
<!-- AURO-GENERATED-CONTENT This file is to be used for any additional content that should be included in the README.md which is specific to this component. -->
<!-- AURO-GENERATED-CONTENT:END -->

## UI development browser support

<!-- AURO-GENERATED-CONTENT:START (REMOTE:url=https://raw.githubusercontent.com/AlaskaAirlines/auro-templates/main/templates/default/partials/browserSupport.md) -->
For the most up to date information on [UI development browser support](https://auro.alaskaair.com/support/browsersSupport)

<!-- AURO-GENERATED-CONTENT:END -->

## Install

<!-- AURO-GENERATED-CONTENT:START (REMOTE:url=https://raw.githubusercontent.com/AlaskaAirlines/auro-templates/main/templates/default/partials/usage/componentInstall.md) -->
[![Build Status](https://img.shields.io/github/actions/workflow/status/AlaskaAirlines/auro-layover/testPublish.yml?style=for-the-badge)](https://github.com/AlaskaAirlines/auro-layover/actions/workflows/testPublish.yml)
[![See it on NPM!](https://img.shields.io/npm/v/@aurodesignsystem/auro-layover?style=for-the-badge&color=orange)](https://www.npmjs.com/package/@aurodesignsystem/auro-layover)
[![License](https://img.shields.io/npm/l/@aurodesignsystem/auro-layover?color=blue&style=for-the-badge)](https://www.apache.org/licenses/LICENSE-2.0)
![ESM supported](https://img.shields.io/badge/ESM-compatible-FFE900?style=for-the-badge)

```shell
$ npm i @aurodesignsystem/auro-layover
```

<!-- AURO-GENERATED-CONTENT:END -->

### Design Token CSS Custom Property dependency

<!-- AURO-GENERATED-CONTENT:START (REMOTE:url=https://raw.githubusercontent.com/AlaskaAirlines/auro-templates/main/templates/default/partials/development/designTokens.md) -->
The use of any Auro custom element has a dependency on the [Auro Design Tokens](https://auro.alaskaair.com/getting-started/developers/design-tokens).

<!-- AURO-GENERATED-CONTENT:END -->

### Define dependency in project component

<!-- AURO-GENERATED-CONTENT:START (REMOTE:url=https://raw.githubusercontent.com/AlaskaAirlines/auro-templates/main/templates/default/partials/usage/componentImportDescription.md) -->
Defining the component dependency within each component that is using the `<auro-layover>` component.

<!-- AURO-GENERATED-CONTENT:END -->
<!-- AURO-GENERATED-CONTENT:START (REMOTE:url=https://raw.githubusercontent.com/AlaskaAirlines/auro-templates/main/templates/default/partials/usage/componentImport.md) -->

```js
import "@aurodesignsystem/auro-layover";
```

<!-- AURO-GENERATED-CONTENT:END -->
**Reference component in HTML**
<!-- AURO-GENERATED-CONTENT:START (CODE:src=./apiExamples/basic.html) -->
<!-- The below code snippet is automatically added from ./apiExamples/basic.html -->

```html
<p>existing support example</p>
<button type="button" onclick="document.querySelector('auro-layover[behavior=dialog]').toggle()">Click Me For Dialog</button>
<auro-layover behavior="dialog">
  <p>I am a dialog popover. I should be positioned fixed over the top of the page.</p>
</auro-layover>
<p>&nbsp;</p>
<p>dialog example</p>
<auro-layover behavior="dialog">
  <button type="button" slot="trigger">Open Dialog</button>
  <p>I am a dialog popover. I should be positioned fixed over the top of the page.</p>
  <auro-layover>
    <button type="button" slot="trigger">Open Nested Layover</button>
    <p>This is a layover in a layover, it shouldn't close at the same time as the parent one.</p>
    <auro-layover>
      <button type="button" slot="trigger">Open 3rd Level Nested Layover</button>
      <p>This is a 3rd level nested layover, it shouldn't close at the same time as the parent ones.</p>
    </auro-layover>
  </auro-layover>
</auro-layover>
<p>&nbsp;</p>
<p>dropdown example</p>
<auro-layover behavior="dropdown">
  <button type="button" slot="trigger">Open Dropdown</button>
  <p>I am a dropdown popover. I should be positioned next to my parent element/trigger.</p>
  <input type="text" placeholder="I am an input inside a dropdown popover" />
  <textarea placeholder="I am a textarea inside a dropdown popover"></textarea>
  <button type="button" onclick="document.querySelector('auro-layover[behavior=dropdown]').hide()">Close Dropdown</button>
  <auro-button>Auro Button Is Here</auro-button>
  <button type="button" onclick="document.querySelector('auro-layover[behavior=dropdown]').hide()">Close Dropdown</button>
  <input type="text" placeholder="I am an input inside a dropdown popover" />
  <textarea placeholder="I am a textarea inside a dropdown popover"></textarea>
  <p>Paragraph test</p>
  <span>Span test</span>
</auro-layover>
<p>&nbsp;</p>
<p>tooltip (hover) example</p>
<auro-layover behavior="tooltip" placement="bottom">
  <button type="button" slot="trigger">Hover For Tooltip</button>
  <p>I am a tooltip popover. I open when the trigger is hovered.</p>
</auro-layover>
<p>&nbsp;</p>
<p>default input example</p>
<auro-layover behavior="input">
  <auro-input slot="trigger" placeholder="Click to open input popover"></auro-input>
  <auro-menu>
    <auro-menuoption value="Apples" id="option-0">Apples</auro-menuoption>
    <auro-menuoption value="Oranges" id="option-1">Oranges</auro-menuoption>
    <auro-menuoption value="Peaches" id="option-2">Peaches</auro-menuoption>
    <auro-menuoption value="Grapes" id="option-3">Grapes</auro-menuoption>
    <auro-menuoption value="Cherries" id="option-4">Cherries</auro-menuoption>
  </auro-menu>
</auro-layover>
<p>&nbsp;</p>
<p>input popover with minInputLength</p>
<auro-layover behavior="input" minInputLength="3">
  <auro-input slot="trigger" placeholder="Click to open input popover"></auro-input>
  <auro-menu>
    <auro-menuoption value="Apples" id="option-0">Apples</auro-menuoption>
    <auro-menuoption value="Oranges" id="option-1">Oranges</auro-menuoption>
    <auro-menuoption value="Peaches" id="option-2">Peaches</auro-menuoption>
    <auro-menuoption value="Grapes" id="option-3">Grapes</auro-menuoption>
    <auro-menuoption value="Cherries" id="option-4">Cherries</auro-menuoption>
  </auro-menu>
</auro-layover>
<p>&nbsp;</p>
<p>input popover with showOnFocus=false</p>
<auro-layover behavior="input" minInputLength="3" showOnFocus="false">
  <auro-input slot="trigger" placeholder="Click to open input popover"></auro-input>
  <auro-menu>
    <auro-menuoption value="Apples" id="option-0">Apples</auro-menuoption>
    <auro-menuoption value="Oranges" id="option-1">Oranges</auro-menuoption>
    <auro-menuoption value="Peaches" id="option-2">Peaches</auro-menuoption>
    <auro-menuoption value="Grapes" id="option-3">Grapes</auro-menuoption>
    <auro-menuoption value="Cherries" id="option-4">Cherries</auro-menuoption>
  </auro-menu>
</auro-layover>
```
<!-- AURO-GENERATED-CONTENT:END -->

## Use CDN

<!-- AURO-GENERATED-CONTENT:START (REMOTE:url=https://raw.githubusercontent.com/AlaskaAirlines/auro-templates/main/templates/default/partials/usage/bundleInstallDescription.md) -->
In cases where the project is not able to process JS assets, there are pre-processed assets available for use. Legacy browsers such as IE11 are no longer supported.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@aurodesignsystem/auro-layover@latest/+esm"></script>
```

<!-- AURO-GENERATED-CONTENT:END -->

## auro-layover use cases

<!-- AURO-GENERATED-CONTENT:START (FILE:src=./docs/partials/useCases.md) -->
<!-- The below content is automatically added from ./docs/partials/useCases.md -->
The `<auro-layover>` element should be used in situations where users:

* Your example use case here
* Another condition where this component is useful
<!-- AURO-GENERATED-CONTENT:END -->

## API Code Examples

### Default auro-layover

<!-- AURO-GENERATED-CONTENT:START (CODE:src=./apiExamples/basic.html) -->
<!-- The below code snippet is automatically added from ./apiExamples/basic.html -->

```html
<p>existing support example</p>
<button type="button" onclick="document.querySelector('auro-layover[behavior=dialog]').toggle()">Click Me For Dialog</button>
<auro-layover behavior="dialog">
  <p>I am a dialog popover. I should be positioned fixed over the top of the page.</p>
</auro-layover>
<p>&nbsp;</p>
<p>dialog example</p>
<auro-layover behavior="dialog">
  <button type="button" slot="trigger">Open Dialog</button>
  <p>I am a dialog popover. I should be positioned fixed over the top of the page.</p>
  <auro-layover>
    <button type="button" slot="trigger">Open Nested Layover</button>
    <p>This is a layover in a layover, it shouldn't close at the same time as the parent one.</p>
    <auro-layover>
      <button type="button" slot="trigger">Open 3rd Level Nested Layover</button>
      <p>This is a 3rd level nested layover, it shouldn't close at the same time as the parent ones.</p>
    </auro-layover>
  </auro-layover>
</auro-layover>
<p>&nbsp;</p>
<p>dropdown example</p>
<auro-layover behavior="dropdown">
  <button type="button" slot="trigger">Open Dropdown</button>
  <p>I am a dropdown popover. I should be positioned next to my parent element/trigger.</p>
  <input type="text" placeholder="I am an input inside a dropdown popover" />
  <textarea placeholder="I am a textarea inside a dropdown popover"></textarea>
  <button type="button" onclick="document.querySelector('auro-layover[behavior=dropdown]').hide()">Close Dropdown</button>
  <auro-button>Auro Button Is Here</auro-button>
  <button type="button" onclick="document.querySelector('auro-layover[behavior=dropdown]').hide()">Close Dropdown</button>
  <input type="text" placeholder="I am an input inside a dropdown popover" />
  <textarea placeholder="I am a textarea inside a dropdown popover"></textarea>
  <p>Paragraph test</p>
  <span>Span test</span>
</auro-layover>
<p>&nbsp;</p>
<p>tooltip (hover) example</p>
<auro-layover behavior="tooltip" placement="bottom">
  <button type="button" slot="trigger">Hover For Tooltip</button>
  <p>I am a tooltip popover. I open when the trigger is hovered.</p>
</auro-layover>
<p>&nbsp;</p>
<p>default input example</p>
<auro-layover behavior="input">
  <auro-input slot="trigger" placeholder="Click to open input popover"></auro-input>
  <auro-menu>
    <auro-menuoption value="Apples" id="option-0">Apples</auro-menuoption>
    <auro-menuoption value="Oranges" id="option-1">Oranges</auro-menuoption>
    <auro-menuoption value="Peaches" id="option-2">Peaches</auro-menuoption>
    <auro-menuoption value="Grapes" id="option-3">Grapes</auro-menuoption>
    <auro-menuoption value="Cherries" id="option-4">Cherries</auro-menuoption>
  </auro-menu>
</auro-layover>
<p>&nbsp;</p>
<p>input popover with minInputLength</p>
<auro-layover behavior="input" minInputLength="3">
  <auro-input slot="trigger" placeholder="Click to open input popover"></auro-input>
  <auro-menu>
    <auro-menuoption value="Apples" id="option-0">Apples</auro-menuoption>
    <auro-menuoption value="Oranges" id="option-1">Oranges</auro-menuoption>
    <auro-menuoption value="Peaches" id="option-2">Peaches</auro-menuoption>
    <auro-menuoption value="Grapes" id="option-3">Grapes</auro-menuoption>
    <auro-menuoption value="Cherries" id="option-4">Cherries</auro-menuoption>
  </auro-menu>
</auro-layover>
<p>&nbsp;</p>
<p>input popover with showOnFocus=false</p>
<auro-layover behavior="input" minInputLength="3" showOnFocus="false">
  <auro-input slot="trigger" placeholder="Click to open input popover"></auro-input>
  <auro-menu>
    <auro-menuoption value="Apples" id="option-0">Apples</auro-menuoption>
    <auro-menuoption value="Oranges" id="option-1">Oranges</auro-menuoption>
    <auro-menuoption value="Peaches" id="option-2">Peaches</auro-menuoption>
    <auro-menuoption value="Grapes" id="option-3">Grapes</auro-menuoption>
    <auro-menuoption value="Cherries" id="option-4">Cherries</auro-menuoption>
  </auro-menu>
</auro-layover>
```
<!-- AURO-GENERATED-CONTENT:END -->

## Development

<!-- AURO-GENERATED-CONTENT:START (REMOTE:url=https://raw.githubusercontent.com/AlaskaAirlines/auro-templates/main/templates/default/partials/development/developmentDescription.md) -->
In order to develop against this project, if you are not part of the core team, you will be required to fork the project prior to submitting a pull request.

Please be sure to review the [contribution guidelines](https://auro.alaskaair.com/contributing) for this project. Please make sure to **pay special attention** to the **conventional commits** section of the document.

<!-- AURO-GENERATED-CONTENT:END -->

### Start development environment

<!-- AURO-GENERATED-CONTENT:START (REMOTE:url=https://raw.githubusercontent.com/AlaskaAirlines/auro-templates/main/templates/default/partials/development/localhost.md) -->
Once the project has been cloned to your local resource and you have installed all the dependencies you will need to open a shell session to run the **dev server**.

```shell
$ npm run dev
```

Open [localhost:8000](http://localhost:8000/)

<!-- AURO-GENERATED-CONTENT:END -->

### Testing

<!-- AURO-GENERATED-CONTENT:START (REMOTE:url=https://raw.githubusercontent.com/AlaskaAirlines/auro-templates/main/templates/default/partials/development/testing.md) -->
Automated tests are required for every Auro component. See `.\test\auro-layover.test.js` for the tests for this component. Run `npm run test` to run the tests and check code coverage. Tests must pass and meet a certain coverage threshold to commit. See [the testing documentation](https://auro.alaskaair.com/support/tests) for more details.

<!-- AURO-GENERATED-CONTENT:END -->
