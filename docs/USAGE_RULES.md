# Rafters Usage Rules
## Design Intelligence Guidelines for Component Implementation

*These rules ensure every implementation maintains the design mastery and intelligence that defines Rafters*

---

## Core Principles

### **Intent → Meaning → Form → Implementation**
Every component usage must follow this hierarchy:
1. **Intent Analysis**: What human need does this serve?
2. **Semantic Definition**: What meaning should this communicate?
3. **Cognitive Assessment**: How can we reduce mental overhead?
4. **Accessibility Intelligence**: What barriers might this create?
5. **Implementation**: Code that embodies the intelligence

---

## Design Intelligence Rules

### **Rule 1: Semantic-First Implementation**
Components must communicate meaning before aesthetics.

```tsx
// CORRECT: Semantic intent drives choice
<Button intent="trust">Secure Payment</Button>
<Button intent="danger">Delete Account</Button>

// WRONG: Visual-first thinking
<Button className="green-button">Pay Now</Button>
<Button className="red-button">Delete</Button>
```

### **Rule 2: Cognitive Load Assessment**
Every component usage must consider mental overhead.

```tsx
// CORRECT: Acknowledge complexity
<Button cognitiveLoad={7}>Configure Advanced Settings</Button>
<Button cognitiveLoad={3}>Save Changes</Button>

// WRONG: Ignoring cognitive impact
<Button>Configure User Authentication, Database Connections, API Keys, and Security Settings</Button>
```

### **Rule 3: Attention Economics**
Visual hierarchy must match functional importance.

```tsx
// CORRECT: Attention matches importance
<Button attention="primary">Complete Purchase</Button>
<Button attention="secondary">Save for Later</Button>
<Button attention="tertiary">View Details</Button>

// WRONG: Attention mismatch
<Button attention="primary">Learn More</Button>  // Low importance, high attention
<Button attention="tertiary">Buy Now</Button>    // High importance, low attention
```

---

## Accessibility Rules

### **Rule 4: Universal Design Foundation**
Every implementation must work for motor, visual, cognitive, and auditory needs.

```tsx
// CORRECT: Comprehensive accessibility
<Input 
  label="Email Address"
  placeholder="Enter your email"
  aria-describedby="email-help"
  required
/>
<div id="email-help">We'll never share your email</div>

// WRONG: Missing accessibility context
<Input placeholder="Email" />
```

### **Rule 5: WCAG AAA Compliance**
Beyond minimum requirements - aim for excellence.

```tsx
// CORRECT: High contrast, clear language
<Button intent="danger">
  Delete Account Permanently
</Button>

// WRONG: Ambiguous language
<Button intent="danger">
  Remove
</Button>
```

### **Rule 6: Motor Accessibility**
44px minimum touch targets, generous spacing.

```tsx
// CORRECT: Adequate spacing
<div className="button-group">
  <Button>Primary Action</Button>
  <Button>Secondary Action</Button>
</div>

// WRONG: Cramped interface
<div style={{gap: '4px'}}>
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>
```

---

## Component-Specific Rules

### **Button Rules**

#### **Intent Mapping**
- `trust`: Financial transactions, security actions
- `danger`: Destructive actions requiring careful consideration
- `success`: Positive completion states
- `primary`: Main workflow actions
- `secondary`: Supporting actions
- `tertiary`: Optional or utility actions

#### **Cognitive Load Guidelines**
- **1-3**: Simple, immediate actions (Save, Cancel, Close)
- **4-6**: Standard workflow actions (Submit Form, Add Item)
- **7-10**: Complex or high-stakes actions (Configure System, Delete Account)

### **Input Rules**

#### **Label Requirements**
Always provide clear, descriptive labels that explain the expected input.

```tsx
// CORRECT: Clear, helpful labels
<Input label="Email Address" placeholder="your.name@company.com" />

// WRONG: Vague labels
<Input label="Data" placeholder="Enter data" />
```

#### **Validation Intelligence**
Error messages should guide users toward success, not just identify failure.

```tsx
// CORRECT: Helpful error guidance
<Input 
  label="Password"
  error="Password must include at least 8 characters, one number, and one special character"
/>

// WRONG: Unhelpful error messages
<Input 
  label="Password"
  error="Invalid password"
/>
```

### **Card Rules**

#### **Content Hierarchy**
Card content should follow logical information hierarchy.

```tsx
// CORRECT: Clear hierarchy
<Card>
  <Card.Header>
    <Card.Title>User Profile</Card.Title>
  </Card.Header>
  <Card.Content>
    <UserDetails />
  </Card.Content>
  <Card.Actions>
    <Button intent="primary">Save Changes</Button>
    <Button>Cancel</Button>
  </Card.Actions>
</Card>

// WRONG: No clear structure
<Card>
  <div>Some content</div>
  <Button>Action</Button>
  <div>More content</div>
</Card>
```

---

## Implementation Rules

### **Rule 7: Systematic Consistency**
Use design tokens and consistent patterns across all implementations.

```tsx
// CORRECT: Using design system patterns
<Layout spacing="comfortable">
  <Button intent="primary">Primary Action</Button>
</Layout>

// WRONG: Custom spacing that breaks system
<div style={{margin: '13px 7px 22px 11px'}}>
  <Button>Action</Button>
</div>
```

### **Rule 8: Performance Intelligence**
Consider loading states, interaction feedback, and user patience.

```tsx
// CORRECT: Loading state awareness
<Button 
  loading={isSubmitting}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Processing...' : 'Submit Order'}
</Button>

// WRONG: No feedback during actions
<Button onClick={slowOperation}>
  Submit Order
</Button>
```

### **Rule 9: Error Prevention**
Design interfaces that prevent errors rather than just handling them.

```tsx
// CORRECT: Prevent invalid states
<Select
  options={availableOptions}
  disabled={!hasPermission}
  placeholder={hasPermission ? "Choose an option" : "No options available"}
/>

// WRONG: Allow invalid interactions
<Select options={[]} />
```

---

## Content Rules

### **Rule 10: No Visual Decoration**
Never use emojis in any code, comments, documentation, or responses. Use clear, descriptive text instead of visual symbols. Emojis are uninformative and represent the exact problem this system solves - focus on semantic meaning through words, not visual decoration.

```tsx
// CORRECT: Clear semantic labels
// This button handles secure payment processing
<Button intent="trust">Complete Payment</Button>

// WRONG: Visual decoration without meaning
// 💳 Payment button 🔒
<Button intent="trust">Complete Payment</Button>
```

### **Rule 11: Clear Communication**
Use simple, clear language that reduces cognitive load.

```tsx
// CORRECT: Clear, action-oriented language
<Button intent="danger">Delete Project</Button>
<Input label="Project Name" placeholder="Enter a descriptive name" />

// WRONG: Vague or technical language
<Button intent="danger">Execute Deletion Protocol</Button>
<Input label="Identifier" placeholder="Input designation" />
```

### **Rule 12: Inclusive Language**
Use language that welcomes all users and avoids assumptions.

```tsx
// CORRECT: Inclusive language
<Input label="Full Name" />
<Button>Continue</Button>

// WRONG: Exclusive assumptions
<Input label="Christian Name" />
<Button>Guys, let's continue</Button>
```

---

## Testing Rules

### **Rule 13: Accessibility Testing**
Every implementation must be tested with assistive technologies.

#### **Required Tests:**
- Screen reader navigation
- Keyboard-only interaction
- High contrast mode compatibility
- Voice control functionality

### **Rule 14: Cognitive Load Validation**
Test with users who represent different cognitive abilities.

#### **Validation Checklist:**
- Can users complete tasks without confusion?
- Are error messages helpful and actionable?
- Is the interface predictable and consistent?
- Does the interface guide users toward success?

### **Rule 15: Real-world Testing**
Test components in realistic usage scenarios, not isolated examples.

```tsx
// CORRECT: Test in realistic context
<Form>
  <Input label="Email" />
  <Input label="Password" type="password" />
  <Button intent="primary" cognitiveLoad={4}>Sign In</Button>
</Form>

// WRONG: Test only in isolation
<Button>Click me</Button>
```

---

## Documentation Rules

### **Rule 16: Design Reasoning**
Every component usage should document the design intelligence behind decisions.

```tsx
/**
 * Using 'trust' intent for payment button because:
 * 1. Financial transaction requires user confidence
 * 2. Visual design reinforces security messaging
 * 3. Cognitive load is appropriate for high-stakes action
 */
<Button intent="trust" cognitiveLoad={6}>
  Complete Payment
</Button>
```

### **Rule 17: Accessibility Documentation**
Document how each implementation serves users with different needs.

```tsx
/**
 * Accessibility considerations:
 * - High contrast for visual accessibility
 * - Clear language for cognitive accessibility  
 * - Keyboard navigation for motor accessibility
 * - Screen reader support for auditory accessibility
 */
<Input 
  label="Search Products"
  placeholder="Type to search our catalog"
  aria-describedby="search-help"
/>
```

---

## Anti-Patterns

### **What NOT to Do**

#### **Visual-First Thinking**
```tsx
// NEVER: Choosing components based on appearance
<Button className="big-red-button">Action</Button>
```

#### **Accessibility Afterthoughts**
```tsx
// NEVER: Adding accessibility as an afterthought
<div onClick={handleClick}>Click here</div>
```

#### **Cognitive Overload**
```tsx
// NEVER: Overwhelming users with choices
<Select>
  {hundreds_of_options.map(option => <Option>{option}</Option>)}
</Select>
```

#### **Inconsistent Patterns**
```tsx
// NEVER: Custom patterns that break system consistency
<CustomButton style={{...customStyles}}>Action</CustomButton>
```

---

## Enforcement

### **Code Review Checklist**
- [ ] Intent clearly maps to human need
- [ ] Cognitive load appropriately assessed
- [ ] Attention economics properly applied
- [ ] Accessibility requirements met
- [ ] Design reasoning documented
- [ ] Consistent with system patterns

### **Design Review Questions**
1. Does this implementation communicate meaning before aesthetics?
2. Have we minimized cognitive overhead while maintaining functionality?
3. Does visual hierarchy match functional importance?
4. Will this work for users with different abilities?
5. Is this consistent with our systematic design approach?

---

## Getting Help

### **Design Intelligence Questions**
When unsure about component usage, ask:
- What human need am I serving?
- What meaning should this communicate?
- How can I reduce mental overhead?
- What barriers might this create?

### **Component Selection Matrix**

| Need | Component | Intent | Attention | Cognitive Load |
|------|-----------|--------|-----------|----------------|
| Form submission | Button | primary | primary | 3-5 |
| Destructive action | Button | danger | primary | 7-9 |
| Optional action | Button | secondary | secondary | 1-3 |
| Data entry | Input | - | - | 2-4 |
| Content grouping | Card | - | - | 1-2 |
| Choice selection | Select | - | - | 4-6 |

---

**"Every implementation should feel like it was designed by Jony Ive's attention to human psychology and Nielsen Norman Group's usability expertise."**

---

*Last updated: June 11, 2025*
*Version: 1.0*
