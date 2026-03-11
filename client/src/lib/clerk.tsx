import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { type ReactNode } from 'react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY - auth will not work');
}

interface ClerkAuthProviderProps {
  children: ReactNode;
}

export function ClerkAuthProvider({ children }: ClerkAuthProviderProps) {
  if (!PUBLISHABLE_KEY) {
    // Show a placeholder in dev when key is missing
    return <>{children}</>;
  }
  
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        layout: {
          logoImageUrl: '/logo.png',
          socialButtonsVariant: 'iconButton',
        },
        variables: {
          colorPrimary: '#2563eb',
          colorBackground: '#ffffff',
          borderRadius: '0.5rem',
        },
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
          headerTitle: 'text-xl font-bold',
          headerSubtitle: 'text-muted-foreground',
          card: 'shadow-none',
          footer: 'hidden',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export { SignIn, SignedIn, SignedOut, UserButton };
