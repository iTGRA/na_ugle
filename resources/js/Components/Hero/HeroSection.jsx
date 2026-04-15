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
            className="bg-paper p-5 md:p-[72px]"
        >
            <div
                className="relative w-full overflow-hidden bg-ink"
                style={{
                    height: 'calc(80vh - 144px)',
                    minHeight: '440px',
                }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setPaused(false)}
            >
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

            {/* Compound gradient: bottom-left strongest for content legibility */}
            <div
                className="absolute inset-0 z-[2] pointer-events-none"
                style={{
                    background:
                        'linear-gradient(to top, rgba(10,10,8,0.85) 0%, rgba(10,10,8,0.35) 55%, rgba(10,10,8,0.25) 100%),' +
                        'linear-gradient(to right, rgba(10,10,8,0.5) 0%, rgba(10,10,8,0.1) 55%, transparent 100%)',
                }}
            />

            {/* Tap zones (mobile stories pattern) */}
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

            {/* Content overlay — bottom-left */}
            <div className="absolute inset-0 z-[15] flex flex-col justify-end pb-28 md:pb-32 px-6 pointer-events-none">
                <div className="shell w-full">
                    {active?.title && (
                        <div className="t-label text-white/80 mb-4">
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
                    <div className="mt-8 flex flex-wrap items-stretch gap-3 pointer-events-auto">
                        <a
                            href={active?.cta_url || '#menu'}
                            className="cta-filled"
                        >
                            {active?.cta_text || 'Смотреть меню'}
                        </a>
                        <a href="#reservation" className="cta-outline">
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

            {/* Compact slider controls — bottom-right */}
            {hasMulti && (
                <div className="absolute bottom-8 right-6 md:bottom-10 md:right-10 z-20 flex items-center gap-4">
                    <button
                        onClick={prev}
                        aria-label="Предыдущий слайд"
                        className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors text-xl leading-none"
                    >‹</button>
                    <div className="flex gap-1.5">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                aria-label={`Слайд ${i + 1}`}
                                className="h-[2px] overflow-hidden"
                                style={{ width: i === current ? '40px' : '24px', background: 'rgba(255,255,255,0.3)', transition: 'width 0.3s ease' }}
                            >
                                <div
                                    className="h-full bg-white"
                                    style={{
                                        width: i < current ? '100%' : i === current ? `${progress * 100}%` : '0%',
                                        transition: i === current ? 'none' : 'width 0.25s ease',
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={next}
                        aria-label="Следующий слайд"
                        className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors text-xl leading-none"
                    >›</button>
                </div>
            )}
            </div>
        </section>
    );
}
