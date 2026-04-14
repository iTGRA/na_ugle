export default function Footer({ settings }) {
    const year = new Date().getFullYear();
    return (
        <footer className="inverted py-16 px-6">
            <div className="shell grid md:grid-cols-4 gap-10">
                <div>
                    <div className="font-bold mb-4" style={{ fontSize: '1.4rem' }}>НА УГЛЕ</div>
                    <p className="text-muted t-small">{settings?.season || 'Работаем май — сентябрь'}</p>
                </div>
                <div>
                    <div className="t-label mb-4 text-muted">Часы работы</div>
                    <p className="t-small whitespace-pre-line">{settings?.work_hours || '—'}</p>
                </div>
                <div>
                    <div className="t-label mb-4 text-muted">Контакты</div>
                    <p className="t-small mb-2">{settings?.address}</p>
                    {settings?.phone && (
                        <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="link-underline t-small">{settings.phone}</a>
                    )}
                </div>
                <div>
                    <div className="t-label mb-4 text-muted">Соцсети</div>
                    <div className="flex gap-5 t-small">
                        {settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener" className="link-underline">Instagram</a>}
                        {settings?.telegram_url && <a href={settings.telegram_url} target="_blank" rel="noopener" className="link-underline">Telegram</a>}
                    </div>
                </div>
            </div>
            <div className="shell mt-16 pt-6 border-t border-hair-inverse flex items-center justify-between t-small text-muted">
                <span>© {year} НА УГЛЕ</span>
                <span>Самара</span>
            </div>
        </footer>
    );
}
