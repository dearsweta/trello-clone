import { FiFilter, FiX } from 'react-icons/fi';

export default function FilterPanel({ labels, members, filters, onChange }) {
  const activeCount =
    (filters.labelIds?.length || 0) +
    (filters.memberIds?.length || 0) +
    (filters.dueDate ? 1 : 0);

  const toggleLabel = (id) => {
    const ids = filters.labelIds || [];
    onChange({ ...filters, labelIds: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] });
  };

  const toggleMember = (id) => {
    const ids = filters.memberIds || [];
    onChange({ ...filters, memberIds: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 text-white/70">
        <FiFilter size={14} />
        <span className="text-xs font-medium">Filters</span>
        {activeCount > 0 && <span className="rounded-full bg-white/20 px-1.5 text-xs">{activeCount}</span>}
      </div>
      <select
        value={filters.dueDate || ''}
        onChange={(e) => onChange({ ...filters, dueDate: e.target.value || null })}
        className="rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-xs text-white outline-none"
      >
        <option value="" className="text-slate-900">All dates</option>
        <option value="overdue" className="text-slate-900">Overdue</option>
        <option value="today" className="text-slate-900">Due today</option>
        <option value="week" className="text-slate-900">Due this week</option>
        <option value="has" className="text-slate-900">Has due date</option>
        <option value="none" className="text-slate-900">No due date</option>
      </select>
      <div className="hidden items-center gap-1 lg:flex">
        {labels.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => toggleLabel(l.id)}
            className={`rounded px-2 py-0.5 text-xs font-medium text-white ${
              filters.labelIds?.includes(l.id) ? 'ring-2 ring-white' : 'opacity-80'
            }`}
            style={{ backgroundColor: l.color }}
          >
            {l.name}
          </button>
        ))}
      </div>
      <div className="hidden items-center gap-1 md:flex">
        {members.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => toggleMember(m.id)}
            title={m.name}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${
              filters.memberIds?.includes(m.id) ? 'ring-2 ring-white' : 'opacity-80'
            }`}
            style={{ backgroundColor: m.avatarColor }}
          >
            {m.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
          </button>
        ))}
      </div>
      {activeCount > 0 && (
        <button type="button" onClick={() => onChange({ ...filters, labelIds: [], memberIds: [], dueDate: null })} className="flex items-center gap-1 text-xs text-white/70 hover:text-white">
          <FiX size={12} /> Clear
        </button>
      )}
    </div>
  );
}
