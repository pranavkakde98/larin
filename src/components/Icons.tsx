type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconBag = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...base}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const IconMenu = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...base}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const IconClose = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconDrop = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
  </svg>
);
export const IconLeaf = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M5 19c0-8 5-13 14-14 0 9-5 14-14 14Z" />
    <path d="M5 19 13 11" />
  </svg>
);
export const IconSpark = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
);
export const IconHair = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M7 21c-2-5-2-10 1-14s9-4 10 1-1 9-3 13" />
    <path d="M11 21c-1-4 0-8 2-11" />
  </svg>
);
export const IconCheck = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...base}>
    <path d="m5 12 4 4 10-10" />
  </svg>
);
export const proofIcons = { drop: IconDrop, leaf: IconLeaf, spark: IconSpark, hair: IconHair };
