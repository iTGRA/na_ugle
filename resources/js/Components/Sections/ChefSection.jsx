export default function ChefSection({ chef, teamPhotos = [] }) {
    if (!chef) return null;
    return (
        <section id="chef" className="section bg-paper">
            <div className="shell grid md:grid-cols-[1fr_1.1fr] gap-12 md:gap-20">
                <div className="min-w-0">
                    <div className="aspect-[3/4] photo-frame mb-4">
                        {chef.photo ? (
                            <img src={chef.photo} alt={chef.name} loading="lazy" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-paper text-sm opacity-40">
                                ФОТО ШЕФА
                            </div>
                        )}
                    </div>
                    {teamPhotos.length > 0 && (
                        <div className="no-scrollbar flex gap-3 overflow-x-auto">
                            {teamPhotos.slice(0, 8).map((p) => (
                                <img
                                    key={p.id}
                                    src={p.photo}
                                    alt={p.alt || ''}
                                    loading="lazy"
                                    className="flex-none w-28 h-28 object-cover photo-frame"
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <div className="t-label text-muted mb-3">Шеф-повар</div>
                    <h2 className="t-h2 mb-2">{chef.name}</h2>
                    {chef.position && (
                        <div className="t-label text-muted mb-8">{chef.position}</div>
                    )}

                    {chef.quote && (
                        <blockquote className="t-h3 mb-10 pl-6 border-l-2 border-ink" style={{ fontWeight: 400 }}>
                            «{chef.quote}»
                        </blockquote>
                    )}

                    {chef.bio_text && (
                        <div className="t-body mb-10" dangerouslySetInnerHTML={{ __html: chef.bio_text }} />
                    )}

                    {chef.facts && Object.keys(chef.facts).length > 0 && (
                        <dl className="grid gap-5 mb-8">
                            {Object.entries(chef.facts).map(([k, v]) => (
                                <div key={k} className="border-t border-hair pt-3">
                                    <dt className="t-label text-muted mb-1">{k}</dt>
                                    <dd className="t-body">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    )}

                    {chef.lavolt_note && (
                        <div className="pt-6 mt-6 border-t border-hair t-small text-muted">
                            {chef.lavolt_note}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
