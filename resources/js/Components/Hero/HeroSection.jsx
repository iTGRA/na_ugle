import { useEffect, useState } from 'react';
import CowMascot from '../UI/CowMascot';

export default function HeroSection({ slides = [], slogan, description, durnyashaQuote }) {
    const [current, setCurrent] = useState(0);
    const hasSlides = slides.length > 0;

    useEffect(() => {
        if (!hasSlides || slides.length < 2) return;
        const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 7000);
        return () => clearInterval(id);
    }, [hasSlides, slides.length]);

    const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
    const next = () => setCurrent((c) => (c + 1) % slides.length);

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-charcoal flex items-center">
            {hasSlides &&
                slides.map((s, i) => (
                    <div
                        key={s.id}
                        className="absolute inset-0 transition-opacity duration-700"
                        style={{
                            opacity: i === current ? 1 : 0,
                            backgroundImage: s.photo ? `url(${s.photo})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,26,24,0.5) 0%, rgba(26,26,24,0.85) 100%)' }} />
                    </div>
                ))}

            {!hasSlides && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <CowMascot size={500} />
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
                <div className="max-w-4xl">
                    {slogan && (
                        <h1
                            className="font-hand text-ember leading-none"
                            style={{ fontSize: 'clamp(3rem, 9vw, 7rem)', whiteSpace: 'pre-line', textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                        >
                            {slogan}
                        </h1>
                    )}
                    {description && (
                        <p className="mt-8 text-cream max-w-2xl text-base md:text-lg leading-relaxed">
                            {description}
                        </p>
                    )}
                    <div className="mt-10 flex flex-wrap gap-4">
                        <a href="/menu" className="btn-ember">Смотреть меню</a>
                        <a href="#reservation" className="btn-outline">Забронировать стол</a>
                    </div>
                    {durnyashaQuote && (
                        <p className="mt-12 font-hand text-2xl md:text-3xl text-amber max-w-xl">
                            {durnyashaQuote}
                        </p>
                    )}
                </div>
            </div>

            {hasSlides && slides.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-cream text-4xl opacity-60 hover:opacity-100 transition-opacity"
                        aria-label="Предыдущий слайд"
                    >‹</button>
                    <button
                        onClick={next}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-cream text-4xl opacity-60 hover:opacity-100 transition-opacity"
                        aria-label="Следующий слайд"
                    >›</button>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className="w-2 h-2 rounded-full transition-all"
                                style={{ background: i === current ? 'var(--ember)' : 'rgba(245,240,232,0.3)', width: i === current ? '24px' : '8px' }}
                                aria-label={`Слайд ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
