
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

type SignupFormProps = {
  setActiveTab: (tab: string) => void;
  setShowVerificationInfo: (show: boolean) => void;
};

export const SignupForm: React.FC<SignupFormProps> = ({ 
  setActiveTab, 
  setShowVerificationInfo 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await signup(email, password, name);
      if (success) {
        setActiveTab('login');
        // Show verification info after signup
        setShowVerificationInfo(true);
        
        // Clear the signup form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button type="submit" className="w-full bg-purple hover:bg-purple-dark" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </CardFooter>
    </form>
  );
};
