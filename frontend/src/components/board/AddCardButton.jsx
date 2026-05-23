import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

export default function AddCardButton({ onAdd }) {
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

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-slate-200/60">
        <FiPlus size={14} /> Add a card
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <textarea autoFocus rows={2} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a title..." className="w-full resize-none rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-violet-500" />
      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700">Add card</button>
        <button type="button" onClick={() => { setOpen(false); setTitle(''); }} className="text-slate-500"><FiX size={18} /></button>
      </div>
    </form>
  );
}
