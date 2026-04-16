/**
 * v0.2 Hero-манифест: корова Дурняша + слоган + описание.
 * Заменяет старый HeroSection (слайдер убран).
 *
 * Props (из SiteSettings):
 *   headline — многострочный слоган (default: «Простые удовольствия...»)
 *   text — описание («Под Струковским парком...»)
 *   durnyashaQuote — реплика Дурняши
 *   barMenuPdf, wineCardPdf — PDF-ссылки (bar/wine)
 */
export default function ManifestoSection({ headline, text, durnyashaQuote, barMenuPdf, wineCardPdf }) {
    return (
        <section id="about" className="bg-paper" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
            <div className="shell text-center">
                {/* Корова Дурняша — крупная, центрирована */}
                <img
                    src="/images/cow-vert.svg"
                    alt="Дурняша"
                    className="mx-auto w-40 md:w-56 lg:w-64 h-auto mb-10 md:mb-14"
                />

                {/* Слоган — крупный, занимает ширину */}
                <h1
                    className="t-h1 mx-auto max-w-5xl"
                    style={{ whiteSpace: 'pre-line', fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}
                >
                    {headline || 'Простые удовольствия\nна набережной Самары.\nГриль, колбаски и пиво.'}
                </h1>

                {/* Описание */}
                {text && (
                    <p className="t-body-large mt-10 mx-auto max-w-2xl" style={{ fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)' }}>
                        {text}
                    </p>
                )}

                {/* Дурняша */}
                {durnyashaQuote && (
                    <p
                        className="mt-8 mx-auto max-w-2xl text-muted"
                        style={{ fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)' }}
                    >
                        {durnyashaQuote}
                    </p>
                )}

                {/* PDF-ссылки (bar/wine, если заданы) */}
                {(barMenuPdf || wineCardPdf) && (
                    <div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-3 t-label">
                        {barMenuPdf && <a href={barMenuPdf} target="_blank" rel="noopener" className="link-underline">Барное меню</a>}
                        {wineCardPdf && <a href={wineCardPdf} target="_blank" rel="noopener" className="link-underline">Винная карта</a>}
                    </div>
                )}
            </div>
        </section>
    );
}
