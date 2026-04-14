export default function Footer({ settings }) {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-smoke text-cream py-12 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
                <div>
                    <div className="font-hand text-3xl text-ember mb-3">НА УГЛЕ</div>
                    <p className="text-ash">{settings?.season || 'Работаем май — сентябрь'}</p>
                </div>
                <div>
                    <h4 className="uppercase tracking-wider text-xs text-ash mb-3">Часы работы</h4>
                    <p className="whitespace-pre-line">{settings?.work_hours || ''}</p>
                </div>
                <div>
                    <h4 className="uppercase tracking-wider text-xs text-ash mb-3">Контакты</h4>
                    <p>{settings?.address}</p>
                    {settings?.phone && (
                        <p><a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="link-ember">{settings.phone}</a></p>
                    )}
                </div>
                <div>
                    <h4 className="uppercase tracking-wider text-xs text-ash mb-3">Соцсети</h4>
                    <div className="flex gap-4">
                        {settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener" className="link-ember">Instagram</a>}
                        {settings?.telegram_url && <a href={settings.telegram_url} target="_blank" rel="noopener" className="link-ember">Telegram</a>}
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-wood text-xs text-ash text-center">
                © {year} НА УГЛЕ
            </div>
        </footer>
    );
}
