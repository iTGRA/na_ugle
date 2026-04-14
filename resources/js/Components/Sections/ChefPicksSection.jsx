export default function ChefPicksSection({ items = [] }) {
    if (items.length === 0) return null;
    return (
        <section className="py-24 px-6" style={{ background: 'var(--wood)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="text-xs uppercase tracking-widest text-amber mb-2">Шеф рекомендует</div>
                    <h2 className="font-hand text-cream" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                        Пять блюд от Андрея
                    </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((i) => (
                        <article key={i.id} className="bg-charcoal p-6">
                            {i.photo && (
                                <div className="aspect-video overflow-hidden mb-4 -m-6 mb-6">
                                    <img src={i.photo} alt={i.name} loading="lazy" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <h3 className="text-cream text-xl mb-2">{i.name}</h3>
                            {i.chef_comment && (
                                <p className="text-amber text-sm italic font-hand text-lg mb-3">«{i.chef_comment}»</p>
                            )}
                            <div className="text-ember font-bold">{i.price} ₽</div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
