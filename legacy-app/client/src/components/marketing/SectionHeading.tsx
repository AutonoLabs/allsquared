type SectionHeadingProps = {
  numeral: string;
  kicker: string;
  title: string;
  accent?: string;
  description?: string;
};

export function SectionHeading({
  numeral,
  kicker,
  title,
  accent,
  description,
}: SectionHeadingProps) {
  const parts = accent ? title.split(accent) : [title];
  const after = accent ? parts.slice(1).join(accent) : "";

  return (
    <div className="grid gap-8 md:grid-cols-[200px_1fr] md:items-end md:gap-12">
      <div className="as25-font-mono text-[11px] uppercase tracking-[0.18em] text-[#6b7e9e]">
        {kicker}
        <div className="as25-font-display mt-2 text-[60px] font-normal tracking-[-0.04em] text-[#c7d0e0] md:text-[72px]">
          {numeral}
        </div>
      </div>
      <div>
        <h2 className="as25-font-display max-w-[880px] text-[34px] font-normal leading-[1.05] tracking-[-0.03em] text-[#0b1b33] md:text-[56px]">
          {parts[0]}
          {accent ? <span className="italic text-[#2d466f]">{accent}</span> : null}
          {after}
        </h2>
        {description ? (
          <p className="mt-5 max-w-[680px] text-[17px] leading-8 text-[#2d466f]">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
