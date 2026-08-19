import { Lockup } from "@/components/brand/Lockup";
import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Platform",
    links: [
      ["Overview", "/platform"],
      ["Intelligence", "/intelligence"],
      ["Orchestration", "/orchestration"],
      ["Control Plane", "/control-plane"],
    ],
  },
  {
    title: "Solutions",
    links: [
      ["Capital Markets", "/solutions/capital-markets"],
      ["Infrastructure", "/solutions/infrastructure"],
      ["Government", "/solutions/government"],
      ["Enterprise", "/solutions/enterprise"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Insights", "/insights"],
      ["Platform", "/platform"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Request Access", "/contact"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="dc-footer">
      <div className="dc-shell dc-footer__grid">
        <div className="dc-footer__brand">
          <Link to="/" aria-label="Daycostra home">
            <Lockup markSize={34} />
          </Link>
          <p>Sovereign intelligence and controlled response for environments that refuse to stay predictable.</p>
          <span className="dc-footer__status">Platform surface · preview</span>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="dc-footer__column">
            <h2>{column.title}</h2>
            <nav aria-label={`${column.title} links`}>
              {column.links.map(([label, href]) => (
                <Link to={href} key={href}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="dc-shell dc-footer__legal">
        <span>© 2026 Daycostra. All rights reserved.</span>
        <div>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Trust & governance</span>
        </div>
      </div>
    </footer>
  );
}
