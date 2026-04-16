<?php

namespace App\Http\Middleware;

use App\Models\MenuCategory;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'flash' => [
                'reservation_success' => fn () => $request->session()->get('reservation_success'),
            ],
            'siteFooter' => fn () => Cache::remember('footer.shared.v1', 600, function () {
                $s = SiteSetting::allSettings();
                return [
                    'phone' => $s['phone'] ?? null,
                    'address' => $s['address'] ?? null,
                    'work_hours' => $s['work_hours'] ?? null,
                    'season' => $s['season'] ?? null,
                    'instagram_url' => $s['instagram_url'] ?? null,
                    'telegram_url' => $s['telegram_url'] ?? null,
                    'menu_pdf' => $s['menu_pdf'] ?? null,
                    'footer_logo' => $s['footer_logo'] ?? null,
                    'footer_tagline' => $s['footer_tagline'] ?? null,
                    'categories' => MenuCategory::query()
                        ->where('is_active', true)
                        ->orderBy('sort_order')
                        ->get(['id', 'name', 'slug', 'icon'])
                        ->map(fn ($c) => ['name' => $c->name, 'slug' => $c->slug, 'icon' => $c->icon])
                        ->all(),
                ];
            }),
        ];
    }
}
