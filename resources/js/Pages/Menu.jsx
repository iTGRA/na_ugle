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
        <div className="bg-charcoal text-cream min-h-screen">
            <Head title="Меню" />
            <header className="border-b border-wood sticky top-0 bg-charcoal z-30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="font-hand text-2xl text-ember">НА УГЛЕ</Link>
                    <Link href="/" className="link-ember text-sm uppercase tracking-wider">← Назад</Link>
                </div>
                <nav className="border-t border-wood overflow-x-auto">
                    <div className="max-w-7xl mx-auto px-6 flex gap-6 py-3 whitespace-nowrap" style={{ scrollbarWidth: 'none' }}>
                        {categories.map((c) => (
                            <a
                                key={c.slug}
                                href={`#cat-${c.slug}`}
                                className={`text-sm uppercase tracking-wider transition-colors ${activeSlug === c.slug ? 'text-ember' : 'text-ash hover:text-cream'}`}
                            >
                                {c.icon} {c.name}
                            </a>
                        ))}
                    </div>
                </nav>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {categories.map((c) => (
                    <section
                        key={c.slug}
                        id={`cat-${c.slug}`}
                        data-slug={c.slug}
                        ref={(el) => (sectionsRef.current[c.slug] = el)}
                        className="mb-16 scroll-mt-28"
                    >
                        <h2 className="font-hand text-ember mb-8" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                            {c.icon} {c.name}
                        </h2>
                        <div className="grid gap-6">
                            {c.items.map((i) => (
                                <article key={i.id} className="grid grid-cols-[80px_1fr_auto] md:grid-cols-[120px_1fr_auto] gap-4 items-start border-b border-wood pb-6">
                                    <div className="aspect-square bg-smoke overflow-hidden">
                                        {i.photo ? (
                                            <img src={i.photo} alt={i.name} loading="lazy" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-ember/30 text-2xl">🔥</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-cream text-lg mb-1">{i.name}</h3>
                                        {i.description && <p className="text-ash text-sm">{i.description}</p>}
                                    </div>
                                    <div className="text-ember font-bold whitespace-nowrap">{i.price} ₽</div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}

                {categories.length === 0 && (
                    <div className="text-center py-24 text-ash">
                        Меню пока пустое. Возвращайтесь позже.
                    </div>
                )}
            </main>

            <Footer settings={{ phone, address }} />
        </div>
    );
}
