import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { posts } from "@/content/site";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on body skin, scent and slow mornings from La Reiné.",
};

export default function Journal() {
  return (
    <div className="wrap" style={{ paddingBottom: "var(--section)" }}>
      <header className="page-head">
        <p className="eyebrow muted">Journal</p>
        <h1>Notes on skin, scent and slow mornings.</h1>
      </header>
      <div className="journal-grid">
        {posts.map((p, i) => (
          <Link key={p.slug} href={`/journal/${p.slug}`} className="journal-card reveal" style={{ ["--i" as string]: i }}>
            <div className="img-frame hover-breathe">
              <Image src={p.cover.src} alt={p.cover.alt} width={p.cover.w} height={p.cover.h} sizes="(max-width: 900px) 100vw, 33vw" />
            </div>
            <h2 className="display-2">{p.title}</h2>
            <p className="muted">{p.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
