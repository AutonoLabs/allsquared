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
    headerTitle: 'text-xl font-bold',
    headerSubtitle: 'text-muted-foreground',
    card: 'shadow-none',
    socialButtonsBlockButton__github: { display: 'none' },
    socialButtonsIconButton__github: { display: 'none' },
    // Hide branding and dev-mode badges but keep footerAction (sign-in/sign-up toggle)
    footerPages: { display: 'none' },
    badge: { display: 'none' },
    developmentModeNotice: { display: 'none' },
    // Green overrides for all Clerk components — prevents default purple
    userButtonPopoverCard: 'border border-[#c7d0e0] shadow-md',
    userButtonPopoverActionButton: 'text-[#0b1b33] hover:bg-[#1f6b3f]/10',
    userButtonPopoverActionButtonText: 'text-[#0b1b33]',
    userButtonPopoverFooter: 'hidden',
    modalContent: 'border-t-[3px] border-t-[#1f6b3f]',
    modalHeader: 'bg-[#fafaf7]',
    formFieldInput: 'border-[#c7d0e0] focus:ring-[#1f6b3f] focus:border-[#1f6b3f]',
    formFieldLabel: 'text-[#0b1b33]',
    formButtonPrimary: 'bg-[#1f6b3f] hover:bg-[#2a8554]',
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
