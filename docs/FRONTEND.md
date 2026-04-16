# Frontend: React + Дизайн-система НА УГЛЕ

> Inertia.js SSR, Tailwind CSS 4, neo-brutalist UI.
> Версия: 2026-04-16

---

## Дерево компонентов

```
resources/js/
├── Pages/
│   ├── Home.jsx          ← лендинг (10 секций)
│   └── Menu.jsx          ← полное меню с фильтрами
├── Components/
│   ├── Layout/
│   │   ├── Header.jsx    ← sticky header (лого, нав, телефон, CTA)
│   │   └── Footer.jsx    ← футер (карта сайта, кнопки, категории)
│   ├── Hero/
│   │   └── HeroSection.jsx ← слайдер с авто-ротацией + stories-прогресс
│   ├── Sections/
│   │   ├── ManifestoSection.jsx  ← «Честная еда…» + Дурняша + PDF
│   │   ├── GallerySection.jsx    ← masonry-галерея атмосферы
│   │   ├── MenuHitsSection.jsx   ← 3-col grid хитов меню
│   │   ├── ChefSection.jsx       ← профиль шефа + факты + цитата
│   │   ├── ChefPicksSection.jsx  ← рекомендации шефа (charcoal bg)
│   │   ├── ContactsSection.jsx   ← адрес, телефон-кнопка, карта
│   │   └── ReservationSection.jsx ← форма брони (сейчас не используется)
│   └── UI/
│       ├── AnnouncementBar.jsx   ← баннер «Сегодня открыты»
│       └── CowMascot.jsx        ← SVG маскот Дурняша
├── app.jsx               ← client entry (hydration)
├── ssr.jsx               ← SSR entry (renderToString)
└── bootstrap.js          ← axios defaults
```

---

## Порядок секций на главной (Home.jsx)

```
<div sticky>
  <AnnouncementBar />
  <Header variant="solid" />
</div>
<main>
  1. <HeroSection />       ← слайдер с per-slide слоганом
  2. <ManifestoSection />   ← cow-vert + заголовок + текст + Дурняша
  3. <GallerySection />     ← masonry-фото атмосферы
  4. <MenuHitsSection />    ← карточки хитов + «Скачать меню»
  5. <ChefSection />        ← фото шефа + био + цитата + факты
  6. <ChefPicksSection />   ← рекомендации шефа (charcoal)
  7. <ContactsSection />    ← адрес, телефон, карта
</main>
<Footer />
```

---

## Дизайн-система (app.css)

### Палитра

```css
--paper:    #F5F0E8   /* кремовый фон — основной */
--ink:      #0A0A08   /* почти чёрный — текст, обводка, тени */
--ink-60:   #5C5C58   /* вторичный текст */
--ink-15:   rgba(10,10,8,0.15)  /* hairline-разделители */
```

### Типографика

Единственный шрифт: **Courier New Cyr** (моноширинный). Вариации только через размер и жирность.

| Класс | Размер | Вес | Назначение |
|---|---|---|---|
| `.t-label` | 11px, uppercase, letter-spacing 0.14em | 700 | Метки, навигация, чипы |
| `.t-small` | 13px | 400 | Мелкий текст, подписи |
| `.t-body` | 16px | 400 | Основной текст |
| `.t-body-large` | clamp(1rem, 1.2vw, 1.15rem) | 400 | Описания секций |
| `.t-h3` | clamp(1.15rem, 1.8vw, 1.4rem) | 700 | Подзаголовки |
| `.t-h2` | clamp(1.5rem, 3.4vw, 2.5rem) | 700 | Заголовки секций |
| `.t-h1` | clamp(2rem, 5.2vw, 4rem) | 700 | Hero-слоган |

### Кнопки (neo-brutalist)

Все кнопки: `border-radius: 10px`, `border: 2.5px solid`, `box-shadow: Npx Npx 0`, hover = translate + меньшая тень (эффект «нажатия»).

| Класс | Фон | Обводка/тень | Контекст |
|---|---|---|---|
| `.btn` | white | ink | Светлый фон (основной) |
| `.btn-secondary` | transparent → ink on hover | ink | Outline на светлом фоне |
| `.btn-sm` | модификатор размера | 4×4 тень | Компактные CTA |
| `.btn-light` | paper | ink | Hero (тёмное фото) |
| `.btn-light-secondary` | ink | ink | Hero secondary |
| `.btn-on-ink` | paper | paper | Инвертированные секции (футер) |
| `.btn-on-ink-secondary` | transparent | paper | Инвертированные outline |

### Чипы (метки блюд)

| Класс | Цвет | Hex | Назначение |
|---|---|---|---|
| `.chip-hit` | sunflower yellow | `#F5C842` | ★ Хит |
| `.chip-chef` | ember orange | `#E8721C` | 👨‍🍳 Шеф |
| `.chip-new` | leaf green | `#B8E04E` | Новинка (заготовка) |
| `.chip-spicy` | hot red | `#E54B2A` | Острое (заготовка) |

### Карточки блюд (Paper Polaroid — v0.2)

Выбран вариант «Paper Polaroid» (из 6 протестированных): фон карточки = фон сайта (paper), не белый.

```css
background: var(--paper);     /* #F5F0E8 — сливается с фоном, бордер создаёт форму */
border: 2.5px solid var(--ink);
border-radius: 10px;
box-shadow: 6px 6px 0 var(--ink);
padding: 12px, bottom 24px;
/* hover: translate(2,2) + shadow 4×4 */
```

Фото внутри: `aspect-ratio: 4/5` (вертикальное), `border-radius: 4px`, без бордера.
Чипы (Хит/Шеф) в левом верхнем углу фото.
Текст: категория (t-label) → название + цена → описание.
Мобильная карусель: тот же стиль, ширина 78vw, snap-to-card.

### Контейнеры

| Класс | Max-width | Назначение |
|---|---|---|
| `.shell` | 1240px + px-24 | Основной контейнер |
| `.shell-narrow` | 880px + px-24 | Узкий (манифест, настройки) |
| `.section` | padding-y: 96px (mobile 64px) | Вертикальный ритм секций |

---

## SSR-совместимость

**Правила для компонентов:**
- Не использовать `window`, `document`, `localStorage` без `typeof window !== 'undefined'`
- `useEffect` — для browser-only логики (scroll events, IntersectionObserver)
- `useState` initial value — НЕ читать из `localStorage` (SSR получит другое значение)
- `dangerouslySetInnerHTML` допустим только для проверенного контента из admin (bio_text, map_embed)

---

## Важные паттерны

### Фильтрация на /menu — клиентская

```jsx
// Menu.jsx — useMemo фильтрует items без обращения к серверу
const filteredCategories = useMemo(() => {
    if (!activeFilter) return categories;
    return categories
        .map(c => ({ ...c, items: c.items.filter(i => ...) }))
        .filter(c => c.items.length > 0);
}, [categories, activeFilter]);
```

### Shared Inertia data

`HandleInertiaRequests::share()` отдаёт `siteFooter` — категории + телефон + PDF URL. Footer берёт через `usePage().props.siteFooter`.

### Изображения

- Hero: Cropper 1920×1080 (хранится URL в БД — relative или Unsplash)
- Menu items: Picture field (хранится URL)
- Gallery: Picture (mixed orientations for masonry)
- Логотипы: SVG в `/public/images/` (оптимизированы SVGO)
