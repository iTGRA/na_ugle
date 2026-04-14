export default function ContactsSection({ settings }) {
    if (!settings) return null;
    return (
        <section id="contacts" className="bg-cream text-charcoal py-24 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="font-hand text-ember mb-8" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                        Как нас найти
                    </h2>
                    {settings.address && (
                        <p className="text-xl mb-3">{settings.address}</p>
                    )}
                    {settings.how_to_find && (
                        <p className="text-charcoal/70 mb-6">{settings.how_to_find}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {settings.yandex_maps_url && (
                            <a href={settings.yandex_maps_url} target="_blank" rel="noopener" className="px-5 py-3 border border-charcoal hover:bg-charcoal hover:text-cream transition-colors text-sm uppercase tracking-wider">
                                Яндекс.Карты
                            </a>
                        )}
                        {settings['2gis_url'] && (
                            <a href={settings['2gis_url']} target="_blank" rel="noopener" className="px-5 py-3 border border-charcoal hover:bg-charcoal hover:text-cream transition-colors text-sm uppercase tracking-wider">
                                2GIS
                            </a>
                        )}
                    </div>
                    <div className="space-y-2">
                        {settings.phone && (
                            <p>
                                <span className="text-charcoal/60 text-sm uppercase tracking-wider mr-3">Телефон:</span>
                                <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="text-xl link-ember">
                                    {settings.phone}
                                </a>
                            </p>
                        )}
                        {settings.work_hours && (
                            <p className="whitespace-pre-line">
                                <span className="text-charcoal/60 text-sm uppercase tracking-wider block">Режим:</span>
                                {settings.work_hours}
                            </p>
                        )}
                        {settings.season && (
                            <p>
                                <span className="text-charcoal/60 text-sm uppercase tracking-wider mr-3">Сезон:</span>
                                {settings.season}
                            </p>
                        )}
                    </div>
                </div>
                <div className="min-h-[400px] bg-smoke">
                    {settings.map_embed ? (
                        <div
                            className="w-full h-full"
                            style={{ minHeight: '400px' }}
                            dangerouslySetInnerHTML={{ __html: settings.map_embed }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-cream/40 font-hand text-2xl" style={{ minHeight: '400px' }}>
                            Карта скоро появится
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
