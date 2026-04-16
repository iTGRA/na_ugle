# Архитектура проекта НА УГЛЕ

> Корпоративный сайт-лендинг + каталог меню ресторана «На Угле» (Самара).
> Версия документа: 2026-04-16

---

## Стек

| Слой | Технология | Версия |
|---|---|---|
| Backend | Laravel | 12.x |
| Frontend | React + Inertia.js (SSR) | React 19, Inertia 3 |
| Стили | Tailwind CSS 4 + custom CSS vars | app.css |
| Админка | Orchid Platform | 14.53 |
| БД | MySQL | 8.0 |
| Сервер | Ubuntu 24.04, Nginx, PHP-FPM 8.3, Node 20 | VDS |

---

## Структура каталогов

```
Na_Ugle_Project/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── HomeController.php       ← главная страница
│   │   │   ├── MenuController.php       ← страница /menu
│   │   │   ├── ReservationController.php← POST /reservation
│   │   │   └── Admin/
│   │   │       └── SettingsFileController.php ← загрузка PDF
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php ← shared props + footer data
│   │   └── Requests/
│   │       └── ReservationRequest.php    ← валидация формы брони
│   ├── Jobs/
│   │   └── SendReservationNotification.php ← Telegram + email
│   ├── Models/                           ← 7 Eloquent-моделей
│   ├── Orchid/
│   │   ├── PlatformProvider.php          ← меню админки
│   │   └── Screens/                      ← 13 кастомных экранов
│   └── Support/
│       └── PageCache.php                 ← хелпер сброса кеша
├── resources/
│   ├── css/app.css                       ← дизайн-система + брутализм
│   ├── js/
│   │   ├── Pages/Home.jsx, Menu.jsx      ← Inertia-страницы
│   │   └── Components/                   ← 12 React-компонентов
│   └── views/
│       ├── app.blade.php                 ← корневой Inertia-template
│       └── orchid/                       ← кастомные partial'ы для Orchid
├── routes/
│   ├── web.php                           ← 3 публичных маршрута
│   └── platform.php                      ← ~30 маршрутов админки
├── database/
│   ├── migrations/                       ← 8 кастомных миграций
│   └── seeders/                          ← NaUgleSeeder, MenuItemsSeeder
├── public/
│   ├── images/                           ← SVG-логотипы (5 файлов)
│   ├── files/                            ← PDF меню (загружается через админку)
│   └── build/                            ← Vite-сборка (JS/CSS)
├── docs/                                 ← эта документация
├── CLAUDE.md                             ← инструкции для ИИ-агентов
└── BRIEF.md                              ← бриф проекта
```

---

## Модели данных

### Схема БД (7 таблиц + Orchid)

```
hero_slides          menu_categories ──┐
  id                   id              │
  photo                name            │
  title                slug (unique)   │
  slogan (per-slide)   icon            │
  subtitle             sort_order      │
  cta_text             is_active       │
  cta_url                              │
  sort_order         menu_items ◄──────┘
  is_active            id
                       category_id (FK → menu_categories.id CASCADE)
gallery_photos         photo
  id                   name
  photo                description
  section (enum)       price
  alt_text             is_featured ← попадает в «Хиты» на главной
  sort_order           is_chef_pick ← попадает в «Рекомендации шефа»
  is_active            chef_comment
                       is_available ← скрыть/показать на сайте
chef_profiles          sort_order
  id
  name               reservations
  position             id
  photo                name, phone
  bio_text             date, time
  quote                guests
  facts (JSON)         comment
  lavolt_note          status (enum: new/confirmed/cancelled)
  is_active

site_settings ← key-value store
  key (PK, string)
  value (longtext)
```

### Ключи SiteSetting

| Группа | Ключи |
|---|---|
| Режим | is_open, announcement_text |
| Контакты | address, phone, work_hours, season |
| Манифест | manifesto_headline, manifesto_text, durnyasha_quote |
| Заголовки секций | gallery_headline, hits_headline, chef_picks_headline, contacts_headline |
| Карты/соцсети | how_to_find, yandex_maps_url, 2gis_url, map_embed, instagram_url, telegram_url |
| PDF | menu_pdf, bar_menu_pdf, wine_card_pdf |
| Уведомления | notification_email, telegram_bot_token, telegram_chat_id |

---

## Маршруты

### Публичные (routes/web.php)

```
GET  /             → HomeController@index    (лендинг, Inertia SSR)
GET  /menu         → MenuController@index    (полное меню, Inertia SSR)
POST /reservation  → ReservationController@store (сохранение + Telegram/Email)
```

### Админка (routes/platform.php, префикс /admin)

Полный список в `docs/ADMIN_GUIDE.md`. Ключевые:
- `/admin/main` — дашборд
- `/admin/hero-slides` — управление Hero-слайдами
- `/admin/menu/categories` + `/admin/menu/items` — меню
- `/admin/gallery` — галерея
- `/admin/chef` — шеф-повар
- `/admin/reservations` — заявки
- `/admin/settings` — настройки сайта (6 вкладок)
- `/admin/settings/upload-pdf/{key}` — POST-endpoint загрузки PDF

---

## Кеширование

Три уровня кеша (driver: `database`):

| Ключ | TTL | Что кешируется | Когда сбрасывается |
|---|---|---|---|
| `home.page.v1` | 5 мин | Все данные главной страницы | При save/delete любой модели через `PageCache::flushHome()` |
| `menu.page.v1` | 5 мин | Все данные страницы /menu | При изменении MenuItem/MenuCategory через `PageCache::flushMenu()` |
| `footer.shared.v1` | 10 мин | Shared footer props (телефон, категории) | При любом изменении через `PageCache::flushAll()` |
| `site_settings:all` | 1 час | Все ключи SiteSetting | При `SiteSetting::put()` |

**Механизм автоинвалидации:** каждая модель (HeroSlide, MenuItem, MenuCategory, GalleryPhoto, ChefProfile, SiteSetting) имеет `booted()` hook, вызывающий `PageCache::flush*()` при `saved` / `deleted`.

---

## SSR (Server-Side Rendering)

Inertia SSR работает через Node.js daemon:

```
systemctl status na-ugle-ssr
→ /usr/bin/node bootstrap/ssr/ssr.js
→ 127.0.0.1:13714
```

Конфиг: `.env` → `INERTIA_SSR_ENABLED=true`, `INERTIA_SSR_URL=http://127.0.0.1:13714`.

SSR-бандл: `bootstrap/ssr/ssr.js` (генерируется `npx vite build --ssr`).

**Маркер SSR в HTML:** `data-server-rendered="true"` на `<div id="app">`.

---

## Принятые соглашения

### PHP
- Контроллеры тонкие, логика в моделях и `PageCache` хелпере.
- Все public-свойства в Orchid Screen — `?nullable = null` (см. «Выращенные правила» в CLAUDE.md).
- Валидация — через FormRequest классы.
- Все секреты в `.env`, никаких хардкодов.

### React/Inertia
- SSR-safe: никакого `window`/`document` без `typeof window !== 'undefined'`.
- Форма: `useForm` от `@inertiajs/react`.
- Tailwind + CSS-переменные для брендовых цветов.
- Компоненты: функциональные, named default export.

### Кеш
- Все модели с `booted()` сбрасывают `PageCache`.
- SQL UPDATE напрямую (без Eloquent) **не триггерит** hooks → нужен ручной `PageCache::flushAll()`.
