import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { posts } from "@/content/site";
import { getProducts } from "@/lib/commerce";

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.dek, openGraph: { type: "article", images: [{ url: p.cover.src }] } };
}

export default async function Post({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const post = posts.find((x) => x.slug === slug);
  if (!post) notFound();
  const products = (await getProducts()).filter((p) => post.related.includes(p.id));
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      blocks.push(
        <ul key={`l${blocks.length}`}>
          {list.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  post.body.forEach((b, i) => {
    if (b.type === "li") return void list.push(b.text);
    flush();
    blocks.push(b.type === "h2" ? <h2 key={i}>{b.text}</h2> : <p key={i}>{b.text}</p>);
  });
  flush();

  return (
    <article className="wrap" style={{ paddingBottom: "var(--section)" }}>
      <header className="page-head" style={{ maxWidth: 900 }}>
        <p className="eyebrow muted">Journal</p>
        <h1>{post.title}</h1>
        <p className="lede muted">{post.dek}</p>
      </header>
      {/* I2/I8: the cover keeps its own shape and is never drawn wider than its real pixels */}
      <div className="img-frame" style={{ aspectRatio: `${post.cover.w}/${post.cover.h}`, maxWidth: `min(100%, ${post.cover.w}px)`, marginBottom: 48 }}>
        <Image src={post.cover.src} alt={post.cover.alt} width={post.cover.w} height={post.cover.h} priority sizes={`(max-width: ${post.cover.w}px) 100vw, ${post.cover.w}px`} />
      </div>
      <div className="prose" style={{ margin: "0 auto" }}>
        {blocks}
      </div>
      <section style={{ marginTop: "var(--section)" }} aria-labelledby="shop-post">
        <h2 id="shop-post" className="display-3" style={{ marginBottom: 24 }}>
          In this article
        </h2>
        <div className="grid-products">
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>
    </article>
  );
}
