<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

class PageCache
{
    public const HOME = 'home.page.v1';
    public const MENU = 'menu.page.v1';

    public static function flushAll(): void
    {
        Cache::forget(self::HOME);
        Cache::forget(self::MENU);
    }

    public static function flushHome(): void
    {
        Cache::forget(self::HOME);
    }

    public static function flushMenu(): void
    {
        Cache::forget(self::MENU);
    }
}
