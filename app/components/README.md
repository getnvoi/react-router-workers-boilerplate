# Base UI Components

This directory contains simplified React components built on top of [Base UI](https://base-ui.com) with CSS Modules for styling.

## Available Components

### Button

A button component with multiple variants and sizes.

```tsx
import { Button } from "~/components";

// Variants: primary (default), secondary, danger, ghost
// Sizes: sm, md (default), lg
<Button variant="primary" size="md" onClick={() => {}}>
  Click me
</Button>

<Button variant="danger" disabled>
  Delete
</Button>
```

### Avatar

An avatar component with image fallback support.

```tsx
import { Avatar } from "~/components";

// Sizes: sm, md (default), lg, xl
<Avatar
  src={user.avatarUrl}
  alt={user.name}
  size="md"
/>

// With fallback text
<Avatar
  src={null}
  alt="John Doe"
  fallback="JD"
  size="lg"
/>
```

### Dialog

A modal dialog component with backdrop.

```tsx
import { Dialog, Button } from "~/components";

<Dialog.Root>
  <Dialog.Trigger>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Title>Confirm Action</Dialog.Title>
    <Dialog.Description>Are you sure you want to proceed?</Dialog.Description>

    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
      <Dialog.Close>
        <Button variant="secondary">Cancel</Button>
      </Dialog.Close>
      <Button variant="primary">Confirm</Button>
    </div>
  </Dialog.Content>
</Dialog.Root>;
```

### Checkbox

A checkbox component with optional label.

```tsx
import { Checkbox } from "~/components";

// With label
<Checkbox
  label="I agree to the terms"
  defaultChecked={false}
  onCheckedChange={(checked) => console.log(checked)}
/>

// Without label
<Checkbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
/>
```

### Switch

A toggle switch component with optional label.

```tsx
import { Switch } from "~/components";

// With label
<Switch
  label="Enable notifications"
  defaultChecked={true}
  onCheckedChange={(checked) => console.log(checked)}
/>

// Without label
<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
/>
```

### Input

A text input component with validation support.

```tsx
import { Input } from "~/components";

<Input
  type="email"
  placeholder="Enter your email"
  required
/>

<Input
  type="text"
  defaultValue="John Doe"
  disabled
/>
```

### Field

A form field wrapper that combines labels, inputs, and error messages.

```tsx
import { Field, Input } from "~/components";

<Field.Root name="email">
  <Field.Label>Email Address</Field.Label>
  <Field.Description>
    We'll never share your email with anyone else.
  </Field.Description>
  <Input type="email" required />
  <Field.Error />
</Field.Root>;
```

### Toast

Toast notifications with multiple variants.

```tsx
import { ToastProvider, useToast } from "~/components";

// Wrap your app with ToastProvider
function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}

// Use the hook in your components
function YourComponent() {
  const toast = useToast();

  return (
    <Button
      onClick={() => {
        // Variants: info, success, warning, error
        toast.success("Action completed!");
        toast.error("Something went wrong");
        toast.info("Did you know...", "This is additional info");
      }}
    >
      Show Toast
    </Button>
  );
}
```

## Styling

All components use CSS Modules for styling, which means:

- **Scoped styles**: No global CSS conflicts
- **Zero runtime**: Styles are compiled at build time
- **Dark mode**: Automatic dark mode support via `prefers-color-scheme`
- **CSS Variables**: All components use CSS custom properties from `app.css`

### Customization

You can customize components by:

1. **Adding className**: All components accept a `className` prop
2. **Overriding CSS variables**: Modify the CSS custom properties in `app.css`
3. **Extending styles**: Create your own CSS modules that extend the base styles

```tsx
// Example: Custom button style
<Button className="my-custom-class" variant="primary">
  Custom Button
</Button>
```

## CSS Custom Properties

Available in `app.css`:

- **Colors**: `--color-{color}-{shade}` (50-950)
  - gray, blue, red, green, purple, orange
- **Spacing**: `--spacing-{size}` (1-16)
- **Border radius**: `--radius-{size}` (sm, md, lg, xl, full)
- **Shadows**: `--shadow-{size}` (sm, md, lg, xl)
- **Transitions**: `--transition-{speed}` (fast, base, slow)

## TypeScript

All components are fully typed with TypeScript. Import types from Base UI:

```tsx
import type { Button } from "@base-ui/react/button";

type ButtonProps = Button.Root.Props;
```

## Accessibility

All components are built on Base UI, which provides:

- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Screen reader support
- ✅ Focus management

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari 15+

## Performance

- Tree-shakable: Only import what you use
- Zero runtime CSS: All styles compiled at build time
- SSR-friendly: Works with React Router SSR on Cloudflare Workers
