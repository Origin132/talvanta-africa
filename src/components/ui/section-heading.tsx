type SectionHeadingProps = {
  eyebrow?: string;
  heading: string;
  supportingText?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  heading,
  supportingText,
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-green">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
        {heading}
      </h2>
      {supportingText ? (
        <p className="mt-4 text-base leading-8 text-slate sm:text-lg">
          {supportingText}
        </p>
      ) : null}
    </div>
  );
}
