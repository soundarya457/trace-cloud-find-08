
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import LoginHeader from '@/components/auth/LoginHeader';
import EmailVerificationAlert from '@/components/auth/EmailVerificationAlert';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-light via-purple to-purple-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">TRACE CLOUD</h1>
          <p className="text-white text-xl">Find What's Lost, Effortlessly</p>
        </div>

        <Card className="shadow-xl">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            {showVerificationInfo && <EmailVerificationAlert />}
            
            <TabsContent value="login">
              <LoginHeader type="login" />
              <LoginForm setShowVerificationInfo={setShowVerificationInfo} />
            </TabsContent>
            
            <TabsContent value="signup">
              <LoginHeader type="signup" />
              <SignupForm 
                setActiveTab={setActiveTab} 
                setShowVerificationInfo={setShowVerificationInfo} 
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
