
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Eye, Info, MessageSquare, Plus, Tag, Trash, User, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminPanel: React.FC = () => {
  const { categories, items, messages, addCategory, updateCategory, deleteCategory, updateItem, deleteMessage, markMessageAsRead } = useData();
  const { toast } = useToast();

  // State for category dialog
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryStatus, setNewCategoryStatus] = useState('active');

  // State for message details
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const handleAddCategory = () => {
    addCategory({
      name: newCategoryName,
      description: newCategoryDescription,
      isActive: newCategoryStatus === 'active',
    });

    toast({
      title: "Category Added",
      description: `${newCategoryName} has been added to categories.`,
    });

    setNewCategoryName('');
    setNewCategoryDescription('');
    setNewCategoryStatus('active');
    setIsAddCategoryOpen(false);
  };

  const handleToggleCategoryStatus = (id: string, currentStatus: boolean) => {
    updateCategory(id, { isActive: !currentStatus });
    
    toast({
      title: "Category Updated",
      description: `Category status has been toggled to ${!currentStatus ? 'active' : 'inactive'}.`,
    });
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    
    toast({
      title: "Category Deleted",
      description: "The category has been deleted.",
    });
  };

  const handleToggleItemClaimedStatus = (id: string, currentStatus: string) => {
    updateItem(id, { status: currentStatus === 'claimed' ? (items.find(i => i.id === id)?.status === 'lost' ? 'lost' : 'found') : 'claimed' });
    
    toast({
      title: "Item Status Updated",
      description: `Item has been marked as ${currentStatus === 'claimed' ? 'active' : 'claimed'}.`,
    });
  };

  const handleDeleteItem = (id: string) => {
    deleteItem(id);
    
    toast({
      title: "Item Deleted",
      description: "The item has been deleted.",
    });
  };

  const handleViewMessage = (id: string) => {
    setSelectedMessage(id);
    markMessageAsRead(id);
  };

  const handleCloseMessageView = () => {
    setSelectedMessage(null);
  };

  const handleDeleteMessage = (id: string) => {
    deleteMessage(id);
    setSelectedMessage(null);
    
    toast({
      title: "Message Deleted",
      description: "The message has been deleted.",
    });
  };

  const messageDetails = selectedMessage ? messages.find(message => message.id === selectedMessage) : null;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage categories, items, and messages
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
              <User className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Categories</h2>
              <Button onClick={() => setIsAddCategoryOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs uppercase ${
                        category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleCategoryStatus(category.id, category.isActive)}
                      >
                        {category.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Category Dialog */}
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Create a new category for lost and found items.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input 
                      id="name" 
                      value={newCategoryName} 
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g., Electronics, Clothing"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={newCategoryDescription}
                      onChange={(e) => setNewCategoryDescription(e.target.value)}
                      placeholder="Brief description of the category"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newCategoryStatus}
                      onValueChange={setNewCategoryStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddCategory}>Save Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="items">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Manage Items</h2>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <Info className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No items yet</h3>
                  <p className="mt-2 text-muted-foreground">
                    Items posted by users will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item) => {
                        const itemCategory = categories.find(cat => cat.id === item.category);
                        return (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {item.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs uppercase ${
                                item.status === 'lost' ? 'bg-red-100 text-red-800' : 
                                item.status === 'found' ? 'bg-green-100 text-green-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {itemCategory?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                              <Button variant="outline" size="sm" className="inline-flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button 
                                variant={item.status === 'claimed' ? 'default' : 'secondary'} 
                                size="sm"
                                onClick={() => handleToggleItemClaimedStatus(item.id, item.status)}
                                className="inline-flex items-center"
                              >
                                {item.status === 'claimed' ? (
                                  <>
                                    <X className="h-3 w-3 mr-1" />
                                    Unclaim
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Mark Claimed
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                                className="inline-flex items-center"
                              >
                                <Trash className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">User Messages</h2>

              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
                  <p className="mt-2 text-muted-foreground">
                    Messages from users will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card key={message.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span>{message.subject}</span>
                            {!message.isRead && (
                              <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(message.date).toLocaleDateString()}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-1">From: {message.name} ({message.email})</p>
                        <p className="text-sm line-clamp-2">{message.message}</p>
                        <div className="flex space-x-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewMessage(message.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Message Details Dialog */}
              <Dialog open={!!selectedMessage} onOpenChange={handleCloseMessageView}>
                <DialogContent>
                  {messageDetails && (
                    <>
                      <DialogHeader>
                        <DialogTitle>{messageDetails.subject}</DialogTitle>
                        <DialogDescription>
                          From: {messageDetails.name} ({messageDetails.email})
                          <br />
                          Date: {new Date(messageDetails.date).toLocaleString()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 border-t border-b">
                        <p>{messageDetails.message}</p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={handleCloseMessageView}>Close</Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDeleteMessage(messageDetails.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Manage Users</h2>
              
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">User Management</h3>
                <p className="mt-2 text-muted-foreground">
                  This feature will be implemented in a future update.
                </p>
                <p className="text-muted-foreground">
                  Currently the system has default admin and student accounts.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
