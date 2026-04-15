import { Link, usePage } from '@inertiajs/react';

const PAGE_LINKS = [
    { href: '/', label: 'Главная' },
    { href: '/menu', label: 'Полное меню' },
    { href: '/#about', label: 'О нас' },
    { href: '/#chef', label: 'Шеф' },
    { href: '/#gallery', label: 'Атмосфера' },
    { href: '/#contacts', label: 'Контакты' },
];

export default function Footer() {
    const { siteFooter = {} } = usePage().props;
    const {
        phone = '',
        address = '',
        work_hours = '',
        season = '',
        instagram_url = '',
        telegram_url = '',
        menu_pdf = '',
        categories = [],
    } = siteFooter;

    const year = new Date().getFullYear();
    const phoneTel = phone ? `tel:${phone.replace(/\D/g, '')}` : null;

    return (
        <footer className="inverted pt-20 pb-12 px-6">
            <div className="shell">
                {/* Top: logo + tagline */}
                <div className="grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-20 pb-16 border-b border-hair-inverse">
                    <div>
                        <img
                            src="/images/logo-footer.svg"
                            alt="НА УГЛЕ"
                            className="w-64 md:w-80 h-auto mb-6"
                        />
                        {address && (
                            <p className="t-body mb-2">{address}</p>
                        )}
                        {season && (
                            <p className="t-small text-muted-inverse">{season}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-4 items-start md:items-end">
                        {phoneTel && (
                            <a
                                href={phoneTel}
                                className="btn-light"
                                style={{ fontSize: '15px', padding: '14px 28px' }}
                            >
                                {phone}
                            </a>
                        )}
                        {menu_pdf && (
                            <a href={menu_pdf} target="_blank" rel="noopener" download className="btn-light-secondary">
                                Скачать меню
                            </a>
                        )}
                    </div>
                </div>

                {/* Sitemap */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 py-12">
                    {/* Pages */}
                    <div>
                        <div className="t-label text-muted-inverse mb-5">Страницы</div>
                        <ul className="space-y-3">
                            {PAGE_LINKS.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="t-small link-hover">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Menu categories */}
                    <div className="md:col-span-2">
                        <div className="t-label text-muted-inverse mb-5">Меню</div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                            {categories.map((c) => (
                                <li key={c.slug}>
                                    <Link
                                        href={`/menu#cat-${c.slug}`}
                                        className="t-small link-hover"
                                    >
                                        {c.icon ? `${c.icon} ` : ''}{c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Hours + social */}
                    <div>
                        <div className="t-label text-muted-inverse mb-5">Часы работы</div>
                        <p className="t-small whitespace-pre-line mb-6">{work_hours || '—'}</p>
                        {(instagram_url || telegram_url) && (
                            <>
                                <div className="t-label text-muted-inverse mb-3">Соцсети</div>
                                <div className="flex flex-col gap-2 t-small">
                                    {instagram_url && (
                                        <a href={instagram_url} target="_blank" rel="noopener" className="link-underline">Instagram</a>
                                    )}
                                    {telegram_url && (
                                        <a href={telegram_url} target="_blank" rel="noopener" className="link-underline">Telegram</a>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom strip */}
                <div className="pt-6 border-t border-hair-inverse flex flex-col md:flex-row items-start md:items-center justify-between gap-3 t-small text-muted-inverse">
                    <span>© {year} НА УГЛЕ · Самара</span>
                    <span>Pop-up гриль-бистро на набережной Волги</span>
                </div>
            </div>
        </footer>
    );
}
