import { useEffect, useState } from 'react';
import { FiTrash2, FiX } from 'react-icons/fi';

export default function InboxCardModal({ card, onClose, onUpdate, onDelete }) {
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');

  useEffect(() => {
    setTitle(card?.title || '');
    setDescription(card?.description || '');
  }, [card?.id, card?.title, card?.description]);

  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose} role="presentation">
      <div className="relative my-8 w-full max-w-lg rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog">
        <button type="button" onClick={onClose} className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <FiX size={20} />
        </button>
        <div className="p-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-600">Inbox</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              const t = title.trim();
              if (t && t !== card.title) onUpdate({ title: t });
            }}
            className="mb-4 w-full border-0 text-xl font-bold text-slate-800 outline-none"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => {
              if (description !== (card.description || '')) onUpdate({ description: description || null });
            }}
            rows={5}
            placeholder="Add details..."
            className="mb-6 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500"
          />
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100"
          >
            <FiTrash2 size={14} />
            Delete from Inbox
          </button>
        </div>
      </div>
    </div>
  );
}
