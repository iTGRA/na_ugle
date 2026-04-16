/**
 * FilmstripGallery — реалистичная 35mm киноплёнка Kodak BW400CN.
 *
 * Визуал: нержавеющая сталь как подложка, оранжевая плёнка полупрозрачная (overlay),
 * перфорации показывают фон (paper), маркировка под каждым кадром.
 *
 * Props:
 *   images[]        — { src, alt, frameNumber? }
 *   filmLabel       — маркировка (default "НА УГЛЕ 400")
 *   filmColor       — цвет плёнки (default #C8400A)
 *   autoScroll      — медленная авто-прокрутка (default false)
 *   orientation     — 'landscape' | 'portrait' (default 'landscape')
 */
import { useRef, useState, useEffect, useCallback } from 'react';

function Perforations({ count = 60, mobile = false }) {
    const w = mobile ? 10 : 15;
    const h = mobile ? 14 : 20;
    const r = mobile ? 2.5 : 3.5;
    const gap = mobile ? 18 : 24;

    return (
        <div className="flex items-center overflow-hidden w-full" style={{ gap: `${gap}px` }}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex-shrink-0"
                    style={{
                        width: `${w}px`,
                        height: `${h}px`,
                        borderRadius: `${r}px`,
                        background: 'var(--paper)',
                    }}
                />
            ))}
        </div>
    );
}

function FrameBarcode({ label, number }) {
    return (
        <div className="flex items-center justify-between px-1 mt-1.5" style={{ height: '16px' }}>
            <div className="flex items-center gap-2">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', opacity: 0.7, color: '#1A0A00' }}>
                    {number}
                </span>
                <div
                    style={{
                        width: '50px',
                        height: '10px',
                        background: `repeating-linear-gradient(90deg,
                            #1A0A00 0px, #1A0A00 1.5px, transparent 1.5px, transparent 3px,
                            #1A0A00 3px, #1A0A00 4px, transparent 4px, transparent 6px,
                            #1A0A00 6px, #1A0A00 8px, transparent 8px, transparent 9.5px,
                            #1A0A00 9.5px, #1A0A00 10.5px, transparent 10.5px, transparent 13px
                        )`,
                        opacity: 0.6,
                    }}
                />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, color: '#1A0A00' }}>
                {label}
            </span>
        </div>
    );
}

export default function FilmstripGallery({
    images = [],
    filmLabel = 'НА УГЛЕ 400',
    filmColor = '#C8400A',
    autoScroll = false,
    orientation = 'landscape',
}) {
    const trackRef = useRef(null);
    const [lightbox, setLightbox] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef(0);

    // Auto-scroll
    useEffect(() => {
        if (!autoScroll || typeof window === 'undefined') return;
        const el = trackRef.current;
        if (!el) return;
        let animId;
        let paused = false;
        const tick = () => {
            if (!paused && el.scrollLeft < el.scrollWidth - el.clientWidth) {
                el.scrollLeft += 0.5;
            }
            animId = requestAnimationFrame(tick);
        };
        animId = requestAnimationFrame(tick);
        const pause = () => { paused = true; };
        const resume = () => { paused = false; };
        el.addEventListener('mouseenter', pause);
        el.addEventListener('mouseleave', resume);
        el.addEventListener('touchstart', pause, { passive: true });
        el.addEventListener('touchend', resume);
        return () => {
            cancelAnimationFrame(animId);
            el.removeEventListener('mouseenter', pause);
            el.removeEventListener('mouseleave', resume);
            el.removeEventListener('touchstart', pause);
            el.removeEventListener('touchend', resume);
        };
    }, [autoScroll, images]);

    // Drag scroll
    const onMouseDown = useCallback((e) => {
        const el = trackRef.current;
        if (!el) return;
        setIsDragging(true);
        dragStartX.current = e.pageX;
        const scrollLeft = el.scrollLeft;
        const move = (ev) => { el.scrollLeft = scrollLeft - (ev.pageX - dragStartX.current); };
        const up = () => {
            setIsDragging(false);
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
    }, []);

    // Lightbox
    const openLightbox = (i) => { if (!isDragging) setLightbox(i); };
    const closeLightbox = () => setLightbox(null);
    const prevLb = () => setLightbox((i) => (i > 0 ? i - 1 : images.length - 1));
    const nextLb = () => setLightbox((i) => (i < images.length - 1 ? i + 1 : 0));

    useEffect(() => {
        if (lightbox === null || typeof window === 'undefined') return;
        const h = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevLb();
            if (e.key === 'ArrowRight') nextLb();
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [lightbox]);

    const frameH = orientation === 'portrait' ? 'clamp(300px, 48vw, 480px)' : 'clamp(240px, 38vw, 400px)';
    const frameAspect = orientation === 'portrait' ? '2/3' : '3/2';

    return (
        <>
            {/* Steel texture background + film overlay */}
            <div
                className="relative w-full overflow-hidden"
                style={{ background: filmColor }}
            >

                {/* Grain texture */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2]" style={{ opacity: 0.08, mixBlendMode: 'overlay' }}>
                    <filter id="filmgrain">
                        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="4" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#filmgrain)" />
                </svg>

                {/* Film content (above overlays) */}
                <div className="relative z-[3]">

                    {/* Top perforations strip */}
                    <div className="px-4 md:px-8 pt-2 pb-1">
                        <div className="hidden md:block"><Perforations count={80} /></div>
                        <div className="md:hidden"><Perforations count={50} mobile /></div>
                    </div>

                    {/* Frames track */}
                    <div
                        ref={trackRef}
                        className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-8 py-1"
                        style={{ cursor: isDragging ? 'grabbing' : 'grab', WebkitOverflowScrolling: 'touch' }}
                        onMouseDown={onMouseDown}
                    >
                        {images.map((img, i) => {
                            const fn = img.frameNumber || String(i + 1).padStart(2, '0');
                            return (
                                <div key={i} className="flex-shrink-0 snap-center">
                                    <figure
                                        className="relative group overflow-hidden"
                                        style={{ height: frameH, aspectRatio: frameAspect }}
                                        onClick={() => openLightbox(i)}
                                    >
                                        <img
                                            src={img.src}
                                            alt={img.alt || ''}
                                            loading={i < 4 ? 'eager' : 'lazy'}
                                            className="w-full h-full block"
                                            style={{
                                                objectFit: 'cover',
                                                cursor: 'pointer',
                                                filter: 'grayscale(100%) contrast(1.05)',
                                                transition: 'filter 0.5s ease',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0%) contrast(1) brightness(1.1)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(100%) contrast(1.05)'; }}
                                            draggable="false"
                                        />
                                        {/* Hover frame number */}
                                        <div
                                            className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.9)', letterSpacing: '0.08em' }}
                                        >
                                            FRAME {fn}
                                        </div>
                                    </figure>
                                    {/* Per-frame barcode + label (under each photo) */}
                                    <FrameBarcode label={filmLabel} number={fn} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom perforations strip */}
                    <div className="px-4 md:px-8 pt-1 pb-2">
                        <div className="hidden md:block"><Perforations count={80} /></div>
                        <div className="md:hidden"><Perforations count={50} mobile /></div>
                    </div>

                </div>
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ background: '#0A0A0A' }}
                    onClick={closeLightbox}
                >
                    <button className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl z-10" onClick={closeLightbox} aria-label="Закрыть">×</button>
                    <div className="absolute top-6 left-6 z-10" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: filmColor, letterSpacing: '0.1em' }}>
                        {filmLabel} &nbsp; FRAME {images[lightbox]?.frameNumber || String(lightbox + 1).padStart(2, '0')}
                    </div>
                    <img
                        src={images[lightbox]?.src}
                        alt={images[lightbox]?.alt || ''}
                        className="max-h-[85vh] max-w-[92vw] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10" onClick={(e) => { e.stopPropagation(); prevLb(); }} aria-label="Предыдущий">‹</button>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10" onClick={(e) => { e.stopPropagation(); nextLb(); }} aria-label="Следующий">›</button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em' }}>
                        {String(lightbox + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                    </div>
                </div>
            )}
        </>
    );
}
