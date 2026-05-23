import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

export default function AddListButton({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    await onAdd(t);
    setTitle('');
    setOpen(false);
  };

  return (
    <div className="w-72 shrink-0">
      {open ? (
        <form onSubmit={submit} className="rounded-xl bg-slate-100/90 p-3">
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter list title..." className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none" />
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white">Add list</button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200">Cancel</button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="flex w-full items-center gap-2 rounded-xl bg-white/20 px-4 py-3 text-sm font-medium text-white hover:bg-white/30">
          <FiPlus size={16} /> Add another list
        </button>
      )}
    </div>
  );
}
