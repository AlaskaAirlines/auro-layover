# auro-layover

AuroLayover is a reusable web component written using Lit.

## Properties

| Property           | Attribute          | Modifiers | Type                | Description                                      |
|--------------------|--------------------|-----------|---------------------|--------------------------------------------------|
| `allowBodyScroll`  | `allowBodyScroll`  |           | `boolean`           | Allow scrolling of the body when the dialog is open |
| `arrow`            |                    | readonly  | `HTMLElement`       | A reference to the popover component's internal arrow element |
| `behavior`         | `behavior`         |           | `string`            | The behavior of the popover, "dialog", "dialog-fullscreen", "dropdown", "tooltip", or "input", "input-fullscreen", "input-dropdown" |
| `button`           |                    | readonly  | `HTMLButtonElement` | A reference to the popover component's internal button element (trigger) |
| `disabled`         | `disabled`         |           | `boolean`           | Whether or not the layover is disabled (show/hide should be fully disabled) |
| `hideOnNoValue`    | `hideOnNoValue`    |           | `string`            | Whether or not the layover should close when there is no value (input behavior only) |
| `inline`           | `inline`           |           | `string`            | Whether or not the layover should try to align to an inline element like a hyperlink |
| `matchWidth`       | `matchWidth`       |           | `boolean`           | Whether or not the popover should match the width of the trigger |
| `minInputLength`   | `minInputLength`   |           | `number`            | The minimum number of characters the user must type before the popover is shown |
| `offset`           | `offset`           |           | `number`            | The offset distance of the layover               |
| `placement`        | `placement`        |           | `string`            | The position of the layover, e.g., "bottom-start", "top-end" etc. (do not use with useAutoPlacement) |
| `popover`          |                    | readonly  | `HTMLElement`       | A reference to the popover component's internal popover element |
| `showOnChange`     | `showOnChange`     |           | `string`            | Whether the layover should show on change (input behavior only) |
| `showOnFocus`      | `showOnFocus`      |           | `string`            | Whether the layover should open on focus (input behavior only) |
| `showOnHover`      | `showOnHover`      |           | `boolean`           | Whether the layover should show on hover         |
| `shown`            | `shown`            |           | `boolean`           | Whether the layover is shown or not              |
| `title`            | `title`            |           | `string`            | The title of the layover - REQUIRED FOR A11Y     |
| `type`             | `type`             |           | `string`            | The type of layover, e.g., "manual", "auto", or "hint" |
| `useAutoPlacement` | `useAutoPlacement` |           | `string`            | Whether or not to use automatic placement for the layover (do not use with placement) |
| `useFlip`          | `useFlip`          |           | `string`            | Whether or not to use the flip behavior (flips the element when it goes off-screen) |
| `useHide`          | `useHide`          |           | `string`            | Whether or not to use the hide behavior (hides element when trigger is not visible) |

## Methods

| Method   | Type       | Description                            |
|----------|------------|----------------------------------------|
| `toggle` | `(): void` | Toggles the visibility of the layover. |

## Events

| Event                       | Type                                             | Description                                      |
|-----------------------------|--------------------------------------------------|--------------------------------------------------|
| `auro-layover-beforechange` | `CustomEvent<{ target: this; newState: any; }>`  |                                                  |
| `auro-layover-change`       | `CustomEvent<{ target: this; newState: any; }>`  | Fired when the layover's visibility state changes. Event detail contains {target: AuroLayover, newState: string} where newState is either "shown" or "hidden". |
| `auro-layover-hidden`       | `CustomEvent<{ target: this; newState: string; }>` | Fired when the layover is hidden. Event detail contains {target: AuroLayover, newState: "hidden"}. |
| `auro-layover-shown`        | `CustomEvent<{ target: this; newState: string; }>` | Fired when the layover is shown. Event detail contains {target: AuroLayover, newState: "shown"}. |
