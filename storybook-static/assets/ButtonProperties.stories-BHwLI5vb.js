import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{B as t}from"./Button-B50RvQza.js";import"./index-DuwuiYca.js";import"./iframe-Cy2I62ob.js";import"./utils-DuMXYCiK.js";const{fn:Y}=__STORYBOOK_MODULE_TEST__,W={title:"03 Components/Action/Button/Properties & States",component:t,parameters:{layout:"centered",docs:{description:{component:"Properties that control size, state, and behavioral characteristics of buttons within interface contexts."}}},tags:["autodocs"],args:{onClick:Y()}},s={args:{size:"sm",children:"Small Action"},parameters:{docs:{description:{story:"Small buttons conserve space in dense interfaces, toolbars, or when multiple actions need to coexist in limited space."}}}},a={args:{size:"md",children:"Standard Action"},parameters:{docs:{description:{story:"Medium buttons offer the ideal balance of touch target size and visual weight. Use as the default size for most interface contexts."}}}},n={args:{size:"lg",children:"Primary Action"},parameters:{docs:{description:{story:"Large buttons provide maximum touch target size and visual prominence. Ideal for mobile interfaces, landing pages, or critical call-to-action moments."}}}},i={args:{disabled:!0,children:"Unavailable Action"},parameters:{docs:{description:{story:"Disabled buttons maintain layout structure while clearly communicating that the action is temporarily unavailable. Use for context-dependent actions or during loading states."}}}},r={render:()=>e.jsx("div",{className:"space-y-6 p-4",children:e.jsxs("div",{className:"space-y-3",children:[e.jsx("h3",{className:"text-lg font-medium",children:"Interactive Feedback"}),e.jsx("p",{className:"text-sm text-muted-foreground max-w-md",children:"Hover and focus to see the interactive feedback that guides user interaction."}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx(t,{variant:"primary",children:"Hover Me"}),e.jsx(t,{variant:"secondary",children:"Focus Me"}),e.jsx(t,{variant:"outline",children:"Try Both"})]})]})}),parameters:{docs:{description:{story:"Interactive states provide essential visual feedback that confirms responsiveness and guides user interaction patterns."}}}},o={render:()=>e.jsxs("div",{className:"space-y-4 p-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"text-lg font-medium",children:"Composition with asChild"}),e.jsx("p",{className:"text-sm text-muted-foreground max-w-md",children:"Use asChild when you need button styling on other elements like links."})]}),e.jsx(t,{asChild:!0,variant:"primary",children:e.jsx("a",{href:"#example",className:"inline-block",children:"Link as Button"})})]}),parameters:{docs:{description:{story:"The asChild property enables composition patterns, allowing button styles to be applied to other elements like links while maintaining proper semantics."}}}},c={render:()=>e.jsxs("div",{className:"flex items-center gap-4 p-4",children:[e.jsx(t,{size:"sm",children:"Small"}),e.jsx(t,{size:"md",children:"Medium"}),e.jsx(t,{size:"lg",children:"Large"})]}),parameters:{docs:{description:{story:"A side-by-side comparison of all button sizes showing their scale relationships and appropriate use contexts."}}}};var d,l,m,p,u;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    children: 'Small Action'
  },
  parameters: {
    docs: {
      description: {
        story: 'Small buttons conserve space in dense interfaces, toolbars, or when multiple actions need to coexist in limited space.'
      }
    }
  }
}`,...(m=(l=s.parameters)==null?void 0:l.docs)==null?void 0:m.source},description:{story:`Compact Interfaces

Small buttons fit naturally in dense layouts and toolbars.
They maintain functionality while conserving space.`,...(u=(p=s.parameters)==null?void 0:p.docs)==null?void 0:u.description}}};var h,g,y,f,v;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    size: 'md',
    children: 'Standard Action'
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium buttons offer the ideal balance of touch target size and visual weight. Use as the default size for most interface contexts.'
      }
    }
  }
}`,...(y=(g=a.parameters)==null?void 0:g.docs)==null?void 0:y.source},description:{story:`Balanced Presence

Medium buttons provide the optimal balance of accessibility and space efficiency.
This is the default size for most interface contexts.`,...(v=(f=a.parameters)==null?void 0:f.docs)==null?void 0:v.description}}};var b,x,S,w,z;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    children: 'Primary Action'
  },
  parameters: {
    docs: {
      description: {
        story: 'Large buttons provide maximum touch target size and visual prominence. Ideal for mobile interfaces, landing pages, or critical call-to-action moments.'
      }
    }
  }
}`,...(S=(x=n.parameters)==null?void 0:x.docs)==null?void 0:S.source},description:{story:`Prominent Actions

Large buttons command attention and improve accessibility.
They excel in mobile interfaces and call-to-action contexts.`,...(z=(w=n.parameters)==null?void 0:w.docs)==null?void 0:z.description}}};var B,N,k,j,C;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: 'Unavailable Action'
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled buttons maintain layout structure while clearly communicating that the action is temporarily unavailable. Use for context-dependent actions or during loading states.'
      }
    }
  }
}`,...(k=(N=i.parameters)==null?void 0:N.docs)==null?void 0:k.source},description:{story:`Unavailable State

Disabled buttons maintain layout while preventing interaction.
They communicate temporary unavailability clearly.`,...(C=(j=i.parameters)==null?void 0:j.docs)==null?void 0:C.description}}};var A,T,M,U,I;r.parameters={...r.parameters,docs:{...(A=r.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 p-4">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Interactive Feedback</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Hover and focus to see the interactive feedback that guides user interaction.
        </p>
        <div className="flex gap-4">
          <Button variant="primary">Hover Me</Button>
          <Button variant="secondary">Focus Me</Button>
          <Button variant="outline">Try Both</Button>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Interactive states provide essential visual feedback that confirms responsiveness and guides user interaction patterns.'
      }
    }
  }
}`,...(M=(T=r.parameters)==null?void 0:T.docs)==null?void 0:M.source},description:{story:`Interactive Feedback

Hover and focus states provide essential feedback for user interactions.
They confirm responsiveness and guide interaction patterns.`,...(I=(U=r.parameters)==null?void 0:U.docs)==null?void 0:I.description}}};var L,_,D,F,P;o.parameters={...o.parameters,docs:{...(L=o.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Composition with asChild</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Use asChild when you need button styling on other elements like links.
        </p>
      </div>
      <Button asChild variant="primary">
        <a href="#example" className="inline-block">
          Link as Button
        </a>
      </Button>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'The asChild property enables composition patterns, allowing button styles to be applied to other elements like links while maintaining proper semantics.'
      }
    }
  }
}`,...(D=(_=o.parameters)==null?void 0:_.docs)==null?void 0:D.source},description:{story:`Composition Flexibility

The asChild property enables composition patterns with Radix Slot.
This allows buttons to wrap other elements while maintaining semantics.`,...(P=(F=o.parameters)==null?void 0:F.docs)==null?void 0:P.description}}};var H,O,E,R,K;c.parameters={...c.parameters,docs:{...(H=c.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4 p-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'A side-by-side comparison of all button sizes showing their scale relationships and appropriate use contexts.'
      }
    }
  }
}`,...(E=(O=c.parameters)==null?void 0:O.docs)==null?void 0:E.source},description:{story:`Size Comparison

Understanding the scale relationships helps choose appropriate sizes
for different interface contexts and user needs.`,...(K=(R=c.parameters)==null?void 0:R.docs)==null?void 0:K.description}}};const X=["Small","Medium","Large","Disabled","InteractiveStates","AsChild","SizeComparison"];export{o as AsChild,i as Disabled,r as InteractiveStates,n as Large,a as Medium,c as SizeComparison,s as Small,X as __namedExportsOrder,W as default};
