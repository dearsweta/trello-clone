export default function CoverSection({ coverImageUrl, onChange }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Cover image</h3>
      <input type="url" value={coverImageUrl || ''} onChange={(e) => onChange(e.target.value || null)} placeholder="https://example.com/image.jpg" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none" />
      {coverImageUrl && <div className="mt-2 h-32 w-full rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${coverImageUrl})` }} />}
    </section>
  );
}
