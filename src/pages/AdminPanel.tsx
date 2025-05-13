
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag, Info, MessageSquare, Users } from 'lucide-react';

// Import the smaller component tabs
import CategoriesTab from '@/components/admin/CategoriesTab';
import ItemsTab from '@/components/admin/ItemsTab';
import MessagesTab from '@/components/admin/MessagesTab';
import UsersTab from '@/components/admin/UsersTab';

const AdminPanel: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage categories, items, messages and users
          </p>
        </div>

        <Tabs defaultValue="categories">
          <TabsList className="mb-6">
            <TabsTrigger value="categories" className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Items
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Categories Tab Content */}
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>

          {/* Items Tab Content */}
          <TabsContent value="items">
            <ItemsTab />
          </TabsContent>

          {/* Messages Tab Content */}
          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>

          {/* Users Tab Content */}
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
