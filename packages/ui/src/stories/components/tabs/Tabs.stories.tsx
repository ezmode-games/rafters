import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/Tabs';

/**
 * Tabs organize content sections while respecting cognitive limits and enabling efficient
 * navigation. They provide clear visual hierarchy and semantic structure that builds
 * accurate mental models without overwhelming users with too many simultaneous choices.
 */
const meta = {
  title: '03 Components/Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Guidelines
 *
 * Limit to 5-7 tabs. Use semantic labels. Group logically.
 */
export const UsageGuidelines: Story = {
  render: () => (
    <Tabs defaultValue="optimal">
      <TabsList>
        <TabsTrigger value="optimal">Optimal</TabsTrigger>
        <TabsTrigger value="overload">Overload</TabsTrigger>
      </TabsList>
      <TabsContent value="optimal">
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <p className="text-body-small">Clear navigation within cognitive limits</p>
          </TabsContent>
        </Tabs>
      </TabsContent>
      <TabsContent value="overload">
        <Tabs defaultValue="general">
          <TabsList>
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
          <TabsContent value="general">
            <p className="text-body-small text-muted-foreground">
              Too many choices create decision paralysis
            </p>
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Overview
 *
 * Basic three-tab structure for content organization.
 */
export const Overview: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-body-small">Overview content</p>
      </TabsContent>
      <TabsContent value="details">
        <p className="text-body-small">Detailed information</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-body-small">Settings and configuration</p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Content Sections
 *
 * Four-tab organization for related functionality.
 */
export const ContentSections: Story = {
  render: () => (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <p className="text-body-small">Profile Information</p>
      </TabsContent>
      <TabsContent value="account">
        <p className="text-body-small">Account Settings</p>
      </TabsContent>
      <TabsContent value="billing">
        <p className="text-body-small">Billing Information</p>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="text-body-small">Notification Settings</p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Hierarchical
 *
 * Nested tabs for complex information architecture.
 */
export const Hierarchical: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="workspace">Workspace</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <p className="text-body-small">Personal information and public profile</p>
          </TabsContent>
          <TabsContent value="security">
            <p className="text-body-small">Password and authentication</p>
          </TabsContent>
          <TabsContent value="preferences">
            <p className="text-body-small">Interface and notification preferences</p>
          </TabsContent>
        </Tabs>
      </TabsContent>
      <TabsContent value="workspace">
        <p className="text-body-small">Team management and project settings</p>
      </TabsContent>
      <TabsContent value="integrations">
        <p className="text-body-small">Connected services and API configuration</p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * State Management
 *
 * Disabled states and conditional content.
 */
export const WithDisabledTabs: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <p className="text-body-small">Currently active items</p>
      </TabsContent>
      <TabsContent value="pending">
        <p className="text-body-small">Items awaiting approval</p>
      </TabsContent>
      <TabsContent value="archived">
        <p className="text-body-small">Archived items</p>
      </TabsContent>
    </Tabs>
  ),
};
