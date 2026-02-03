# Rafters Compound Component Patterns

## Pattern Structure

Rafters uses namespaced compound components with React Context for state sharing.

### Root + Subcomponents
```tsx
// Root creates context, subcomponents consume it
<Tabs defaultValue="tokens">
  <Tabs.List>
    <Tabs.Trigger value="tokens">Tokens</Tabs.Trigger>
    <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tokens">...</Tabs.Content>
  <Tabs.Content value="preview">...</Tabs.Content>
</Tabs>
```

### Implementation Pattern
```tsx
// Context for sharing state
const TabsContext = React.createContext<TabsContextValue | null>(null);

// Root component provides context
function Tabs({ children, defaultValue, ...props }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

// Subcomponents consume context
function TabsTrigger({ value, children }) {
  const { value: selected, setValue } = useContext(TabsContext);
  return <button onClick={() => setValue(value)}>{children}</button>;
}

// Namespace attachment
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
```

## Components Using This Pattern

| Component | Root | Subcomponents |
|-----------|------|---------------|
| Tooltip | Tooltip.Provider | Tooltip, Tooltip.Trigger, Tooltip.Content |
| Tabs | Tabs | Tabs.List, Tabs.Trigger, Tabs.Content |
| Card | Card | Card.Header, Card.Title, Card.Description, Card.Content, Card.Footer |
| Dialog | Dialog | Dialog.Trigger, Dialog.Content, Dialog.Header, Dialog.Footer |

## Key Principles

1. **Root provides context** - State lives in root, flows down via context
2. **Subcomponents are pure** - They read context, render accordingly
3. **Value-based matching** - Tabs/Trigger/Content match by `value` prop
4. **Controlled or uncontrolled** - Support both `value` (controlled) and `defaultValue` (uncontrolled)
5. **asChild pattern** - Tooltip.Trigger can pass behavior to child via `asChild`

## asChild Pattern

The `asChild` prop uses slot primitive to merge props with the child element:

```tsx
// Without asChild - renders a button
<Tooltip.Trigger>Click me</Tooltip.Trigger>

// With asChild - passes tooltip behavior to Button
<Tooltip.Trigger asChild>
  <Button variant="ghost">Click me</Button>
</Tooltip.Trigger>
```

This allows any element to become a trigger without wrapper divs.

## Semantic Props

Components often have `as` prop for semantic HTML:
- Card: `as="article" | "section" | "aside" | "div"`
- Container: `as="main" | "nav" | "aside" | "section" | "div"`

This separates semantic meaning from visual appearance.
