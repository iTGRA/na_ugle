export default function ManifestoSection({ headline, text, menuPdf, barMenuPdf, wineCardPdf }) {
    return (
        <section id="about" className="section bg-paper">
            <div className="shell grid md:grid-cols-[1.1fr_1fr] gap-12 md:gap-20 items-start">
                <h2 className="t-h2" style={{ whiteSpace: 'pre-line' }}>
                    {headline || 'Честная еда\nна открытом\nогне'}
                </h2>
                <div>
                    <p className="t-body-large">{text}</p>
                    {(menuPdf || barMenuPdf || wineCardPdf) && (
                        <div className="mt-12 flex flex-wrap gap-x-10 gap-y-3 t-label">
                            {menuPdf && <a href={menuPdf} target="_blank" rel="noopener" className="link-underline">Меню PDF</a>}
                            {barMenuPdf && <a href={barMenuPdf} target="_blank" rel="noopener" className="link-underline">Барное меню</a>}
                            {wineCardPdf && <a href={wineCardPdf} target="_blank" rel="noopener" className="link-underline">Винная карта</a>}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
