export function Disclaimer({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-border-soft bg-background-elevated p-4 text-xs leading-relaxed text-muted-soft sm:text-sm">
      <span className="font-semibold text-muted">Read this before you screenshot it: </span>
      {text}
    </div>
  );
}
