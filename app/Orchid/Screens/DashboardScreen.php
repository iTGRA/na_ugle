<?php

namespace App\Orchid\Screens;

use App\Models\ChefProfile;
use App\Models\GalleryPhoto;
use App\Models\HeroSlide;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Reservation;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Layouts\Rows;
use Orchid\Screen\Screen;
use Orchid\Screen\Sight;
use Orchid\Screen\TD;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class DashboardScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'is_open' => SiteSetting::bool('is_open'),
            'announcement_text' => SiteSetting::get('announcement_text', ''),
            'metrics' => [
                'menu_total' => MenuItem::count(),
                'menu_available' => MenuItem::available()->count(),
                'menu_featured' => MenuItem::featured()->count(),
                'menu_chef' => MenuItem::chefPicks()->count(),
                'hero_slides' => HeroSlide::active()->count(),
                'gallery_atmosphere' => GalleryPhoto::section('atmosphere')->active()->count(),
                'gallery_team' => GalleryPhoto::section('team')->active()->count(),
                'reservations_new' => Reservation::new()->count(),
                'reservations_total' => Reservation::count(),
                'chef_set' => ChefProfile::active()->exists(),
            ],
            'recent' => Reservation::orderByDesc('created_at')->limit(5)->get(),
        ];
    }

    public function name(): ?string
    {
        return 'НА УГЛЕ — Дашборд';
    }

    public function description(): ?string
    {
        return 'Главное за один взгляд: режим работы, контент сайта, заявки.';
    }

    public function commandBar(): iterable
    {
        $isOpen = SiteSetting::bool('is_open');

        return [
            Link::make('Открыть сайт')
                ->href(config('app.url'))
                ->target('_blank')
                ->icon('bs.eye'),

            Button::make($isOpen ? '🟢 РЕСТОРАН ОТКРЫТ' : '🔴 РЕСТОРАН ЗАКРЫТ')
                ->method('toggleOpen')
                ->type($isOpen ? Color::SUCCESS : Color::DANGER)
                ->confirm($isOpen ? 'Закрыть ресторан? На сайте пропадёт верхний баннер.' : 'Открыть ресторан? На сайте появится верхний баннер.'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::view('orchid.dashboard-quick-actions'),

            Layout::metrics([
                'Блюд в меню' => 'metrics.menu_total',
                'Доступны сейчас' => 'metrics.menu_available',
                '«Хиты» на главной' => 'metrics.menu_featured',
                'Рекомендации шефа' => 'metrics.menu_chef',
            ]),

            Layout::metrics([
                'Слайдов в Hero' => 'metrics.hero_slides',
                'Фото атмосферы' => 'metrics.gallery_atmosphere',
                'Фото команды' => 'metrics.gallery_team',
                'Новых заявок' => 'metrics.reservations_new',
            ]),

            Layout::rows([
                Input::make('announcement_text')
                    ->title('Текст верхнего баннера на сайте')
                    ->placeholder('Например: «Сегодня открыты: 12:00 – 23:00»')
                    ->help('Появляется на сайте, если ресторан открыт. Изменения видны сразу.'),
            ])->title('Быстрое редактирование баннера'),

            Layout::table('recent', [
                TD::make('created_at', 'Заявка')->render(fn (Reservation $r) => $r->created_at?->format('d.m H:i')),
                TD::make('name', 'Имя'),
                TD::make('phone', 'Телефон')->render(fn (Reservation $r) => '<a href="tel:'.e($r->phone).'">'.e($r->phone).'</a>'),
                TD::make('date', 'Визит')->render(fn (Reservation $r) => $r->date?->format('d.m').' · '.$r->guests.' чел'),
                TD::make('status', 'Статус')->render(fn (Reservation $r) => $r->status_label),
            ])->title('Последние заявки')->canSee(Reservation::count() > 0),
        ];
    }

    public function toggleOpen(Request $request)
    {
        $new = !SiteSetting::bool('is_open');
        SiteSetting::put('is_open', $new ? '1' : '0');
        Toast::info($new ? 'Ресторан открыт. Баннер появился на сайте.' : 'Ресторан закрыт. Баннер скрыт.');
    }

    public function save(Request $request)
    {
        SiteSetting::put('announcement_text', (string) $request->input('announcement_text', ''));
        Toast::info('Текст баннера сохранён.');
    }
}
