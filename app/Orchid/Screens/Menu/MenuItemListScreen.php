<?php

namespace App\Orchid\Screens\Menu;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class MenuItemListScreen extends Screen
{
    public function query(Request $request): iterable
    {
        $q = MenuItem::with('category')->orderBy('category_id')->orderBy('sort_order');

        if ($request->filled('category_id')) {
            $q->where('category_id', $request->integer('category_id'));
        }
        if ($request->boolean('only_featured')) {
            $q->featured();
        }
        if ($request->boolean('only_available')) {
            $q->available();
        }

        return [
            'items' => $q->paginate(30),
            'categories' => MenuCategory::orderBy('sort_order')->get(),
        ];
    }

    public function name(): ?string { return 'Блюда меню'; }

    public function commandBar(): iterable
    {
        return [Link::make('Новое блюдо')->route('platform.menu.items.edit')->icon('bs.plus')];
    }

    public function layout(): iterable
    {
        return [
            Layout::table('items', [
                TD::make('name', 'Название')->render(fn (MenuItem $i) =>
                    Link::make($i->name)->route('platform.menu.items.edit', $i)),
                TD::make('category', 'Категория')->render(fn (MenuItem $i) => $i->category?->name ?? '—'),
                TD::make('price', 'Цена')->render(fn (MenuItem $i) => $i->price.' ₽'),
                TD::make('is_available', 'Доступно')->render(fn (MenuItem $i) => $i->is_available ? '✅' : '—'),
                TD::make('is_featured', 'Хит')->render(fn (MenuItem $i) => $i->is_featured ? '⭐' : '—'),
                TD::make('is_chef_pick', 'Шеф')->render(fn (MenuItem $i) => $i->is_chef_pick ? '👨‍🍳' : '—'),
            ]),
        ];
    }
}
