export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-900">
      This is a free, automated indicator — not legal advice. It uses calendar days, not
      the full England &amp; Wales bank-holiday calendar. For a reviewed assessment,{" "}
      <a href="/checker" className="underline font-medium">
        get the referral pack
      </a>
      .
    </div>
  );
}
