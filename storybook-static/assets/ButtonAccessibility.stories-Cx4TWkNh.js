import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{B as a}from"./Button-B50RvQza.js";import"./index-DuwuiYca.js";import"./iframe-Cy2I62ob.js";import"./utils-DuMXYCiK.js";const{fn:w}=__STORYBOOK_MODULE_TEST__,P={title:"03 Components/Action/Button/Accessibility",component:a,parameters:{layout:"centered",docs:{description:{component:"Accessibility features that enhance usability for all users while ensuring inclusive design principles are met."}}},tags:["autodocs"],args:{onClick:w()}},s={render:()=>e.jsxs("div",{className:"space-y-6 p-4 max-w-2xl",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium",children:"Foundation Principles"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Accessible buttons benefit everyone by providing clear context and predictable interaction patterns."})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsx("h4",{className:"text-base font-medium",children:"Clear Purpose"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{children:"Save Document"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Descriptive text eliminates guesswork about button function"})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("h4",{className:"text-base font-medium",children:"Enhanced Context"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{"aria-label":"Save the current document to your account",children:"Save"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"aria-label provides additional context when button text is minimal"})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("h4",{className:"text-base font-medium",children:"State Communication"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{"aria-pressed":!0,variant:"secondary",children:"Starred"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"aria-pressed communicates toggle state to all users"})]})]})]})]}),parameters:{docs:{description:{story:"Foundation accessibility principles that improve usability for everyone while ensuring inclusive design standards."}},layout:"fullscreen"}},t={render:()=>e.jsxs("div",{className:"space-y-6 p-4 max-w-2xl",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium",children:"Keyboard Navigation"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Use Tab to navigate, Space or Enter to activate. Focus indicators show current position clearly."})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex gap-3",children:[e.jsx(a,{variant:"primary",children:"First Action"}),e.jsx(a,{variant:"secondary",children:"Second Action"}),e.jsx(a,{variant:"outline",children:"Third Action"})]}),e.jsxs("div",{className:"text-xs text-muted-foreground space-y-1",children:[e.jsxs("div",{children:["• ",e.jsx("kbd",{className:"px-1.5 py-0.5 bg-muted rounded text-xs",children:"Tab"})," to navigate between buttons"]}),e.jsxs("div",{children:["• ",e.jsx("kbd",{className:"px-1.5 py-0.5 bg-muted rounded text-xs",children:"Space"})," or"," ",e.jsx("kbd",{className:"px-1.5 py-0.5 bg-muted rounded text-xs",children:"Enter"})," to activate"]}),e.jsx("div",{children:"• Focus ring provides clear visual indication"})]})]})]}),parameters:{docs:{description:{story:"Keyboard navigation patterns that create intuitive, predictable interaction flows for all users."}},layout:"fullscreen"}},i={render:()=>e.jsxs("div",{className:"space-y-8 p-4 max-w-3xl",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium",children:"Universal Design Through Contrast"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"High contrast benefits everyone: users with low vision, people in bright sunlight, and anyone using older displays."})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"text-base font-medium",children:"Standard Lighting"}),e.jsx("div",{className:"p-4 bg-background border rounded",children:e.jsxs("div",{className:"space-y-3",children:[e.jsx(a,{variant:"primary",children:"Primary Action"}),e.jsx(a,{variant:"secondary",children:"Secondary Action"}),e.jsx(a,{variant:"outline",children:"Outline Action"}),e.jsx(a,{variant:"ghost",children:"Ghost Action"})]})})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"text-base font-medium",children:"High Contrast Simulation"}),e.jsx("div",{className:"p-4 bg-white border rounded",children:e.jsxs("div",{className:"space-y-3",children:[e.jsx(a,{variant:"primary",className:"contrast-more:bg-black contrast-more:text-white",children:"Primary Action"}),e.jsx(a,{variant:"secondary",className:"contrast-more:border-black contrast-more:text-black",children:"Secondary Action"}),e.jsx(a,{variant:"outline",className:"contrast-more:border-black contrast-more:text-black",children:"Outline Action"}),e.jsx(a,{variant:"ghost",className:"contrast-more:text-black hover:contrast-more:bg-gray-200",children:"Ghost Action"})]})})]})]}),e.jsx("div",{className:"text-xs text-muted-foreground",children:e.jsx("div",{children:"All button variants maintain WCAG AA contrast ratios (4.5:1) for optimal readability"})})]}),parameters:{docs:{description:{story:"Color contrast demonstration showing how proper contrast ratios benefit all users across different viewing conditions."}},layout:"fullscreen"}},r={render:()=>e.jsxs("div",{className:"space-y-6 p-4 max-w-2xl",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium",children:"Screen Reader Optimization"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Semantic markup and ARIA attributes create clear, navigable experiences for screen reader users."})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsx("h4",{className:"text-base font-medium",children:"Action Context"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{"aria-describedby":"save-description",variant:"primary",children:"Save Changes"}),e.jsx("div",{id:"save-description",className:"text-xs text-muted-foreground",children:"Saves your current document progress to the cloud"})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("h4",{className:"text-base font-medium",children:"Loading State"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{disabled:!0,"aria-live":"polite","aria-busy":"true",children:"Processing..."}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"aria-live and aria-busy communicate loading state to screen readers"})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("h4",{className:"text-base font-medium",children:"Toggle State"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{variant:"secondary","aria-pressed":!1,"aria-label":"Add item to favorites",children:"Favorite"}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"aria-pressed indicates current toggle state clearly"})]})]})]})]}),parameters:{docs:{description:{story:"Screen reader optimization techniques that create clear, navigable experiences through semantic markup and ARIA attributes."}},layout:"fullscreen"}};var n,o,c,d,l;s.parameters={...s.parameters,docs:{...(n=s.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-4 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Foundation Principles</h3>
        <p className="text-sm text-muted-foreground">
          Accessible buttons benefit everyone by providing clear context and predictable interaction
          patterns.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-base font-medium">Clear Purpose</h4>
          <div className="space-y-2">
            <Button>Save Document</Button>
            <p className="text-xs text-muted-foreground">
              Descriptive text eliminates guesswork about button function
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Enhanced Context</h4>
          <div className="space-y-2">
            <Button aria-label="Save the current document to your account">Save</Button>
            <p className="text-xs text-muted-foreground">
              aria-label provides additional context when button text is minimal
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">State Communication</h4>
          <div className="space-y-2">
            <Button aria-pressed={true} variant="secondary">
              Starred
            </Button>
            <p className="text-xs text-muted-foreground">
              aria-pressed communicates toggle state to all users
            </p>
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Foundation accessibility principles that improve usability for everyone while ensuring inclusive design standards.'
      }
    },
    layout: 'fullscreen'
  }
}`,...(c=(o=s.parameters)==null?void 0:o.docs)==null?void 0:c.source},description:{story:`Foundation Principles

Accessible buttons work for everyone, not just assistive technology users.
They provide clear context, proper semantics, and predictable behavior.`,...(l=(d=s.parameters)==null?void 0:d.docs)==null?void 0:l.description}}};var m,u,p,v,x;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-4 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Keyboard Navigation</h3>
        <p className="text-sm text-muted-foreground">
          Use Tab to navigate, Space or Enter to activate. Focus indicators show current position
          clearly.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Button variant="primary">First Action</Button>
          <Button variant="secondary">Second Action</Button>
          <Button variant="outline">Third Action</Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            • <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Tab</kbd> to navigate between
            buttons
          </div>
          <div>
            • <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Space</kbd> or{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to activate
          </div>
          <div>• Focus ring provides clear visual indication</div>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Keyboard navigation patterns that create intuitive, predictable interaction flows for all users.'
      }
    },
    layout: 'fullscreen'
  }
}`,...(p=(u=t.parameters)==null?void 0:u.docs)==null?void 0:p.source},description:{story:`Natural Navigation

Keyboard navigation should feel intuitive and predictable.
Focus management creates smooth, logical interaction flows.`,...(x=(v=t.parameters)==null?void 0:v.docs)==null?void 0:x.description}}};var h,y,g,b,N;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 p-4 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Universal Design Through Contrast</h3>
        <p className="text-sm text-muted-foreground">
          High contrast benefits everyone: users with low vision, people in bright sunlight, and
          anyone using older displays.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-base font-medium">Standard Lighting</h4>
          <div className="p-4 bg-background border rounded">
            <div className="space-y-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="outline">Outline Action</Button>
              <Button variant="ghost">Ghost Action</Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-base font-medium">High Contrast Simulation</h4>
          <div className="p-4 bg-white border rounded">
            <div className="space-y-3">
              <Button variant="primary" className="contrast-more:bg-black contrast-more:text-white">
                Primary Action
              </Button>
              <Button variant="secondary" className="contrast-more:border-black contrast-more:text-black">
                Secondary Action
              </Button>
              <Button variant="outline" className="contrast-more:border-black contrast-more:text-black">
                Outline Action
              </Button>
              <Button variant="ghost" className="contrast-more:text-black hover:contrast-more:bg-gray-200">
                Ghost Action
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <div>
          All button variants maintain WCAG AA contrast ratios (4.5:1) for optimal readability
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Color contrast demonstration showing how proper contrast ratios benefit all users across different viewing conditions.'
      }
    },
    layout: 'fullscreen'
  }
}`,...(g=(y=i.parameters)==null?void 0:y.docs)==null?void 0:g.source},description:{story:`Universal Design

Color contrast and visual design serve functional purposes.
High contrast improves readability in all lighting conditions.`,...(N=(b=i.parameters)==null?void 0:b.docs)==null?void 0:N.description}}};var f,j,A,S,B;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-4 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Screen Reader Optimization</h3>
        <p className="text-sm text-muted-foreground">
          Semantic markup and ARIA attributes create clear, navigable experiences for screen reader
          users.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-base font-medium">Action Context</h4>
          <div className="space-y-2">
            <Button aria-describedby="save-description" variant="primary">
              Save Changes
            </Button>
            <div id="save-description" className="text-xs text-muted-foreground">
              Saves your current document progress to the cloud
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Loading State</h4>
          <div className="space-y-2">
            <Button disabled aria-live="polite" aria-busy="true">
              Processing...
            </Button>
            <div className="text-xs text-muted-foreground">
              aria-live and aria-busy communicate loading state to screen readers
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Toggle State</h4>
          <div className="space-y-2">
            <Button variant="secondary" aria-pressed={false} aria-label="Add item to favorites">
              Favorite
            </Button>
            <div className="text-xs text-muted-foreground">
              aria-pressed indicates current toggle state clearly
            </div>
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Screen reader optimization techniques that create clear, navigable experiences through semantic markup and ARIA attributes.'
      }
    },
    layout: 'fullscreen'
  }
}`,...(A=(j=r.parameters)==null?void 0:j.docs)==null?void 0:A.source},description:{story:`Screen Reader Optimization

Screen readers need semantic structure and clear relationships.
Proper markup creates predictable, navigable experiences.`,...(B=(S=r.parameters)==null?void 0:S.docs)==null?void 0:B.description}}};const R=["AccessibilityBasics","KeyboardNavigation","ColorContrastDemo","ScreenReaderOptimization"];export{s as AccessibilityBasics,i as ColorContrastDemo,t as KeyboardNavigation,r as ScreenReaderOptimization,R as __namedExportsOrder,P as default};
