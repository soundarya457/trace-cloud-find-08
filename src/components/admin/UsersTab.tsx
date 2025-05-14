
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User, Users, GraduationCap, Building, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const UsersTab: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setUsers(data || []);
      } catch (error: any) {
        console.error('Error fetching users:', error.message);
        toast({
          title: "Error",
          description: "Failed to fetch users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = activeTab === 'all' 
    ? users 
    : users.filter(user => user.role === activeTab);

  // Count stats
  const adminCount = users.filter(user => user.role === 'admin').length;
  const studentCount = users.filter(user => user.role === 'student').length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <div className="flex space-x-2">
          <Badge className="bg-blue-500">{users.length} Total</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-2xl font-bold">{users.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-purple" />
              <span className="text-2xl font-bold">{adminCount}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-green-500" />
              <span className="text-2xl font-bold">{studentCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
          <TabsTrigger value="admin">Admins ({adminCount})</TabsTrigger>
          <TabsTrigger value="student">Students ({studentCount})</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No users found</h3>
              <p className="mt-2 text-muted-foreground">
                {activeTab === 'all' ? 'Users will appear here once they register.' : `No ${activeTab}s are registered yet.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        Student ID
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        Department
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        Year
                      </div>
                    </TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name}
                      </TableCell>
                      <TableCell>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge className={user.role === 'admin' ? "bg-purple" : "bg-blue-500"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.student_id || '-'}
                      </TableCell>
                      <TableCell>
                        {user.department || '-'}
                      </TableCell>
                      <TableCell>
                        {user.year || '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersTab;
