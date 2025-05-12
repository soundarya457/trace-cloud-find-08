
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type LoginHeaderProps = {
  type: 'login' | 'signup';
};

const LoginHeader: React.FC<LoginHeaderProps> = ({ type }) => {
  return (
    <CardHeader>
      <CardTitle className="text-center">
        {type === 'login' ? 'Login' : 'Sign Up'}
      </CardTitle>
      <CardDescription className="text-center">
        {type === 'login' 
          ? 'Enter your credentials to access the Lost and Found system'
          : 'Create a new account to join the Lost and Found system'
        }
      </CardDescription>
    </CardHeader>
  );
};

export default LoginHeader;
