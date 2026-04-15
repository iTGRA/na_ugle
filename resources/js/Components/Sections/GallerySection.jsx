export default function GallerySection({ photos = [], instagramUrl, headline, label }) {
    if (photos.length === 0) return null;

    return (
        <section id="gallery" className="section bg-paper">
            <div className="shell">
                {/* Heading */}
                <div className="max-w-3xl mb-12 md:mb-16">
                    <div className="t-label text-muted mb-4">{label || 'Атмосфера'}</div>
                    <h2 className="t-h2" style={{ whiteSpace: 'pre-line' }}>
                        {headline || 'Наслаждаемся закатами\nв нашей атмосфере'}
                    </h2>
                </div>

                {/* Editorial masonry — CSS columns flow */}
                <div
                    className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6"
                    style={{ columnFill: 'balance' }}
                >
                    {photos.map((p) => (
                        <figure key={p.id} className="break-inside-avoid mb-4 md:mb-6 overflow-hidden bg-ink">
                            <img
                                src={p.photo}
                                alt={p.alt || ''}
                                loading="lazy"
                                className="w-full h-auto block transition-transform duration-700 hover:scale-[1.03]"
                            />
                        </figure>
                    ))}
                </div>

                {/* Footer link to Instagram if provided */}
                {instagramUrl && (
                    <div className="mt-12 md:mt-16 text-center">
                        <a href={instagramUrl} target="_blank" rel="noopener" className="cta-plain">
                            Больше — в Instagram
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}
