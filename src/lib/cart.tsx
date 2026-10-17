"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ORDER_NOTE_MAX, sanitizeGift, sanitizeLine, type CartLine, type GiftBox } from "./line";

export type { CartLine, GiftBox } from "./line";
export { toLine } from "./line";

// Gift wrap and note for the shopper's own items (gift boxes carry their own note).
export interface GiftOptions {
  wrap: boolean;
  note: string;
}

interface CartState {
  lines: CartLine[];
  gifts: GiftBox[];
  gift: GiftOptions;
  open: boolean;
  count: number;
  subtotal: number;
  add: (items: Omit<CartLine, "qty">[], qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  addGift: (box: Omit<GiftBox, "id">) => void;
  removeGift: (id: string) => void;
  updateGift: (id: string, box: Omit<GiftBox, "id">) => void;
  loaded: boolean;
  clear: () => void;
  setGift: (g: Partial<GiftOptions>) => void;
  setOpen: (o: boolean) => void;
}

const Ctx = createContext<CartState | null>(null);
const KEY = "lareine.cart.v2";
const OLD_KEY = "lareine.cart.v1";
const MAX_QTY = 10;
const MAX_GIFTS = 10;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [gifts, setGifts] = useState<GiftBox[]>([]);
  const [gift, setGiftState] = useState<GiftOptions>({ wrap: true, note: "" });
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY) ?? localStorage.getItem(OLD_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        const restored = Array.isArray(s?.lines) ? s.lines.map(sanitizeLine).filter(Boolean) : [];
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring browser-only storage after hydration; reading it during render would mismatch the server HTML
        setLines(restored as CartLine[]);
        if (Array.isArray(s?.gifts)) setGifts(s.gifts.map(sanitizeGift).filter(Boolean).slice(0, MAX_GIFTS) as GiftBox[]);
        if (s?.gift && typeof s.gift === "object") {
          setGiftState({ wrap: s.gift.wrap !== false, note: typeof s.gift.note === "string" ? s.gift.note.slice(0, ORDER_NOTE_MAX) : "" });
        }
      }
      localStorage.removeItem(OLD_KEY);
    } catch {
      // malformed storage: start with an empty bag
      try {
        localStorage.removeItem(KEY);
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ lines, gifts, gift }));
    } catch {}
  }, [lines, gifts, gift, loaded]);

  const add = useCallback((items: Omit<CartLine, "qty">[], qty = 1) => {
    setLines((prev) => {
      const next = [...prev];
      for (const it of items) {
        const i = next.findIndex((l) => l.id === it.id);
        if (i >= 0) next[i] = { ...next[i], qty: Math.min(MAX_QTY, next[i].qty + qty) };
        else next.push({ ...it, qty: Math.min(MAX_QTY, qty) });
      }
      return next;
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => setLines((p) => p.filter((l) => l.id !== id)), []);

  const addGift = useCallback((box: Omit<GiftBox, "id">) => {
    const id = `gift-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    setGifts((prev) => [...prev, { ...box, id }].slice(-MAX_GIFTS));
    setOpen(true);
  }, []);
  const removeGift = useCallback((id: string) => setGifts((p) => p.filter((g) => g.id !== id)), []);
  // Edits keep the box's id and its position in the bag.
  const updateGift = useCallback((id: string, box: Omit<GiftBox, "id">) => setGifts((p) => p.map((g) => (g.id === id ? { ...box, id } : g))), []);

  const clear = useCallback(() => {
    setLines([]);
    setGifts([]);
  }, []);
  const setGift = useCallback((g: Partial<GiftOptions>) => setGiftState((p) => ({ ...p, ...g })), []);

  const value = useMemo<CartState>(() => {
    const giftQty = gifts.reduce((n, g) => n + g.items.reduce((m, l) => m + l.qty, 0), 0);
    const giftSum = gifts.reduce((n, g) => n + g.items.reduce((m, l) => m + l.qty * l.price, 0), 0);
    const count = lines.reduce((n, l) => n + l.qty, 0) + giftQty;
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0) + giftSum;
    return { lines, gifts, gift, open, count, subtotal, add, setQty, remove, addGift, removeGift, updateGift, loaded, clear, setGift, setOpen };
  }, [lines, gifts, gift, open, add, setQty, remove, addGift, removeGift, updateGift, loaded, clear, setGift]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
