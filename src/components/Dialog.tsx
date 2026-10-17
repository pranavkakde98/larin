"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

const noop = () => () => {};

// Shared modal sheet (WAI-ARIA dialog pattern): portalled to <body>, background made inert,
// focus contained in both directions, Escape closes, focus returns to the opener.
export function Dialog({
  open,
  onClose,
  label,
  labelledBy,
  side,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label?: string;
  labelledBy?: string;
  side: "left" | "right";
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    const root = panel.current?.closest("[data-dialog-root]") as HTMLElement | null;
    const others = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== root && !el.hasAttribute("inert"),
    );
    others.forEach((el) => el.setAttribute("inert", ""));
    document.body.style.overflow = "hidden";

    const focusables = () => Array.from(panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((el) => el.offsetParent !== null);
    (panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0])?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.current?.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      others.forEach((el) => el.removeAttribute("inert"));
      document.body.style.overflow = "";
      const back = opener.current;
      if (back && back.isConnected) back.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open || !mounted) return null;
  return createPortal(
    <div data-dialog-root="">
      <div className="scrim" onClick={onClose} />
      <div
        ref={panel}
        className={`sheet ${side}`}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
