"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { buildSeedAudit, buildSeedInbound, buildSeedInvoices, REJECTION_CODES, type InboundInvoice } from "./data";
import type { AuditEntry, Invoice } from "./types";

const KEY = "bytesbilling-demo-state-v1";
export const SESSION_KEY = "bytesbilling-demo-signed-in";

type State = {
  invoices: Invoice[];
  audit: AuditEntry[];
  holds: Record<string, boolean>;
  fixed: Record<string, boolean>;
  inbound: InboundInvoice[];
};

function seed(): State {
  const now = new Date();
  const invoices = buildSeedInvoices(now);
  return { invoices, audit: buildSeedAudit(now, invoices), holds: { "1296": true }, fixed: {}, inbound: buildSeedInbound(now) };
}

type Store = State & {
  ready: boolean;
  addInvoice: (inv: Invoice) => void;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  log: (action: string, target: string, actor?: string) => void;
  fixCode: (code: string) => void;
  resubmit: (code: string) => Invoice[];
  toggleHold: (id: string) => void;
  postInbound: (id: string, note: string) => void;
  reset: () => void;
};

const Ctx = createContext<Store | null>(null);
const USER = "Sara Al Mansoori";
let seq = 0;
const uid = () => `e${Date.now().toString(36)}${(seq++).toString(36)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(seed);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        if (Array.isArray(parsed.invoices) && Array.isArray(parsed.audit)) setState(parsed);
      }
    } catch {
      /* storage blocked: keep the seed */
    }
    loaded.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const entry = (action: string, target: string, actor = USER): AuditEntry => ({
    id: uid(),
    at: new Date().toISOString(),
    actor,
    action,
    target,
  });

  const log = useCallback((action: string, target: string, actor?: string) => {
    setState((s) => ({ ...s, audit: [entry(action, target, actor), ...s.audit] }));
  }, []);

  const addInvoice = useCallback((inv: Invoice) => {
    setState((s) => ({ ...s, invoices: [inv, ...s.invoices] }));
  }, []);

  const updateInvoice = useCallback((id: string, patch: Partial<Invoice>) => {
    setState((s) => ({ ...s, invoices: s.invoices.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  }, []);

  const fixCode = useCallback((code: string) => {
    setState((s) => ({
      ...s,
      fixed: { ...s.fixed, [code]: true },
      audit: [entry(`Master data fixed for ${code}: ${REJECTION_CODES[code]?.fixDone ?? ""}`, "SAP Business One"), ...s.audit],
    }));
  }, []);

  const resubmit = useCallback(
    (code: string) => {
      const affected = state.invoices.filter((i) => i.rejectionCode === code);
      const at = new Date().toISOString();
      setState((s) => ({
        ...s,
        invoices: s.invoices.map((i) =>
          i.rejectionCode === code
            ? {
                ...i,
                peppol: "Delivered",
                fta: "Accepted",
                rejectionCode: undefined,
                resolvedCode: code,
                resubmittedAt: at,
                idempotencyKey: `idem-${i.number.toLowerCase()}-r1`,
              }
            : i,
        ),
        audit: [
          ...affected.map((i) => entry(`Resubmitted with key idem-${i.number.toLowerCase()}-r1 · FTA accepted`, i.number)),
          ...s.audit,
        ],
      }));
      return affected;
    },
    [state.invoices],
  );

  const toggleHold = useCallback((id: string) => {
    setState((s) => {
      const on = !s.holds[id];
      const inv = s.invoices.find((i) => i.id === id);
      return {
        ...s,
        holds: { ...s.holds, [id]: on },
        audit: [entry(on ? "Legal hold placed (retention expiry suspended)" : "Legal hold released", inv?.number ?? id), ...s.audit],
      };
    });
  }, []);

  const postInbound = useCallback((id: string, note: string) => {
    setState((s) => {
      const inv = s.inbound.find((i) => i.id === id);
      return {
        ...s,
        inbound: s.inbound.map((i) => (i.id === id ? { ...i, posted: true } : i)),
        audit: [entry(note, inv?.number ?? id), ...s.audit],
      };
    });
  }, []);

  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setState(seed());
  }, []);

  const value = useMemo<Store>(
    () => ({ ...state, ready, addInvoice, updateInvoice, log, fixCode, resubmit, toggleHold, postInbound, reset }),
    [state, ready, addInvoice, updateInvoice, log, fixCode, resubmit, toggleHold, postInbound, reset],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside StoreProvider");
  return s;
}

/** Returns true when the user prefers reduced motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
