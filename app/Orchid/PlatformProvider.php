<?php

declare(strict_types=1);

namespace App\Orchid;

use App\Models\Reservation;
use Orchid\Platform\Dashboard;
use Orchid\Platform\ItemPermission;
use Orchid\Platform\OrchidServiceProvider;
use Orchid\Screen\Actions\Menu;
use Orchid\Support\Color;

class PlatformProvider extends OrchidServiceProvider
{
    public function boot(Dashboard $dashboard): void
    {
        parent::boot($dashboard);
    }

    public function menu(): array
    {
        return [
            Menu::make('Дашборд')
                ->icon('bs.speedometer2')
                ->route(config('platform.index'))
                ->title('На Угле'),

            Menu::make('Бронирования')
                ->icon('bs.calendar-check')
                ->route('platform.reservations')
                ->badge(fn () => Reservation::new()->count() ?: null, Color::DANGER),

            Menu::make('Hero-слайдер')
                ->icon('bs.images')
                ->route('platform.hero'),

            Menu::make('Меню')
                ->icon('bs.menu-button-wide')
                ->title('Контент')
                ->list([
                    Menu::make('Категории')->icon('bs.tags')->route('platform.menu.categories'),
                    Menu::make('Блюда')->icon('bs.egg-fried')->route('platform.menu.items'),
                ]),

            Menu::make('Галерея')
                ->icon('bs.camera')
                ->route('platform.gallery'),

            Menu::make('Шеф-повар')
                ->icon('bs.person-badge')
                ->route('platform.chef'),

            Menu::make('Настройки сайта')
                ->icon('bs.gear')
                ->route('platform.settings')
                ->divider(),

            Menu::make(__('Users'))
                ->icon('bs.people')
                ->route('platform.systems.users')
                ->permission('platform.systems.users')
                ->title(__('Access Controls')),

            Menu::make(__('Roles'))
                ->icon('bs.shield')
                ->route('platform.systems.roles')
                ->permission('platform.systems.roles'),
        ];
    }

    public function permissions(): array
    {
        return [
            ItemPermission::group(__('System'))
                ->addPermission('platform.systems.roles', __('Roles'))
                ->addPermission('platform.systems.users', __('Users')),
        ];
    }
}
