import { FiInbox } from 'react-icons/fi';

export default function Inbox({ active, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`mx-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active ? 'bg-white/20 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
      }`}
    >
      <FiInbox size={18} />
      Inbox
    </button>
  );
}
