// Product content. Source of truth for copy; prices for the two gels are refreshed from
// the live WooCommerce Store API at build time (see src/lib/commerce.ts).
// Anything marked `pending` is shown quietly on the site and listed in the client to-do.

export type ScentId = "flowers" | "rain";
export type Format = "gel" | "mist";

export interface Img {
  src: string;
  alt: string;
  w: number;
  h: number;
}

export interface Product {
  id: string;
  wooId?: number;
  source: "woo" | "local";
  slug: string;
  scent: ScentId;
  format: Format;
  name: string;
  formatLabel: string;
  size: string;
  price: number;
  mrp: number;
  priceNote?: string;
  inStock: boolean;
  images: Img[];
  sceneLine: string;
  intro: string;
  smellsLike: string;
  feelsLike: string;
  fragrance: string;
  notes?: { top: string; heart: string; base: string };
  actives: { name: string; what: string }[];
  highlights: string[];
  howTo: string[];
  ritualPairing: string;
  faq: { q: string; a: string }[];
  legal: { label: string; value: string; pending?: boolean }[];
  seo: { title: string; description: string };
}

const pendingLegal = (mrp: number, qty: string) => [
  { label: "MRP", value: `₹${mrp} (inclusive of all taxes)` },
  { label: "Net quantity", value: qty },
  { label: "Country of origin", value: "India", pending: true },
  { label: "Manufactured / marketed by", value: "As printed on the pack; being added here", pending: true },
  { label: "Customer care", value: "Through the Help page while details are added", pending: true },
];

export const products: Product[] = [
  {
    id: "flowers-gel",
    wooId: 640,
    source: "woo",
    slug: "flowers-for-myself-shower-gel",
    scent: "flowers",
    format: "gel",
    name: "Flowers for Myself",
    formatLabel: "Shower gel",
    size: "250 ml",
    price: 575,
    mrp: 575,
    inStock: true,
    images: [
      { src: "/media/gel-flowers-1.jpg", alt: "Flowers for Myself shower gel on a marble pedestal with pink roses", w: 928, h: 1152 },
      { src: "/media/gel-flowers-2.jpg", alt: "The gel tilted in pink water among drifting petals", w: 928, h: 1152 },
      { src: "/media/gel-flowers-3.jpg", alt: "The gel resting on an open peony in water", w: 928, h: 1152 },
    ],
    sceneLine: "Petals on warm water.",
    intro:
      "A soft, floral shower gel with 1% salicylic acid. It cleanses gently while helping keep breakout-prone skin on your back, chest and arms clear, and leaves a delicate fragrance that stays with you.",
    smellsLike: "An armful of pink petals, still wet from the bath.",
    feelsLike: "A light, clear gel that turns to a soft lather and rinses clean.",
    fragrance: "A delicate Italian floral.",
    actives: [
      { name: "1% salicylic acid", what: "Helps keep pores on breakout-prone body skin clear and skin feeling smooth." },
    ],
    highlights: ["1% salicylic acid", "For breakout-prone body skin", "Delicate Italian floral"],
    howTo: [
      "On wet skin, work a little gel into a lather between your palms.",
      "Focus on breakout-prone areas: back, chest and arms.",
      "Rinse well. Use on Monday, Wednesday and Friday, and on breakout-prone areas on Sunday.",
    ],
    ritualPairing:
      "Alternate with A Bath in the Rain through the week, then finish with the Flowers for Myself shimmer mist on hair and shoulders.",
    faq: [
      { q: "Can I use it every day?", a: "The founder's ritual uses it three times a week, alternating with A Bath in the Rain. Start there and see how your skin feels." },
      { q: "Is it for my face?", a: "It is made for the body. Your body skin has fewer oil glands than your face, and this gel is designed for it." },
      { q: "Is the fragrance strong?", a: "No. It is a delicate floral that stays softly on skin after the shower." },
    ],
    legal: pendingLegal(575, "250 ml / 8.5 fl oz"),
    seo: {
      title: "Flowers for Myself Shower Gel with 1% Salicylic Acid",
      description:
        "A soft floral body wash with 1% salicylic acid for breakout-prone skin on the back, chest and arms. 250 ml. Part of the La Reiné weekly ritual.",
    },
  },
  {
    id: "rain-gel",
    wooId: 648,
    source: "woo",
    slug: "a-bath-in-the-rain-shower-gel",
    scent: "rain",
    format: "gel",
    name: "A Bath in the Rain",
    formatLabel: "Shower gel",
    size: "250 ml",
    price: 486,
    mrp: 486,
    inStock: true,
    images: [
      { src: "/media/gel-rain-1.jpg", alt: "A Bath in the Rain shower gel on a mesh bag with lemons, limes and grapefruit", w: 928, h: 1152 },
      { src: "/media/gel-rain-2.jpg", alt: "The gel splashing into a white basin with citrus", w: 928, h: 1152 },
      { src: "/media/gel-rain-3.jpg", alt: "The gel on a wet glass shelf with lemon and foam", w: 600, h: 750 },
    ],
    sceneLine: "The first breath after a downpour.",
    intro:
      "A refreshing citrus shower gel enriched with seaweed extract. It cleanses while leaving skin feeling fresh, soft and revitalised, so your everyday shower becomes a small ritual.",
    smellsLike: "Cut citrus and cool air, the moment the rain stops.",
    feelsLike: "A clear, cooling gel and a soft lather that leaves skin comfortable, not tight.",
    fragrance: "Fresh citrus.",
    actives: [
      { name: "Seaweed extract", what: "Helps skin that feels dry or tight after a shower feel soft and comfortable again." },
    ],
    highlights: ["Seaweed extract", "For skin that feels tight after a shower", "Fresh citrus"],
    howTo: [
      "On wet skin, work a little gel into a lather.",
      "Massage over the whole body, wherever skin feels tight or dry.",
      "Rinse. Use on Tuesday, Thursday and Saturday, and everywhere on Sunday.",
    ],
    ritualPairing:
      "Alternate with Flowers for Myself through the week, then finish with the A Bath in the Rain shimmer mist.",
    faq: [
      { q: "Is it good for dry skin?", a: "It is made for skin that feels tight or flaky after showering, with seaweed extract to help it feel comfortable." },
      { q: "Can I use it every day?", a: "Yes. In the founder's ritual it takes Tuesday, Thursday, Saturday and the all-over Sunday reset." },
      { q: "Does it foam?", a: "It turns into a soft, light lather that rinses clean." },
    ],
    legal: pendingLegal(486, "250 ml / 8.5 fl oz"),
    seo: {
      title: "A Bath in the Rain Shower Gel with Seaweed Extract",
      description:
        "A refreshing citrus body wash with seaweed extract for skin that feels tight after showering. 250 ml. Part of the La Reiné weekly ritual.",
    },
  },
  {
    id: "flowers-mist",
    source: "local",
    slug: "flowers-for-myself-shimmer-mist",
    scent: "flowers",
    format: "mist",
    name: "Flowers for Myself",
    formatLabel: "Shimmer hair & body mist",
    size: "100 ml",
    price: 399,
    mrp: 499,
    priceNote: "Launch price",
    inStock: true,
    images: [
      { src: "/media/mist-flowers-1.jpg", alt: "Flowers for Myself shimmer mist among orchids, apricots and elderflower", w: 1086, h: 1358 },
      { src: "/media/mist-flowers-2.jpg", alt: "Two Flowers mists splashing through water under a blue sky", w: 1024, h: 1536 },
      { src: "/media/mist-flowers-4.jpg", alt: "A woman sprays the Flowers mist, petals falling around her", w: 620, h: 776 },
      { src: "/media/mist-flowers-5.jpg", alt: "The mist on wet stone beside a pink peony", w: 560, h: 700 },
      { src: "/media/mist-flowers-3.jpg", alt: "A hand sets the mist into a pond scattered with petals", w: 1024, h: 1536 },
    ],
    sceneLine: "Softness, in its lightest form.",
    intro:
      "A delicate shimmer mist with a sweet floral musk fragrance. Made for hair and body, it leaves a soft, radiant shimmer and a scent that lingers beautifully. Alcohol-free.",
    smellsLike: "Fresh fruit and petals, settling into something sweet and warm.",
    feelsLike: "A fine, weightless veil with a whisper of shimmer. Never sticky.",
    fragrance: "Sweet floral musk.",
    notes: { top: "Fresh, fruity", heart: "Floral", base: "Sweet, woody" },
    actives: [
      { name: "Alcohol-free", what: "Gentle on hair and skin, without the dryness of alcohol-based sprays." },
      { name: "Soft shimmer", what: "A fine radiant finish on hair, shoulders and collarbones." },
    ],
    highlights: ["Alcohol-free", "For hair & body", "Soft shimmer"],
    howTo: [
      "Shake gently.",
      "Spray from about 20 cm onto hair lengths, shoulders and collarbones.",
      "Let it settle for a few seconds. Layer over Flowers for Myself shower gel for a longer-lasting scent.",
    ],
    ritualPairing: "The last step after a Flowers for Myself shower, or any time you want the scent back.",
    faq: [
      { q: "Can I use it in my hair?", a: "Yes. It is alcohol-free and made for hair and body." },
      { q: "Will the shimmer transfer to clothes?", a: "The shimmer is soft and fine. Let it settle for a few seconds before dressing." },
      { q: "How long does the scent last?", a: "It is a light mist, made to be reapplied. Layering over the shower gel helps it last." },
    ],
    legal: pendingLegal(499, "100 ml / 3.38 fl oz"),
    seo: {
      title: "Flowers for Myself Shimmer Hair & Body Mist, Alcohol-free",
      description:
        "A sweet floral musk shimmer mist for hair and body. Alcohol-free, 100 ml. Softness, in its lightest form, from La Reiné.",
    },
  },
  {
    id: "rain-mist",
    source: "local",
    slug: "a-bath-in-the-rain-shimmer-mist",
    scent: "rain",
    format: "mist",
    name: "A Bath in the Rain",
    formatLabel: "Shimmer hair & body mist",
    size: "100 ml",
    price: 399,
    mrp: 499,
    priceNote: "Launch price",
    inStock: true,
    images: [
      { src: "/media/mist-rain-1.jpg", alt: "A Bath in the Rain mist on the edge of a pool among flowers", w: 1024, h: 1280 },
      { src: "/media/mist-rain-2.jpg", alt: "The Rain mist in falling water beside a stone fountain", w: 560, h: 700 },
    ],
    sceneLine: "Rain-kissed, in its lightest form.",
    intro:
      "A refreshing mist with an aqua citrus fragrance that brings a clean, fresh burst to your everyday routine. Made for hair and body, with a subtle shimmer finish. Alcohol-free.",
    smellsLike: "A splash of citrus over cool, clean water.",
    feelsLike: "A cool, fine mist that dries in seconds to the faintest shimmer.",
    fragrance: "Aqua citrus.",
    notes: { top: "Aqua spice", heart: "Citrus floral", base: "Musk amber" },
    actives: [
      { name: "Alcohol-free", what: "Gentle on hair and skin, without the dryness of alcohol-based sprays." },
      { name: "Subtle shimmer", what: "Just enough light on skin and hair, never glittery." },
    ],
    highlights: ["Alcohol-free", "For hair & body", "Subtle shimmer"],
    howTo: [
      "Shake gently.",
      "Spray from about 20 cm onto hair, neck and arms.",
      "Mist again whenever you want the freshness back.",
    ],
    ritualPairing: "The last step after an A Bath in the Rain shower, or a mid-afternoon reset.",
    faq: [
      { q: "Can I use it in my hair?", a: "Yes. It is alcohol-free and made for hair and body." },
      { q: "Is the shimmer strong?", a: "It is subtle: a faint light on skin rather than glitter." },
      { q: "Can I carry it with me?", a: "The 100 ml bottle fits most handbags. Keep the cap on to avoid accidental sprays." },
    ],
    legal: pendingLegal(499, "100 ml / 3.38 fl oz"),
    seo: {
      title: "A Bath in the Rain Shimmer Hair & Body Mist, Alcohol-free",
      description:
        "An aqua citrus shimmer mist for hair and body. Alcohol-free, 100 ml. Rain-kissed, in its lightest form, from La Reiné.",
    },
  },
];

export interface ProductSet {
  id: string;
  slug: string;
  name: string;
  line: string;
  description: string;
  items: string[];
  image: Img;
  scent?: ScentId;
}

export const sets: ProductSet[] = [
  {
    id: "duo",
    slug: "the-duo",
    name: "The Duo",
    line: "One ritual. Two bottles. Zero guesswork.",
    description: "Both shower gels for the full weekly ritual: Flowers for Myself on Monday, Wednesday and Friday, A Bath in the Rain on Tuesday, Thursday and Saturday, both on Sunday.",
    items: ["flowers-gel", "rain-gel"],
    image: { src: "/media/duo-bath-tray.jpg", alt: "Both shower gels on a bamboo bath tray over foam", w: 1080, h: 720 },
  },
  {
    id: "flowers-ritual",
    slug: "flowers-for-myself-ritual",
    name: "The Flowers Ritual",
    line: "Shower, then shimmer.",
    description: "Flowers for Myself shower gel and shimmer mist: cleanse, then finish with the same scent in its lightest form.",
    items: ["flowers-gel", "flowers-mist"],
    scent: "flowers",
    image: { src: "/media/mist-flowers-2.jpg", alt: "Flowers for Myself mists splashing through water", w: 1024, h: 1536 },
  },
  {
    id: "rain-ritual",
    slug: "a-bath-in-the-rain-ritual",
    name: "The Rain Ritual",
    line: "Fresh, then fresher.",
    description: "A Bath in the Rain shower gel and shimmer mist: a cool, citrus shower, then a rain-kissed mist for hair and skin.",
    items: ["rain-gel", "rain-mist"],
    scent: "rain",
    image: { src: "/media/mist-rain-1.jpg", alt: "A Bath in the Rain mist on the edge of a pool", w: 1024, h: 1280 },
  },
];

// The fields interactive (client) components need. Passing whole products to client components
// serialises every story, FAQ and legal block into each page's HTML (re-audit point 7).
export type ProductLite = Pick<Product, "id" | "slug" | "scent" | "format" | "name" | "formatLabel" | "size" | "price" | "inStock"> & { images: Img[] };
export const lite = (p: Product): ProductLite => ({
  id: p.id,
  slug: p.slug,
  scent: p.scent,
  format: p.format,
  name: p.name,
  formatLabel: p.formatLabel,
  size: p.size,
  price: p.price,
  inStock: p.inStock,
  images: [p.images[0]],
});

export const productById = (id: string) => products.find((p) => p.id === id);
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const sibling = (p: Product) => products.find((x) => x.scent === p.scent && x.format !== p.format)!;
export const otherScent = (p: Product) => products.find((x) => x.scent !== p.scent && x.format === p.format)!;
