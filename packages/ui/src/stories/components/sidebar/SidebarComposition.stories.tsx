// @componentStatus published | draft | depreciated
// @version 0.2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, File, FolderOpen, Home, Settings, Users } from 'lucide-react';
import { fn } from 'storybook/test';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarItem,
  SidebarItemIcon,
  SidebarItemText,
  SidebarTitle,
} from '../../../components/Sidebar';
import { MenuProvider } from '../../../providers';

/**
 * AI Training: Sidebar Composition Patterns
 *
 * Demonstrates the new compositional architecture where Sidebar focuses on
 * navigation container functionality while complex menu behaviors are handled
 * by dedicated menu components that compose with the sidebar.
 *
 * COGNITIVE LOAD: 4/10 (reduced from 6/10 through separation of concerns)
 * ATTENTION HIERARCHY: Background wayfinding that supports primary content
 * TRUST BUILDING: Consistent spatial positioning with reliable composition patterns
 * PROGRESSIVE ENHANCEMENT: Basic navigation enhanced through menu composition
 */
const meta = {
  title: 'Components/Sidebar/Composition',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
AI Training: Compositional Sidebar Architecture demonstrates how the refactored Sidebar 
component focuses on navigation container functionality while complex menu behaviors 
are handled by dedicated components.

## Design Intelligence Benefits

- **Reduced Cognitive Load**: 4/10 (down from 6/10) through focused responsibilities
- **Better Maintainability**: Clear separation between container and menu logic
- **Enhanced Composition**: Menu components work independently and compose naturally
- **Trust Building**: Consistent patterns across basic navigation and complex menus

## Composition Patterns

The Sidebar now serves as a navigation container that composes with menu components:

1. **Basic Navigation**: Simple SidebarItem for direct links
2. **Future Composition**: Ready to integrate with DropdownMenu, TreeMenu, etc.
3. **Menu Coordination**: Uses MenuProvider for attention hierarchy management
4. **Progressive Enhancement**: Core functionality with optional menu enhancements
        `,
      },
    },
  },
  argTypes: {
    collapsed: {
      control: 'boolean',
      description: 'Controls sidebar collapsed state',
    },
    collapsible: {
      control: 'boolean',
      description: 'Enables collapse functionality',
    },
    variant: {
      control: 'select',
      options: ['default', 'floating', 'overlay'],
      description: 'Visual variant for different use cases',
    },
    size: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
      description: 'Sizing for cognitive load management',
    },
    onNavigate: {
      description: 'Navigation handler for menu coordination',
    },
  },
  args: {
    onNavigate: fn(),
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compositional Architecture Example
 *
 * Demonstrates the refactored Sidebar focusing on navigation container
 * functionality with clean separation of concerns.
 */
export const CompositionExample: Story = {
  args: {
    collapsed: false,
    collapsible: true,
    variant: 'default',
    size: 'comfortable',
  },
  render: (args) => (
    <div className="flex h-screen bg-background">
      <MenuProvider>
        <Sidebar {...args} className="border-r">
          <SidebarHeader showToggle={true}>
            <SidebarTitle>Dashboard</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            {/* Basic Navigation Items */}
            <SidebarGroup>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/dashboard">
                  <SidebarItemIcon>
                    <Home className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>Dashboard</SidebarItemText>
                </SidebarItem>

                <SidebarItem href="/users">
                  <SidebarItemIcon>
                    <Users className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>Users</SidebarItemText>
                </SidebarItem>

                <SidebarItem href="/settings">
                  <SidebarItemIcon>
                    <Settings className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>Settings</SidebarItemText>
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Placeholder for Future Menu Composition */}
            <SidebarGroup>
              <SidebarGroupLabel>Projects (Future: DropdownMenu)</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem>
                  <SidebarItemIcon>
                    <FolderOpen className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>Current Project</SidebarItemText>
                  <ChevronDown className="w-4 h-4 ml-auto opacity-50" />
                  {/* Future: DropdownMenu will be composed here */}
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Placeholder for Tree Menu */}
            <SidebarGroup>
              <SidebarGroupLabel>Files (Future: TreeMenu)</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem level={0}>
                  <SidebarItemIcon>
                    <FolderOpen className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>src</SidebarItemText>
                </SidebarItem>
                <SidebarItem level={1}>
                  <SidebarItemIcon>
                    <File className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>App.tsx</SidebarItemText>
                </SidebarItem>
                <SidebarItem level={1}>
                  <SidebarItemIcon>
                    <File className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>index.tsx</SidebarItemText>
                </SidebarItem>
                {/* Future: TreeMenu will provide expand/collapse functionality */}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem>
              <SidebarItemIcon>
                <Settings className="w-4 h-4" />
              </SidebarItemIcon>
              <SidebarItemText>User Settings</SidebarItemText>
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>
      </MenuProvider>

      {/* Main content area */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-semibold mb-4">Compositional Sidebar Architecture</h1>
          <div className="prose">
            <p>
              The refactored Sidebar component now focuses on navigation container functionality:
            </p>
            <ul>
              <li>
                <strong>Spatial Consistency</strong>: Reliable positioning and layout management
              </li>
              <li>
                <strong>Basic Navigation</strong>: Simple SidebarItem components for direct links
              </li>
              <li>
                <strong>Composition Ready</strong>: Clean integration points for menu components
              </li>
              <li>
                <strong>Menu Coordination</strong>: MenuProvider manages attention hierarchy
              </li>
            </ul>
            <p>
              Complex menu behaviors (dropdowns, trees, context menus) will be handled by dedicated
              components that compose with the sidebar rather than being embedded within it.
            </p>
          </div>
        </div>
      </main>
    </div>
  ),
};

/**
 * Collapsed State Composition
 *
 * Shows how the composition pattern works in collapsed state,
 * maintaining functionality while reducing visual complexity.
 */
export const CollapsedComposition: Story = {
  args: {
    collapsed: true,
    collapsible: true,
    variant: 'default',
    size: 'comfortable',
  },
  render: (args) => (
    <div className="flex h-screen bg-background">
      <MenuProvider>
        <Sidebar {...args} className="border-r">
          <SidebarHeader showToggle={true}>
            <SidebarTitle>App</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarItem href="/dashboard" showTooltip={true}>
                  <SidebarItemIcon>
                    <Home className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>Dashboard</SidebarItemText>
                </SidebarItem>

                <SidebarItem href="/users" showTooltip={true}>
                  <SidebarItemIcon>
                    <Users className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>Users</SidebarItemText>
                </SidebarItem>

                <SidebarItem href="/settings" showTooltip={true}>
                  <SidebarItemIcon>
                    <Settings className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>Settings</SidebarItemText>
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </MenuProvider>

      <main className="flex-1 p-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-semibold mb-4">Collapsed Composition</h1>
          <p className="text-muted-foreground">
            Even in collapsed state, the composition architecture maintains clean separation between
            navigation container (Sidebar) and menu functionality (future menu components).
          </p>
        </div>
      </main>
    </div>
  ),
};

/**
 * Menu Coordination Demo
 *
 * Demonstrates how MenuProvider coordinates attention hierarchy
 * between different navigation elements.
 */
export const MenuCoordination: Story = {
  args: {
    collapsed: false,
    collapsible: true,
    variant: 'default',
    size: 'comfortable',
  },
  render: (args) => (
    <div className="flex h-screen bg-background">
      <MenuProvider
        maxCognitiveLoad={15}
        onLoadExceeded={(current, max) => console.log(`Cognitive load exceeded: ${current}/${max}`)}
      >
        <Sidebar {...args} className="border-r">
          <SidebarHeader showToggle={true}>
            <SidebarTitle>Coordinated Navigation</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation with Coordination</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/dashboard">
                  <SidebarItemIcon>
                    <Home className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>Dashboard</SidebarItemText>
                </SidebarItem>

                <SidebarItem href="/users">
                  <SidebarItemIcon>
                    <Users className="w-4 h-4" />
                  </SidebarItemIcon>
                  <SidebarItemText>Users</SidebarItemText>
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="text-xs text-muted-foreground p-2">
              MenuProvider coordinates attention hierarchy and manages cognitive load budget
            </div>
          </SidebarFooter>
        </Sidebar>
      </MenuProvider>

      <main className="flex-1 p-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-semibold mb-4">Menu Coordination System</h1>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h2 className="font-medium mb-2">Coordination Features</h2>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • Attention hierarchy management (Context → Navigation → Dropdown → Breadcrumb)
              </li>
              <li>• Cognitive load budgeting (15-point maximum)</li>
              <li>• Focus coordination across menu types</li>
              <li>• State synchronization between components</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  ),
};
