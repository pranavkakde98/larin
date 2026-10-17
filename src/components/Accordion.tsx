// Native <details> accordion: keyboard and screen-reader friendly with no JS.
export function Accordion({ items, openFirst }: { items: { title: string; body: React.ReactNode }[]; openFirst?: boolean }) {
  return (
    <div className="acc">
      {items.map((it, i) => (
        <details key={it.title} open={openFirst && i === 0}>
          <summary>
            {it.title}
            <span className="pm" aria-hidden="true" />
          </summary>
          <div className="panel">{it.body}</div>
        </details>
      ))}
    </div>
  );
}
