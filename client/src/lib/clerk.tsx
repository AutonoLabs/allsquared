import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { type ReactNode } from 'react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY - auth will not work');
}

interface ClerkAuthProviderProps {
  children: ReactNode;
}

const clerkAppearance = {
  layout: {
    logoImageUrl: '/logo.png',
    socialButtonsVariant: 'iconButton' as const,
  },
  variables: {
    colorPrimary: '#F97066',
    colorBackground: '#ffffff',
    borderRadius: '0.5rem',
  },
  elements: {
    formButtonPrimary: 'bg-[#F97066] hover:bg-[#e5635a]',
    headerTitle: 'text-xl font-bold',
    headerSubtitle: 'text-muted-foreground',
    card: 'shadow-none',
    footer: 'hidden',
    // Hide "Development mode" and "Secured by Clerk" badges
    badge: 'hidden',
    developerWarning: 'hidden',
  },
};

export function ClerkAuthProvider({ children }: ClerkAuthProviderProps) {
  if (!PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={clerkAppearance}
      signInUrl="/dashboard"
      signUpUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}

export { SignIn, SignUp, SignedIn, SignedOut, UserButton };
