/**
 * CardLabSection — экспериментальный блок для тестирования 6 вариантов карточек блюд.
 * Временный. После выбора — лучший вариант переносится в основной каталог.
 */

const SAMPLE = {
    name: 'Свиные рёбра с соусом BBQ',
    description: 'Томлёные 6 часов, потом на хоспер. Соус BBQ собственного приготовления.',
    price: 650,
    category: 'Горячее',
    photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=85&auto=format&fit=crop',
    is_featured: true,
    is_chef_pick: true,
    chef_comment: 'Маринад — неделя. Обжарка — минуты.',
};

function CardVariant1({ item }) {
    return (
        <article
            className="bg-white p-3 pb-6"
            style={{ border: '2.5px solid var(--ink)', borderRadius: '10px', boxShadow: '6px 6px 0 var(--ink)' }}
        >
            <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '4/5', borderRadius: '4px' }}>
                <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 flex gap-1.5">
                    {item.is_featured && <span className="chip chip-hit" style={{ fontSize: '10px', padding: '3px 7px' }}>★ Хит</span>}
                    {item.is_chef_pick && <span className="chip chip-chef" style={{ fontSize: '10px', padding: '3px 7px' }}>👨‍🍳 Шеф</span>}
                </div>
            </div>
            <div className="px-1">
                <div className="t-label text-muted mb-1">{item.category}</div>
                <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="t-body font-bold leading-tight">{item.name}</h3>
                    <span className="font-bold whitespace-nowrap">{item.price} ₽</span>
                </div>
                <p className="t-small text-muted leading-snug">{item.description}</p>
            </div>
        </article>
    );
}

function CardVariant2({ item }) {
    return (
        <article className="pb-6" style={{ borderBottom: '1px solid var(--ink-15)' }}>
            <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '4/5', borderRadius: '2px' }}>
                <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                {item.is_featured && (
                    <div className="absolute top-0 right-0 px-3 py-1" style={{ background: 'var(--ink)', color: 'var(--paper)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Хит
                    </div>
                )}
            </div>
            <div className="t-label text-muted mb-1">{item.category}</div>
            <h3 className="t-body font-bold leading-tight mb-1">{item.name}</h3>
            <p className="t-small text-muted leading-snug mb-2">{item.description}</p>
            <span className="t-body font-bold">{item.price} ₽</span>
        </article>
    );
}

function CardVariant3({ item }) {
    return (
        <article className="relative overflow-hidden" style={{ aspectRatio: '3/4', borderRadius: '10px', border: '2.5px solid var(--ink)', boxShadow: '6px 6px 0 var(--ink)' }}>
            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,8,0.9) 0%, rgba(10,10,8,0.3) 50%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex gap-1.5 mb-2">
                    {item.is_featured && <span className="chip chip-hit" style={{ fontSize: '9px', padding: '2px 6px' }}>★ Хит</span>}
                    {item.is_chef_pick && <span className="chip chip-chef" style={{ fontSize: '9px', padding: '2px 6px' }}>👨‍🍳 Шеф</span>}
                </div>
                <div className="t-label mb-1" style={{ color: 'rgba(245,240,232,0.6)' }}>{item.category}</div>
                <h3 className="t-body font-bold leading-tight mb-1" style={{ color: 'var(--paper)' }}>{item.name}</h3>
                <p className="t-small leading-snug mb-2" style={{ color: 'rgba(245,240,232,0.7)' }}>{item.description}</p>
                <span className="t-body font-bold" style={{ color: '#F5C842' }}>{item.price} ₽</span>
            </div>
        </article>
    );
}

function CardVariant4({ item }) {
    return (
        <article
            className="p-3 pb-6"
            style={{ background: 'var(--paper)', border: '2.5px solid var(--ink)', borderRadius: '10px', boxShadow: '6px 6px 0 var(--ink)' }}
        >
            <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '4/5', borderRadius: '4px' }}>
                <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 flex gap-1.5">
                    {item.is_featured && <span className="chip chip-hit" style={{ fontSize: '10px', padding: '3px 7px' }}>★ Хит</span>}
                    {item.is_chef_pick && <span className="chip chip-chef" style={{ fontSize: '10px', padding: '3px 7px' }}>👨‍🍳 Шеф</span>}
                </div>
            </div>
            <div className="px-1">
                <div className="t-label text-muted mb-1">{item.category}</div>
                <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="t-body font-bold leading-tight">{item.name}</h3>
                    <span className="font-bold whitespace-nowrap">{item.price} ₽</span>
                </div>
                <p className="t-small text-muted leading-snug">{item.description}</p>
            </div>
        </article>
    );
}

function CardVariant5({ item }) {
    return (
        <article
            className="bg-white text-center p-3 pb-5"
            style={{ border: '3px solid var(--ink)', borderRadius: '0', boxShadow: '5px 5px 0 var(--ink)' }}
        >
            <div className="relative overflow-hidden mb-3" style={{ aspectRatio: '1/1' }}>
                <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 flex gap-1">
                    {item.is_featured && <span className="chip chip-hit" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '0' }}>★ ХИТ</span>}
                </div>
            </div>
            <div className="t-label text-muted mb-1">{item.category}</div>
            <h3 className="t-body font-bold leading-tight mb-1">{item.name}</h3>
            <p className="t-small text-muted leading-snug mb-3">{item.description}</p>
            <div
                className="inline-block px-4 py-1.5 font-bold t-body"
                style={{ border: '2px solid var(--ink)', background: 'var(--ink)', color: 'var(--paper)' }}
            >
                {item.price} ₽
            </div>
        </article>
    );
}

function CardVariant6({ item }) {
    return (
        <article
            className="relative overflow-hidden"
            style={{ aspectRatio: '4/5', borderRadius: '10px', border: '2.5px solid var(--ink)', boxShadow: '6px 6px 0 var(--ink)' }}
        >
            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
            {/* Bottom bar */}
            <div
                className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4"
                style={{ background: 'linear-gradient(to top, var(--ink) 0%, rgba(10,10,8,0.85) 60%, transparent 100%)', paddingTop: '60px' }}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex gap-1.5 mb-1">
                        {item.is_featured && <span className="chip chip-hit" style={{ fontSize: '9px', padding: '2px 6px' }}>★ Хит</span>}
                    </div>
                    <h3 className="font-bold leading-tight" style={{ color: 'var(--paper)', fontSize: '15px' }}>{item.name}</h3>
                    <p className="t-small mt-1 leading-snug" style={{ color: 'rgba(245,240,232,0.65)' }}>{item.description}</p>
                </div>
                <div
                    className="flex-shrink-0 ml-3 px-3 py-2 font-bold"
                    style={{ background: 'var(--paper)', color: 'var(--ink)', borderRadius: '6px', fontSize: '14px' }}
                >
                    {item.price} ₽
                </div>
            </div>
        </article>
    );
}

const VARIANTS = [
    { Component: CardVariant1, name: '01 · Classic Polaroid', desc: 'Текущий стиль + описание + фото 4:5' },
    { Component: CardVariant2, name: '02 · Minimal Flat', desc: 'Без бордера/тени, hairline снизу, чистый' },
    { Component: CardVariant3, name: '03 · Magazine Editorial', desc: 'Фото 3:4 fullbleed, текст поверх с gradient' },
    { Component: CardVariant4, name: '04 · Paper Polaroid', desc: 'Как 01, но фон карточки = фон сайта (paper #F5F0E8)' },
    { Component: CardVariant5, name: '05 · Stamp', desc: 'Квадратное фото 1:1, центрировано, острые углы, цена-badge' },
    { Component: CardVariant6, name: '06 · Overlay Compact', desc: 'Фото 4:5 fullbleed, название + цена-badge внизу' },
];

export default function CardLabSection({ items = [] }) {
    const sample = items[0] ? {
        name: items[0].name,
        description: items[0].description || SAMPLE.description,
        price: items[0].price,
        category: items[0].category?.name || SAMPLE.category,
        photo: items[0].photo || SAMPLE.photo,
        is_featured: items[0].is_featured,
        is_chef_pick: items[0].is_chef_pick,
        chef_comment: items[0].chef_comment || SAMPLE.chef_comment,
    } : SAMPLE;

    return (
        <section className="section bg-paper">
            <div className="shell">
                <div className="t-label text-muted mb-3">Лаборатория карточек</div>
                <h2 className="t-h2 mb-4">Выбери стиль карточки</h2>
                <p className="t-body text-muted mb-16">6 вариантов — одно и то же блюдо. Выбери лучший.</p>

                <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
                    {VARIANTS.map(({ Component, name, desc }) => (
                        <div key={name}>
                            <div className="t-label mb-2">{name}</div>
                            <p className="t-small text-muted mb-4">{desc}</p>
                            <div style={{ maxWidth: '360px' }}>
                                <Component item={sample} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
