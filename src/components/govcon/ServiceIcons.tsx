/** Small line icons for the service pages (24×24, stroke = currentColor). Decorative. */
const paths = {
  building: "M4 21V8l8-5 8 5v13M9 21v-6h6v6M3 21h18M8 10h.01M12 10h.01M16 10h.01",
  briefcase: "M3 8h18v12H3zM8 8V5h8v3M3 13h18",
  store: "M4 10v10h16V10M3 10l2-6h14l2 6M3 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3M10 20v-5h4v5",
  alert: "M12 3l9.5 17h-19zM12 10v4M12 17.5h.01",
  check: "M5 12.5l4.5 4.5L19 7.5",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  pencil: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4",
  cycle: "M20 11a8 8 0 0 0-14.6-4.5M4 4v3h3M4 13a8 8 0 0 0 14.6 4.5M20 20v-3h-3",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4",
  rocket: "M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c3-1 6-1 6-1s0 3-1 6l-7 7-5-5zM9 11l-3-1 3-3h3M13 15l1 3-3 3v-3",
  lifebuoy: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6",
  user: "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c0-4 3.6-7 8-7s8 3 8 7",
  calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4M8 14h3",
  board: "M4 4h16v16H4zM9.5 4v16M14.5 4v16M6 7h2M11 7h2M16 7h2M6 10h2M16 10h2",
  stamp: "M12 3a3 3 0 0 0-3 3c0 2 2 3 2 5H6v4h12v-4h-5c0-2 2-3 2-5a3 3 0 0 0-3-3zM5 19h14",
  coin: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM14.5 9c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6v1.5M12 16.5V18",
  box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
  contract: "M7 3h10v18H7zM10 7h4M10 11h4M10 15l1.5 1.5L14 14",
  inbox: "M3 13l3-8h12l3 8v6H3zM3 13h5l1 2h6l1-2h5",
  team: "M9 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M16 5.5a3 3 0 0 1 0 5.5M18 14.5c2.4.7 4 2.8 4 5.5",
  wrench: "M14.5 5.5a4 4 0 0 0-5 5L4 16v4h4l5.5-5.5a4 4 0 0 0 5-5L16 12l-4-4z",
} as const;

export type IconName = keyof typeof paths;

export default function ServiceIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
