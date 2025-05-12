
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

const EmailVerificationAlert: React.FC = () => {
  return (
    <div className="px-4 pb-2">
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertTitle>Email Verification Required</AlertTitle>
        <AlertDescription>
          Please check your email inbox for a verification link. You need to verify your email before logging in.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EmailVerificationAlert;
