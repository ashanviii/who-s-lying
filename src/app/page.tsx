import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProfileForm } from "@/components/ProfileForm";

const STEPS = [
  {
    n: "01",
    title: "Paste a profile",
    body: "Drop in a LinkedIn URL or copy-paste the About / Experience sections. Yours, a coworker's, that one guy's — your call.",
  },
  {
    n: "02",
    title: "We check the receipts",
    body: "Claude extracts every checkable claim — titles, metrics, degrees, awards — and searches the public web for evidence, for and against.",
  },
  {
    n: "03",
    title: "Get the verdict",
    body: "A Lying Ass Index, claim-by-claim evidence, and sources for everything. Screenshot-ready, receipts included.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-14 sm:pt-20">
        <section className="animate-fade-up text-center">
          <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Evidence-based. Brutally honest. Occasionally unhinged.
          </p>
          <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
            How much bullshit is on this{" "}
            <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">LinkedIn</span>?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-base text-muted sm:text-lg">
            Paste a profile. We pull out every claim — titles, metrics, degrees, awards — and check it against public
            sources. You get a score, the receipts, and a reason to never say &ldquo;thought leader&rdquo; again.
          </p>
        </section>

        <section className="animate-fade-up mt-10 sm:mt-12" style={{ animationDelay: "80ms" }}>
          <ProfileForm />
        </section>

        <section className="mt-20 sm:mt-28">
          <h2 className="text-center font-display text-2xl font-semibold sm:text-3xl">How it works</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-2xl border border-border bg-surface p-5">
                <span className="font-display text-sm font-bold text-brand">{step.n}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-border-soft bg-background-elevated p-5 text-sm leading-relaxed text-muted-soft sm:mt-20">
          <span className="font-semibold text-muted">Before you get any ideas: </span>
          The Lying Ass Index measures how well claims can be verified from public sources right now — it is not a
          verdict on anyone&apos;s character, and it is not a background check. Use it for laughs and healthy
          skepticism, not for harassment, doxxing, or hiring decisions.
        </section>
      </main>
      <Footer />
    </>
  );
}
