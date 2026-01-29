# AuroLayover - Behavior & Feature System

## Architecture Overview

The AuroLayover component uses a **behavior-driven architecture** with **composable features**. This system separates concerns between:

- **Behaviors** - Define what the layover should do (tooltip, dropdown, dialog, etc.)
- **Features** - Provide specific capabilities (positioning, focus trapping, click tracking, etc.)
- **Managers** - Coordinate behaviors and features automatically

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Component     │───▶│ BehaviorManager  │───▶│ FeatureManager  │
│   (auro-layover)│    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                          │
                              ▼                          ▼
                       ┌─────────────┐            ┌─────────────┐
                       │  Behaviors  │            │  Features   │
                       │ ┌─────────┐ │            │ ┌─────────┐ │
                       │ │Dropdown │ │            │ │Position │ │
                       │ │Tooltip  │ │            │ │FocusTrap│ │
                       │ │Dialog   │ │            │ │BodyScrll│ │
                       │ │Input    │ │            │ │ClickTrk │ │
                       │ └─────────┘ │            │ └─────────┘ │
                       └─────────────┘            └─────────────┘
```

## How It Works

### 1. Component Lifecycle

```javascript
// When component shows/hides:
component.show() → BehaviorManager.attachBehavior() → FeatureManager.manageFeatures("attach")
component.hide() → BehaviorManager.detachBehavior() → FeatureManager.manageFeatures("detach")
```

### 2. Behavior Configuration Controls Features

Each behavior defines a configuration that tells the FeatureManager which features to activate:

```javascript
// Example: DropdownBehavior configuration
get config() {
  return {
    requiresPositioning: true,     // → PositioningFeature.attach()
    requiresFocusTrap: true,       // → FocusTrapFeature.attach()
    requiresClickTracker: true,    // → ClickTrackingFeature.attach()
    shouldCloseInLayers: true,     // → LayerManagementFeature.attach()
    shouldAdjustFocus: true,       // → FocusManagementFeature.attach()
    matchWidth: false,             // → WidthMatchingFeature (skipped)
    requiresBodyScrollDisabled: false // → BodyScrollFeature (skipped)
  };
}
```

### 3. Automatic Feature Coordination

The FeatureManager reads the behavior config and automatically activates the right features:

```javascript
// FeatureManager.manageFeatures() internally:
this.positioning.attach(behaviorConfig, context);      // if requiresPositioning: true
this.focusTrap.attach(behaviorConfig, context);        // if requiresFocusTrap: true
this.clickTracking.attach(behaviorConfig, context);    // if requiresClickTracker: true
// ... etc
```

## Current Behaviors & Their Features

| Behavior | Positioning | FocusTrap | ClickTracker | BodyScroll | LayerMgmt | FocusMgmt | WidthMatch |
|----------|-------------|-----------|--------------|------------|-----------|-----------|------------|
| **Tooltip** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Dropdown** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Dialog** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Input** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Fullscreen** | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |

## Available Features

### Core Features
- **PositioningFeature** - Popover positioning relative to trigger using PopoverPositioner
- **FocusTrapFeature** - Focus trapping within popover + tab key handling
- **ClickTrackingFeature** - Outside click detection for closing
- **BodyScrollFeature** - Document body scroll disable/enable
- **LayerManagementFeature** - Integration with layering system for stacked layovers
- **FocusManagementFeature** - Focus transitions between trigger and popover
- **WidthMatchingFeature** - Match popover width to trigger width

## Creating a New Behavior

### 1. Create the Behavior Class

```javascript
// src/behaviors/MyCustomBehavior.js
import { BaseBehavior } from "./BaseBehavior.js";

export class MyCustomBehavior extends BaseBehavior {
  get config() {
    return {
      ...super.config,
      type: "manual",
      requiresPositioning: true,
      requiresFocusTrap: false,
      requiresClickTracker: true,
      requiresBodyScrollDisabled: false,
      shouldAdjustFocus: true,
      shouldCloseInLayers: true,
      matchWidth: false,
    };
  }

  setup() {
    // Behavior-specific initialization
    this.#bindCustomEvents();
  }

  cleanup() {
    // Behavior-specific cleanup
    this.#unbindCustomEvents();
  }

  onShow({ internal = false } = {}) {
    // Called when layover shows
    // Features are handled automatically - focus on behavior logic
  }

  onHide() {
    // Called when layover hides
  }

  #bindCustomEvents() {
    // Private methods for behavior-specific logic
  }

  #unbindCustomEvents() {
    // Cleanup behavior-specific event listeners
  }
}
```

### 2. Register the Behavior

```javascript
// src/behaviors/BehaviorRegistry.js
import { MyCustomBehavior } from "./MyCustomBehavior.js";

export class BehaviorRegistry {
  static behaviors = new Map([
    // ... existing behaviors
    ["my-custom", MyCustomBehavior],
  ]);
}
```

### 3. Use the Behavior

```html
<auro-layover behavior="my-custom">
  <button slot="trigger">Custom Trigger</button>
  <div>Custom content</div>
</auro-layover>
```

## Creating a New Feature

### 1. Create the Feature Class

```javascript
// src/features/MyCustomFeature.js
import { BaseFeature } from "./BaseFeature.js";
import { SomeLibrary } from "some-library";

export class MyCustomFeature extends BaseFeature {
  constructor(component) {
    super(component);
    this._instance = null;
  }

  attach(behaviorConfig, context = {}) {
    // Check if this feature should activate
    if (!behaviorConfig.enableMyCustomFeature || this._instance) {
      return;
    }

    // Initialize the feature
    this._instance = new SomeLibrary({
      target: this.component.popover,
      onEvent: this.#handleEvent.bind(this)
    });
  }

  detach(behaviorConfig, context = {}) {
    if (this._instance) {
      this._instance.destroy();
      this._instance = null;
    }
  }

  cleanup() {
    this.detach();
  }

  #handleEvent(event) {
    // Handle feature-specific events
  }
}
```

### 2. Add to FeatureManager

```javascript
// src/LayoverFeatureManager.js
import { MyCustomFeature } from "./features/MyCustomFeature.js";

export class LayoverFeatureManager {
  constructor(component) {
    // ... existing features
    this.myCustomFeature = new MyCustomFeature(component);
  }

  #attachFeatures(behavior, behaviorConfig, context) {
    // ... existing feature calls
    this.myCustomFeature.attach(behaviorConfig, context);
  }

  #detachFeatures(behavior, behaviorConfig, context) {
    // ... existing feature calls
    this.myCustomFeature.detach(behaviorConfig, context);
  }

  cleanup() {
    // ... existing cleanup calls
    this.myCustomFeature.cleanup();
  }
}
```

### 3. Add Configuration to Behaviors

```javascript
// In any behavior that should use the feature
get config() {
  return {
    // ... existing config
    enableMyCustomFeature: true, // ← Add this
  };
}
```

## Key Design Principles

### 🎯 **Separation of Concerns**
- **Behaviors** handle interaction patterns (hover, click, input, etc.)
- **Features** handle technical capabilities (positioning, focus, scroll, etc.)
- **Managers** coordinate everything automatically

### 🔄 **Automatic Coordination**
- No manual feature orchestration in behaviors
- Configuration-driven feature activation
- Centralized lifecycle management

### 🧩 **Composability**
- Mix and match features for different behaviors
- Easy to add new features or behaviors
- Features are independent and reusable

### 🧪 **Testability**
- Each behavior can be tested in isolation
- Each feature can be unit tested independently
- Clear interfaces and dependencies

## File Structure

```
src/
├── auro-layover.js                 # Main component
├── LayoverBehaviorManager.js       # Coordinates behaviors
├── LayoverFeatureManager.js        # Coordinates features
├── behaviors/
│   ├── BaseBehavior.js            # Base behavior class
│   ├── BehaviorRegistry.js        # Behavior registry
│   ├── DropdownBehavior.js        # Dropdown behavior
│   ├── TooltipBehavior.js         # Tooltip behavior
│   ├── DialogBehavior.js          # Dialog behavior
│   ├── InputBehavior.js           # Input behavior
│   └── FullscreenBehavior.js      # Fullscreen behavior
└── features/
    ├── BaseFeature.js             # Base feature class
    ├── PositioningFeature.js      # Popover positioning
    ├── FocusTrapFeature.js        # Focus trapping
    ├── ClickTrackingFeature.js    # Click tracking
    ├── BodyScrollFeature.js       # Body scroll control
    ├── LayerManagementFeature.js  # Layer management
    ├── FocusManagementFeature.js  # Focus management
    └── WidthMatchingFeature.js    # Width matching
```

## Common Configuration Options

### Behavior Config Properties

| Property | Type | Description | Used By |
|----------|------|-------------|---------|
| `type` | string | Behavior type hint | All |
| `requiresPositioning` | boolean | Enable popover positioning | Tooltip, Dropdown, Input |
| `requiresFocusTrap` | boolean | Enable focus trapping | Dropdown, Dialog, Fullscreen |
| `requiresClickTracker` | boolean | Enable outside click detection | Dropdown, Dialog |
| `requiresBodyScrollDisabled` | boolean | Disable body scroll | Dialog, Fullscreen |
| `shouldAdjustFocus` | boolean | Manage focus transitions | Dropdown, Dialog, Fullscreen |
| `shouldCloseInLayers` | boolean | Enable layered closing | Dropdown, Dialog, Fullscreen |
| `matchWidth` | boolean | Match popover width to trigger | Input |

## Best Practices

### For Behaviors:
- ✅ Focus on interaction patterns, not technical features
- ✅ Use config to declare needed features
- ✅ Keep behavior-specific logic in private methods
- ✅ Extend BaseBehavior for consistency

### For Features:
- ✅ Handle their own conditional logic
- ✅ Import their own dependencies
- ✅ Clean up resources in detach/cleanup
- ✅ Use private methods for implementation details

### For Integration:
- ✅ Test behaviors and features independently
- ✅ Use descriptive config property names
- ✅ Document feature interactions and dependencies
- ✅ Follow the established patterns for consistency

---

This architecture makes AuroLayover highly flexible and maintainable, allowing you to easily create new behaviors by combining existing features, or add new features that can be used across multiple behaviors.