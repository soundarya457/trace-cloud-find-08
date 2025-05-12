
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ItemForm from '@/components/items/ItemForm';

const PostItemPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Post an Item</CardTitle>
            <CardDescription>
              Fill out this form to report a lost or found item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ItemForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PostItemPage;
