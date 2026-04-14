import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Footer from '../Components/Layout/Footer';

export default function Menu({ categories = [], phone, address }) {
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
            { rootMargin: '-40% 0px -50% 0px' }
        );
        Object.values(sectionsRef.current).forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [categories]);

    return (
        <div className="bg-paper text-ink min-h-screen">
            <Head title="Меню" />
            <header className="border-b border-hair sticky top-0 bg-paper z-30">
                <div className="shell py-5 flex items-center justify-between">
                    <Link href="/" className="font-bold" style={{ fontSize: '1.4rem' }}>НА УГЛЕ</Link>
                    <Link href="/" className="t-label link-underline">← На главную</Link>
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

            <main className="shell-narrow py-16">
                {categories.map((c) => (
                    <section
                        key={c.slug}
                        id={`cat-${c.slug}`}
                        data-slug={c.slug}
                        ref={(el) => (sectionsRef.current[c.slug] = el)}
                        className="mb-20 scroll-mt-36"
                    >
                        <div className="flex items-baseline justify-between mb-10 pb-4 border-b border-ink">
                            <h2 className="t-h2">{c.name}</h2>
                            <span className="t-label text-muted">{c.items.length} позиций</span>
                        </div>
                        <div className="space-y-6">
                            {c.items.map((i) => (
                                <article key={i.id} className="grid grid-cols-[1fr_auto] gap-6 items-baseline">
                                    <div>
                                        <h3 className="t-body-large">{i.name}</h3>
                                        {i.description && (
                                            <p className="t-small text-muted mt-1">{i.description}</p>
                                        )}
                                    </div>
                                    <div className="t-body-large font-bold whitespace-nowrap">{i.price} ₽</div>
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
