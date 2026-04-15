import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Footer from '../Components/Layout/Footer';

function formatPrice(price) {
    if (!price || price <= 0) return 'уточняйте';
    return `${price} ₽`;
}

export default function Menu({ categories = [], phone, address, menuPdf, barMenuPdf, wineCardPdf }) {
    const [activeSlug, setActiveSlug] = useState(categories[0]?.slug || '');
    const sectionsRef = useRef({});

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActiveSlug(e.target.dataset.slug);
                });
            },
            { rootMargin: '-35% 0px -55% 0px' }
        );
        Object.values(sectionsRef.current).forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [categories]);

    const totalItems = categories.reduce((acc, c) => acc + c.items.length, 0);

    return (
        <div className="bg-paper text-ink min-h-screen">
            <Head title="Меню" />

            {/* Top bar */}
            <header className="border-b border-hair sticky top-0 bg-paper/95 backdrop-blur-sm z-30">
                <div className="shell py-5 flex items-center justify-between gap-6">
                    <Link href="/"><img src="/images/logo-header.svg" alt="НА УГЛЕ" className="h-12 w-auto" /></Link>
                    <div className="flex items-center gap-6">
                        {menuPdf && (
                            <a href={menuPdf} target="_blank" rel="noopener" download className="hidden md:inline-flex items-center gap-2 t-label link-underline">
                                ↓ Скачать PDF
                            </a>
                        )}
                        <Link href="/" className="t-label link-underline">← На главную</Link>
                    </div>
                </div>
                <nav className="border-t border-hair overflow-x-auto no-scrollbar">
                    <div className="shell flex gap-8 py-4 whitespace-nowrap">
                        {categories.map((c) => (
                            <a
                                key={c.slug}
                                href={`#cat-${c.slug}`}
                                className={`t-label transition-opacity ${activeSlug === c.slug ? '' : 'opacity-50 hover:opacity-100'}`}
                                style={activeSlug === c.slug ? { borderBottom: '2px solid currentColor', paddingBottom: '4px' } : undefined}
                            >
                                {c.name}
                            </a>
                        ))}
                    </div>
                </nav>
            </header>

            {/* Intro */}
            <section className="shell py-16 md:py-24">
                <div className="max-w-3xl">
                    <div className="t-label text-muted mb-4">Меню {totalItems > 0 && `· ${totalItems} позиций`}</div>
                    <h1 className="t-h1 mb-8">Полное меню</h1>
                    <p className="t-body-large text-muted mb-10">
                        Еда на углях, собственные колбасы и домашние соусы. Если хотите забрать меню с собой — скачайте PDF.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        {menuPdf && (
                            <a href={menuPdf} target="_blank" rel="noopener" download className="btn">
                                ↓ Скачать меню PDF
                            </a>
                        )}
                        {barMenuPdf && (
                            <a href={barMenuPdf} target="_blank" rel="noopener" download className="btn-secondary">
                                Барная карта
                            </a>
                        )}
                        {wineCardPdf && (
                            <a href={wineCardPdf} target="_blank" rel="noopener" download className="btn-secondary">
                                Винная карта
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <main className="shell pb-24">
                {categories.map((c) => (
                    <section
                        key={c.slug}
                        id={`cat-${c.slug}`}
                        data-slug={c.slug}
                        ref={(el) => (sectionsRef.current[c.slug] = el)}
                        className="mb-20 md:mb-28 scroll-mt-40"
                    >
                        <div className="flex items-baseline justify-between mb-10 pb-4 border-b border-ink">
                            <h2 className="t-h2">{c.icon ? `${c.icon} ${c.name}` : c.name}</h2>
                            <span className="t-label text-muted hidden md:inline">{c.items.length} {c.items.length === 1 ? 'позиция' : 'позиций'}</span>
                        </div>
                        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                            {c.items.map((i) => (
                                <article
                                    key={i.id}
                                    className="group bg-white p-3 pb-7"
                                    style={{
                                        border: '2.5px solid var(--ink)',
                                        borderRadius: '10px',
                                        boxShadow: '6px 6px 0 var(--ink)',
                                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translate(2px, 2px)';
                                        e.currentTarget.style.boxShadow = '4px 4px 0 var(--ink)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translate(0, 0)';
                                        e.currentTarget.style.boxShadow = '6px 6px 0 var(--ink)';
                                    }}
                                >
                                    <div className="aspect-[4/3] bg-ink overflow-hidden mb-5" style={{ borderRadius: '4px' }}>
                                        {i.photo ? (
                                            <img
                                                src={i.photo}
                                                alt={i.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-paper/40 t-label">НА УГЛЕ</div>
                                        )}
                                    </div>
                                    <div className="px-1">
                                        <div className="flex items-baseline justify-between gap-4 mb-1.5">
                                            <h3 className="t-body-large leading-tight">{i.name}</h3>
                                            <span className="font-bold whitespace-nowrap">{formatPrice(i.price)}</span>
                                        </div>
                                        {i.description && (
                                            <p className="t-small text-muted leading-snug">{i.description}</p>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}

                {categories.length === 0 && (
                    <div className="text-center py-24 t-body text-muted">
                        Меню пока пустое. Возвращайтесь позже.
                    </div>
                )}
            </main>

            <Footer settings={{ phone, address }} />
        </div>
    );
}
