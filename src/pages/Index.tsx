
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Archive, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-purple-dark">TRACE CLOUD</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The smart and efficient lost and found system for your campus
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6 text-purple-dark">Find what matters to you</h2>
            <p className="text-lg mb-8 text-gray-700">
              TRACE CLOUD makes it easy to report lost items or submit found items to help reunite people with their belongings quickly and efficiently.
            </p>
            <div className="space-x-4">
              <Link to="/login">
                <Button size="lg" className="bg-purple-dark hover:bg-purple text-white">
                  Get Started
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img 
              src="/placeholder.svg" 
              alt="Lost and Found Illustration" 
              className="max-w-full rounded-lg shadow-lg"
              width={500}
              height={400} 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-md">
            <CardHeader>
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Search className="text-purple-dark h-6 w-6" />
              </div>
              <CardTitle>Find Lost Items</CardTitle>
              <CardDescription>Search through reported lost and found items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our powerful search system helps you locate your lost items quickly by filtering through categories, locations, and dates.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Archive className="text-purple-dark h-6 w-6" />
              </div>
              <CardTitle>Report Items</CardTitle>
              <CardDescription>Easily report lost or found items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Submit detailed descriptions and images of lost or found items to help increase the chances of successful returns.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="text-purple-dark h-6 w-6" />
              </div>
              <CardTitle>Secure System</CardTitle>
              <CardDescription>Safe and secure platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                All data is protected and verified users can communicate securely through our platform to claim their items.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-16">
          <p className="text-gray-500">© 2025 TRACE CLOUD. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
