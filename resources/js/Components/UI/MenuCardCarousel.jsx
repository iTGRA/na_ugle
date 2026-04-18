/**
 * MenuCardCarousel — мобильная горизонтальная карусель карточек блюд.
 *
 * Показывает одну карточку по центру (~80% ширины) с peek соседних (~10% по бокам).
 * Snap-to-card при свайпе. Счётчик 2/6 под карточками.
 *
 * Props: items[] (same format as Menu.jsx items), formatPrice fn
 */
import { useRef, useState, useEffect } from 'react';

export default function MenuCardCarousel({ items = [], formatPrice }) {
    const trackRef = useRef(null);
    const [current, setCurrent] = useState(0);
    const count = items.length;

    useEffect(() => {
        const el = trackRef.current;
        if (!el || typeof window === 'undefined') return;
        const update = () => {
            const cardW = el.querySelector('[data-card]')?.offsetWidth || 1;
            const gap = 12;
            const idx = Math.round(el.scrollLeft / (cardW + gap));
            setCurrent(Math.min(Math.max(idx, 0), count - 1));
        };
        el.addEventListener('scroll', update, { passive: true });
        return () => el.removeEventListener('scroll', update);
    }, [count]);

    if (count === 0) return null;

    return (
        <div>
            {/* Counter — left-aligned над первой карточкой */}
            {count > 1 && (
                <div className="mb-3" style={{ paddingLeft: '24px' }}>
                    <span className="t-label text-muted">
                        {String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                    </span>
                </div>
            )}
            <div
                ref={trackRef}
                className="flex gap-3 overflow-x-auto no-scrollbar"
                style={{
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    paddingTop: '4px',
                    paddingBottom: '12px',
                }}
            >
                {items.map((i, idx) => (
                    <article
                        key={i.id}
                        data-card
                        className="flex-shrink-0 p-3 pb-6"
                        style={{
                            background: 'var(--paper)',
                            width: '78vw',
                            maxWidth: '340px',
                            scrollSnapAlign: 'center',
                            border: '2.5px solid var(--ink)',
                            borderRadius: '10px',
                            boxShadow: '5px 5px 0 var(--ink)',
                        }}
                    >
                        <div className="aspect-[4/5] bg-ink overflow-hidden mb-4 relative" style={{ borderRadius: '4px' }}>
                            {i.photo ? (
                                <img src={i.photo} alt={i.name} loading={idx < 3 ? 'eager' : 'lazy'} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-paper/40 t-label">НА УГЛЕ</div>
                            )}
                        </div>
                        <div className="px-1">
                            <div className="flex items-baseline justify-between gap-3 mb-1">
                                <h3 className="t-body leading-tight font-bold">{i.name}</h3>
                                <span className="font-bold whitespace-nowrap">{formatPrice(i.price)}</span>
                            </div>
                            {i.description && (
                                <p className="t-small text-muted leading-snug">{i.description}</p>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
