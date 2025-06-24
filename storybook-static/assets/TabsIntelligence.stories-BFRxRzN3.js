import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as u}from"./iframe-Cy2I62ob.js";import{T as t,a as n,b as a,c as s,d as B}from"./Tabs-Bcyagkfc.js";import"./index-BB5JR4LJ.js";import"./index-DuwuiYca.js";import"./index-LIN26vHB.js";import"./index-DoQPmrLJ.js";import"./index-Cox8WoOv.js";import"./utils-DuMXYCiK.js";const U={title:"03 Components/Navigation/Tabs/Intelligence",component:t,parameters:{layout:"centered",docs:{description:{component:"Cognitive load optimized tabs that prevent user confusion through wayfinding intelligence, mental model building, and smart navigation patterns. Designed to reduce cognitive overhead while maintaining clear navigation paths."}}},tags:["autodocs"]},r={render:()=>{const[i,d]=u.useState("overview");return e.jsxs(e.Fragment,{children:[e.jsx("h3",{children:"Optimal Tab Count and Grouping"}),e.jsxs("div",{className:"w-full max-w-2xl space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-medium",children:"Optimal Tab Group (5 tabs)"}),e.jsxs(t,{defaultValue:"overview",cognitiveLoad:"minimal",children:[e.jsxs(n,{children:[e.jsx(a,{value:"overview",children:"Overview"}),e.jsx(a,{value:"details",children:"Details"}),e.jsx(a,{value:"settings",children:"Settings"}),e.jsx(a,{value:"security",children:"Security"}),e.jsx(a,{value:"billing",children:"Billing"})]}),e.jsx(s,{value:"overview",className:"p-4",children:e.jsx("p",{children:"Overview content - easy to find and understand"})}),e.jsx(s,{value:"details",className:"p-4",children:e.jsx("p",{children:"Details content - clearly grouped information"})}),e.jsx(s,{value:"settings",className:"p-4",children:e.jsx("p",{children:"Settings content - logical organization"})}),e.jsx(s,{value:"security",className:"p-4",children:e.jsx("p",{children:"Security content - important but not overwhelming"})}),e.jsx(s,{value:"billing",className:"p-4",children:e.jsx("p",{children:"Billing content - separate concern, clearly labeled"})})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Perfect cognitive load - users can scan and choose easily"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-medium",children:"Complex Tab Group (needs grouping)"}),e.jsxs(t,{defaultValue:"general",cognitiveLoad:"complex",children:[e.jsxs(n,{density:"compact",children:[e.jsx(a,{value:"general",children:"General"}),e.jsx(a,{value:"profile",children:"Profile"}),e.jsx(a,{value:"privacy",children:"Privacy"}),e.jsx(a,{value:"notifications",children:"Notifications"}),e.jsx(a,{value:"integrations",children:"Integrations"}),e.jsx(a,{value:"api",children:"API"}),e.jsx(a,{value:"billing",children:"Billing"}),e.jsx(a,{value:"usage",children:"Usage"}),e.jsx(a,{value:"support",children:"Support"})]}),e.jsx(s,{value:"general",className:"p-4",children:e.jsx("p",{children:"Too many options create decision paralysis"})}),e.jsx(s,{value:"profile",className:"p-4",children:e.jsx("p",{children:"Users struggle to scan this many options"})}),e.jsx(s,{value:"privacy",className:"p-4",children:e.jsx("p",{children:"Related settings should be grouped together"})})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"High cognitive load - consider grouping or progressive disclosure"})]})]})]})}},o={render:()=>{const[i,d]=u.useState("dashboard"),p=[{value:"dashboard",label:"Dashboard"},{value:"analytics",label:"Analytics"},{value:"reports",label:"Reports"},{value:"settings",label:"Settings"}];return e.jsxs(e.Fragment,{children:[e.jsx("h3",{children:"Navigation Context and Wayfinding"}),e.jsxs("div",{className:"w-full max-w-2xl space-y-4",children:[e.jsxs(t,{value:i,onValueChange:d,wayfinding:!0,children:[e.jsx(B,{activeTab:i,tabs:p}),e.jsxs(n,{variant:"underline",children:[e.jsx(a,{value:"dashboard",icon:"📊",children:"Dashboard"}),e.jsx(a,{value:"analytics",icon:"📈",badge:"3",children:"Analytics"}),e.jsx(a,{value:"reports",icon:"📋",children:"Reports"}),e.jsx(a,{value:"settings",icon:"⚙️",children:"Settings"})]}),e.jsxs(s,{value:"dashboard",className:"p-4 border rounded",children:[e.jsx("h4",{className:"font-medium mb-2",children:"Dashboard Overview"}),e.jsx("p",{children:"Clear visual feedback shows current location in navigation hierarchy"})]}),e.jsxs(s,{value:"analytics",className:"p-4 border rounded",children:[e.jsx("h4",{className:"font-medium mb-2",children:"Analytics Data"}),e.jsx("p",{children:"Badge notifications provide context without overwhelming"})]}),e.jsxs(s,{value:"reports",className:"p-4 border rounded",children:[e.jsx("h4",{className:"font-medium mb-2",children:"Report Generation"}),e.jsx("p",{children:"Icons help with recognition and reduce cognitive load"})]}),e.jsxs(s,{value:"settings",className:"p-4 border rounded",children:[e.jsx("h4",{className:"font-medium mb-2",children:"System Settings"}),e.jsx("p",{children:"Consistent patterns build user confidence"})]})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Breadcrumb shows location, icons aid recognition, badges provide context"})]})]})}},l={render:()=>{const[i,d]=u.useState("account"),[p,D]=u.useState("profile");return e.jsxs(e.Fragment,{children:[e.jsx("h3",{children:"Hierarchical Mental Models"}),e.jsxs("div",{className:"w-full max-w-3xl space-y-4",children:[e.jsxs(t,{value:i,onValueChange:d,children:[e.jsxs(n,{variant:"pills",density:"spacious",children:[e.jsx(a,{value:"account",children:"Account"}),e.jsx(a,{value:"workspace",children:"Workspace"}),e.jsx(a,{value:"integration",children:"Integrations"})]}),e.jsx(s,{value:"account",className:"mt-4",children:e.jsxs(t,{value:p,onValueChange:D,orientation:"horizontal",children:[e.jsxs(n,{variant:"underline",density:"comfortable",children:[e.jsx(a,{value:"profile",children:"Profile"}),e.jsx(a,{value:"security",children:"Security"}),e.jsx(a,{value:"preferences",children:"Preferences"})]}),e.jsxs(s,{value:"profile",className:"p-4 bg-muted/30 rounded mt-2",children:[e.jsx("h4",{className:"font-medium mb-2",children:"Profile Information"}),e.jsx("p",{children:"Personal details and public information settings"})]}),e.jsxs(s,{value:"security",className:"p-4 bg-muted/30 rounded mt-2",children:[e.jsx("h4",{className:"font-medium mb-2",children:"Security Settings"}),e.jsx("p",{children:"Password, two-factor authentication, and login history"})]}),e.jsxs(s,{value:"preferences",className:"p-4 bg-muted/30 rounded mt-2",children:[e.jsx("h4",{className:"font-medium mb-2",children:"User Preferences"}),e.jsx("p",{children:"Theme, language, and notification settings"})]})]})}),e.jsxs(s,{value:"workspace",className:"p-4 bg-muted/30 rounded",children:[e.jsx("h4",{className:"font-medium mb-2",children:"Workspace Settings"}),e.jsx("p",{children:"Team management, project settings, and collaboration tools"})]}),e.jsxs(s,{value:"integration",className:"p-4 bg-muted/30 rounded",children:[e.jsx("h4",{className:"font-medium mb-2",children:"Integration Management"}),e.jsx("p",{children:"Connected services, API keys, and third-party applications"})]})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Hierarchical organization builds clear mental models of system structure"})]})]})}},c={render:()=>e.jsxs(e.Fragment,{children:[e.jsx("h3",{children:"Enhanced Motor Accessibility"}),e.jsxs("div",{className:"w-full max-w-2xl space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-medium",children:"Large Touch Targets"}),e.jsxs(t,{defaultValue:"home",children:[e.jsxs(n,{density:"spacious",children:[e.jsx(a,{value:"home",children:"Home"}),e.jsx(a,{value:"products",children:"Products"}),e.jsx(a,{value:"services",children:"Services"}),e.jsx(a,{value:"contact",children:"Contact"})]}),e.jsx(s,{value:"home",className:"p-4",children:e.jsx("p",{children:"44px minimum touch targets meet accessibility guidelines"})}),e.jsx(s,{value:"products",className:"p-4",children:e.jsx("p",{children:"Enhanced spacing prevents accidental activation"})}),e.jsx(s,{value:"services",className:"p-4",children:e.jsx("p",{children:"Consistent hit areas reduce motor precision requirements"})}),e.jsx(s,{value:"contact",className:"p-4",children:e.jsx("p",{children:"Generous padding accommodates various interaction methods"})})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-medium",children:"Keyboard Navigation Support"}),e.jsxs(t,{defaultValue:"tab1",children:[e.jsxs(n,{children:[e.jsx(a,{value:"tab1",children:"Tab 1"}),e.jsx(a,{value:"tab2",children:"Tab 2"}),e.jsx(a,{value:"tab3",disabled:!0,children:"Disabled"}),e.jsx(a,{value:"tab4",children:"Tab 4"})]}),e.jsx(s,{value:"tab1",className:"p-4",children:e.jsx("p",{children:"Arrow keys navigate between tabs, Enter/Space activates"})}),e.jsx(s,{value:"tab2",className:"p-4",children:e.jsx("p",{children:"Focus indicators clearly show current position"})}),e.jsx(s,{value:"tab4",className:"p-4",children:e.jsx("p",{children:"Disabled tabs are properly skipped in navigation"})})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Full keyboard support with clear focus indicators and proper tab order"})]})]})]})};var g,m,b,v,h;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const [activeTab, setActiveTab] = useState('overview');
    return <>
        <h3>Optimal Tab Count and Grouping</h3>
        
        <div className="w-full max-w-2xl space-y-6">
          {/* Optimal: 5 tabs (within cognitive limits) */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Optimal Tab Group (5 tabs)</h4>
            <Tabs defaultValue="overview" cognitiveLoad="minimal">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-4">
                <p>Overview content - easy to find and understand</p>
              </TabsContent>
              <TabsContent value="details" className="p-4">
                <p>Details content - clearly grouped information</p>
              </TabsContent>
              <TabsContent value="settings" className="p-4">
                <p>Settings content - logical organization</p>
              </TabsContent>
              <TabsContent value="security" className="p-4">
                <p>Security content - important but not overwhelming</p>
              </TabsContent>
              <TabsContent value="billing" className="p-4">
                <p>Billing content - separate concern, clearly labeled</p>
              </TabsContent>
            </Tabs>
            <p className="text-xs text-muted-foreground">Perfect cognitive load - users can scan and choose easily</p>
          </div>

          {/* Complex: Showing the problem */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Complex Tab Group (needs grouping)</h4>
            <Tabs defaultValue="general" cognitiveLoad="complex">
              <TabsList density="compact">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="p-4">
                <p>Too many options create decision paralysis</p>
              </TabsContent>
              <TabsContent value="profile" className="p-4">
                <p>Users struggle to scan this many options</p>
              </TabsContent>
              <TabsContent value="privacy" className="p-4">
                <p>Related settings should be grouped together</p>
              </TabsContent>
            </Tabs>
            <p className="text-xs text-muted-foreground">High cognitive load - consider grouping or progressive disclosure</p>
          </div>
        </div>
      </>;
  }
}`,...(b=(m=r.parameters)==null?void 0:m.docs)==null?void 0:b.source},description:{story:`Cognitive Load Optimization

Limit tab count and use smart grouping to prevent decision paralysis.
Miller's 7±2 rule applied with visual hierarchy for scanning.`,...(h=(v=r.parameters)==null?void 0:v.docs)==null?void 0:h.description}}};var T,x,j,f,y;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const tabs = [{
      value: 'dashboard',
      label: 'Dashboard'
    }, {
      value: 'analytics',
      label: 'Analytics'
    }, {
      value: 'reports',
      label: 'Reports'
    }, {
      value: 'settings',
      label: 'Settings'
    }];
    return <>
        <h3>Navigation Context and Wayfinding</h3>
        
        <div className="w-full max-w-2xl space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} wayfinding>
            <TabsBreadcrumb activeTab={activeTab} tabs={tabs} />
            <TabsList variant="underline">
              <TabsTrigger value="dashboard" icon="📊">Dashboard</TabsTrigger>
              <TabsTrigger value="analytics" icon="📈" badge="3">Analytics</TabsTrigger>
              <TabsTrigger value="reports" icon="📋">Reports</TabsTrigger>
              <TabsTrigger value="settings" icon="⚙️">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="p-4 border rounded">
              <h4 className="font-medium mb-2">Dashboard Overview</h4>
              <p>Clear visual feedback shows current location in navigation hierarchy</p>
            </TabsContent>
            <TabsContent value="analytics" className="p-4 border rounded">
              <h4 className="font-medium mb-2">Analytics Data</h4>
              <p>Badge notifications provide context without overwhelming</p>
            </TabsContent>
            <TabsContent value="reports" className="p-4 border rounded">
              <h4 className="font-medium mb-2">Report Generation</h4>
              <p>Icons help with recognition and reduce cognitive load</p>
            </TabsContent>
            <TabsContent value="settings" className="p-4 border rounded">
              <h4 className="font-medium mb-2">System Settings</h4>
              <p>Consistent patterns build user confidence</p>
            </TabsContent>
          </Tabs>
          
          <p className="text-xs text-muted-foreground">
            Breadcrumb shows location, icons aid recognition, badges provide context
          </p>
        </div>
      </>;
  }
}`,...(j=(x=o.parameters)==null?void 0:x.docs)==null?void 0:j.source},description:{story:`Wayfinding Intelligence

Clear active states and navigation context prevent user confusion.
Breadcrumb patterns show location within complex tab structures.`,...(y=(f=o.parameters)==null?void 0:f.docs)==null?void 0:y.description}}};var N,C,w,S,A;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => {
    const [activeSection, setActiveSection] = useState('account');
    const [activeSubTab, setActiveSubTab] = useState('profile');
    return <>
        <h3>Hierarchical Mental Models</h3>
        
        <div className="w-full max-w-3xl space-y-4">
          {/* Primary navigation level */}
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList variant="pills" density="spacious">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="workspace">Workspace</TabsTrigger>
              <TabsTrigger value="integration">Integrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="mt-4">
              {/* Secondary navigation level */}
              <Tabs value={activeSubTab} onValueChange={setActiveSubTab} orientation="horizontal">
                <TabsList variant="underline" density="comfortable">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="p-4 bg-muted/30 rounded mt-2">
                  <h4 className="font-medium mb-2">Profile Information</h4>
                  <p>Personal details and public information settings</p>
                </TabsContent>
                <TabsContent value="security" className="p-4 bg-muted/30 rounded mt-2">
                  <h4 className="font-medium mb-2">Security Settings</h4>
                  <p>Password, two-factor authentication, and login history</p>
                </TabsContent>
                <TabsContent value="preferences" className="p-4 bg-muted/30 rounded mt-2">
                  <h4 className="font-medium mb-2">User Preferences</h4>
                  <p>Theme, language, and notification settings</p>
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="workspace" className="p-4 bg-muted/30 rounded">
              <h4 className="font-medium mb-2">Workspace Settings</h4>
              <p>Team management, project settings, and collaboration tools</p>
            </TabsContent>
            
            <TabsContent value="integration" className="p-4 bg-muted/30 rounded">
              <h4 className="font-medium mb-2">Integration Management</h4>
              <p>Connected services, API keys, and third-party applications</p>
            </TabsContent>
          </Tabs>
          
          <p className="text-xs text-muted-foreground">
            Hierarchical organization builds clear mental models of system structure
          </p>
        </div>
      </>;
  }
}`,...(w=(C=l.parameters)==null?void 0:C.docs)==null?void 0:w.source},description:{story:`Mental Model Building

Consistent patterns and logical grouping help users build accurate mental models.
Progressive disclosure manages complexity without hiding functionality.`,...(A=(S=l.parameters)==null?void 0:S.docs)==null?void 0:A.description}}};var P,L,k,I,M;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <>
      <h3>Enhanced Motor Accessibility</h3>
      
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Large Touch Targets</h4>
          <Tabs defaultValue="home">
            <TabsList density="spacious">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="home" className="p-4">
              <p>44px minimum touch targets meet accessibility guidelines</p>
            </TabsContent>
            <TabsContent value="products" className="p-4">
              <p>Enhanced spacing prevents accidental activation</p>
            </TabsContent>
            <TabsContent value="services" className="p-4">
              <p>Consistent hit areas reduce motor precision requirements</p>
            </TabsContent>
            <TabsContent value="contact" className="p-4">
              <p>Generous padding accommodates various interaction methods</p>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Keyboard Navigation Support</h4>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3" disabled>Disabled</TabsTrigger>
              <TabsTrigger value="tab4">Tab 4</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="p-4">
              <p>Arrow keys navigate between tabs, Enter/Space activates</p>
            </TabsContent>
            <TabsContent value="tab2" className="p-4">
              <p>Focus indicators clearly show current position</p>
            </TabsContent>
            <TabsContent value="tab4" className="p-4">
              <p>Disabled tabs are properly skipped in navigation</p>
            </TabsContent>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            Full keyboard support with clear focus indicators and proper tab order
          </p>
        </div>
      </div>
    </>
}`,...(k=(L=c.parameters)==null?void 0:L.docs)==null?void 0:k.source},description:{story:`Motor Accessibility Focus

Enhanced touch targets and keyboard navigation reduce interaction barriers.
Clear focus states and proper ARIA attributes support all interaction methods.`,...(M=(I=c.parameters)==null?void 0:I.docs)==null?void 0:M.description}}};const q=["CognitiveLoadOptimization","WayfindingIntelligence","MentalModelBuilding","MotorAccessibilityFocus"];export{r as CognitiveLoadOptimization,l as MentalModelBuilding,c as MotorAccessibilityFocus,o as WayfindingIntelligence,q as __namedExportsOrder,U as default};
