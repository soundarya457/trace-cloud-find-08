import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, Search, MapPin, Calendar, User, Check, Eye } from 'lucide-react';

const LostFoundPage: React.FC = () => {
  const { items, categories } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');

  // Filter items based on search term, category, and status
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = activeTab === 'all' || item.status === activeTab;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get active categories
  const activeCategories = categories.filter(cat => cat.is_active);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lost and Found</h1>
            <p className="text-muted-foreground">Browse lost and found items or post a new one</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search items..."
                className="pl-8 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Categories sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-2">Categories</h2>
              <div className="space-y-1">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Categories
                </button>
                {activeCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'all' | 'lost' | 'found')}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="lost">Lost Items</TabsTrigger>
                <TabsTrigger value="found">Found Items</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No items found</h3>
                    <p className="mt-2 text-muted-foreground">
                      No {activeTab !== 'all' ? activeTab : ''} items found{' '}
                      {selectedCategory !== 'all' && 'in this category'}.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => {
                      const category = categories.find(c => c.id === item.category);
                      return (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="aspect-video bg-muted flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="text-muted-foreground">No image</div>
                            )}
                          </div>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>
                                  {category ? category.name : 'Uncategorized'}
                                </CardDescription>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs uppercase ${
                                item.status === 'lost' ? 'bg-red-100 text-red-800' : 
                                item.status === 'found' ? 'bg-green-100 text-green-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="line-clamp-2 text-sm text-muted-foreground mb-4">
                              {item.description}
                            </p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{item.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="truncate">Contact: {item.contact_email}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {item.status !== 'claimed' && (
                              <Button size="sm">
                                <Check className="h-4 w-4 mr-2" />
                                {item.status === 'lost' ? 'I Found This' : 'Claim Item'}
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LostFoundPage;
