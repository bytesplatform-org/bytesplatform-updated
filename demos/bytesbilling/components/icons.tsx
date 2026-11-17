import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 18, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconDashboard = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="3.5" width="7" height="8" rx="2" />
    <rect x="13.5" y="3.5" width="7" height="5" rx="2" />
    <rect x="13.5" y="11.5" width="7" height="9" rx="2" />
    <rect x="3.5" y="14.5" width="7" height="6" rx="2" />
  </Base>
);
export const IconInvoices = (p: P) => (
  <Base {...p}>
    <path d="M6 3.5h9l3.5 3.5v13.5H6z" />
    <path d="M14.5 3.5V7h4M9 11h6M9 14.5h6M9 18h3.5" />
  </Base>
);
export const IconPlus = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);
export const IconShield = (p: P) => (
  <Base {...p}>
    <path d="M12 3.5 5 6v5.5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Base>
);
export const IconAlert = (p: P) => (
  <Base {...p}>
    <path d="M12 4 3 19.5h18z" />
    <path d="M12 10v4.2M12 17h.01" />
  </Base>
);
export const IconInbox = (p: P) => (
  <Base {...p}>
    <path d="M3.5 13.5 6 5h12l2.5 8.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19z" />
    <path d="M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5" />
  </Base>
);
export const IconArchive = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="4" width="17" height="4.5" rx="1.2" />
    <path d="M5 8.5v10A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-10M10 12.5h4" />
  </Base>
);
export const IconSettings = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2" />
  </Base>
);
export const IconArrowRight = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </Base>
);
export const IconArrowLeft = (p: P) => (
  <Base {...p}>
    <path d="M19 12H5m6-6-6 6 6 6" />
  </Base>
);
export const IconCheck = (p: P) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Base>
);
export const IconX = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);
export const IconDownload = (p: P) => (
  <Base {...p}>
    <path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5M5 19.5h14" />
  </Base>
);
export const IconCopy = (p: P) => (
  <Base {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
  </Base>
);
export const IconMenu = (p: P) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
);
export const IconLock = (p: P) => (
  <Base {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2" />
    <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
  </Base>
);
export const IconTrash = (p: P) => (
  <Base {...p}>
    <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
  </Base>
);
export const IconRefresh = (p: P) => (
  <Base {...p}>
    <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4" />
  </Base>
);
export const IconWrench = (p: P) => (
  <Base {...p}>
    <path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5a4 4 0 0 1-2-2z" />
  </Base>
);
export const IconUpload = (p: P) => (
  <Base {...p}>
    <path d="M12 15V4m-4.5 4.5L12 4l4.5 4.5M5 19.5h14" />
  </Base>
);
