import { FiChevronDown } from 'react-icons/fi';
import { BOARD_BACKGROUNDS } from '../../constants/boardBackgrounds.js';
import SearchBar from './SearchBar.jsx';
import FilterPanel from './FilterPanel.jsx';

export default function Topbar({ boardTitle, boardBackground, labels, members, search, filters, onSearchChange, onFiltersChange, onBackgroundChange }) {
  return (
    <header className="flex shrink-0 flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-white md:text-xl">{boardTitle}</h1>
        <div className="group relative">
          <button type="button" className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-1 text-xs text-white hover:bg-black/30">
            Background <FiChevronDown size={12} />
          </button>
          <div className="absolute left-0 top-full z-50 mt-1 hidden gap-1 rounded-lg bg-slate-900 p-2 shadow-xl group-hover:flex">
            {BOARD_BACKGROUNDS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onBackgroundChange(color)}
                className={`h-8 w-8 rounded-md ${boardBackground === color ? 'ring-2 ring-white' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
      <SearchBar value={search} onChange={onSearchChange} />
      <FilterPanel labels={labels} members={members} filters={filters} onChange={onFiltersChange} />
    </header>
  );
}
