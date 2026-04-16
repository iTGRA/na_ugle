/**
 * FilmstripGallery — реалистичная 35mm киноплёнка.
 *
 * Перфорация скроллится синхронно с фото (единый контейнер).
 * Цвет: тёмно-угольный. Drag + wheel + momentum на десктопе, свайп на мобиле.
 */
import { useRef, useState, useEffect, useCallback } from 'react';

const FILM_COLOR = '#1a1a18';
const PERF_COLOR = 'var(--paper)';
const TEXT_COLOR = 'rgba(245,240,232,0.45)';

function Perf({ mobile }) {
    const w = mobile ? 10 : 15;
    const h = mobile ? 14 : 20;
    const r = mobile ? 2.5 : 3.5;
    return (
        <div className="flex-shrink-0" style={{ width: `${w}px`, height: `${h}px`, borderRadius: `${r}px`, background: PERF_COLOR }} />
    );
}

function PerfStrip({ count = 4, mobile = false }) {
    return (
        <div className="flex items-center" style={{ gap: mobile ? '18px' : '24px' }}>
            {Array.from({ length: count }).map((_, i) => <Perf key={i} mobile={mobile} />)}
        </div>
    );
}

function FrameBarcode({ label, number }) {
    return (
        <div className="flex items-center justify-between" style={{ height: '14px', padding: '0 2px' }}>
            <div className="flex items-center gap-2">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', color: TEXT_COLOR }}>
                    {number}
                </span>
                <div style={{
                    width: '40px', height: '9px', opacity: 0.5,
                    background: `repeating-linear-gradient(90deg, ${TEXT_COLOR} 0px, ${TEXT_COLOR} 1.5px, transparent 1.5px, transparent 3px, ${TEXT_COLOR} 3px, ${TEXT_COLOR} 4px, transparent 4px, transparent 6px, ${TEXT_COLOR} 6px, ${TEXT_COLOR} 8px, transparent 8px, transparent 10px)`,
                }} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT_COLOR }}>
                {label}
            </span>
        </div>
    );
}

export default function FilmstripGallery({
    images = [],
    filmLabel = 'НА УГЛЕ 400',
    filmColor = FILM_COLOR,
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
        let animId, paused = false;
        const tick = () => {
            if (!paused && el.scrollLeft < el.scrollWidth - el.clientWidth) el.scrollLeft += 0.5;
            animId = requestAnimationFrame(tick);
        };
        animId = requestAnimationFrame(tick);
        const pause = () => { paused = true; };
        const resume = () => { paused = false; };
        el.addEventListener('mouseenter', pause);
        el.addEventListener('mouseleave', resume);
        el.addEventListener('touchstart', pause, { passive: true });
        el.addEventListener('touchend', resume);
        return () => { cancelAnimationFrame(animId); el.removeEventListener('mouseenter', pause); el.removeEventListener('mouseleave', resume); el.removeEventListener('touchstart', pause); el.removeEventListener('touchend', resume); };
    }, [autoScroll, images]);

    // Drag with threshold + momentum
    const onMouseDown = useCallback((e) => {
        const el = trackRef.current;
        if (!el) return;
        const startX = e.pageX, startScroll = el.scrollLeft;
        let moved = false, lastX = startX, lastTime = Date.now(), velocity = 0;
        const move = (ev) => {
            const dx = ev.pageX - startX;
            if (!moved && Math.abs(dx) < 5) return;
            moved = true; setIsDragging(true); el.style.cursor = 'grabbing';
            const now = Date.now(), dt = now - lastTime;
            if (dt > 0) velocity = (ev.pageX - lastX) / dt;
            lastX = ev.pageX; lastTime = now;
            el.scrollLeft = startScroll - dx;
        };
        const up = () => {
            el.style.cursor = 'grab';
            window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up);
            if (moved && Math.abs(velocity) > 0.15) {
                let v = velocity * 12;
                const coast = () => { if (Math.abs(v) < 0.5) { setIsDragging(false); return; } el.scrollLeft -= v; v *= 0.95; requestAnimationFrame(coast); };
                requestAnimationFrame(coast);
            } else { setTimeout(() => setIsDragging(false), 10); }
        };
        window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    }, []);

    // Wheel → horizontal
    useEffect(() => {
        const el = trackRef.current;
        if (!el || typeof window === 'undefined') return;
        const onWheel = (e) => { if (Math.abs(e.deltaY) < 5) return; e.preventDefault(); el.scrollLeft += e.deltaY * 1.5; };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [images]);

    // Lightbox
    const openLightbox = (i) => { if (!isDragging) setLightbox(i); };
    const closeLightbox = () => setLightbox(null);
    const prevLb = () => setLightbox((i) => (i > 0 ? i - 1 : images.length - 1));
    const nextLb = () => setLightbox((i) => (i < images.length - 1 ? i + 1 : 0));
    useEffect(() => {
        if (lightbox === null || typeof window === 'undefined') return;
        const h = (e) => { if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowLeft') prevLb(); if (e.key === 'ArrowRight') nextLb(); };
        window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
    }, [lightbox]);

    const frameH = orientation === 'portrait' ? 'clamp(345px, 55vw, 550px)' : 'clamp(276px, 44vw, 460px)';
    const frameAspect = orientation === 'portrait' ? '2/3' : '3/2';
    const perfPerFrame = 6;
    const isMobileSSR = false; // SSR renders desktop, mobile handled by CSS

    return (
        <>
            <div className="relative w-full overflow-hidden" style={{ background: filmColor }}>
                {/* Grain */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2]" style={{ opacity: 0.06, mixBlendMode: 'overlay' }}>
                    <filter id="filmgrain"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="4" stitchTiles="stitch" /></filter>
                    <rect width="100%" height="100%" filter="url(#filmgrain)" />
                </svg>

                {/* Single scrollable strip: perfs + frames + perfs — all move together */}
                <div
                    ref={trackRef}
                    className="relative z-[3] overflow-x-auto no-scrollbar"
                    style={{ cursor: 'grab', WebkitOverflowScrolling: 'touch' }}
                    onMouseDown={onMouseDown}
                >
                    {/* Top perforations row */}
                    <div className="flex items-center px-4 md:px-6 pt-2 pb-1" style={{ gap: '0px' }}>
                        {images.map((_, i) => (
                            <div key={`tp${i}`} className="flex-shrink-0" style={{ width: frameH === frameH ? undefined : undefined }}>
                                <div className="flex items-center" style={{ gap: '0px' }}>
                                    <div className="hidden md:flex items-center" style={{ gap: '24px', marginRight: i === 0 ? '0' : '16px', marginLeft: i === 0 ? '0' : '0' }}>
                                        {Array.from({ length: perfPerFrame }).map((_, j) => <Perf key={j} />)}
                                    </div>
                                    <div className="md:hidden flex items-center" style={{ gap: '18px', marginRight: i === 0 ? '0' : '12px' }}>
                                        {Array.from({ length: 4 }).map((_, j) => <Perf key={j} mobile />)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Extra perfs for overscroll */}
                        <div className="hidden md:flex items-center flex-shrink-0" style={{ gap: '24px', marginLeft: '16px' }}>
                            {Array.from({ length: perfPerFrame }).map((_, j) => <Perf key={`e${j}`} />)}
                        </div>
                    </div>

                    {/* Frames row */}
                    <div className="flex gap-3 md:gap-4 px-4 md:px-6 py-1">
                        {images.map((img, i) => {
                            const fn = img.frameNumber || String(i + 1).padStart(2, '0');
                            return (
                                <div key={i} className="flex-shrink-0">
                                    <figure
                                        className="relative group overflow-hidden"
                                        style={{ height: frameH, aspectRatio: frameAspect }}
                                        onClick={() => openLightbox(i)}
                                    >
                                        <img
                                            src={img.src} alt={img.alt || ''} loading={i < 4 ? 'eager' : 'lazy'}
                                            className="w-full h-full block"
                                            style={{ objectFit: 'cover', cursor: 'pointer', filter: 'grayscale(100%) contrast(1.05)', transition: 'filter 0.5s ease' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0%) contrast(1) brightness(1.1)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(100%) contrast(1.05)'; }}
                                            draggable="false"
                                        />
                                        <div className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.9)', letterSpacing: '0.08em' }}>
                                            FRAME {fn}
                                        </div>
                                    </figure>
                                    <FrameBarcode label={filmLabel} number={fn} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom perforations row */}
                    <div className="flex items-center px-4 md:px-6 pt-1 pb-2" style={{ gap: '0px' }}>
                        {images.map((_, i) => (
                            <div key={`bp${i}`} className="flex-shrink-0">
                                <div className="hidden md:flex items-center" style={{ gap: '24px', marginRight: '16px' }}>
                                    {Array.from({ length: perfPerFrame }).map((_, j) => <Perf key={j} />)}
                                </div>
                                <div className="md:hidden flex items-center" style={{ gap: '18px', marginRight: '12px' }}>
                                    {Array.from({ length: 4 }).map((_, j) => <Perf key={j} mobile />)}
                                </div>
                            </div>
                        ))}
                        <div className="hidden md:flex items-center flex-shrink-0" style={{ gap: '24px', marginLeft: '0' }}>
                            {Array.from({ length: perfPerFrame }).map((_, j) => <Perf key={`e${j}`} />)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#0A0A0A' }} onClick={closeLightbox}>
                    <button className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl z-10" onClick={closeLightbox}>×</button>
                    <div className="absolute top-6 left-6 z-10" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: filmColor === FILM_COLOR ? '#888' : filmColor, letterSpacing: '0.1em' }}>
                        {filmLabel} · FRAME {images[lightbox]?.frameNumber || String(lightbox + 1).padStart(2, '0')}
                    </div>
                    <img src={images[lightbox]?.src} alt={images[lightbox]?.alt || ''} className="max-h-[85vh] max-w-[92vw] object-contain" onClick={(e) => e.stopPropagation()} />
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10" onClick={(e) => { e.stopPropagation(); prevLb(); }}>‹</button>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10" onClick={(e) => { e.stopPropagation(); nextLb(); }}>›</button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em' }}>
                        {String(lightbox + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                    </div>
                </div>
            )}
        </>
    );
}
