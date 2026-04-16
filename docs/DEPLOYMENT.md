# Деплой и инфраструктура НА УГЛЕ

> Сервер: VDS 85.236.186.16 (Ubuntu 24.04 LTS)
> Домен: landing.swipeandev.ru
> Версия: 2026-04-16

---

## Сервер

| Параметр | Значение |
|---|---|
| OS | Ubuntu 24.04.4 LTS, x86_64 |
| Web | Nginx 1.24 |
| PHP | 8.3-FPM (socket: /run/php/php8.3-fpm.sock) |
| Node | 20.20.2 (для SSR) |
| MySQL | 8.0.45 |
| Firewall | UFW: SSH + HTTP + HTTPS |
| SSL | Let's Encrypt (certbot auto-renew) |

### SSH-доступ

```bash
ssh na-ugle    # alias в ~/.ssh/config
# User: claude, passwordless sudo
```

### Пути на сервере

```
/var/www/na-ugle/              # Laravel root
/var/www/na-ugle/public/       # webroot (Nginx)
/var/www/na-ugle/storage/logs/ # логи Laravel
/etc/nginx/sites-available/na-ugle  # Nginx vhost
/etc/systemd/system/na-ugle-ssr.service  # SSR daemon
/etc/php/8.3/fpm/conf.d/99-na-ugle-uploads.ini  # PHP upload limits
```

---

## Деплой (ручной)

```bash
ssh na-ugle
cd /var/www/na-ugle

# 1. Забрать код
git pull --ff-only

# 2. Backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force

# 3. Frontend
npm ci
npm run build           # client bundle
npx vite build --ssr    # SSR bundle

# 4. Кеш
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan cache:clear

# 5. Перезапуск
sudo systemctl restart na-ugle-ssr php8.3-fpm
sudo systemctl reload nginx
```

### Быстрый деплой (без зависимостей)

Если менялись только JSX/CSS/Blade:

```bash
ssh na-ugle
cd /var/www/na-ugle
git pull --ff-only
npm run build && npx vite build --ssr
php artisan cache:clear
sudo systemctl restart na-ugle-ssr
```

---

## Systemd-сервисы

### SSR daemon

```ini
# /etc/systemd/system/na-ugle-ssr.service
[Service]
Type=simple
User=claude
WorkingDirectory=/var/www/na-ugle
ExecStart=/usr/bin/node bootstrap/ssr/ssr.js
Restart=always
RestartSec=3
Environment=NODE_ENV=production
```

```bash
sudo systemctl status na-ugle-ssr
sudo systemctl restart na-ugle-ssr
journalctl -u na-ugle-ssr -f    # логи SSR
```

---

## Переменные окружения (.env)

Критичные для работы (не менять без понимания последствий):

```ini
APP_NAME="Na Ugle"
APP_URL=https://landing.swipeandev.ru
APP_ENV=production
APP_DEBUG=false

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=na_ugle
DB_USERNAME=na_ugle

CACHE_STORE=database
FILESYSTEM_DISK=local

INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL=http://127.0.0.1:13714
```

---

## SSL

```bash
sudo certbot certificates                    # проверить
sudo certbot renew --dry-run                 # тест продления
# auto-renew: systemd timer certbot.timer
```

---

## Бэкапы

**TODO:** настроить nightly MySQL dump в `/var/backups/mysql/`.

Ручной бэкап:
```bash
DB_PASS=$(grep ^DB_PASSWORD /var/www/na-ugle/.env | cut -d= -f2)
mysqldump -u na_ugle -p"$DB_PASS" na_ugle > /tmp/na_ugle_$(date +%Y%m%d).sql
```

---

## Troubleshooting

### Сайт отдаёт 500

```bash
tail -50 /var/www/na-ugle/storage/logs/laravel.log
```

### Фото не загружаются в админке

```bash
# Проверить лимиты PHP
php-fpm8.3 -i | grep upload_max_filesize
# Должно быть 25M
cat /etc/php/8.3/fpm/conf.d/99-na-ugle-uploads.ini
# Проверить Nginx
grep client_max_body_size /etc/nginx/sites-available/na-ugle
# Должно быть 50M
```

### SSR не работает

```bash
sudo systemctl status na-ugle-ssr
# Если failed:
sudo systemctl restart na-ugle-ssr
# Проверить бандл:
ls -la /var/www/na-ugle/bootstrap/ssr/ssr.js
# Пересобрать:
cd /var/www/na-ugle && npx vite build --ssr
```

### Sticky не работает

Проверить что в `app.css` стоит `overflow-x: clip` (НЕ `hidden`) на `html, body`. См. правило в CLAUDE.md.

### Настройки не сохраняются из админки

Проверить нет ли вложенных `<form>` тегов в кастомных Blade-partial'ах Orchid. Вложенные формы ломают основную форму экрана.

### Кеш не сбрасывается

```bash
cd /var/www/na-ugle
php artisan cache:clear
# Или точечно:
php artisan tinker --execute "App\Support\PageCache::flushAll();"
```
