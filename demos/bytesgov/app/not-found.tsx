import Link from "next/link";
import { Logo } from "@/components/Logo";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <Logo className="justify-center" />
        <h1 className="mt-10 text-[clamp(2.4rem,6vw,4rem)] font-medium leading-none tracking-[-0.055em]">
          No such page<span className="text-blue">.</span>
        </h1>
        <p className="mt-3 text-ink-mute">That notice may have been withdrawn, or the link is mistyped.</p>
        <Link href="/dashboard" className={`${btn.dark} mt-8`}>
          Back to the dashboard
        </Link>
      </div>
    </main>
  );
}
