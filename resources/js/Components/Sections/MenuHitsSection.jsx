import { Link } from '@inertiajs/react';
import CowMascot from '../UI/CowMascot';

export default function MenuHitsSection({ items = [] }) {
    if (items.length === 0) {
        return (
            <section id="menu" className="bg-smoke py-24 px-6 text-center">
                <div className="max-w-xl mx-auto text-cream">
                    <div className="opacity-30 mx-auto mb-6 w-fit text-ember">
                        <CowMascot size={140} />
                    </div>
                    <h2 className="font-hand text-ember mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>Меню скоро появится</h2>
                    <p className="text-ash">Дурняша всё готовит. Возвращайтесь через пару часов.</p>
                </div>
            </section>
        );
    }

    return (
        <section id="menu" className="bg-smoke py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
                    <h2 className="font-hand text-ember" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                        Хиты меню
                    </h2>
                    <Link href="/menu" className="link-ember text-cream uppercase tracking-wider text-sm">
                        Смотреть полное меню →
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((i) => (
                        <article key={i.id} className="group">
                            <div className="aspect-[4/3] overflow-hidden bg-charcoal mb-3 relative">
                                {i.photo ? (
                                    <img
                                        src={i.photo}
                                        alt={i.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-ember opacity-40">
                                        <CowMascot size={80} />
                                    </div>
                                )}
                            </div>
                            {i.category && (
                                <div className="text-xs text-ash uppercase tracking-wider mb-1">
                                    {i.category.name}
                                </div>
                            )}
                            <h3 className="text-cream text-base mb-1">{i.name}</h3>
                            <div className="text-ember font-bold">{i.price} ₽</div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
