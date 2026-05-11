import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AlertOctagon } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <AlertOctagon className="w-16 h-16 text-destructive mb-6" />
      <h1 className="text-4xl font-bold text-foreground mb-2">404 - Invalid Sector</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The requested routing node does not exist within the current network state. The path may have been pruned or heavily encrypted.
      </p>
      <Button onClick={() => navigate('/')}>Return to Safe Zone</Button>
    </div>
  );
}
