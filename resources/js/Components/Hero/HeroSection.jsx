import { useEffect, useState } from 'react';
import CowMascot from '../UI/CowMascot';

export default function HeroSection({ slides = [], slogan, description, durnyashaQuote }) {
    const [current, setCurrent] = useState(0);
    const hasSlides = slides.length > 0;

    useEffect(() => {
        if (!hasSlides || slides.length < 2) return;
        const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 8000);
        return () => clearInterval(id);
    }, [hasSlides, slides.length]);

    return (
        <section className="relative min-h-screen bg-paper flex flex-col justify-end pt-32 pb-16 overflow-hidden">
            {hasSlides && (
                <div className="absolute inset-0 pointer-events-none">
                    {slides.map((s, i) => (
                        <div
                            key={s.id}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{
                                opacity: i === current ? 0.18 : 0,
                                backgroundImage: s.photo ? `url(${s.photo})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'grayscale(40%) contrast(0.95)',
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="relative shell w-full">
                {slogan && (
                    <h1 className="t-h1" style={{ whiteSpace: 'pre-line' }}>
                        {slogan}
                    </h1>
                )}

                <div className="mt-12 grid md:grid-cols-[1.6fr_1fr] gap-10 items-end">
                    <div>
                        {description && (
                            <p className="t-body-large max-w-2xl">{description}</p>
                        )}
                        <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4">
                            <a href="#menu" className="cta">Смотреть меню</a>
                            <a href="#reservation" className="cta-plain">Забронировать стол</a>
                        </div>
                    </div>
                    <div className="flex items-end justify-end gap-4 text-right">
                        <div className="max-w-xs">
                            {durnyashaQuote && (
                                <p className="t-small text-muted" style={{ fontStyle: 'italic' }}>
                                    {durnyashaQuote}
                                </p>
                            )}
                        </div>
                        <div className="text-ink opacity-80 flex-none">
                            <CowMascot size={120} />
                        </div>
                    </div>
                </div>
            </div>

            {hasSlides && slides.length > 1 && (
                <div className="relative shell w-full mt-10 flex items-center justify-between">
                    <div className="t-label text-muted">
                        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                    </div>
                    <div className="flex gap-6">
                        <button
                            onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
                            className="t-label link-hover"
                            aria-label="Предыдущий слайд"
                        >← ПРЕД</button>
                        <button
                            onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                            className="t-label link-hover"
                            aria-label="Следующий слайд"
                        >СЛЕД →</button>
                    </div>
                </div>
            )}
        </section>
    );
}
