export default function ManifestoSection({ headline, text, menuPdf, barMenuPdf, wineCardPdf }) {
    return (
        <section id="about" className="bg-charcoal text-cream py-24 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <h2
                    className="font-hand text-ember leading-[0.9]"
                    style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', whiteSpace: 'pre-line' }}
                >
                    {headline || 'Честная еда\nна открытом\nогне'}
                </h2>
                <div>
                    <p className="text-base md:text-lg leading-relaxed text-cream">
                        {text}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-8">
                        {menuPdf && <a href={menuPdf} target="_blank" rel="noopener" className="btn-outline text-xs">Меню PDF</a>}
                        {barMenuPdf && <a href={barMenuPdf} target="_blank" rel="noopener" className="btn-outline text-xs">Барное меню</a>}
                        {wineCardPdf && <a href={wineCardPdf} target="_blank" rel="noopener" className="btn-outline text-xs">Винная карта</a>}
                    </div>
                </div>
            </div>
        </section>
    );
}
