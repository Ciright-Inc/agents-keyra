import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="keyra-footer">
      <div className="keyra-footer__inner">
        <section className="keyra-footer__brand">
          <div className="keyra-footer__brand-row">
            <span className="keyra-footer__brand-tile">
              <Image
                src="/favicon.png"
                alt=""
                width={22}
                height={22}
                className="keyra-footer__brand-mark"
                unoptimized
              />
            </span>
            <span className="keyra-footer__brand-name">Keyra</span>
          </div>
          <p className="keyra-footer__lede">
            Operational civilization infrastructure for the autonomous era.
            Trusted digital workers for governments, telcos, banks, universities,
            and enterprises.
          </p>
        </section>

        <FooterCol
          title="Marketplace"
          items={[
            ["Browse agents", "/marketplace"],
            ["Industries", "/industries"],
            ["Bundles", "/bundles"],
            ["Use cases", "/use-cases"],
          ]}
        />

        <FooterCol
          title="Trust"
          items={[
            ["Security model", "/security"],
            ["Deployment", "/deployment"],
            ["Pricing", "/pricing"],
            ["Customer portal", "/portal"],
          ]}
        />

        <FooterCol
          title="Lineage"
          items={[
            ["agents.ciright.com", "https://agents.ciright.com"],
            ["ciright.agents.keyra.ie", "https://ciright.agents.keyra.ie"],
            ["Admin", "/admin"],
            ["Consultation", "/consultation"],
          ]}
        />
      </div>

      <div className="keyra-footer__bar">
        <div className="keyra-footer__bar-inner">
          <div>© Keyra. Sovereign and enterprise digital worker infrastructure.</div>
          <div className="keyra-footer__bar-meta">v0.1.0 · agents.keyra.ie</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <section>
      <h2 className="keyra-footer__label">{title}</h2>
      <ul className="keyra-footer__list">
        {items.map(([label, href]) => {
          const isExternal = href.startsWith("http");
          return (
            <li key={label}>
              {isExternal ? (
                <a
                  href={href}
                  className="keyra-footer__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </a>
              ) : (
                <Link href={href} className="keyra-footer__link">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
