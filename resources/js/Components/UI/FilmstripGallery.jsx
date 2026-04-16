/**
 * FilmstripGallery — реалистичная 35mm киноплёнка в стиле Kodak BW400CN.
 *
 * Визуал: оранжевая основа, белые перфорации, маркировка кадров, штрихкод, зерно.
 * UX: drag-scroll, snap-to-frame, auto-scroll (опц.), lightbox по клику, hover brightness.
 *
 * Props:
 *   images[]        — { src, alt, frameNumber? }
 *   filmLabel       — маркировка плёнки (default "НА УГЛЕ 400")
 *   filmColor       — цвет основы (default #C8400A — Kodak orange)
 *   autoScroll      — медленная авто-прокрутка (default false)
 *   orientation     — 'landscape' | 'portrait' (default 'landscape')
 */
import { useRef, useState, useEffect, useCallback } from 'react';

const PERFORATION_DESKTOP = { w: 18, h: 24, r: 4, gap: 28 };
const PERFORATION_MOBILE = { w: 12, h: 16, r: 3, gap: 22 };

function Perforations({ count = 60, perf }) {
    return (
        <div className="flex items-center overflow-hidden w-full" style={{ gap: `${perf.gap}px` }}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex-shrink-0"
                    style={{
                        width: `${perf.w}px`,
                        height: `${perf.h}px`,
                        borderRadius: `${perf.r}px`,
                        background: '#ffffff',
                    }}
                />
            ))}
        </div>
    );
}

function Barcode({ width = 200 }) {
    return (
        <div
            style={{
                width: `${width}px`,
                height: '14px',
                background: `repeating-linear-gradient(
                    90deg,
                    #1A0A00 0px, #1A0A00 2px,
                    transparent 2px, transparent 4px,
                    #1A0A00 4px, #1A0A00 5px,
                    transparent 5px, transparent 8px,
                    #1A0A00 8px, #1A0A00 11px,
                    transparent 11px, transparent 13px,
                    #1A0A00 13px, #1A0A00 14px,
                    transparent 14px, transparent 17px,
                    #1A0A00 17px, #1A0A00 20px,
                    transparent 20px, transparent 22px
                )`,
                opacity: 0.8,
            }}
        />
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
    const [lightbox, setLightbox] = useState(null); // index or null
    const [isDragging, setIsDragging] = useState(false);

    // Auto-scroll
    useEffect(() => {
        if (!autoScroll || typeof window === 'undefined') return;
        const el = trackRef.current;
        if (!el) return;
        let animId;
        let paused = false;
        const speed = 0.6; // px per frame

        const tick = () => {
            if (!paused && el.scrollLeft < el.scrollWidth - el.clientWidth) {
                el.scrollLeft += speed;
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
        const startX = e.pageX;
        const scrollLeft = el.scrollLeft;
        const move = (ev) => {
            const dx = ev.pageX - startX;
            el.scrollLeft = scrollLeft - dx;
        };
        const up = () => {
            setIsDragging(false);
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
    }, []);

    // Lightbox nav
    const openLightbox = (i) => { if (!isDragging) setLightbox(i); };
    const closeLightbox = () => setLightbox(null);
    const prevLightbox = () => setLightbox((i) => (i > 0 ? i - 1 : images.length - 1));
    const nextLightbox = () => setLightbox((i) => (i < images.length - 1 ? i + 1 : 0));

    // Keyboard nav for lightbox
    useEffect(() => {
        if (lightbox === null || typeof window === 'undefined') return;
        const handler = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevLightbox();
            if (e.key === 'ArrowRight') nextLightbox();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightbox]);

    const frameH = orientation === 'portrait' ? 'clamp(320px, 50vw, 500px)' : 'clamp(260px, 40vw, 420px)';
    const frameAspect = orientation === 'portrait' ? '2/3' : '3/2';
    const textColor = '#1A0A00';

    return (
        <>
            {/* Film strip */}
            <div className="relative w-full overflow-hidden" style={{ background: filmColor }}>

                {/* Grain overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5]" style={{ opacity: 0.12, mixBlendMode: 'multiply' }}>
                    <filter id="grain">
                        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#grain)" />
                </svg>

                {/* Top strip: text + perforations */}
                <div className="relative z-[2] px-4 md:px-8 pt-3 pb-1">
                    <div className="flex items-center justify-between mb-2" style={{ color: textColor }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>
                            ◄ {images[0]?.frameNumber || '23'} &nbsp;&nbsp; {filmLabel}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', opacity: 0.5 }}>
                            DX 6 15
                        </span>
                    </div>
                    <div className="hidden md:block"><Perforations count={80} perf={PERFORATION_DESKTOP} /></div>
                    <div className="md:hidden"><Perforations count={50} perf={PERFORATION_MOBILE} /></div>
                </div>

                {/* Frames track */}
                <div
                    ref={trackRef}
                    className="flex gap-3 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-8 py-2"
                    style={{ cursor: isDragging ? 'grabbing' : 'grab', WebkitOverflowScrolling: 'touch' }}
                    onMouseDown={onMouseDown}
                >
                    {images.map((img, i) => (
                        <figure
                            key={i}
                            className="flex-shrink-0 snap-center relative group"
                            style={{ height: frameH, aspectRatio: frameAspect }}
                            onClick={() => openLightbox(i)}
                        >
                            <img
                                src={img.src}
                                alt={img.alt || ''}
                                loading={i < 4 ? 'eager' : 'lazy'}
                                className="w-full h-full block transition-[filter] duration-300 group-hover:brightness-[1.15]"
                                style={{ objectFit: 'cover', border: '2px solid rgba(0,0,0,0.3)', cursor: 'pointer' }}
                                draggable="false"
                            />
                            {/* Frame number overlay on hover */}
                            <div
                                className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)', letterSpacing: '0.08em' }}
                            >
                                {img.frameNumber || String(i + 1).padStart(2, '0')}
                            </div>
                            {/* Frame number (always visible, film style) */}
                            <div
                                className="absolute -bottom-5 left-1/2 -translate-x-1/2"
                                style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: textColor, opacity: 0.6, letterSpacing: '0.1em' }}
                            >
                                {img.frameNumber || String(i + 1).padStart(2, '0')}
                            </div>
                        </figure>
                    ))}
                </div>

                {/* Bottom strip: perforations + barcode + text */}
                <div className="relative z-[2] px-4 md:px-8 pt-1 pb-3">
                    <div className="hidden md:block"><Perforations count={80} perf={PERFORATION_DESKTOP} /></div>
                    <div className="md:hidden"><Perforations count={50} perf={PERFORATION_MOBILE} /></div>
                    <div className="flex items-center justify-between mt-2" style={{ color: textColor }}>
                        <div className="flex items-center gap-4">
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', opacity: 0.6 }}>
                                {images[images.length - 1]?.frameNumber || String(images.length).padStart(2, '0')}A ►
                            </span>
                            <Barcode width={120} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.45 }}>
                            {filmLabel} &nbsp; SAFETY FILM
                        </span>
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
                    {/* Close */}
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl z-10"
                        onClick={closeLightbox}
                        aria-label="Закрыть"
                    >×</button>

                    {/* Frame number */}
                    <div
                        className="absolute top-6 left-6 z-10"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: filmColor, letterSpacing: '0.1em' }}
                    >
                        {filmLabel} &nbsp; FRAME {images[lightbox]?.frameNumber || String(lightbox + 1).padStart(2, '0')}
                    </div>

                    {/* Image */}
                    <img
                        src={images[lightbox]?.src}
                        alt={images[lightbox]?.alt || ''}
                        className="max-h-[85vh] max-w-[92vw] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Nav arrows */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10"
                        onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                        aria-label="Предыдущий"
                    >‹</button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10"
                        onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                        aria-label="Следующий"
                    >›</button>

                    {/* Counter */}
                    <div
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em' }}
                    >
                        {String(lightbox + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                    </div>
                </div>
            )}
        </>
    );
}
