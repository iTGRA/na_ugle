import { Link } from '@inertiajs/react';

export default function MenuHitsSection({ items = [], menuPdf, headline }) {
    if (items.length === 0) {
        return (
            <section id="menu" className="section bg-paper text-center">
                <div className="shell-narrow">
                    <div className="t-label text-muted mb-6">Меню</div>
                    <h2 className="t-h2 mb-6">Скоро появится</h2>
                    <p className="t-body text-muted">Дурняша всё ещё готовит. Возвращайтесь через пару часов.</p>
                </div>
            </section>
        );
    }

    return (
        <section id="menu" className="section bg-paper">
            <div className="shell">
                <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
                    <div>
                        <div className="t-label text-muted mb-3">Меню</div>
                        <h2 className="t-h2">{headline || 'Хиты с хоспера'}</h2>
                    </div>
                    {menuPdf && (
                        <a href={menuPdf} target="_blank" rel="noopener" download className="btn-secondary btn-sm">
                            Скачать меню
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                    {items.map((i) => (
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
                            <div className="aspect-[4/3] bg-ink overflow-hidden mb-5 relative" style={{ borderRadius: '4px' }}>
                                {i.photo ? (
                                    <img
                                        src={i.photo}
                                        alt={i.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-paper opacity-50 font-bold text-xs tracking-widest">
                                        НА УГЛЕ
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                    {i.is_chef_pick && <span className="chip chip-chef">👨‍🍳 Шеф</span>}
                                    {i.is_featured && <span className="chip chip-hit">★ Хит</span>}
                                </div>
                            </div>
                            <div className="px-1">
                                {i.category && (
                                    <div className="t-label text-muted mb-1.5">{i.category.name}</div>
                                )}
                                <div className="flex items-baseline justify-between gap-3">
                                    <h3 className="text-base">{i.name}</h3>
                                    <span className="font-bold whitespace-nowrap">{i.price > 0 ? `${i.price} ₽` : 'уточняйте'}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/menu" className="btn-secondary">
                        Полное меню
                    </Link>
                </div>
            </div>
        </section>
    );
}
