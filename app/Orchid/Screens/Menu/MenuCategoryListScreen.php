<?php

namespace App\Orchid\Screens\Menu;

use App\Models\MenuCategory;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;

class MenuCategoryListScreen extends Screen
{
    public function query(): iterable
    {
        return ['categories' => MenuCategory::withCount('items')->orderBy('sort_order')->paginate(50)];
    }

    public function name(): ?string { return 'Категории меню'; }

    public function commandBar(): iterable
    {
        return [Link::make('Новая категория')->route('platform.menu.categories.edit')->icon('bs.plus')];
    }

    public function layout(): iterable
    {
        return [
            Layout::table('categories', [
                TD::make('sort_order', '№')->width('60px'),
                TD::make('icon', 'Иконка')->width('80px'),
                TD::make('name', 'Название')->render(fn (MenuCategory $c) =>
                    Link::make($c->name)->route('platform.menu.categories.edit', $c)),
                TD::make('items_count', 'Блюд'),
                TD::make('is_active', 'Активна')->render(fn (MenuCategory $c) => $c->is_active ? '✅' : '—'),
            ]),
        ];
    }
}
