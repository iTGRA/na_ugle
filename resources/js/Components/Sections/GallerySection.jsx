/**
 * v0.2 Filmstrip Gallery — горизонтальная кино-лента фотографий.
 *
 * Десктоп: drag-scroll + стрелки, фото натуральной пропорции, одна высота ~420px.
 * Мобайл: snap-свайп слайдер, фото fullwidth, стрелки поверх.
 * Перфорация (sprocket holes) сверху и снизу ленты для 35mm-эффекта.
 *
 * Props: photos[], instagramUrl?, headline?, label?
 */
import { useRef, useState, useEffect } from 'react';

export default function GallerySection({ photos = [], instagramUrl, headline, label }) {
    if (photos.length === 0) return null;

    const trackRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(true);
    const [current, setCurrent] = useState(0);
    const count = photos.length;

    // Update arrow states on scroll
    const updateArrows = () => {
        const el = trackRef.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 10);
        setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
        // Estimate current slide for counter
        if (el.children.length) {
            const childW = el.children[0].offsetWidth + 16; // gap approx
            setCurrent(Math.round(el.scrollLeft / childW));
        }
    };

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        updateArrows();
        el.addEventListener('scroll', updateArrows, { passive: true });
        return () => el.removeEventListener('scroll', updateArrows);
    }, [photos]);

    const scroll = (dir) => {
        const el = trackRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.75;
        el.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };

    return (
        <section id="gallery" className="section bg-paper overflow-hidden">
            {/* Heading */}
            <div className="shell mb-10 md:mb-14">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <div className="t-label text-muted mb-3">{label || 'Атмосфера'}</div>
                        <h2 className="t-h2" style={{ whiteSpace: 'pre-line' }}>
                            {headline || 'Наслаждаемся закатами\nв нашей атмосфере'}
                        </h2>
                    </div>
                    {/* Desktop arrows + counter */}
                    <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                        <span className="t-label text-muted">
                            {String(Math.min(current + 1, count)).padStart(2, '0')} / {String(count).padStart(2, '0')}
                        </span>
                        <button
                            onClick={() => scroll(-1)}
                            disabled={!canPrev}
                            className="btn btn-sm disabled:opacity-30"
                            aria-label="Назад"
                        >←</button>
                        <button
                            onClick={() => scroll(1)}
                            disabled={!canNext}
                            className="btn btn-sm disabled:opacity-30"
                            aria-label="Вперёд"
                        >→</button>
                    </div>
                </div>
            </div>

            {/* Filmstrip */}
            <div className="relative mt-10 md:mt-14">
                {/* Sprocket holes — top (punch-through to paper bg) */}
                <div className="absolute top-0 left-0 right-0 h-6 z-10 flex items-center pointer-events-none overflow-hidden" style={{ background: 'var(--ink)' }}>
                    <div className="flex gap-5 px-4 w-full justify-around">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={`t${i}`}
                                className="flex-shrink-0"
                                style={{
                                    width: '14px',
                                    height: '10px',
                                    borderRadius: '2.5px',
                                    background: 'var(--paper)',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Sprocket holes — bottom (punch-through to paper bg) */}
                <div className="absolute bottom-0 left-0 right-0 h-6 z-10 flex items-center pointer-events-none overflow-hidden" style={{ background: 'var(--ink)' }}>
                    <div className="flex gap-5 px-4 w-full justify-around">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={`b${i}`}
                                className="flex-shrink-0"
                                style={{
                                    width: '14px',
                                    height: '10px',
                                    borderRadius: '2.5px',
                                    background: 'var(--paper)',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Film strip body */}
                <div
                    style={{ background: 'var(--ink)', paddingTop: '24px', paddingBottom: '24px' }}
                >
                    <div
                        ref={trackRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 md:px-12"
                        style={{ cursor: 'grab', WebkitOverflowScrolling: 'touch' }}
                        onMouseDown={(e) => {
                            const el = trackRef.current;
                            if (!el) return;
                            el.style.cursor = 'grabbing';
                            const startX = e.pageX - el.offsetLeft;
                            const scrollLeft = el.scrollLeft;
                            const move = (ev) => { el.scrollLeft = scrollLeft - (ev.pageX - el.offsetLeft - startX); };
                            const up = () => { el.style.cursor = 'grab'; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
                            window.addEventListener('mousemove', move);
                            window.addEventListener('mouseup', up);
                        }}
                    >
                        {photos.map((p, i) => (
                            <figure
                                key={p.id}
                                className="flex-shrink-0 snap-center relative overflow-hidden"
                                style={{
                                    height: 'clamp(280px, 45vw, 440px)',
                                    width: 'auto',
                                }}
                            >
                                <img
                                    src={p.photo}
                                    alt={p.alt || ''}
                                    loading={i < 3 ? 'eager' : 'lazy'}
                                    className="h-full w-auto block"
                                    style={{ objectFit: 'cover' }}
                                />
                                {/* Frame number (film aesthetic) */}
                                <div
                                    className="absolute bottom-2 right-3 t-label"
                                    style={{ color: 'rgba(245,240,232,0.4)', fontSize: '10px' }}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                            </figure>
                        ))}
                    </div>
                </div>

                {/* Mobile arrows overlay */}
                <div className="md:hidden absolute inset-0 flex items-center justify-between px-2 pointer-events-none z-20">
                    <button
                        onClick={() => scroll(-1)}
                        disabled={!canPrev}
                        className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full disabled:opacity-0 transition-opacity"
                        style={{ background: 'rgba(245,240,232,0.85)', color: 'var(--ink)' }}
                        aria-label="Назад"
                    >‹</button>
                    <button
                        onClick={() => scroll(1)}
                        disabled={!canNext}
                        className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full disabled:opacity-0 transition-opacity"
                        style={{ background: 'rgba(245,240,232,0.85)', color: 'var(--ink)' }}
                        aria-label="Вперёд"
                    >›</button>
                </div>
            </div>

            {/* Footer: counter (mobile) + Instagram link */}
            <div className="shell mt-8 flex items-center justify-between">
                <span className="t-label text-muted md:hidden">
                    {String(Math.min(current + 1, count)).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </span>
                {instagramUrl ? (
                    <a href={instagramUrl} target="_blank" rel="noopener" className="cta-plain t-label">
                        Больше — в Instagram
                    </a>
                ) : <span />}
            </div>
        </section>
    );
}
