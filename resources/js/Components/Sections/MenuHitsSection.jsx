import { Link } from '@inertiajs/react';

export default function MenuHitsSection({ items = [], menuPdf }) {
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
                        <h2 className="t-h2">Хиты с хоспера</h2>
                    </div>
                    <Link href="/menu" className="btn-secondary btn-sm">
                        Полное меню
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                    {items.map((i) => (
                        <article key={i.id} className="group bg-white border border-ink p-3 pb-7 transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(10,10,8,0.12)]">
                            <div className="aspect-[4/5] bg-ink overflow-hidden mb-5">
                                {i.photo ? (
                                    <img
                                        src={i.photo}
                                        alt={i.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-paper opacity-50 font-bold text-xs tracking-widest">
                                        НА УГЛЕ
                                    </div>
                                )}
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

                {menuPdf && (
                    <div className="mt-16 text-center">
                        <a href={menuPdf} target="_blank" rel="noopener" download className="btn">
                            ↓ Скачать меню
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}
