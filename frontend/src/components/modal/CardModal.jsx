import { useEffect, useState } from 'react';
import { FiX, FiTrash2, FiArchive } from 'react-icons/fi';
import LabelSection from './LabelSection.jsx';
import MemberSection from './MemberSection.jsx';
import ChecklistSection from './ChecklistSection.jsx';
import DueDateSection from './DueDateSection.jsx';
import CoverSection from './CoverSection.jsx';

export default function CardModal({ card, labels, members, onClose, onUpdate, onDelete, onArchive, onMembersChange, onLabelsChange, onAddChecklist, onToggleChecklist, onDeleteChecklist }) {
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');

  useEffect(() => {
    setTitle(card?.title || '');
    setDescription(card?.description || '');
  }, [card?.id, card?.title, card?.description]);

  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 md:p-8" onClick={onClose} role="presentation">
      <div className="relative my-4 w-full max-w-2xl rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog">
        {card.coverImageUrl && <div className="h-40 w-full rounded-t-xl bg-cover bg-center" style={{ backgroundImage: `url(${card.coverImageUrl})` }} />}
        <button type="button" onClick={onClose} className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100"><FiX size={20} /></button>
        <div className="p-6">
          <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => { const t = title.trim(); if (t && t !== card.title) onUpdate({ title: t }); }} className="mb-4 w-full border-0 text-xl font-bold text-slate-800 outline-none" />
          <div className="mb-6 flex gap-2">
            <button type="button" onClick={() => onArchive(true)} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700"><FiArchive size={14} /> Archive</button>
            <button type="button" onClick={onDelete} className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600"><FiTrash2 size={14} /> Delete</button>
          </div>
          <div className="mb-6">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Description</h3>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} onBlur={() => { if (description !== (card.description || '')) onUpdate({ description: description || null }); }} rows={4} placeholder="Add a more detailed description..." className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none" />
          </div>
          <div className="flex flex-col gap-6">
            <DueDateSection dueDate={card.dueDate} onChange={(val) => onUpdate({ dueDate: val ? `${val}T12:00:00` : null })} />
            <LabelSection labels={labels} selectedIds={card.labelIds || []} onChange={onLabelsChange} />
            <MemberSection members={members} selectedIds={card.memberIds || []} onChange={onMembersChange} />
            <ChecklistSection items={card.checklistItems || []} onAdd={onAddChecklist} onToggle={onToggleChecklist} onDelete={onDeleteChecklist} />
            <CoverSection coverImageUrl={card.coverImageUrl} onChange={(url) => onUpdate({ coverImageUrl: url })} />
          </div>
        </div>
      </div>
    </div>
  );
}
