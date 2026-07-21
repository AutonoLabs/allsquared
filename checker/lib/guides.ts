export type Guide = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  body: string[];
};

export const guides: Guide[] = [
  {
    slug: "main-contractor-not-paying-subcontractor",
    title: "Main Contractor Not Paying? Here's What UK Subcontractors Can Do",
    metaDescription:
      "If a main contractor hasn't paid you, the Construction Act gives you a fast, procedural route to recover the full notified sum — here's how it works.",
    intro:
      "If a main contractor has stopped paying, you are not stuck waiting for a valuation argument. The Housing Grants, Construction and Regeneration Act 1996 (as amended) gives every UK construction subcontractor a statutory right to be paid on time — and a fast enforcement route when that right is ignored.",
    body: [
      "Every construction contract in England and Wales is required to have a payment mechanism: a due date, a final date for payment, and a right for the payer to serve a payment notice or a pay less notice if they intend to pay less than the sum applied for.",
      "If your main contractor missed the deadline to serve a valid pay less notice, the amount you applied for becomes the 'notified sum' — payable in full, regardless of any dispute about the actual value of the work. This is commonly called a 'smash and grab' adjudication, because it turns on notice dates and paperwork, not on re-arguing the value of the work.",
      "The process to enforce this is adjudication: a 28-day statutory dispute process that any party to a construction contract can start at any time, without needing a court order first. An adjudicator's decision is binding and enforceable immediately, even if the losing party wants to challenge it later.",
      "The first step is establishing exactly which notices were served, and when. Our free checker below walks through your dates and gives you an immediate, automated read on whether your payer's paperwork was in order.",
    ],
  },
  {
    slug: "smash-and-grab-adjudication-cost",
    title: "Smash and Grab Adjudication Cost: What UK Subcontractors Actually Pay",
    metaDescription:
      "Adjudicator fees typically run £8,000–£30,000 for construction disputes — but smash-and-grab cases are the cheapest and fastest category to bring. Here's the real cost breakdown.",
    intro:
      "The biggest reason subcontractors write off money they're owed isn't that they're wrong on the law — it's that the cost of enforcing it looks disproportionate to the claim. Smash-and-grab adjudication is the exception: it's the cheapest, fastest category of UK construction dispute, because it turns purely on dates and notices, not on valuing the work.",
    body: [
      "A typical full-value adjudication — where the parties argue about how much the work is actually worth — can cost £8,000 to £30,000 in adjudicator fees alone, before either side's own advisers. That's why claims consultants and construction solicitors usually only take cases above roughly £50,000-£125,000: the fees don't make sense below that.",
      "A smash-and-grab case is structurally different. There's no valuation argument — the adjudicator is only being asked whether a payment notice or pay less notice was served, and whether it was served on time and in the correct form. That means the referral, response, and decision can be prepared and run far faster and cheaper than a true-value dispute.",
      "Low-value and fast-track adjudication schemes (CIC Model Adjudication Procedure, TeCSA, RICS) already exist precisely because the standard adjudicator-fee model doesn't work for claims under roughly £25,000 — but almost none of the market serves that segment today, because the preparation cost (not the adjudicator's fee) is what's still uncapped and expensive.",
      "That's the gap a prepared, AI-assisted referral pack closes: fixed-fee preparation for the notice-validity case, at a price that makes sub-£25,000 claims rational to bring for the first time.",
    ],
  },
  {
    slug: "payment-notice-deadline-calculator",
    title: "Payment Notice Deadline Calculator (UK Construction Contracts)",
    metaDescription:
      "Calculate your payment notice and pay less notice deadlines under a UK construction contract, and check whether your payer's notices were served on time.",
    intro:
      "Payment notice and pay less notice deadlines are the single most important dates in a UK construction payment dispute. Missing them — as a payer — means the notified sum becomes payable in full. This calculator estimates both deadlines from your contract dates.",
    body: [
      "Under the Scheme for Construction Contracts (which applies whenever a contract doesn't specify its own payment terms, or specifies terms that don't comply with the Construction Act), a payment notice is due within 5 days of the due date, and a pay less notice is due 7 days before the final date for payment — unless your contract specifies different periods, in which case the contract terms apply first.",
      "The calculator below uses calendar days for a quick first read. It does not yet account for the England & Wales bank-holiday calendar, so treat the exact deadline dates as indicative — for a certified assessment before you act on a deadline, get the reviewed referral pack.",
      "Enter your due date, final date for payment, and (if one was served) the date your payer's pay less notice arrived. You'll get an immediate read on whether it was served in time, and what that means for the sum you're owed.",
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
