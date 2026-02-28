import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'allsquared_cookie_consent';

type ConsentState = 'accepted' | 'rejected' | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
    setConsent(stored as ConsentState);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setConsent('accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setConsent('rejected');
    setVisible(false);
  };

  if (!visible || consent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-4">
      <div className="mx-auto max-w-3xl rounded-lg border bg-background p-4 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              We use essential cookies to make AllSquared work. We'd also like to use analytics
              cookies to understand how you use our platform so we can improve it.{' '}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>{' '}
              &middot;{' '}
              <a href="/terms" className="underline hover:text-foreground">
                Cookie Policy
              </a>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReject}>
              Essential Only
            </Button>
            <Button size="sm" onClick={handleAccept}>
              Accept All
            </Button>
            <button
              onClick={handleReject}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
