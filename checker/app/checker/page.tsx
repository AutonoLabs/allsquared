import type { Metadata } from "next";
import { NoticeForm } from "@/components/NoticeForm";

export const metadata: Metadata = {
  title: "Free Pay Less Notice Checker",
  description:
    "Check whether your payer served a valid pay less notice in time, and see what you're likely owed.",
};

export default function CheckerPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">
        Has your payer served a valid pay less notice?
      </h1>
      <p className="mt-4 text-ink/70">
        Enter your contract dates below for a free, automated read on whether the notified
        sum in your payment application is likely payable in full.
      </p>
      <div className="mt-8">
        <NoticeForm />
      </div>
    </div>
  );
}
