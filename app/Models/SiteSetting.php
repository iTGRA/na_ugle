<?php

namespace App\Models;

use App\Support\PageCache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Key-value хранилище настроек сайта.
 *
 * Кеш site_settings:all (1 час). Сбрасывается при каждом put().
 * Также сбрасывает PageCache::flushAll() чтобы страницы получили свежие данные.
 *
 * Использование:
 *   SiteSetting::get('phone')          // строка или null
 *   SiteSetting::bool('is_open')       // boolean
 *   SiteSetting::put('phone', '...')   // upsert + cache flush
 *   SiteSetting::allSettings()          // array key=>value (кешированный)
 */
class SiteSetting extends Model
{
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['key', 'value'];

    protected const CACHE_KEY = 'site_settings:all';
    protected const CACHE_TTL = 3600;

    protected static function booted(): void
    {
        $flush = function (): void {
            Cache::forget(self::CACHE_KEY);
            PageCache::flushAll();
        };
        static::saved($flush);
        static::deleted($flush);
    }

    /**
     * Return all settings as a plain [key => value] array (cached).
     */
    public static function allSettings(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, fn () =>
            static::query()->pluck('value', 'key')->all()
        );
    }

    public static function get(string $key, $default = null)
    {
        $all = static::allSettings();
        return $all[$key] ?? $default;
    }

    public static function put(string $key, $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    public static function bool(string $key, bool $default = false): bool
    {
        $value = static::get($key);
        if ($value === null) {
            return $default;
        }
        return in_array(strtolower((string) $value), ['1', 'true', 'on', 'yes'], true);
    }
}
