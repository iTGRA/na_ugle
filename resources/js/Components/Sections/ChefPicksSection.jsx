export default function ChefPicksSection({ items = [] }) {
    if (items.length === 0) return null;
    return (
        <section className="inverted section">
            <div className="shell">
                <div className="text-center mb-16">
                    <div className="t-label text-muted-inverse mb-4">Шеф рекомендует</div>
                    <h2 className="t-h2">Пять блюд от Андрея</h2>
                </div>
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((i) => (
                        <article key={i.id}>
                            {i.photo && (
                                <div className="aspect-[4/3] mb-5 overflow-hidden">
                                    <img src={i.photo} alt={i.name} loading="lazy" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <h3 className="t-h3 mb-3">{i.name}</h3>
                            {i.chef_comment && (
                                <p className="t-body mb-4" style={{ opacity: 0.85 }}>«{i.chef_comment}»</p>
                            )}
                            <div className="font-bold">{i.price > 0 ? `${i.price} ₽` : 'уточняйте'}</div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
