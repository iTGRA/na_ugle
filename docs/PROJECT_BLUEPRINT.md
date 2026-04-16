# Проект «НА УГЛЕ» — техническое описание для масштабирования

## Назначение документа

Это описание одного типового проекта из портфеля. Используй его как шаблон для понимания архитектуры, процессов поддержки и управления 10-100 аналогичных сайтов ресторанов/бизнесов. Каждый проект строится по единому стеку, но имеет свой контент, домен и визуальную систему.

---

## 1. ОБЗОР ПРОЕКТА

**Тип:** корпоративный сайт-лендинг + каталог меню ресторана
**Клиент:** Pop-up гриль-бистро «НА УГЛЕ», Самара
**URL:** https://landing.swipeandev.ru
**Админка:** https://landing.swipeandev.ru/admin
**Репозиторий:** https://github.com/iTGRA/na_ugle (ветка v0.2 — текущая, v0.1 — тег бэкапа)

**Что умеет сайт:**
- Лендинг с 6 секциями (hero-манифест, галерея, меню-хиты, шеф, контакты)
- Полный каталог меню на отдельной странице (/menu) с фильтрами и мобильными каруселями
- Бронирование — через телефонный звонок (кнопка tel:)
- Весь контент управляется из Orchid-админки (тексты, фото, меню, настройки)
- SSR (Server-Side Rendering) для SEO

---

## 2. СТЕК (единый для всех проектов)

```
Backend:   Laravel 12.x
Frontend:  React 19 + Inertia.js 3 (SSR)
Стили:     Tailwind CSS 4 + кастомные CSS-переменные
Админка:   Orchid Platform 14.53
БД:        MySQL 8.0
Сервер:    Ubuntu 24.04, Nginx 1.24, PHP-FPM 8.3, Node 20
SSL:       Let's Encrypt (certbot auto-renew)
Git:       GitHub (private repo)
```

**Почему этот стек для масштаба:**
- Laravel + Orchid = быстрая админка без кастомного SPA (экономия 60% времени на CRUD)
- Inertia.js = React-фронтенд без REST API (один роутинг, один деплой)
- SSR = SEO из коробки (важно для ресторанов — Google Maps, локальный поиск)
- MySQL + database cache = просто, не нужен Redis для маленьких проектов
- Один VDS может держать 5-10 таких сайтов (Nginx vhosts, отдельные PHP-FPM pools)

---

## 3. АРХИТЕКТУРА (типовая для каждого проекта)

### Маршруты
```
GET  /             → HomeController     (лендинг, кешируется 5 мин)
GET  /menu         → MenuController     (каталог, кешируется 5 мин)
POST /reservation  → ReservationController (заявка → Telegram + Email)
/admin/*           → Orchid Platform    (13 экранов, авторизация)
```

### Модели данных (7 таблиц)
```
hero_slides       — слайды/баннеры (фото, слоган, CTA)
menu_categories   — категории меню (10 шт)
menu_items        — блюда (78 шт, фото, цена, флаги hit/chef)
gallery_photos    — фото атмосферы (секции: atmosphere/dishes/team)
chef_profiles     — профиль шефа (singleton)
reservations      — заявки на бронь (имя, телефон, дата, статус)
site_settings     — key-value хранилище (23+ ключа: тексты, URL'ы, PDF, контакты)
```

### Кеширование (3 уровня, driver: database)
```
home.page.v1      — 5 мин, вся главная страница
menu.page.v1      — 5 мин, вся страница меню
footer.shared.v1  — 10 мин, shared data для футера
site_settings:all — 1 час, все настройки
```
**Автоинвалидация:** каждая модель через `booted()` вызывает `PageCache::flush*()` при save/delete. Контент-менеджер сохраняет в админке → кеш сбрасывается → сайт обновляется мгновенно.

### Orchid-админка (13 экранов)
```
/admin/main              — дашборд (метрики, quick-actions, баннер, статус ресторана)
/admin/hero-slides       — hero-слайдер (per-slide слоган, фото Cropper 1920×1080)
/admin/menu/categories   — 10 категорий меню
/admin/menu/items        — 78 блюд (фильтры: категория, доступность, хит/шеф/без фото)
/admin/gallery           — фото атмосферы (3 секции)
/admin/chef              — профиль шефа (singleton)
/admin/reservations      — заявки
/admin/settings          — 8 вкладок (основное, манифест, заголовки, контакты, PDF, изображения, футер, уведомления)
```

### React-компоненты (12 штук)
```
Pages:      Home.jsx, Menu.jsx
Layout:     Header.jsx, Footer.jsx
Sections:   ManifestoSection, GallerySection, MenuHitsSection, ChefSection, ContactsSection
UI:         AnnouncementBar, CowMascot, FilmstripGallery, MenuCardCarousel
```

---

## 4. ДИЗАЙН-СИСТЕМА

### Концепция
Минималистичный neo-brutalist editorial стиль. Монохромный (кремовый + чёрный), один моноширинный шрифт, жёсткие тени, никаких градиентов и цветовых акцентов кроме чипов-меток.

### Палитра
```
--paper:  #F5F0E8   кремовый — основной фон
--ink:    #0A0A08   почти чёрный — текст, обводки, тени
--ink-60: #5C5C58   вторичный текст
--ink-15: rgba(10,10,8,0.15)  hairline-разделители
```
Цвет только в чипах: #F5C842 (Хит), #E8721C (Шеф), #B8E04E (Новинка), #E54B2A (Острое).

### Типографика
Единственный шрифт: **Courier New Cyr** (моноширинный). Вариации через размер, жирность (400/700), uppercase.
```
t-label:      11px, uppercase, 700, letter-spacing 0.14em
t-small:      13px, 400
t-body:       16px, 400
t-body-large: clamp(1rem–1.15rem), 400
t-h3:         clamp(1.15rem–1.4rem), 700
t-h2:         clamp(1.5rem–2.5rem), 700
t-h1:         clamp(1.6rem, min(4.5vw, 5vh), 4rem), 700
```

### Кнопки (neo-brutalist)
Все кнопки: border 2.5px, border-radius 10px, box-shadow Npx. Hover = translate + уменьшенная тень.
```
.btn               — white fill, ink border (primary, светлый фон)
.btn-secondary     — transparent → ink hover (secondary, светлый фон)
.btn-sm            — компактный модификатор
.btn-light         — paper fill, ink shadow (hero, тёмный фон)
.btn-light-secondary — ink fill (hero secondary)
Footer btns        — paper fill, ink border, subtle paper shadow
```

### Карточки блюд (Paper Polaroid)
```
background: var(--paper)
border: 2.5px solid var(--ink)
border-radius: 10px
box-shadow: 6px 6px 0 var(--ink)
padding: 12px, bottom 24px
Фото: aspect-ratio 4:5, border-radius 4px
Hover: translate(2,2) + shadow 4×4
```

### Чипы-метки
```
border: 2px solid var(--ink)
border-radius: 6px
box-shadow: 3px 3px 0 var(--ink)
font: 11px, 700, uppercase
```

---

## 5. СЕРВЕРНАЯ ИНФРАСТРУКТУРА

### Текущий сервер
```
IP:          85.236.186.16
OS:          Ubuntu 24.04 LTS
SSH:         ssh na-ugle (alias, key-based, passwordless sudo)
App path:    /var/www/na-ugle
Nginx:       /etc/nginx/sites-available/na-ugle
SSR daemon:  systemctl status na-ugle-ssr (Node на 127.0.0.1:13714)
PHP limits:  upload 25M, post 30M
SSL:         certbot, auto-renew timer
```

### Деплой (ручной, ~30 секунд)
```bash
ssh na-ugle
cd /var/www/na-ugle
git pull --ff-only
npm run build && npx vite build --ssr
php artisan cache:clear
sudo systemctl restart na-ugle-ssr
```

### Масштабирование на 10-100 проектов

**Вариант A — один VDS, несколько сайтов:**
```
/var/www/na-ugle/    → landing.swipeandev.ru
/var/www/project-2/  → site2.domain.ru
/var/www/project-3/  → site3.domain.ru
```
Каждый сайт = отдельный Nginx vhost + своя MySQL БД + свой SSR systemd unit.
Лимит: ~5-10 сайтов на 4GB RAM VDS.

**Вариант B — VDS per client:**
Проще изоляция, проще бэкапы. Дороже.

**Вариант C — Docker (для 20+ проектов):**
docker-compose per project, общий MySQL, Traefik как reverse proxy + auto-SSL.

---

## 6. КОНТЕНТ-МЕНЕДЖМЕНТ

### Что менять и где

| На сайте | Где в админке | Как часто |
|---|---|---|
| Баннер «Открыты / закрыты» | Дашборд (один клик) | Ежедневно |
| Блюда, цены, наличие | /admin/menu/items | Ежедневно |
| Фото галереи | /admin/gallery | Еженедельно |
| Hero-слоган и фото | /admin/hero-slides | Ежемесячно |
| Тексты манифеста | /admin/settings → Манифест | Редко |
| PDF меню | /admin/settings → PDF (файл) | При обновлении |
| Контакты, часы, соцсети | /admin/settings → Основное | Редко |
| Логотип футера | /admin/settings → Изображения | Редко |

### Типичный день контент-менеджера
1. Утро: `/admin/main` → «🟢 РЕСТОРАН ОТКРЫТ»
2. Блюдо закончилось → снять тоггл «В наличии»
3. Вечер: «🔴 РЕСТОРАН ЗАКРЫТ»

---

## 7. МОНИТОРИНГ

```bash
# Сайт живой?
curl -sS -o /dev/null -w "%{http_code}" https://landing.swipeandev.ru/

# SSR работает?
curl -sS https://landing.swipeandev.ru/ | grep -q "data-server-rendered"

# Ошибки?
ssh na-ugle 'tail -20 /var/www/na-ugle/storage/logs/laravel.log | grep ERROR'

# SSL?
ssh na-ugle 'sudo certbot certificates'

# Диск?
ssh na-ugle 'df -h /'
```

### Типичные проблемы
| Проблема | Решение |
|---|---|
| 500 на сайте | `tail storage/logs/laravel.log` |
| Фото не грузятся | PHP upload limit, проверить fpm conf |
| Sticky не работает | `overflow-x: clip` вместо `hidden` |
| Настройки не сохраняются | Вложенные `<form>` → JS fetch |
| Orchid Screen 500 | `public ?Model $prop = null;` |

---

## 8. ВЕРСИОНИРОВАНИЕ

```
main   — стабильная версия (v0.1 — тег)
v0.2   — текущая рабочая ветка
```
Откат: `git checkout v0.1 && npm run build && npx vite build --ssr && systemctl restart na-ugle-ssr`

---

## 9. ВЫРАЩЕННЫЕ ПРАВИЛА (из инцидентов)

1. **Orchid Screen typed properties** → всегда `?nullable = null`
2. **overflow-x** → `clip`, не `hidden` (ломает sticky)
3. **Вложенные `<form>` в Orchid** → JS fetch
4. **Кеш после SQL UPDATE** → `PageCache::flushAll()` вручную
5. **Unsplash фото** → могут удалиться, проверять URL'ы

---

## 10. ШАБЛОН ДЛЯ НОВОГО ПРОЕКТА

```bash
# 1. Клонировать
git clone https://github.com/iTGRA/na_ugle new-project

# 2. БД
mysql -e "CREATE DATABASE new_project CHARACTER SET utf8mb4;"

# 3. .env
cp .env.example .env && php artisan key:generate
# Сменить APP_NAME, APP_URL, DB_DATABASE

# 4. Миграции + сидеры
php artisan migrate --force && php artisan db:seed --class=NaUgleSeeder

# 5. Admin user
php artisan orchid:admin admin admin@new-project.ru password

# 6. Заменить: логотипы /public/images/, палитру в app.css
# 7. Nginx vhost + SSL + SSR systemd unit
# 8. Deploy
```

**Время на новый проект из шаблона:** ~2-4 часа.

---

*Документ: 2026-04-17. При изменении стека — обновлять.*
