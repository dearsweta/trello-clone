import { toInputDate } from '../../utils/date.js';

export default function DueDateSection({ dueDate, onChange }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Due date</h3>
      <div className="flex items-center gap-2">
        <input type="date" value={toInputDate(dueDate)} onChange={(e) => onChange(e.target.value || null)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none" />
        {dueDate && <button type="button" onClick={() => onChange(null)} className="text-sm text-slate-500">Remove</button>}
      </div>
    </section>
  );
}
