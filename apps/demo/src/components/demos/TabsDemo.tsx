import { Tabs, TabsContent, TabsList, TabsTrigger } from '@rafters/ui/components/ui/tabs';

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4 border border-border rounded-md mt-2">
        <p className="text-sm text-muted-foreground">Make changes to your account here.</p>
      </TabsContent>
      <TabsContent value="password" className="p-4 border border-border rounded-md mt-2">
        <p className="text-sm text-muted-foreground">Change your password here.</p>
      </TabsContent>
    </Tabs>
  );
}
