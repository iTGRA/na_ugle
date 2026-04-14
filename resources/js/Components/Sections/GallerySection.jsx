import { useRef } from 'react';

export default function GallerySection({ photos = [] }) {
    const scrollRef = useRef(null);
    if (photos.length === 0) return null;

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir * window.innerWidth * 0.7, behavior: 'smooth' });
    };

    return (
        <section id="gallery" className="section bg-paper overflow-hidden">
            <div className="shell flex items-end justify-between mb-10">
                <h2 className="t-h2">Атмосфера</h2>
                <div className="hidden md:flex gap-6">
                    <button onClick={() => scroll(-1)} className="t-label link-hover">← ПРЕД</button>
                    <button onClick={() => scroll(1)} className="t-label link-hover">СЛЕД →</button>
                </div>
            </div>
            <div
                ref={scrollRef}
                className="no-scrollbar flex gap-6 overflow-x-auto pb-4 px-6 snap-x snap-mandatory"
            >
                {photos.map((p) => (
                    <figure
                        key={p.id}
                        className="flex-none snap-center photo-frame"
                        style={{ width: '80vw', maxWidth: '620px', height: '70vh', minHeight: '420px' }}
                    >
                        <img src={p.photo} alt={p.alt || ''} loading="lazy" />
                    </figure>
                ))}
            </div>
        </section>
    );
}
