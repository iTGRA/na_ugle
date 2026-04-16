/**
 * v0.2 Hero-манифест: корова Дурняша + слоган + описание.
 * Занимает ровно один экран (100dvh минус header).
 * Контент центрируется по вертикали через flexbox.
 *
 * Props: headline, text, barMenuPdf, wineCardPdf
 */

/**
 * Типографическая коррекция: не оставляем короткие предлоги/союзы
 * в конце строки. Заменяем пробел после них на неразрывный.
 */
function fixPrepositions(str) {
    if (!str) return str;
    return str.replace(/ (на|в|и|с|у|к|о|за|по|от|из|до|не|ни|же|ли|а) /gi, ' $1\u00A0');
}

export default function ManifestoSection({ headline, text, phone, barMenuPdf, wineCardPdf }) {
    const defaultHeadline = 'Гриль, колбаски и\u00A0пиво.\nПростые удовольствия\nна\u00A0набережной Самары.';

    return (
        <section
            id="about"
            className="bg-paper flex flex-col items-center justify-center text-center"
            style={{
                minHeight: 'calc(100dvh - 120px)',
                paddingTop: '40px',
                paddingBottom: '40px',
            }}
        >
            <div className="shell">
                {/* Корова — адаптивная по высоте экрана */}
                <img
                    src="/images/cow-vert.svg"
                    alt="Дурняша"
                    className="mx-auto h-auto"
                    style={{
                        width: 'clamp(96px, 14vw, 208px)',
                        marginBottom: 'clamp(24px, 4vh, 56px)',
                    }}
                />

                {/* Слоган — масштаб зависит от ширины И высоты viewport */}
                <h1
                    className="mx-auto max-w-5xl font-bold"
                    style={{
                        whiteSpace: 'pre-line',
                        fontSize: 'clamp(1.6rem, min(4.5vw, 5vh), 4rem)',
                        lineHeight: 1.05,
                        letterSpacing: '-0.015em',
                    }}
                >
                    {fixPrepositions(headline) || defaultHeadline}
                </h1>

                {/* Описание */}
                {text && (
                    <p
                        className="mx-auto max-w-2xl text-muted"
                        style={{
                            marginTop: 'clamp(20px, 3vh, 40px)',
                            fontSize: 'clamp(0.95rem, min(1.2vw, 1.8vh), 1.2rem)',
                            lineHeight: 1.5,
                        }}
                    >
                        {fixPrepositions(text)}
                    </p>
                )}

                {/* CTA кнопки */}
                <div
                    className="flex flex-wrap justify-center gap-4"
                    style={{ marginTop: 'clamp(24px, 4vh, 48px)' }}
                >
                    {phone && (
                        <a href={`tel:${phone.replace(/\D/g, '')}`} className="btn btn-sm">
                            Забронировать
                        </a>
                    )}
                    <a href="/menu" className="btn-secondary btn-sm">
                        Меню
                    </a>
                </div>

                {/* PDF-ссылки */}
                {(barMenuPdf || wineCardPdf) && (
                    <div
                        className="flex flex-wrap justify-center gap-x-10 gap-y-3 t-label"
                        style={{ marginTop: 'clamp(16px, 2vh, 28px)' }}
                    >
                        {barMenuPdf && <a href={barMenuPdf} target="_blank" rel="noopener" className="link-underline">Барное меню</a>}
                        {wineCardPdf && <a href={wineCardPdf} target="_blank" rel="noopener" className="link-underline">Винная карта</a>}
                    </div>
                )}
            </div>
        </section>
    );
}
