import policies from "@/content/policies.json";

type Key = keyof typeof policies;

// Policy text imported from the old site. Unfilled template placeholders like "[Insert Number]"
// are highlighted rather than published as if final.
function mark(text: string) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((p, i) =>
    /^\[.*\]$/.test(p) ? (
      <mark key={i} title="To be confirmed by La Reiné">
        to be confirmed
      </mark>
    ) : (
      p
    ),
  );
}

export function Policy({ k, title }: { k: Key; title: string }) {
  const blocks = policies[k].blocks.filter((b, i) => !(i === 0 && b.type === "h") && !(i < 3 && /^(return and refund policy|privacy policy|terms and conditions)$/i.test(b.text.trim())));
  const hasGaps = blocks.some((b) => /\[[^\]]+\]/.test(b.text) || /contact us at:$/.test(b.text));
  const out: React.ReactNode[] = [];
  let list: React.ReactNode[] = [];
  const flush = () => {
    if (list.length) out.push(<ul key={`u${out.length}`}>{list}</ul>);
    list = [];
  };
  blocks.forEach((b, i) => {
    if (b.type === "li") return void list.push(<li key={i}>{mark(b.text)}</li>);
    flush();
    const text = /contact us at:$/.test(b.text) ? b.text.replace(/at:$/, "through our Help page.") : b.text;
    out.push(b.type === "h" ? <h2 key={i}>{mark(text)}</h2> : <p key={i}>{mark(text)}</p>);
  });
  flush();
  return (
    <div className="wrap narrow" style={{ paddingBottom: "var(--section)" }}>
      <header className="page-head">
        <p className="eyebrow muted">Policies</p>
        <h1>{title}</h1>
      </header>
      {hasGaps && (
        <p className="notice" style={{ maxWidth: "68ch", marginBottom: 32 }}>
          Draft. Highlighted details are being confirmed by La Reiné.
        </p>
      )}
      <div className="prose">{out}</div>
    </div>
  );
}
