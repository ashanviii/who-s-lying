export function DemoBanner({ noKey }: { noKey?: boolean }) {
  return (
    <div className="animate-fade-in rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-foreground">
      <span className="font-semibold text-brand">Demo data.</span>{" "}
      {noKey
        ? "No OPENAI_API_KEY is configured on this server, so every analysis shows this pre-written example. Add a key to run real analyses — see the README."
        : "This is the example profile, pre-written to show how results look without spending API credits."}
    </div>
  );
}
