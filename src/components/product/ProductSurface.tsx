import type { ReactNode } from "react";
import { CircleDotDashed, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function ProductSurface({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <main className="dc-page dc-product-page">
      <section className="dc-product-hero">
        <div className="dc-shell dc-product-hero__grid">
          <div className="dc-product-hero__copy">
            <div className="dc-product-state"><CircleDotDashed size={14} /> Product preview · demo-labelled state</div>
            <div className="dc-kicker">{eyebrow}</div>
            <h1>{title}</h1>
            <p>{body}</p>
            <div className="dc-product-truth">
              <ShieldCheck size={17} />
              <span>Authoritative backend data is shown only when a verified source is connected. This preview does not simulate a live production feed.</span>
            </div>
          </div>
          <div className="dc-product-console dc-glass dc-elev-7">
            <div className="dc-product-console__bar">
              <span>Daycostra / preview</span>
              <span className="dc-demo-label">DEMO</span>
            </div>
            {children}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
