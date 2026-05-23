import { getInitials } from '../../utils/initials.js';

export default function MemberSection({ members, selectedIds, onChange }) {
  const toggle = (id) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Members</h3>
      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <button key={m.id} type="button" onClick={() => toggle(m.id)} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${selectedIds.includes(m.id) ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: m.avatarColor }}>{getInitials(m.name)}</span>
            {m.name}
          </button>
        ))}
      </div>
    </section>
  );
}
