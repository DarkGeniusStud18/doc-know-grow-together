
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mail } from 'lucide-react';

const VerificationAlert: React.FC = () => {
  return (
    <Alert className="max-w-md w-full mb-4 bg-green-50 border-green-200" variant="default">
      <Mail className="h-5 w-5 text-green-500" />
      <AlertTitle className="text-green-700">Email vérifié</AlertTitle>
      <AlertDescription className="text-green-600">
        Votre email a été vérifié. Vous pouvez maintenant vous connecter.
      </AlertDescription>
    </Alert>
  );
};

export default VerificationAlert;
