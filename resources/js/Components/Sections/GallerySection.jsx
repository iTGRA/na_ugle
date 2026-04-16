/**
 * v0.2 Gallery Section — обёртка для FilmstripGallery.
 * Рендерит заголовок секции + плёнку + Instagram-ссылку.
 */
import FilmstripGallery from '../UI/FilmstripGallery';

export default function GallerySection({ photos = [], instagramUrl, headline, label }) {
    if (photos.length === 0) return null;

    // Map gallery_photos → filmstrip images format
    const filmImages = photos.map((p, i) => ({
        src: p.photo,
        alt: p.alt || '',
        frameNumber: String(i + 1).padStart(2, '0'),
    }));

    return (
        <section id="gallery" className="section bg-paper overflow-hidden">
            {/* Heading */}
            <div className="shell mb-20 md:mb-28">
                <div className="t-label text-muted mb-3">{label || 'Атмосфера'}</div>
                <h2 className="t-h2" style={{ whiteSpace: 'pre-line' }}>
                    {headline || 'Наслаждаемся закатами\nв нашей атмосфере'}
                </h2>
            </div>

            {/* Kodak BW400CN Filmstrip */}
            <FilmstripGallery
                images={filmImages}
                filmLabel="НА УГЛЕ 400"
                filmColor="#C8400A"
                autoScroll={true}
                orientation="landscape"
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
