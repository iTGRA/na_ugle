export default function ChefSection({ chef, teamPhotos = [] }) {
    if (!chef) return null;
    return (
        <section id="chef" className="bg-charcoal py-24 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
                <div>
                    <div className="aspect-[3/4] bg-smoke overflow-hidden mb-4">
                        {chef.photo ? (
                            <img src={chef.photo} alt={chef.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-ash">
                                <span className="font-hand text-6xl">шеф</span>
                            </div>
                        )}
                    </div>
                    {teamPhotos.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                            {teamPhotos.slice(0, 8).map((p) => (
                                <img
                                    key={p.id}
                                    src={p.photo}
                                    alt={p.alt || ''}
                                    loading="lazy"
                                    className="flex-none w-24 h-24 object-cover"
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="font-hand text-ember mb-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                        {chef.name}
                    </h2>
                    {chef.position && (
                        <div className="text-ash uppercase tracking-wider text-xs mb-6">{chef.position}</div>
                    )}
                    {chef.bio_text && (
                        <div className="text-cream leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: chef.bio_text }} />
                    )}
                    {chef.facts && Object.keys(chef.facts).length > 0 && (
                        <dl className="grid gap-3 mb-6">
                            {Object.entries(chef.facts).map(([k, v]) => (
                                <div key={k} className="flex border-b border-wood pb-2 gap-4">
                                    <dt className="text-ash uppercase tracking-wider text-xs w-32 flex-none">{k}</dt>
                                    <dd className="text-cream">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                    {chef.quote && (
                        <blockquote className="font-hand text-2xl md:text-3xl text-amber leading-snug my-8 pl-6 border-l-4 border-ember">
                            «{chef.quote}»
                        </blockquote>
                    )}
                    {chef.lavolt_note && (
                        <p className="text-ash text-sm border border-wood p-4">
                            {chef.lavolt_note}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
