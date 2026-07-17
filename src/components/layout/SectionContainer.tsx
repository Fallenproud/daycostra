import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionContainer({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative py-20 sm:py-28 px-5 sm:px-8 lg:px-12", className)}
    >
      <div className="mx-auto max-w-[var(--content-max-w)]">
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-14 sm:mb-16">
            {eyebrow && (
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)] mb-3">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="font-display font-semibold tracking-[-0.02em] text-[var(--text-primary)] text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.05]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-[var(--text-secondary)] text-base sm:text-lg max-w-[640px] mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
