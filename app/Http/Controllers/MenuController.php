<?php

namespace App\Http\Controllers;

use App\Models\MenuCategory;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(): Response
    {
        $data = Cache::remember('menu.page.v1', 300, function () {
            $categories = MenuCategory::active()
                ->with(['items' => fn ($q) => $q->available()->orderBy('sort_order')])
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                    'icon' => $c->icon,
                    'items' => $c->items->map(fn ($i) => [
                        'id' => $i->id,
                        'name' => $i->name,
                        'description' => $i->description,
                        'price' => $i->price,
                        'photo' => $i->photo,
                    ])->all(),
                ])
                ->filter(fn ($c) => count($c['items']) > 0)
                ->values()
                ->all();

            return [
                'categories' => $categories,
                'phone' => SiteSetting::get('phone'),
                'address' => SiteSetting::get('address'),
            ];
        });

        return Inertia::render('Menu', $data)->withViewData([
            'title' => 'Меню — НА УГЛЕ',
            'description' => 'Полное меню ресторана НА УГЛЕ. Гриль, колбасы, закуски, десерты.',
        ]);
    }
}
