import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-md flex-1">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
      <input
        type="search"
        placeholder="Search cards..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/20 bg-white/10 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/40"
      />
    </div>
  );
}
