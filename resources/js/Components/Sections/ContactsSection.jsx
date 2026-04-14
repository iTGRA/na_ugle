export default function ContactsSection({ settings }) {
    if (!settings) return null;
    return (
        <section id="contacts" className="section bg-paper">
            <div className="shell grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20">
                <div>
                    <div className="t-label text-muted mb-3">Контакты</div>
                    <h2 className="t-h2 mb-8">Как нас найти</h2>
                    {settings.address && (
                        <p className="t-h3 mb-4" style={{ fontWeight: 400 }}>{settings.address}</p>
                    )}
                    {settings.how_to_find && (
                        <p className="t-body text-muted mb-10">{settings.how_to_find}</p>
                    )}
                    <div className="flex flex-wrap gap-x-10 gap-y-3 mb-10 t-label">
                        {settings.yandex_maps_url && (
                            <a href={settings.yandex_maps_url} target="_blank" rel="noopener" className="link-underline">Яндекс.Карты</a>
                        )}
                        {settings['2gis_url'] && (
                            <a href={settings['2gis_url']} target="_blank" rel="noopener" className="link-underline">2GIS</a>
                        )}
                    </div>
                    <dl className="space-y-4 pt-6 border-t border-hair">
                        {settings.phone && (
                            <div>
                                <dt className="t-label text-muted mb-1">Телефон</dt>
                                <dd><a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="t-h3 link-underline" style={{ fontWeight: 400 }}>{settings.phone}</a></dd>
                            </div>
                        )}
                        {settings.work_hours && (
                            <div>
                                <dt className="t-label text-muted mb-1">Режим работы</dt>
                                <dd className="t-body whitespace-pre-line">{settings.work_hours}</dd>
                            </div>
                        )}
                        {settings.season && (
                            <div>
                                <dt className="t-label text-muted mb-1">Сезон</dt>
                                <dd className="t-body">{settings.season}</dd>
                            </div>
                        )}
                    </dl>
                </div>
                <div className="aspect-[4/3] md:aspect-auto md:min-h-[500px] photo-frame">
                    {settings.map_embed ? (
                        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: settings.map_embed }} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-paper t-label">
                            КАРТА СКОРО ПОЯВИТСЯ
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
