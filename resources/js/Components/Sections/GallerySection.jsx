import { useRef } from 'react';

export default function GallerySection({ photos = [] }) {
    const scrollRef = useRef(null);
    if (photos.length === 0) return null;

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir * window.innerWidth * 0.7, behavior: 'smooth' });
    };

    return (
        <section id="gallery" className="bg-charcoal py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
                <h2 className="font-hand text-ember" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                    Атмосфера
                </h2>
                <div className="hidden md:flex gap-2">
                    <button onClick={() => scroll(-1)} className="w-10 h-10 border border-cream text-cream hover:bg-cream hover:text-charcoal transition-colors">‹</button>
                    <button onClick={() => scroll(1)} className="w-10 h-10 border border-cream text-cream hover:bg-cream hover:text-charcoal transition-colors">›</button>
                </div>
            </div>
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 px-6 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none' }}
            >
                {photos.map((p) => (
                    <div
                        key={p.id}
                        className="flex-none snap-center"
                        style={{ width: '80vw', maxWidth: '560px', height: '65vh', minHeight: '380px' }}
                    >
                        <img
                            src={p.photo}
                            alt={p.alt || ''}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
