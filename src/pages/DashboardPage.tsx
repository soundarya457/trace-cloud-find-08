
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, CheckCircle, HelpCircle, MessageSquare, Tag } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { stats, items, messages } = useData();

  if (!user) {
    return null;
  }

  const statCards = [
    {
      title: 'Lost Items',
      value: stats.totalLostItems,
      icon: <HelpCircle className="h-6 w-6 text-red-500" />,
      color: 'bg-red-100',
    },
    {
      title: 'Found Items',
      value: stats.totalFoundItems,
      icon: <Archive className="h-6 w-6 text-green-500" />,
      color: 'bg-green-100',
    },
    {
      title: 'Claimed Items',
      value: stats.totalClaimedItems,
      icon: <CheckCircle className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-100',
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      icon: <MessageSquare className="h-6 w-6 text-orange-500" />,
      color: 'bg-orange-100',
    },
  ];

  if (user.role === 'admin') {
    statCards.push({
      title: 'Active Categories',
      value: stats.activeCategories,
      icon: <Tag className="h-6 w-6 text-purple" />,
      color: 'bg-purple-100',
    });
  }

  // Get the most recent items and messages
  const recentItems = [...items].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  const recentMessages = [...messages].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">
            {user.role === 'admin' 
              ? 'Here\'s an overview of the lost and found system.' 
              : 'Track your lost and found items here.'
            }
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="overflow-hidden">
              <CardHeader className={`p-4 ${stat.color}`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Items</CardTitle>
            </CardHeader>
            <CardContent>
              {recentItems.length > 0 ? (
                <div className="space-y-4">
                  {recentItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs uppercase ${
                        item.status === 'lost' ? 'bg-red-100 text-red-800' : 
                        item.status === 'found' ? 'bg-green-100 text-green-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No items yet</p>
              )}
            </CardContent>
          </Card>

          {user.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                {recentMessages.length > 0 ? (
                  <div className="space-y-4">
                    {recentMessages.map((message) => (
                      <div key={message.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{message.subject}</p>
                          <p className="text-sm text-muted-foreground">{message.name}</p>
                        </div>
                        <span className={`h-2 w-2 rounded-full ${
                          message.is_read ? 'bg-gray-300' : 'bg-blue-500'
                        }`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No messages yet</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
