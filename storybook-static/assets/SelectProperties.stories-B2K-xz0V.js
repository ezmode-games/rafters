import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{S as r,a,b as i,c as s,d as t}from"./Select-BQoa9TWO.js";import"./iframe-Cy2I62ob.js";import"./index-Cox8WoOv.js";import"./index-DYn9WTcg.js";import"./index-BB5JR4LJ.js";import"./index-DuwuiYca.js";import"./index-DoQPmrLJ.js";import"./index-LIN26vHB.js";import"./utils-DuMXYCiK.js";const{fn:B}=__STORYBOOK_MODULE_TEST__,$={title:"03 Components/Form/Select/Properties & States",component:r,parameters:{layout:"centered",docs:{description:{component:"Properties that control size, behavior, and interaction characteristics of selects within interface contexts."}}},tags:["autodocs"],args:{onValueChange:B()}},l={render:()=>e.jsx("div",{className:"w-64",children:e.jsxs(r,{children:[e.jsx(a,{children:e.jsx(i,{placeholder:"Select an option"})}),e.jsxs(s,{children:[e.jsx(t,{value:"option1",children:"Option One"}),e.jsx(t,{value:"option2",children:"Option Two"}),e.jsx(t,{value:"option3",children:"Option Three"})]})]})}),parameters:{docs:{description:{story:"Standard size select with balanced proportions for general form usage and interface contexts."}}}},c={render:()=>e.jsx("div",{className:"w-64",children:e.jsxs(r,{children:[e.jsx(a,{size:"large",children:e.jsx(i,{placeholder:"Enhanced touch target"})}),e.jsxs(s,{children:[e.jsx(t,{value:"large1",children:"Large Option One"}),e.jsx(t,{value:"large2",children:"Large Option Two"}),e.jsx(t,{value:"large3",children:"Large Option Three"})]})]})}),parameters:{docs:{description:{story:"Large size select with 44px minimum touch targets for improved motor accessibility and touch interface usability."}}}},n={render:()=>e.jsx("div",{className:"w-64",children:e.jsxs(r,{children:[e.jsx(a,{showCount:!0,itemCount:6,children:e.jsx(i,{placeholder:"Choose from available options"})}),e.jsxs(s,{children:[e.jsx(t,{value:"apple",children:"Apple"}),e.jsx(t,{value:"banana",children:"Banana"}),e.jsx(t,{value:"cherry",children:"Cherry"}),e.jsx(t,{value:"date",children:"Date"}),e.jsx(t,{value:"elderberry",children:"Elderberry"}),e.jsx(t,{value:"fig",children:"Fig"})]})]})}),parameters:{docs:{description:{story:"Item count display provides cognitive load reduction by showing the total number of available choices upfront."}}}},o={render:()=>e.jsx("div",{className:"w-64",children:e.jsxs(r,{children:[e.jsx(a,{showCount:!0,itemCount:15,children:e.jsx(i,{placeholder:"Search large option set"})}),e.jsxs(s,{searchable:!0,searchPlaceholder:"Search countries...",children:[e.jsx(t,{value:"us",children:"United States"}),e.jsx(t,{value:"uk",children:"United Kingdom"}),e.jsx(t,{value:"ca",children:"Canada"}),e.jsx(t,{value:"au",children:"Australia"}),e.jsx(t,{value:"de",children:"Germany"}),e.jsx(t,{value:"fr",children:"France"}),e.jsx(t,{value:"it",children:"Italy"}),e.jsx(t,{value:"es",children:"Spain"}),e.jsx(t,{value:"nl",children:"Netherlands"}),e.jsx(t,{value:"se",children:"Sweden"}),e.jsx(t,{value:"no",children:"Norway"}),e.jsx(t,{value:"dk",children:"Denmark"}),e.jsx(t,{value:"fi",children:"Finland"}),e.jsx(t,{value:"ie",children:"Ireland"}),e.jsx(t,{value:"ch",children:"Switzerland"})]})]})}),parameters:{docs:{description:{story:"Search functionality enables progressive disclosure for large option sets, reducing cognitive load and improving findability."}}}},d={render:()=>e.jsx("div",{className:"w-64",children:e.jsxs(r,{disabled:!0,children:[e.jsx(a,{children:e.jsx(i,{placeholder:"Not available"})}),e.jsxs(s,{children:[e.jsx(t,{value:"disabled1",children:"Disabled Option 1"}),e.jsx(t,{value:"disabled2",children:"Disabled Option 2"})]})]})}),parameters:{docs:{description:{story:"Disabled state communicates unavailability while maintaining visual consistency in form layouts."}}}},u={render:()=>e.jsxs("div",{className:"w-64 space-y-2",children:[e.jsxs("label",{htmlFor:"required-select",className:"text-sm font-medium",children:["Required Selection ",e.jsx("span",{className:"text-destructive",children:"*"})]}),e.jsxs(r,{required:!0,children:[e.jsx(a,{id:"required-select","aria-required":"true",children:e.jsx(i,{placeholder:"Must select an option"})}),e.jsxs(s,{children:[e.jsx(t,{value:"required1",children:"Required Option 1"}),e.jsx(t,{value:"required2",children:"Required Option 2"}),e.jsx(t,{value:"required3",children:"Required Option 3"})]})]})]}),parameters:{docs:{description:{story:"Required state with proper ARIA attributes and visual indication for mandatory form fields."}}}};var m,p,h,S,v;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="w-64">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option One</SelectItem>
          <SelectItem value="option2">Option Two</SelectItem>
          <SelectItem value="option3">Option Three</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Standard size select with balanced proportions for general form usage and interface contexts.'
      }
    }
  }
}`,...(h=(p=l.parameters)==null?void 0:p.docs)==null?void 0:h.source},description:{story:`Standard Size

Default size provides balanced presence in most interface contexts.
Optimal for forms and standard selection scenarios.`,...(v=(S=l.parameters)==null?void 0:S.docs)==null?void 0:v.description}}};var g,x,I,j,y;c.parameters={...c.parameters,docs:{...(g=c.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="w-64">
      <Select>
        <SelectTrigger size="large">
          <SelectValue placeholder="Enhanced touch target" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="large1">Large Option One</SelectItem>
          <SelectItem value="large2">Large Option Two</SelectItem>
          <SelectItem value="large3">Large Option Three</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Large size select with 44px minimum touch targets for improved motor accessibility and touch interface usability.'
      }
    }
  }
}`,...(I=(x=c.parameters)==null?void 0:x.docs)==null?void 0:I.source},description:{story:`Enhanced Touch Targets

Large size improves motor accessibility with enhanced touch targets.
Better usability for touch interfaces and users with motor difficulties.`,...(y=(j=c.parameters)==null?void 0:j.docs)==null?void 0:y.description}}};var b,f,w,C,O;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div className="w-64">
      <Select>
        <SelectTrigger showCount itemCount={6}>
          <SelectValue placeholder="Choose from available options" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="elderberry">Elderberry</SelectItem>
          <SelectItem value="fig">Fig</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Item count display provides cognitive load reduction by showing the total number of available choices upfront.'
      }
    }
  }
}`,...(w=(f=n.parameters)==null?void 0:f.docs)==null?void 0:w.source},description:{story:`Choice Architecture

Item count display helps users understand the scope of available choices.
Reduces cognitive load by setting clear expectations.`,...(O=(C=n.parameters)==null?void 0:C.docs)==null?void 0:O.description}}};var q,T,N,D,R;o.parameters={...o.parameters,docs:{...(q=o.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="w-64">
      <Select>
        <SelectTrigger showCount itemCount={15}>
          <SelectValue placeholder="Search large option set" />
        </SelectTrigger>
        <SelectContent searchable searchPlaceholder="Search countries...">
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="it">Italy</SelectItem>
          <SelectItem value="es">Spain</SelectItem>
          <SelectItem value="nl">Netherlands</SelectItem>
          <SelectItem value="se">Sweden</SelectItem>
          <SelectItem value="no">Norway</SelectItem>
          <SelectItem value="dk">Denmark</SelectItem>
          <SelectItem value="fi">Finland</SelectItem>
          <SelectItem value="ie">Ireland</SelectItem>
          <SelectItem value="ch">Switzerland</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Search functionality enables progressive disclosure for large option sets, reducing cognitive load and improving findability.'
      }
    }
  }
}`,...(N=(T=o.parameters)==null?void 0:T.docs)==null?void 0:N.source},description:{story:`Progressive Disclosure

Search functionality for large option sets reduces cognitive burden.
Automatic search threshold helps manage complex choices.`,...(R=(D=o.parameters)==null?void 0:D.docs)==null?void 0:R.description}}};var z,L,A,F,E;d.parameters={...d.parameters,docs:{...(z=d.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <div className="w-64">
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Not available" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="disabled1">Disabled Option 1</SelectItem>
          <SelectItem value="disabled2">Disabled Option 2</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Disabled state communicates unavailability while maintaining visual consistency in form layouts.'
      }
    }
  }
}`,...(A=(L=d.parameters)==null?void 0:L.docs)==null?void 0:A.source},description:{story:`Disabled State

Disabled selects communicate unavailability while maintaining layout structure.
Clear visual indication prevents interaction attempts.`,...(E=(F=d.parameters)==null?void 0:F.docs)==null?void 0:E.description}}};var V,_,k,P,U;u.parameters={...u.parameters,docs:{...(V=u.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => <div className="w-64 space-y-2">
      <label htmlFor="required-select" className="text-sm font-medium">
        Required Selection <span className="text-destructive">*</span>
      </label>
      <Select required>
        <SelectTrigger id="required-select" aria-required="true">
          <SelectValue placeholder="Must select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="required1">Required Option 1</SelectItem>
          <SelectItem value="required2">Required Option 2</SelectItem>
          <SelectItem value="required3">Required Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Required state with proper ARIA attributes and visual indication for mandatory form fields.'
      }
    }
  }
}`,...(k=(_=u.parameters)==null?void 0:_.docs)==null?void 0:k.source},description:{story:`Required Field

Required state communicates necessity for form completion.
Clear indication helps users understand mandatory selections.`,...(U=(P=u.parameters)==null?void 0:P.docs)==null?void 0:U.description}}};const ee=["Default","Large","WithItemCount","WithSearch","Disabled","Required"];export{l as Default,d as Disabled,c as Large,u as Required,n as WithItemCount,o as WithSearch,ee as __namedExportsOrder,$ as default};
