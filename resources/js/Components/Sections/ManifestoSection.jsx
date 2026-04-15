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
                    <p className="t-small text-muted mt-8 mx-auto max-w-xl" style={{ fontStyle: 'italic' }}>
                        {durnyashaQuote}
                    </p>
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
