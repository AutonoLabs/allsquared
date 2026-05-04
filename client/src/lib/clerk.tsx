import { ClerkProvider, SignIn, SignUp, UserButton } from '@clerk/react';
import { type ReactNode } from 'react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const hasClerkPublishableKey = Boolean(PUBLISHABLE_KEY);

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
    colorPrimary: '#1f6b3f',
    colorBackground: '#fafaf7',
    colorText: '#0b1b33',
    colorTextSecondary: '#2d466f',
    borderRadius: '0.5rem',
  },
  elements: {
    formButtonPrimary: 'bg-[#1f6b3f] hover:bg-[#2a8554]',
    headerTitle: 'text-xl font-bold',
    headerSubtitle: 'text-muted-foreground',
    card: 'shadow-none',
    socialButtonsBlockButton: 'hidden',
    dividerRow: 'hidden',
    // Hide branding and dev-mode badges but keep footerAction (sign-in/sign-up toggle)
    footerPages: { display: 'none' },
    badge: { display: 'none' },
    developmentModeNotice: { display: 'none' },
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
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      {children}
    </ClerkProvider>
  );
}

export { SignIn, SignUp, UserButton };
