import { useEffect, useRef, useState } from 'react';

const AUTO_MS = 6000;

export default function HeroSection({ slides = [], slogan, description, durnyashaQuote }) {
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const [paused, setPaused] = useState(false);
    const rafRef = useRef(null);
    const startRef = useRef(0);
    const carryRef = useRef(0);

    const count = slides.length;
    const hasMulti = count > 1;

    useEffect(() => {
        if (!hasMulti || paused) {
            cancelAnimationFrame(rafRef.current);
            return;
        }
        startRef.current = performance.now() - carryRef.current;
        const tick = (now) => {
            const elapsed = now - startRef.current;
            const p = Math.min(elapsed / AUTO_MS, 1);
            setProgress(p);
            if (p >= 1) {
                carryRef.current = 0;
                setProgress(0);
                setCurrent((c) => (c + 1) % count);
            } else {
                carryRef.current = elapsed;
                rafRef.current = requestAnimationFrame(tick);
            }
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [current, paused, hasMulti, count]);

    const goTo = (i) => {
        carryRef.current = 0;
        setProgress(0);
        setCurrent(((i % count) + count) % count);
    };
    const prev = () => goTo(current - 1);
    const next = () => goTo(current + 1);

    const active = slides[current];

    return (
        <section
            className="relative w-full overflow-hidden bg-ink"
            style={{ height: '100vh', minHeight: '600px' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
        >
            {/* Slides */}
            {slides.map((s, i) => (
                <div
                    key={s.id}
                    className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                    style={{
                        opacity: i === current ? 1 : 0,
                        zIndex: i === current ? 1 : 0,
                        backgroundImage: s.photo ? `url(${s.photo})` : 'linear-gradient(180deg, #2d2d2a, #0A0A08)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    aria-hidden={i !== current}
                />
            ))}
            {count === 0 && (
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #2d2d2a, #0A0A08)' }} />
            )}

            {/* Bottom→top gradient for text contrast */}
            <div
                className="absolute inset-0 z-[2] pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(10,10,8,0.35) 0%, rgba(10,10,8,0.2) 40%, rgba(10,10,8,0.85) 100%)' }}
            />

            {/* Stories progress bars */}
            {hasMulti && (
                <div className="absolute top-0 left-0 right-0 z-20 flex gap-1.5 px-6 pt-20 md:pt-24">
                    {slides.map((_, i) => (
                        <div key={i} className="flex-1 h-[3px] bg-white/25 overflow-hidden rounded-full">
                            <div
                                className="h-full bg-white"
                                style={{
                                    width: i < current ? '100%' : i === current ? `${progress * 100}%` : '0%',
                                    transition: i === current ? 'none' : 'width 0.25s ease',
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Side click-areas (tap to navigate) */}
            {hasMulti && (
                <>
                    <button
                        aria-label="Предыдущий слайд"
                        onClick={prev}
                        className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-default focus:outline-none"
                    />
                    <button
                        aria-label="Следующий слайд"
                        onClick={next}
                        className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-default focus:outline-none"
                    />
                </>
            )}

            {/* Visible arrows (desktop) */}
            {hasMulti && (
                <>
                    <button
                        aria-label="Предыдущий"
                        onClick={prev}
                        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center text-white/80 hover:text-white text-3xl leading-none transition-opacity"
                    >‹</button>
                    <button
                        aria-label="Следующий"
                        onClick={next}
                        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center text-white/80 hover:text-white text-3xl leading-none transition-opacity"
                    >›</button>
                </>
            )}

            {/* Content overlay */}
            <div className="absolute inset-0 z-[15] flex flex-col justify-end pb-16 md:pb-20 px-6 pointer-events-none">
                <div className="shell w-full">
                    {active?.title && (
                        <div className="t-label text-white/70 mb-4">
                            {String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} · {active.title}
                        </div>
                    )}
                    {slogan && (
                        <h1 className="t-h1 text-white max-w-5xl" style={{ whiteSpace: 'pre-line' }}>
                            {slogan}
                        </h1>
                    )}
                    {(description || active?.subtitle) && (
                        <p className="t-body-large text-white/85 max-w-2xl mt-6">
                            {active?.subtitle || description}
                        </p>
                    )}
                    <div className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-3 pointer-events-auto">
                        <a
                            href={active?.cta_url || '#menu'}
                            className="cta text-white"
                            style={{ borderBottomColor: '#fff' }}
                        >
                            {active?.cta_text || 'Смотреть меню'}
                        </a>
                        <a href="#reservation" className="cta-plain text-white/80" style={{ borderBottomColor: 'rgba(255,255,255,0.6)' }}>
                            Забронировать
                        </a>
                    </div>
                    {durnyashaQuote && (
                        <p className="t-small text-white/55 mt-8 max-w-md" style={{ fontStyle: 'italic' }}>
                            {durnyashaQuote}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
