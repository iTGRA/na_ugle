/**
 * v0.2 AtmosphereGallery — фото-карусель на атмосферном фоне.
 *
 * Фоновое фото (закат, Волга) + горизонтальная лента фотографий поверх.
 * Drag + wheel + momentum на десктопе, свайп на мобиле.
 * Ч/б → цвет при hover.
 *
 * Props:
 *   images[]      — { src, alt }
 *   bgImage       — URL фонового изображения (управляется из админки)
 *   autoScroll    — медленная авто-прокрутка (default true)
 */
import { useRef, useState, useEffect, useCallback } from 'react';

export default function FilmstripGallery({
    images = [],
    autoScroll = true,
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
            if (!paused && el.scrollLeft < el.scrollWidth - el.clientWidth) el.scrollLeft += 0.4;
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

    return (
        <>
            <div className="relative w-full overflow-hidden">
                <div
                    ref={trackRef}
                    className="relative z-[2] flex gap-5 md:gap-6 overflow-x-auto no-scrollbar px-6 md:px-12"
                    style={{ cursor: 'grab', WebkitOverflowScrolling: 'touch' }}
                    onMouseDown={onMouseDown}
                >
                    {images.map((img, i) => (
                        <figure
                            key={i}
                            className="flex-shrink-0 group relative overflow-hidden"
                            style={{
                                height: 'clamp(280px, 44vw, 460px)',
                                aspectRatio: '3/2',
                                borderRadius: '4px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            }}
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
                                onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0%) contrast(1) brightness(1.05)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(100%) contrast(1.05)'; }}
                                draggable="false"
                            />
                            {/* Frame counter on hover */}
                            <div
                                className="absolute bottom-3 left-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.9)', letterSpacing: '0.08em' }}
                            >
                                {String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                            </div>
                        </figure>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#0A0A0A' }} onClick={closeLightbox}>
                    <button className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl z-10" onClick={closeLightbox}>×</button>
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
