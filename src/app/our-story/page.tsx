import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Monogram } from "@/components/Monogram";
import { founderNote, scents } from "@/content/site";

export const metadata: Metadata = {
  title: "Our story: a note from our founder",
  description: "La Reiné was born from a simple belief: everyday rituals deserve to feel extraordinary.",
};

export default function OurStory() {
  return (
    <>
      <section className="section founder bg-surface">
        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <p className="eyebrow muted" style={{ textAlign: "center", marginBottom: 32 }}>
            A note from our founder
          </p>
          <article className="letter">
            <p className="italic">{founderNote.salutation}</p>
            {founderNote.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="sig">{founderNote.signoff}</p>
            {founderNote.signature && <p className="sig">{founderNote.signature}</p>}
            <p className="eyebrow muted" style={{ fontFamily: "var(--font-label)" }}>
              {founderNote.role}
            </p>
            <p className="eyebrow">Every Bathé Luxury.</p>
          </article>
        </div>
        <Monogram className="mono" />
      </section>
      <section className="section wrap" aria-labelledby="worlds">
        <h2 id="worlds" className="display-4" style={{ marginBottom: 32 }}>
          The two worlds
        </h2>
        <div className="formats">
          {scents.map((s) => (
            <Link key={s.id} href={`/scents/${s.slug}`} className={`format-card bg-${s.id}`} style={{ padding: 20 }}>
              <div className="img-frame hover-breathe">
                <Image src={s.hero.src} alt={s.hero.alt} width={s.hero.w} height={s.hero.h} sizes="(max-width: 520px) 100vw, 25vw" />
              </div>
              <div className="body">
                <p className={`eyebrow t-${s.id}`}>{s.days}</p>
                <h3 className={`t-${s.id}`}>{s.name}</h3>
                <p>{s.story[0]}</p>
                <span className="link-arrow">
                  Enter <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
