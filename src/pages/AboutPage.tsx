
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">About TRACE CLOUD</h1>
          <p className="text-muted-foreground">
            Find What's Lost, Effortlessly
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>
              Connecting RIT community members with their lost items quickly and efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              TRACE CLOUD is a state-of-the-art digital lost and found management system built specifically for the RIT campus community. Our platform serves as a central hub for all lost and found items, making it easier than ever to reconnect people with their belongings.
            </p>
            <p className="text-muted-foreground">
              Our system uses modern web technologies to create a seamless experience for reporting, searching, and claiming lost items, reducing the frustration and time spent trying to locate misplaced possessions.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>
                Lost and found by the numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">College Campus Found Item Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>IDs/Cards</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Electronics</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Books/Notes</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Miscellaneous</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>
                What makes TRACE CLOUD special
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Centralized digital platform for lost and found items</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Advanced search and filtering capabilities</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Easy-to-use item reporting system</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Automated matching of lost and found items</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Secure claim verification process</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Direct communication between users and administrators</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Analytics and reporting for campus safety</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Mobile-friendly responsive design</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 bg-muted p-4 rounded-lg text-center">
                  <div className="bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
                  <h3 className="font-medium mb-2">Report an Item</h3>
                  <p className="text-sm text-muted-foreground">Lost something? Found something? Report it through our simple form, including details and optionally a photo.</p>
                </div>
                
                <div className="md:w-1/3 bg-muted p-4 rounded-lg text-center">
                  <div className="bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
                  <h3 className="font-medium mb-2">Search and Match</h3>
                  <p className="text-sm text-muted-foreground">Browse the database of lost and found items or let our system automatically match your lost item with found items.</p>
                </div>
                
                <div className="md:w-1/3 bg-muted p-4 rounded-lg text-center">
                  <div className="bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
                  <h3 className="font-medium mb-2">Verify and Claim</h3>
                  <p className="text-sm text-muted-foreground">Contact the admin to schedule a pickup and verify your ownership through our secure verification process.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AboutPage;
