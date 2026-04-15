<?php

namespace App\Http\Controllers;

use App\Models\ChefProfile;
use App\Models\GalleryPhoto;
use App\Models\HeroSlide;
use App\Models\MenuItem;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $data = Cache::remember('home.page.v1', 300, function () {
            $s = SiteSetting::allSettings();

            return [
                'settings' => [
                    'is_open' => SiteSetting::bool('is_open'),
                    'announcement_text' => $s['announcement_text'] ?? null,
                    'address' => $s['address'] ?? null,
                    'phone' => $s['phone'] ?? null,
                    'work_hours' => $s['work_hours'] ?? null,
                    'season' => $s['season'] ?? null,
                    'hero_slogan' => $s['hero_slogan'] ?? null,
                    'hero_description' => $s['hero_description'] ?? null,
                    'durnyasha_quote' => $s['durnyasha_quote'] ?? null,
                    'manifesto_headline' => $s['manifesto_headline'] ?? null,
                    'manifesto_text' => $s['manifesto_text'] ?? null,
                    'how_to_find' => $s['how_to_find'] ?? null,
                    'instagram_url' => $s['instagram_url'] ?? null,
                    'telegram_url' => $s['telegram_url'] ?? null,
                    'yandex_maps_url' => $s['yandex_maps_url'] ?? null,
                    '2gis_url' => $s['2gis_url'] ?? null,
                    'map_embed' => $s['map_embed'] ?? null,
                    'menu_pdf' => $s['menu_pdf'] ?? null,
                    'bar_menu_pdf' => $s['bar_menu_pdf'] ?? null,
                    'wine_card_pdf' => $s['wine_card_pdf'] ?? null,
                    'gallery_headline' => $s['gallery_headline'] ?? null,
                    'hits_headline' => $s['hits_headline'] ?? null,
                    'chef_picks_headline' => $s['chef_picks_headline'] ?? null,
                    'contacts_headline' => $s['contacts_headline'] ?? null,
                ],
                'heroSlides' => HeroSlide::active()->get()->map(fn ($s) => [
                    'id' => $s->id,
                    'photo' => $s->photo,
                    'title' => $s->title,
                    'subtitle' => $s->subtitle,
                    'cta_text' => $s->cta_text,
                    'cta_url' => $s->cta_url,
                ])->all(),
                'featuredItems' => MenuItem::with('category')
                    ->available()->featured()
                    ->orderBy('sort_order')
                    ->limit(12)
                    ->get()
                    ->map(fn ($i) => $this->mapItem($i))
                    ->all(),
                'chefPicks' => MenuItem::with('category')
                    ->available()->chefPicks()
                    ->orderBy('sort_order')
                    ->limit(6)
                    ->get()
                    ->map(fn ($i) => $this->mapItem($i))
                    ->all(),
                'atmospherePhotos' => GalleryPhoto::active()->section('atmosphere')->get()
                    ->map(fn ($p) => ['id' => $p->id, 'photo' => $p->photo, 'alt' => $p->alt_text])
                    ->all(),
                'teamPhotos' => GalleryPhoto::active()->section('team')->get()
                    ->map(fn ($p) => ['id' => $p->id, 'photo' => $p->photo, 'alt' => $p->alt_text])
                    ->all(),
                'chef' => $this->mapChef(ChefProfile::active()->first()),
            ];
        });

        return Inertia::render('Home', $data)->withViewData([
            'title' => 'НА УГЛЕ — Гриль-бистро на набережной Самары',
            'description' => 'Летний pop-up ресторан с хоспером и авторскими колбасами. Набережная Волги. Открыты май — сентябрь.',
        ]);
    }

    protected function mapItem(MenuItem $i): array
    {
        return [
            'id' => $i->id,
            'name' => $i->name,
            'description' => $i->description,
            'price' => $i->price,
            'photo' => $i->photo,
            'chef_comment' => $i->chef_comment,
            'is_featured' => (bool) $i->is_featured,
            'is_chef_pick' => (bool) $i->is_chef_pick,
            'category' => $i->category ? ['id' => $i->category->id, 'name' => $i->category->name, 'slug' => $i->category->slug] : null,
        ];
    }

    protected function mapChef(?ChefProfile $chef): ?array
    {
        if (!$chef) return null;
        return [
            'name' => $chef->name,
            'position' => $chef->position,
            'photo' => $chef->photo,
            'bio_text' => $chef->bio_text,
            'quote' => $chef->quote,
            'facts' => $chef->facts ?? [],
            'lavolt_note' => $chef->lavolt_note,
        ];
    }
}
