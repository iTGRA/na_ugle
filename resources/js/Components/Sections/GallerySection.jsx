/**
 * v0.2 Gallery Section — фото-карусель на атмосферном фоне.
 */
import FilmstripGallery from '../UI/FilmstripGallery';

export default function GallerySection({ photos = [], instagramUrl, headline, label }) {
    if (photos.length === 0) return null;

    const filmImages = photos.map((p, i) => ({
        src: p.photo,
        alt: p.alt || '',
    }));

    return (
        <section id="gallery" className="section bg-paper overflow-hidden">
            {/* Heading */}
            <div className="shell" style={{ marginBottom: '48px' }}>
                <div className="t-label text-muted mb-3">{label || 'Атмосфера'}</div>
                <h2 className="t-h2" style={{ whiteSpace: 'pre-line' }}>
                    {headline || 'Наслаждаемся закатами\nв нашей атмосфере'}
                </h2>
            </div>

            {/* Photo gallery on atmospheric background */}
            <FilmstripGallery
                images={filmImages}
                autoScroll={true}
            />

            {/* Instagram link */}
            {instagramUrl && (
                <div className="shell mt-10 md:mt-14 text-center">
                    <a href={instagramUrl} target="_blank" rel="noopener" className="cta-plain t-label">
                        Больше — в Instagram
                    </a>
                </div>
            )}
        </section>
    );
}
