"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Card, CardHead, PageHeader } from "../ui";
import { ASP_NAME, ERP_NAME, MILESTONES, SELLER } from "@/lib/data";
import { fmtDate } from "@/lib/format";
import { SESSION_KEY, useStore } from "@/lib/store";
import { PINT_AE_CUSTOMIZATION } from "@/lib/ubl";

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-[rgb(17_17_17/.07)] py-3 last:border-0 sm:grid-cols-[12rem_1fr] sm:gap-4">
      <dt className="text-[0.82rem] text-ink-mute">{k}</dt>
      <dd className="min-w-0 break-words text-[0.9rem]">{children}</dd>
    </div>
  );
}

export default function Settings() {
  const { reset } = useStore();
  const router = useRouter();
  const [done, setDone] = useState(false);

  return (
    <>
      <PageHeader eyebrow="Workspace" title="Settings" intro="Tenant configuration for this demo workspace. In a live tenant these are set during onboarding and every change is written to the audit log." />
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <Card>
          <CardHead eyebrow="Tenant" title="Company" />
          <dl>
            <Row k="Legal name">{SELLER.name}</Row>
            <Row k="TRN">
              <span className="tabular-nums">{SELLER.trn}</span>
            </Row>
            <Row k="Peppol ID">
              <span className="mono">{SELLER.endpoint}</span>
            </Row>
            <Row k="Address">
              {SELLER.street}, {SELLER.city}
            </Row>
            <Row k="Mandate phase">Phase 1 · revenue AED 50M+ · live {fmtDate(MILESTONES[1].date.slice(0, 10))}</Row>
          </dl>
        </Card>
        <Card>
          <CardHead eyebrow="Connections" title="ERP and provider" />
          <dl>
            <Row k="ERP connector">
              <span className="flex flex-wrap items-center gap-2">
                {ERP_NAME} <Badge tone="ok">Connected</Badge>
              </span>
            </Row>
            <Row k="Submission">HTTPS API with idempotency keys · signed webhooks + polling</Row>
            <Row k="Service provider">
              <span className="flex flex-wrap items-center gap-2">
                {ASP_NAME} <Badge tone="info">Sandbox</Badge>
              </span>
            </Row>
            <Row k="Specification">
              <span className="mono">{PINT_AE_CUSTOMIZATION}</span>
            </Row>
            <Row k="Retention">5 years general · 7 years real estate · legal hold enabled</Row>
          </dl>
        </Card>
        <Card className="xl:col-span-2">
          <CardHead eyebrow="Demo" title="Reset or leave" />
          <p className="max-w-[44rem] text-[0.9rem] text-ink-mute">
            This workspace keeps your changes for the browser session only. Reset to restore the original sample invoices, rejections and archive.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              className="pill"
              onClick={() => {
                reset();
                setDone(true);
              }}
            >
              {done ? "Sample data restored" : "Reset demo data"}
            </button>
            <button
              type="button"
              className="pill pill-dark"
              onClick={() => {
                try {
                  sessionStorage.removeItem(SESSION_KEY);
                } catch {
                  /* ignore */
                }
                router.push("/");
              }}
            >
              Sign out
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
