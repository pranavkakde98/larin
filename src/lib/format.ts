export const inr = (n: number) =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));

export function deliveryWindow(minDays: number, maxDays: number, from = new Date()) {
  const add = (d: number) => {
    const x = new Date(from);
    let added = 0;
    while (added < d) {
      x.setDate(x.getDate() + 1);
      if (x.getDay() !== 0) added++; // couriers in India mostly skip Sundays
    }
    return x;
  };
  const f = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  return `${f(add(minDays))} – ${f(add(maxDays))}`;
}

export const validPincode = (s: string) => /^[1-8][0-9]{5}$/.test(s.trim());
