import type { ScentId } from "./products";

export const settings = {
  name: "La Reiné",
  tagline: "Every Bathé Luxury.",
  // Real domain via NEXT_PUBLIC_SITE_URL; Vercel builds fall back to the project's production URL.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  // Proposed, not yet confirmed by the founder (see client to-do).
  announcement: "Complimentary gift wrap and a handwritten note on every order.",
  freeShippingThreshold: null as number | null,
  giftWrapPrice: 0,
  delivery: { minDays: 3, maxDays: 6 },
  whatsapp: null as string | null,
  instagram: null as string | null,
};

export interface Scent {
  id: ScentId;
  slug: string;
  name: string;
  days: string;
  character: string;
  headline: string;
  story: string[];
  forSkin: string;
  hero: { src: string; alt: string; w: number; h: number };
  loop?: { mp4: string; webm: string; poster: string };
}

export const scents: Scent[] = [
  {
    id: "flowers",
    slug: "flowers-for-myself",
    name: "Flowers for Myself",
    days: "Monday · Wednesday · Friday",
    character: "Softness, kept for yourself.",
    headline: "Flowers for Myself",
    story: [
      "Flowers for Myself celebrates softness and self-love: the flowers you buy for no one but you.",
      "The shower gel carries 1% salicylic acid for breakout-prone skin on the back, chest and arms. The shimmer mist carries the same feeling in its lightest form, a sweet floral musk for hair and skin.",
    ],
    forSkin: "For breakouts on your back, chest or arms.",
    hero: { src: "/media/gel-flowers-2.jpg", alt: "Flowers for Myself shower gel tilted in pink water among petals", w: 928, h: 1152 },
  },
  {
    id: "rain",
    slug: "a-bath-in-the-rain",
    name: "A Bath in the Rain",
    days: "Tuesday · Thursday · Saturday",
    character: "Fresh, calm, rain-kissed.",
    headline: "A Bath in the Rain",
    story: [
      "A Bath in the Rain captures the freshness and calm of a rain-kissed escape.",
      "The shower gel is enriched with seaweed extract for skin that feels tight after a shower. The shimmer mist is an aqua citrus burst for hair and skin, whenever you want the freshness back.",
    ],
    forSkin: "For skin that feels tight or flaky after every shower.",
    hero: { src: "/media/gel-rain-2.jpg", alt: "A Bath in the Rain shower gel splashing into a basin with citrus", w: 928, h: 1152 },
  },
];

export const scentBySlug = (slug: string) => scents.find((s) => s.slug === slug);
export const scentById = (id: ScentId) => scents.find((s) => s.id === id)!;

// The founder's weekly skin cycling routine (July 2026 social post).
export const ritual = {
  title: "One ritual. Two bottles. Zero guesswork.",
  intro:
    "Your body skin has fewer oil glands than your face, which is one reason it can feel dry after showering. So give it what it needs on the right day: clarity on some days, comfort on others.",
  days: [
    { day: "Mon", scent: "flowers" as const, text: "Focus on breakout-prone areas. Purify and keep it balanced." },
    { day: "Tue", scent: "rain" as const, text: "Hydrate, soothe and refresh. Nourish your skin barrier." },
    { day: "Wed", scent: "flowers" as const, text: "Back, chest and arms first. Rinse, and finish with a mist." },
    { day: "Thu", scent: "rain" as const, text: "All over, wherever skin feels tight." },
    { day: "Fri", scent: "flowers" as const, text: "Clear skin for the weekend." },
    { day: "Sat", scent: "rain" as const, text: "A slow, cool shower. No rush." },
    { day: "Sun", scent: "both" as const, text: "The reset: Flowers for Myself on breakout-prone areas first, then A Bath in the Rain everywhere else." },
  ],
};

// The founder's "A or B" post, turned into the chooser.
export const chooser = {
  question: "Which one is for you?",
  sub: "Tell us how your skin feels after a shower. We'll tell you exactly which one to start with.",
  options: [
    { key: "A", scent: "flowers" as ScentId, title: "Breakouts on your back, chest or arms.", body: "Start with Flowers for Myself." },
    { key: "B", scent: "rain" as ScentId, title: "Skin feels tight or flaky after every shower.", body: "Start with A Bath in the Rain." },
  ],
  results: {
    flowers: {
      headline: "You're Flowers for Myself.",
      body: "1% salicylic acid helps keep breakout-prone skin on your back, chest and arms clear. Use it on Monday, Wednesday and Friday, then finish with the shimmer mist.",
    },
    rain: {
      headline: "You're A Bath in the Rain.",
      body: "Seaweed extract helps skin that feels tight after a shower feel soft and comfortable again. Use it on Tuesday, Thursday and Saturday, then finish with the shimmer mist.",
    },
    both: {
      headline: "You're both. Most of us are.",
      body: "Alternate them through the week, the way the founder does: clarity on some days, comfort on others, and both on Sunday.",
    },
  },
};

export const founderNote = {
  salutation: "Dear You,",
  paragraphs: [
    "La Reiné was born from a simple belief: everyday rituals deserve to feel extraordinary.",
    "We often save the beautiful things for special occasions: the perfect fragrance, the luxurious bath, the little moments of indulgence. I wanted to create a brand that brings that feeling into the everyday.",
    "La Reiné is my interpretation of modern, effortless luxury: sensory, elegant and made for those quiet moments when you choose to pause and care for yourself.",
    "From our shower gels to our hair & body mists, every product is created to make an ordinary routine feel a little more special. Flowers for Myself celebrates softness and self-love, while A Bath in the Rain captures the freshness and calm of a rain-kissed escape.",
    "But La Reiné is more than what is inside the bottle. It is about the feeling that stays with you: the confidence after getting ready, the calm after a long day, the joy of gifting someone you love, and the simple pleasure of doing something just for yourself.",
    "I hope that whenever you reach for La Reiné, you remember that you don't need a special occasion to feel special.",
    "Thank you for being part of our journey.",
  ],
  signoff: "With love,",
  // Founder's name not yet supplied; never invent one.
  signature: null as string | null,
  role: "Founder, La Reiné",
};

export const proof = [
  { icon: "drop", title: "1% salicylic acid", text: "In Flowers for Myself shower gel" },
  { icon: "leaf", title: "Seaweed extract", text: "In A Bath in the Rain shower gel" },
  { icon: "spark", title: "Alcohol-free mists", text: "Gentle on hair and skin" },
  { icon: "hair", title: "For hair & body", text: "One mist, two places" },
];

export const services = [
  { title: "Wrapped by hand", text: "Complimentary gift wrap and a handwritten note." },
  { title: "Know when it arrives", text: "Check your delivery date with your pincode." },
  { title: "Secure payment", text: "UPI, cards and netbanking." },
  { title: "Here to help", text: "Questions about your skin or your order, answered by people." },
];

export const helpFaq = [
  { q: "Which one should I start with?", a: "If you get breakouts on your back, chest or arms, start with Flowers for Myself. If your skin feels tight or flaky after showering, start with A Bath in the Rain. If both sound like you, take the Duo and alternate." },
  { q: "Can I use the mists in my hair?", a: "Yes. Both mists are alcohol-free and made for hair and body." },
  { q: "Are the gels for the face?", a: "No, they are made for body skin." },
  { q: "How long will delivery take?", a: "Enter your pincode on any product page for an estimate. Most orders arrive within 3 to 6 days." },
  { q: "Can I send a gift?", a: "Yes. Every order can be gift wrapped with a handwritten note at no cost, and prices are never included in a gift parcel." },
  { q: "What is your return policy?", a: "See the refund policy. Details are being finalised and will be confirmed before launch." },
];

export interface Post {
  slug: string;
  title: string;
  dek: string;
  date: string;
  cover: { src: string; alt: string; w: number; h: number };
  body: { type: "p" | "h2" | "li"; text: string }[];
  related: string[];
}

export const posts: Post[] = [
  {
    slug: "weekly-skin-cycling-for-the-body",
    title: "Your weekly skin cycling routine, for the body",
    dek: "Clarity on some days, comfort on others. A simple plan for two shower gels.",
    date: "2026-10-14",
    cover: { src: "/media/duo-bath-tray.jpg", alt: "Both shower gels on a bamboo bath tray over foam", w: 1080, h: 720 },
    body: [
      { type: "p", text: "Skin cycling started on faces: rotate what you use so skin gets the right thing on the right day. Body skin benefits from the same idea, and it only takes two bottles." },
      { type: "h2", text: "Monday, Wednesday, Friday: clarity" },
      { type: "p", text: "Use Flowers for Myself. Its 1% salicylic acid helps keep pores on breakout-prone areas clear, so focus on your back, chest and arms." },
      { type: "h2", text: "Tuesday, Thursday, Saturday: comfort" },
      { type: "p", text: "Use A Bath in the Rain. Seaweed extract helps skin that feels tight or dry after a shower feel soft and comfortable again." },
      { type: "h2", text: "Sunday: the reset" },
      { type: "p", text: "Use Flowers for Myself on breakout-prone areas first, then A Bath in the Rain everywhere else." },
      { type: "h2", text: "Finish with a mist" },
      { type: "p", text: "On any day, mist the matching scent onto your hair and shoulders. It's alcohol-free, so it won't dry them out." },
    ],
    related: ["flowers-gel", "rain-gel"],
  },
  {
    slug: "why-skin-feels-tight-after-a-shower",
    title: "Why your skin feels tight after a shower",
    dek: "Your body has fewer oil glands than your face. Here's what that means for your shower.",
    date: "2026-10-14",
    cover: { src: "/media/ritual-shower.jpg", alt: "A woman tilts her face into the shower", w: 1080, h: 900 },
    body: [
      { type: "p", text: "Your body skin has fewer oil glands than your face. That's one reason it can feel dry, tight or flaky after showering, especially in air-conditioned rooms or the winter months." },
      { type: "h2", text: "Small changes that help" },
      { type: "li", text: "Keep the water warm rather than hot." },
      { type: "li", text: "Keep showers short and unhurried rather than long." },
      { type: "li", text: "Pat skin dry instead of rubbing." },
      { type: "li", text: "Choose a cleanser made for skin that feels tight." },
      { type: "h2", text: "Where A Bath in the Rain comes in" },
      { type: "p", text: "A Bath in the Rain is enriched with seaweed extract and made for exactly this feeling. It cleanses while leaving skin feeling fresh and comfortable, not stripped." },
    ],
    related: ["rain-gel", "rain-mist"],
  },
  {
    slug: "how-to-wear-a-shimmer-mist-in-your-hair",
    title: "How to wear a shimmer mist in your hair",
    dek: "Three ways to wear a little light, without stickiness.",
    date: "2026-10-14",
    cover: { src: "/media/mist-flowers-4.jpg", alt: "A woman sprays the Flowers for Myself mist", w: 620, h: 776 },
    body: [
      { type: "p", text: "Hair holds scent beautifully, and an alcohol-free mist is kind to it. Here are three ways to wear one." },
      { type: "h2", text: "On the lengths" },
      { type: "p", text: "Hold the bottle about 20 cm away and mist the lengths and ends, not the roots. Let it settle for a few seconds." },
      { type: "h2", text: "On a brush" },
      { type: "p", text: "Mist your brush once, then brush through. It spreads the scent and the shimmer evenly." },
      { type: "h2", text: "As a midday reset" },
      { type: "p", text: "Keep the mist in your bag and refresh hair, neck and wrists whenever you want the feeling back." },
    ],
    related: ["flowers-mist", "rain-mist"],
  },
];
