# AuroLayover User Guide

A comprehensive guide to using the AuroLayover component for tooltips, dropdowns, dialogs, and more.

## Quick Start

```bash
npm install @aurodesignsystem/auro-layover
```

```javascript
import "@aurodesignsystem/auro-layover";
```

```html
<auro-layover behavior="dropdown">
  <button slot="trigger">Click me</button>
  <div>Dropdown content</div>
</auro-layover>
```

## Core Features

✅ **Multiple Behavior Types** - Tooltip, dropdown, dialog, input, and fullscreen modes  
✅ **Automatic Positioning** - Smart positioning with collision detection and auto-flipping  
✅ **Focus Management** - Proper focus trapping and keyboard navigation  
✅ **Accessibility** - WCAG compliant with proper ARIA attributes  
✅ **Layer Management** - Handles multiple layovers without conflicts  
✅ **Responsive** - Works on desktop, tablet, and mobile  
✅ **Customizable Arrows** - Auto-rotating arrows with smart offset positioning  
✅ **Touch Friendly** - Mobile-optimized interactions  

## Behavior Types

### 🔍 Tooltip (`behavior="tooltip"`)

**Perfect for**: Contextual hints, help text, supplementary information

- **Trigger**: Hover to show/hide
- **Features**: Positioning only, no focus trap, no outside click detection
- **Accessibility**: Uses `aria-describedby` pattern

```html
<auro-layover behavior="tooltip" placement="top">
  <button slot="trigger" aria-describedby="help-text">
    Help ℹ️
  </button>
  <div slot="arrow">↓</div>
  <div id="help-text">
    This provides helpful information about the feature
  </div>
</auro-layover>
```

### 📋 Dropdown (`behavior="dropdown"`)

**Perfect for**: Menus, selectors, action lists, navigation

- **Trigger**: Click to show, outside click or Escape to hide
- **Features**: Positioning, focus trap, outside click detection, layer management
- **Accessibility**: Uses `role="menu"` pattern

```html
<auro-layover behavior="dropdown" placement="bottom-start">
  <button slot="trigger" aria-haspopup="menu">
    Actions ▼
  </button>
  <div slot="arrow">↓</div>
  <ul role="menu">
    <li role="menuitem"><button>Edit</button></li>
    <li role="menuitem"><button>Copy</button></li>
    <li role="menuitem"><button>Delete</button></li>
  </ul>
</auro-layover>
```

### 🏠 Dialog (`behavior="dialog"`)

**Perfect for**: Modal dialogs, confirmations, forms, alerts

- **Trigger**: Click to show, outside click or Escape to hide
- **Features**: Focus trap, body scroll disabled, layer management, centered positioning
- **Accessibility**: Uses `role="dialog"` pattern with `aria-modal` under the hood - no need for extra implementation steps

```html
<auro-layover behavior="dialog">
  <button slot="trigger">Open Dialog</button>
  <div>
    <h2 id="dialog-title">Confirm Action</h2>
    <p>Are you sure you want to proceed?</p>
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
</auro-layover>
```

### ⌨️ Input (`behavior="input"`)

**Perfect for**: Autocomplete, search suggestions, input helpers, validation messages

- **Trigger**: Focus/input changes to show, blur to hide
- **Features**: Positioning, width matching, input value monitoring
- **Accessibility**: Currently requires extra implementation steps to ensure correct a11y UX

```html
<auro-layover 
  behavior="input" 
  show-on-focus 
  show-on-change 
  min-input-length="2"
  match-width>
  <input 
    slot="trigger" 
    type="text" 
    placeholder="Search users..."
    aria-autocomplete="list">
  <ul role="listbox">
    <li role="option">John Smith</li>
    <li role="option">Jane Doe</li>
    <li role="option">Bob Johnson</li>
  </ul>
</auro-layover>
```

**Note**: `input-dropdown` is an alias for `input` behavior - both currently work identically, but the "-dropdown" version was included to give us a place to modify that specific behavior if needed in the future.

### ⌨️📱 Input Fullscreen (`behavior="input-fullscreen"`)

**Perfect for**: Mobile search overlays, complex input forms, mobile autocomplete

- **Trigger**: Focus/input changes to show, blur or escape to hide
- **Features**: Fullscreen overlay, focus trap, body scroll disabled, input monitoring
- **Accessibility**: Uses `role="dialog"` with input patterns for fullscreen input experiences

```html
<auro-layover 
  behavior="input-fullscreen" 
  show-on-focus 
  show-on-change>
  <input 
    slot="trigger" 
    type="search" 
    placeholder="Search destinations..."
    aria-autocomplete="list">
  <div role="dialog" aria-label="Search destinations" class="fullscreen-search">
    <header>
      <h2>Search Destinations</h2>
      <button aria-label="Close search">✕</button>
    </header>
    <div class="search-content">
      <ul role="listbox">
        <li role="option">New York, NY</li>
        <li role="option">Los Angeles, CA</li>
        <li role="option">Chicago, IL</li>
      </ul>
    </div>
  </div>
</auro-layover>
```

### 📱 Fullscreen (`behavior="dialog-fullscreen"`)

**Perfect for**: Mobile overlays, fullscreen forms, navigation drawers

- **Trigger**: Click to show, Escape to hide
- **Features**: Focus trap, body scroll disabled, layer management, fullscreen overlay
- **Accessibility**: Uses `role="dialog"` with fullscreen presentation out of the box, no extra implementation steps necessary for a11y

```html
<auro-layover behavior="dialog-fullscreen">
  <button slot="trigger">☰ Menu</button>
  <div>
    <header>
      <h1>Navigation</h1>
      <button aria-label="Close menu">✕</button>
    </header>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </div>
</auro-layover>
```

## Attributes & Properties

### Core Configuration

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `behavior` | String | `"dropdown"` | Defines interaction pattern: `tooltip`, `dropdown`, `dialog`, `dialog-fullscreen`, `input`, `input-dropdown`, `input-fullscreen` |
| `placement` | String | `"bottom"` | Preferred placement: `top`, `bottom`, `left`, `right` |
| `offset` | Number | `auto` | Distance from trigger in pixels (auto-calculated from arrow size if not specified) |
| `match-width` | Boolean | `false` | Match popover width to trigger width |
| `allow-body-scroll` | Boolean | `false` | Allow body scrolling when layover is open |

### Input Behavior Specific

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `show-on-focus` | Boolean | `false` | Show layover when input receives focus |
| `show-on-change` | Boolean | `false` | Show layover when input value changes |
| `min-input-length` | Number | `0` | Minimum characters required before showing |

### Advanced Positioning

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `auto-flip` | Boolean | `true` | Automatically flip placement to stay in viewport |
| `boundary` | String | `"viewport"` | Boundary element for collision detection |
| `fallback-placements` | String | `""` | Comma-separated fallback placements |

## Slots

### Trigger Slot
The element that triggers the layover to show/hide.

```html
<auro-layover>
  <button slot="trigger">Trigger Element</button>
  <!-- Content -->
</auro-layover>
```

**Supported Elements:**
- `<button>` - Recommended for best accessibility
- `<input>` - Required for input behavior
- `<a>` - For link-triggered layovers - should be limited to "tooltip" behavior
- Custom elements with proper event handling

### Default Slot (Content)
The layover content that appears when triggered.

### Arrow Slot
Custom arrow element that gets automatically rotated based on placement. The default direction is down and rotation will occur automatically based on the layover position.

```html
<auro-layover>
  <button slot="trigger">Trigger Element</button>
  <!-- Arrow slot - automatically rotated -->
  <div slot="arrow" class="my-custom-arrow">↓</div>
  <!-- Default slot content -->
  <div>Layover content</div>
</auro-layover>
```

**Arrow Slot Examples:**
```html
<!-- Simple arrow -->
<div slot="arrow">▼</div>

<!-- Custom styled arrow -->
<div slot="arrow" class="custom-arrow">
  <svg viewBox="0 0 12 8">
    <path d="M6 8L0 0h12z" fill="white" stroke="#ccc"/>
  </svg>
</div>

<!-- CSS-styled arrow -->
<div slot="arrow" class="css-triangle"></div>
```

```html
<auro-layover>
  <button slot="trigger">Trigger</button>
  <!-- Default slot content -->
  <div>
    <h3>Layover Content</h3>
    <p>Any HTML content can go here</p>
    <ul>
      <li>Lists</li>
      <li>Forms</li>
      <li>Images</li>
      <li>Custom components</li>
    </ul>
  </div>
</auro-layover>
```

## Arrow Slot Functionality

### Basic Arrow Usage

```html
<auro-layover behavior="dropdown">
  <button slot="trigger">With Arrow</button>
  <div slot="arrow">▼</div>
  <div>Content with arrow pointing to trigger</div>
</auro-layover>
```

### Smart Auto-Rotation

The **arrow slot content is automatically rotated** based on the actual popover position. Design your arrow pointing down (↓) and it will be rotated appropriately:

```html
<!-- Design arrow pointing down ↓ -->
<auro-layover placement="top">
  <button slot="trigger">Top placement</button>
  <div slot="arrow">↓</div> <!-- Remains pointing down ↓ -->
  <div>Arrow stays as designed</div>
</auro-layover>

<!-- Arrow automatically rotated for bottom placement -->
<auro-layover placement="bottom">
  <button slot="trigger">Bottom placement</button>  
  <div slot="arrow">↓</div> <!-- Rotated to point up ↑ -->
  <div>Arrow rotated 180°</div>
</auro-layover>

<!-- Arrow rotated for side placements -->
<auro-layover placement="left">
  <button slot="trigger">Left placement</button>
  <div slot="arrow">↓</div> <!-- Rotated to point right → -->
  <div>Arrow rotated 90° clockwise</div>
</auro-layover>

<auro-layover placement="right">
  <button slot="trigger">Right placement</button>
  <div slot="arrow">↓</div> <!-- Rotated to point left ← -->
  <div>Arrow rotated 90° counter-clockwise</div>
</auro-layover>
```

### Advanced Arrow Examples

```html
<!-- SVG Arrow -->
<auro-layover behavior="tooltip" placement="top">
  <button slot="trigger">SVG Arrow</button>
  <svg slot="arrow" viewBox="0 0 12 8" class="svg-arrow">
    <path d="M6 8L0 0h12z" fill="white" stroke="#e0e0e0"/>
  </svg>
  <div>Tooltip content</div>
</auro-layover>

<!-- CSS Triangle Arrow -->
<auro-layover behavior="dropdown" placement="bottom">
  <button slot="trigger">CSS Arrow</button>
  <div slot="arrow" class="css-triangle"></div>
  <div>Dropdown content</div>
</auro-layover>

<!-- Icon Font Arrow -->
<auro-layover behavior="dropdown">
  <button slot="trigger">Icon Arrow</button>
  <i slot="arrow" class="icon-arrow-down"></i>
  <div>Content</div>
</auro-layover>
```

### Smart Offset Control

The `offset` attribute controls spacing between trigger and popover:

**Auto-Calculated Offset (Recommended):**
```html
<!-- No offset specified - automatically calculated from arrow size -->
<auro-layover>
  <button slot="trigger">Auto offset</button>
  <div slot="arrow">↓</div>
  <div>Perfect spacing automatically!</div>
</auro-layover>
```

**Manual Offset Override:**
```html
<!-- Manual offset overrides arrow size calculation -->
<auro-layover offset="20">
  <button slot="trigger">Custom offset</button>
  <div slot="arrow">↓</div>
  <div>Exactly 20px from trigger</div>
</auro-layover>

<!-- Precise control for fine-tuning -->
<auro-layover offset="4">
  <button slot="trigger">Tight spacing</button>
  <div slot="arrow">↓</div>
  <div>Very close to trigger</div>
</auro-layover>
```

**How Offset Works:**
- **No `offset` specified** → Auto-calculated based on arrow slot content size
- **`offset` specified** → Overrides auto-calculation for precise control
- **No arrow slot** → Uses default offset

### Arrow Slot Styling

```css
/* Style your custom arrow content */
[slot="arrow"] {
  width: 12px;
  height: 8px;
  color: white;
  /* Arrow will be automatically rotated by the component */
}

/* SVG arrow styling */
[slot="arrow"] svg {
  fill: white;
  stroke: #e0e0e0;
  stroke-width: 1px;
}

/* CSS triangle example */
.css-triangle {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid white;
}
```

## Positioning System

### Smart Positioning Logic

1. **Try Preferred Placement** - Your specified `placement` first
2. **Check Viewport Fit** - Ensure layover is visible
3. **Auto-Flip if Needed** - Flip to opposite side automatically
4. **Try Fallbacks** - Use `fallback-placements` if specified
5. **Best Fit Selection** - Choose position with most visible area

### Placement Options

| Value | Position | Arrow Direction | Best For |
|-------|----------|----------------|----------|
| `top` | Above trigger | ↓ Down | Short tooltips |
| `top-start` | Above, left-aligned | ↓ Down | Left-aligned content |
| `top-end` | Above, right-aligned | ↓ Down | Right-aligned content |
| `bottom` | Below trigger | ↑ Up | Dropdowns, menus |
| `bottom-start` | Below, left-aligned | ↑ Up | Left-aligned menus |
| `bottom-end` | Below, right-aligned | ↑ Up | Right-aligned menus |
| `left` | Left of trigger | → Right | Wide content panels |
| `left-start` | Left, top-aligned | → Right | Top-aligned panels |
| `left-end` | Left, bottom-aligned | → Right | Bottom-aligned panels |
| `right` | Right of trigger | ← Left | Side menus |
| `right-start` | Right, top-aligned | ← Left | Top-aligned help |
| `right-end` | Right, bottom-aligned | ← Left | Bottom-aligned help |

### Advanced Positioning Example

```html
<auro-layover 
  placement="bottom-start" 
  fallback-placements="top-start,right-start,left-start"
  auto-flip="true"
  offset="12"
  boundary="viewport"
  arrow>
  <button slot="trigger">Smart Position</button>
  <div>
    This will always find the best position!
  </div>
</auro-layover>
```

## Real-World Examples

### User Profile Dropdown

```html
<auro-layover behavior="dropdown" placement="bottom-end">
  <button slot="trigger" class="profile-button">
    <img src="avatar.jpg" alt="User avatar">
    John Doe ▼
  </button>
  <div slot="arrow">↓</div>
  <div class="profile-menu" role="menu">
    <div class="profile-info">
      <img src="avatar.jpg" alt="">
      <div>
        <strong>John Doe</strong>
        <small>john@example.com</small>
      </div>
    </div>
    <hr>
    <button role="menuitem">Profile Settings</button>
    <button role="menuitem">Billing</button>
    <button role="menuitem">Help Center</button>
    <hr>
    <button role="menuitem" class="danger">Sign Out</button>
  </div>
</auro-layover>
```

### Search Autocomplete

```html
<auro-layover 
  behavior="input"
  show-on-focus
  show-on-change
  min-input-length="3"
  match-width
  placement="bottom-start">
  <input 
    slot="trigger"
    type="search"
    placeholder="Search products..."
    aria-autocomplete="list"
    aria-expanded="false">
  <div role="listbox" class="search-results">
    <div class="search-category">
      <h4>Products</h4>
      <div role="option" tabindex="-1">MacBook Pro</div>
      <div role="option" tabindex="-1">MacBook Air</div>
    </div>
    <div class="search-category">
      <h4>Categories</h4>
      <div role="option" tabindex="-1">Laptops</div>
      <div role="option" tabindex="-1">Accessories</div>
    </div>
  </div>
</auro-layover>
```

### Confirmation Dialog

```html
<auro-layover behavior="dialog">
  <button slot="trigger" class="danger-button">
    🗑️ Delete Account
  </button>
  <div role="dialog" aria-labelledby="confirm-title" aria-modal="true" class="confirmation-dialog">
    <div class="dialog-header">
      <h2 id="confirm-title">⚠️ Delete Account</h2>
    </div>
    <div class="dialog-content">
      <p>This action <strong>cannot be undone</strong>. This will permanently delete your account and remove all your data from our servers.</p>
      <div class="warning-box">
        <p>Please type <strong>DELETE</strong> to confirm:</p>
        <input type="text" placeholder="Type DELETE here">
      </div>
    </div>
    <div class="dialog-actions">
      <button type="button">Cancel</button>
      <button type="button" class="danger-button">I understand, delete my account</button>
    </div>
  </div>
</auro-layover>
```

### Mobile Navigation

```html
<auro-layover behavior="dialog-fullscreen">
  <button slot="trigger" class="mobile-menu-button" aria-label="Open menu">
    ☰
  </button>
  <div role="dialog" aria-label="Main navigation" class="mobile-nav">
    <header class="nav-header">
      <h1>Navigation</h1>
      <button class="close-button" aria-label="Close menu">✕</button>
    </header>
    <nav class="nav-content">
      <ul>
        <li><a href="#home">🏠 Home</a></li>
        <li><a href="#products">📦 Products</a></li>
        <li><a href="#about">ℹ️ About</a></li>
        <li><a href="#contact">📧 Contact</a></li>
      </ul>
    </nav>
    <footer class="nav-footer">
      <button>Settings</button>
      <button>Help</button>
    </footer>
  </div>
</auro-layover>
```

### Complex Tooltip with Rich Content

```html
<auro-layover behavior="tooltip" placement="right" offset="16">
  <button slot="trigger" class="info-button">
    📊 View Stats
  </button>
  <div slot="arrow">→</div>
  <div class="rich-tooltip">
    <h3>Performance Statistics</h3>
    <div class="stats-grid">
      <div class="stat">
        <span class="stat-label">CPU Usage</span>
        <span class="stat-value">45%</span>
      </div>
      <div class="stat">
        <span class="stat-label">Memory</span>
        <span class="stat-value">2.1 GB</span>
      </div>
      <div class="stat">
        <span class="stat-label">Network</span>
        <span class="stat-value">15 MB/s</span>
      </div>
    </div>
    <small>Last updated: 2 minutes ago</small>
  </div>
</auro-layover>
```

## Accessibility Features

### Keyboard Navigation

| Key | Action |
|-----|--------|
| **Tab** | Navigate through focusable elements |
| **Shift + Tab** | Navigate backwards |
| **Escape** | Close layover and return focus to trigger |
| **Enter/Space** | Activate focused element |
| **Arrow Keys** | Navigate menu items (when `role="menu"`) |

### ARIA Patterns

**Tooltip Pattern:**
```html
<auro-layover behavior="tooltip">
  <button slot="trigger" aria-describedby="tooltip-content">
    Help
  </button>
  <div id="tooltip-content" role="tooltip">
    Helpful information
  </div>
</auro-layover>
```

**Menu Pattern:**
```html
<auro-layover behavior="dropdown">
  <button slot="trigger" aria-haspopup="menu" aria-expanded="false">
    Menu
  </button>
  <ul role="menu">
    <li role="menuitem"><button>Option 1</button></li>
  </ul>
</auro-layover>
```

**Dialog Pattern:**
```html
<auro-layover behavior="dialog">
  <button slot="trigger">Open Dialog</button>
  <div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
    <h2 id="dialog-title">Dialog Title</h2>
    <!-- content -->
  </div>
</auro-layover>
```

**Listbox Pattern (for input):**
```html
<auro-layover behavior="input">
  <input slot="trigger" aria-autocomplete="list" aria-expanded="false">
  <ul role="listbox">
    <li role="option">Option 1</li>
  </ul>
</auro-layover>
```

## Styling & Theming

### CSS Custom Properties

```css
auro-layover {
  /* Popover Container */
  --popover-background: white;
  --popover-border: 1px solid #e0e0e0;
  --popover-border-radius: 8px;
  --popover-box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  --popover-padding: 1rem;
  --popover-max-width: 400px;
  --popover-max-height: 300px;
  
  /* Arrow Styling */
  --arrow-size: 8px;
  --arrow-color: white;
  --arrow-border-color: #e0e0e0;
  --arrow-border-width: 1px;
  
  /* Animation */
  --animation-duration: 200ms;
  --animation-easing: ease-out;
  --animation-opacity-start: 0;
  --animation-opacity-end: 1;
  --animation-scale-start: 0.95;
  --animation-scale-end: 1;
}
```

### Component-Specific Styling

```css
/* Style the trigger */
auro-layover [slot="trigger"] {
  /* Your trigger styles */
}

/* Style the content */
auro-layover .my-content {
  /* Your content styles */
}

/* Behavior-specific styling */
auro-layover[behavior="tooltip"] {
  --popover-max-width: 250px;
  --popover-padding: 0.5rem;
}

auro-layover[behavior="dialog"] {
  --popover-max-width: 600px;
  --popover-border-radius: 12px;
}

auro-layover[behavior="fullscreen"] {
  --popover-border-radius: 0;
  --popover-max-width: 100vw;
  --popover-max-height: 100vh;
}
```

### Responsive Design

```css
/* Tablet and mobile adjustments */
@media (max-width: 768px) {
  auro-layover[behavior="dropdown"] {
    --popover-max-width: 90vw;
    --popover-max-height: 50vh;
  }
  
  auro-layover[behavior="dialog"] {
    --popover-max-width: 95vw;
    --popover-padding: 1.5rem;
  }
  
  /* Transform desktop dropdowns to fullscreen on mobile */
  auro-layover[behavior="dropdown"].mobile-fullscreen {
    --popover-max-width: 100vw;
    --popover-max-height: 100vh;
    --popover-border-radius: 0;
  }
}
```

## Best Practices

### ✅ Do's

- **Use semantic HTML** in content slots (`<button>`, `<ul>`, `<nav>`)
- **Provide proper ARIA labels** and roles
- **Keep content concise** for tooltips
- **Use appropriate behavior types** for your use case
- **Test with keyboard navigation** and screen readers
- **Consider mobile experience** especially for dropdowns

### ❌ Don'ts  

- **Don't nest interactive elements** inappropriately
- **Don't make tooltips too large** or complex
- **Don't forget focus management** in custom interactions
- **Don't rely solely on hover** for important actions
- **Don't create scroll traps** in modal dialogs

### Performance Tips

- **Lazy load content** for complex layovers
- **Limit simultaneous layovers** to prevent conflicts
- **Use CSS containment** for large content
- **Optimize animations** for smooth interactions

```css
/* Example: Optimized layover for performance */
auro-layover {
  contain: layout style paint;
  will-change: transform, opacity;
}

auro-layover .large-content {
  content-visibility: auto;
  contain-intrinsic-size: 300px 200px;
}
```

## Browser Support

- **Chrome** 80+ ✅
- **Firefox** 75+ ✅  
- **Safari** 13+ ✅
- **Edge** 80+ ✅
- **Mobile Safari** 13+ ✅
- **Chrome Mobile** 80+ ✅

## WCAG Compliance

- ✅ **WCAG 2.1 AA** compliant
- ✅ **Section 508** compliant  
- ✅ **ARIA 1.2** patterns
- ✅ Keyboard navigation
- ✅ Screen reader optimized
- ✅ High contrast mode support
- ✅ Reduced motion respect

---

For technical architecture and development guides, see [ARCHITECTURE.md](./ARCHITECTURE.md).