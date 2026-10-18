import React, { useState, useRef, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import SmartImage from '../SmartImage';
import { matchesSearch, formatINR } from '../../lib/shop';

/**
 * Shop search with live suggestions (Amazon style): matching products appear under the box
 * while typing; Enter (or "See all results") filters the grid. Arrow keys move through the list.
 */
export const ShopSearch = ({ products, value, onSearch, className = '' }) => {
  const navigate = useNavigate();
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef(null);
  const listId = useId();

  useEffect(() => setText(value), [value]);
  useEffect(() => {
    const close = (e) => !boxRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const suggestions = text.trim().length >= 2 ? products.filter((p) => matchesSearch(p, text)).slice(0, 6) : [];

  const searchAll = () => {
    setOpen(false);
    setActive(-1);
    onSearch(text.trim());
  };

  // Enter: open the highlighted suggestion, or search for the typed words
  const submit = (e) => {
    e.preventDefault();
    if (open && active >= 0 && suggestions[active]) navigate(`/shop/${suggestions[active].id}`);
    else searchAll();
  };

  const onKeyDown = (e) => {
    if (!open || !suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form onSubmit={submit} role="search" className="relative">
        <Search className="w-[18px] h-[18px] text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search sofas, chairs, travertine, walnut…"
          aria-label="Search the shop"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          className="w-full h-12 pl-11 pr-24 rounded-full bg-surface border border-line text-[16px] text-fg placeholder:text-subtle focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 [&::-webkit-search-cancel-button]:hidden"
        />
        {text && (
          <button
            type="button"
            onClick={() => {
              setText('');
              onSearch('');
            }}
            className="absolute right-[76px] top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted hover:text-fg"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button type="submit" className="btn-primary btn-sm absolute right-1.5 top-1/2 -translate-y-1/2">
          Search
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 left-0 right-0 mt-2 rounded-2xl bg-surface shadow-tile-hover border border-line/60 dark:border-line overflow-hidden"
        >
          {suggestions.map((p, i) => (
            <li key={p.id} id={`${listId}-${i}`} role="option" aria-selected={active === i}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => navigate(`/shop/${p.id}`)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left ${active === i ? 'bg-sunken/60' : ''}`}
              >
                <SmartImage src={p.images?.[0]} sizes="48px" alt="" className="w-11 h-11 rounded-lg object-cover bg-sunken shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-fg truncate">{p.name}</span>
                  <span className="block text-[12px] text-muted truncate">in {p.categoryName}</span>
                </span>
                <span className="text-[13px] font-semibold text-fg tabular-nums shrink-0">{formatINR(p.price)}</span>
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={searchAll} className="w-full px-4 py-2.5 text-left text-[13px] text-accent font-medium border-t border-line/60 dark:border-line hover:bg-sunken/40">
              See all results for “{text.trim()}”
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ShopSearch;
