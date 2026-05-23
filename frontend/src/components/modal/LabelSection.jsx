export default function LabelSection({ labels, selectedIds, onChange }) {
  const toggle = (id) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Labels</h3>
      <div className="flex flex-wrap gap-2">
        {labels.map((l) => (
          <button key={l.id} type="button" onClick={() => toggle(l.id)} className={`rounded px-3 py-1.5 text-sm font-medium text-white ${selectedIds.includes(l.id) ? 'ring-2 ring-violet-500 ring-offset-2' : 'opacity-70'}`} style={{ backgroundColor: l.color }}>{l.name}</button>
        ))}
      </div>
    </section>
  );
}
