import { useState } from 'react';
import { FiCheck, FiTrash2 } from 'react-icons/fi';

export default function ChecklistSection({ items, onAdd, onToggle, onDelete }) {
  const [text, setText] = useState('');
  const completed = items.filter((i) => i.completed).length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  const submit = async (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    await onAdd(t);
    setText('');
  };

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Checklist</h3>
        {items.length > 0 && <span className="text-xs text-slate-500">{completed}/{items.length} ({pct}%)</span>}
      </div>
      {items.length > 0 && (
        <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
        </div>
      )}
      <ul className="mb-3 flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id} className="group flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-slate-50">
            <button type="button" onClick={() => onToggle(item.id, !item.completed)} className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${item.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'}`}>
              {item.completed && <FiCheck size={12} />}
            </button>
            <span className={`flex-1 text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.text}</span>
            <button type="button" onClick={() => onDelete(item.id)} className="rounded p-1 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500"><FiTrash2 size={14} /></button>
          </li>
        ))}
      </ul>
      <form onSubmit={submit} className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add an item..." className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none" />
        <button type="submit" className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">Add</button>
      </form>
    </section>
  );
}
