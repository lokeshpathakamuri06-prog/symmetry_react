import React, { useState, useEffect } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { PRICE_BRACKETS, RATING_STEPS, DISCOUNT_STEPS, applyFilters, discountOf, isInStock, formatINR } from '../../lib/shop';

/**
 * Filter groups, Flipkart / Amazon style: Category, Price, Customer Ratings, Discount, Availability.
 * Each option shows how many products it would leave (counted with the other filters applied).
 * Used in the desktop sidebar and in the phone filter sheet.
 */
export const ShopFilters = ({ products, categories, filters, onChange }) => {
  const countFor = (except, test) => applyFilters(products, filters, { except }).filter(test).length;

  const toggleIn = (key, value) => {
    const list = filters[key];
    onChange({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  return (
    <div className="divide-y divide-line/70 dark:divide-line">
      <Group title="Category">
        {categories.map((cat) => {
          const n = countFor('categories', (p) => p.category === cat.slug);
          return (
            <Check
              key={cat.slug}
              label={cat.name}
              count={n}
              checked={filters.categories.includes(cat.slug)}
              onChange={() => toggleIn('categories', cat.slug)}
            />
          );
        })}
      </Group>

      <Group title="Price">
        {PRICE_BRACKETS.map((b) => {
          const active = filters.min === b.min && filters.max === b.max;
          const n = countFor('price', (p) => p.price >= b.min && (b.max == null || p.price < b.max));
          return (
            <Radio
              key={b.label}
              name="price"
              label={b.label}
              count={n}
              checked={active}
              onChange={() => onChange(active ? { min: null, max: null } : { min: b.min, max: b.max })}
            />
          );
        })}
        <PriceInputs filters={filters} onChange={onChange} />
      </Group>

      <Group title="Customer Ratings">
        {RATING_STEPS.map((r) => (
          <Radio
            key={r}
            name="rating"
            label={
              <span className="inline-flex items-center gap-1">
                {r}
                <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" strokeWidth={0} /> &amp; above
              </span>
            }
            count={countFor('rating', (p) => (p.rating || 0) >= r)}
            checked={filters.rating === r}
            onChange={() => onChange({ rating: filters.rating === r ? null : r })}
          />
        ))}
      </Group>

      <Group title="Discount">
        {DISCOUNT_STEPS.map((d) => {
          const n = countFor('discount', (p) => discountOf(p) >= d);
          if (!n && filters.discount !== d) return null;
          return (
            <Radio
              key={d}
              name="discount"
              label={`${d}% or more`}
              count={n}
              checked={filters.discount === d}
              onChange={() => onChange({ discount: filters.discount === d ? null : d })}
            />
          );
        })}
      </Group>

      <Group title="Availability">
        <Check
          label="In Stock (Ready to Ship)"
          count={countFor('stock', (p) => isInStock(p))}
          checked={filters.stock.includes('in-stock')}
          onChange={() => toggleIn('stock', 'in-stock')}
        />
        <Check
          label="Made to Order"
          count={countFor('stock', (p) => !isInStock(p))}
          checked={filters.stock.includes('made-to-order')}
          onChange={() => toggleIn('stock', 'made-to-order')}
        />
      </Group>
    </div>
  );
};

const Group = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <section className="py-4 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-[14px] font-semibold text-fg mb-1"
      >
        {title}
        <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-2 space-y-0.5">{children}</div>}
    </section>
  );
};

const optionRow = 'flex items-center gap-2.5 py-1.5 text-[14px] cursor-pointer select-none';

const Check = ({ label, count, checked, onChange }) => (
  <label className={`${optionRow} ${!count && !checked ? 'opacity-45' : ''}`}>
    <input type="checkbox" checked={checked} onChange={onChange} disabled={!count && !checked} className="w-4 h-4 rounded accent-[rgb(var(--c-accent))] cursor-pointer" />
    <span className={`flex-1 ${checked ? 'text-fg font-medium' : 'text-fg/85'}`}>{label}</span>
    <span className="text-[12px] text-subtle tabular-nums">{count}</span>
  </label>
);

const Radio = ({ name, label, count, checked, onChange }) => (
  <label className={`${optionRow} ${!count && !checked ? 'opacity-45' : ''}`}>
    {/* A radio that can also be unticked: clicking the chosen option clears the filter */}
    <input
      type="radio"
      name={name}
      checked={checked}
      onClick={onChange}
      onChange={() => {}}
      disabled={!count && !checked}
      className="w-4 h-4 rounded-full accent-[rgb(var(--c-accent))] cursor-pointer"
    />
    <span className={`flex-1 ${checked ? 'text-fg font-medium' : 'text-fg/85'}`}>{label}</span>
    <span className="text-[12px] text-subtle tabular-nums">{count}</span>
  </label>
);

/** Own min / max, applied with Go (Amazon style) */
const PriceInputs = ({ filters, onChange }) => {
  const [min, setMin] = useState(filters.min ?? '');
  const [max, setMax] = useState(filters.max ?? '');
  useEffect(() => {
    setMin(filters.min ?? '');
    setMax(filters.max ?? '');
  }, [filters.min, filters.max]);
  const apply = (e) => {
    e.preventDefault();
    const lo = min === '' ? null : Math.max(0, Number(min));
    const hi = max === '' ? null : Math.max(0, Number(max));
    onChange({ min: lo, max: hi != null && lo != null && hi < lo ? lo : hi });
  };
  const field = 'w-full min-w-0 rounded-lg bg-canvas dark:bg-sunken border border-line px-2.5 py-1.5 text-[13px] text-fg focus:outline-none focus:border-accent';
  return (
    <form onSubmit={apply} className="pt-2 flex items-center gap-2" aria-label="Custom price range">
      <input className={field} inputMode="numeric" placeholder="Min ₹" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))} aria-label="Minimum price in rupees" />
      <span className="text-subtle text-[12px]">to</span>
      <input className={field} inputMode="numeric" placeholder="Max ₹" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))} aria-label="Maximum price in rupees" />
      <button type="submit" className="btn-secondary btn-sm !px-3 shrink-0">Go</button>
    </form>
  );
};

/** Short label for an applied filter chip */
export const chipLabel = { price: (f) => (f.max == null ? `Over ${formatINR(f.min)}` : f.min ? `${formatINR(f.min)} – ${formatINR(f.max)}` : `Under ${formatINR(f.max)}`) };

export default ShopFilters;
