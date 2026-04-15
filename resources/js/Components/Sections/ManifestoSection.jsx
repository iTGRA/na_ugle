export default function ManifestoSection({ headline, text, durnyashaQuote, barMenuPdf, wineCardPdf }) {
    return (
        <section id="about" className="section bg-paper">
            <div className="shell-narrow text-center">
                <h2 className="t-h2" style={{ whiteSpace: 'pre-line' }}>
                    {headline || 'Честная еда\nна открытом огне\nс видом на Волгу'}
                </h2>
                {text && (
                    <p className="t-body-large mt-10 mx-auto max-w-2xl">{text}</p>
                )}
                {durnyashaQuote && (
                    <div className="mt-12 md:mt-16">
                        <img
                            src="/images/cow-vert.svg"
                            alt="Дурняша"
                            className="mx-auto w-24 md:w-32 h-auto"
                        />
                        <p className="t-small text-muted mt-5 mx-auto max-w-xl" style={{ fontStyle: 'italic' }}>
                            {durnyashaQuote}
                        </p>
                    </div>
                )}
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
