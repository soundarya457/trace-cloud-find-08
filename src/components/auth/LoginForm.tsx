
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

type LoginFormProps = {
  setShowVerificationInfo: (show: boolean) => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ setShowVerificationInfo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        // If login failed, show verification info
        setShowVerificationInfo(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="pt-2 text-sm text-muted-foreground">
          <p>Demo Credentials:</p>
          <p>- Admin: admin@tracecloud.rit.edu / admin123</p>
          <p>- Student: student@rit.edu / student123</p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button type="submit" className="w-full bg-purple hover:bg-purple-dark" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </CardFooter>
    </form>
  );
};
