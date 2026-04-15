<?php

namespace App\Orchid\Screens\Menu;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Support\PageCache;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Group;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Color;
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
        if ($request->filled('availability')) {
            if ($request->string('availability')->toString() === 'available') $q->available();
            if ($request->string('availability')->toString() === 'unavailable') $q->where('is_available', false);
        }
        if ($request->filled('flag')) {
            $flag = $request->string('flag')->toString();
            if ($flag === 'featured') $q->featured();
            if ($flag === 'chef_pick') $q->chefPicks();
            if ($flag === 'no_photo') $q->where(fn($x) => $x->whereNull('photo')->orWhere('photo', ''));
            if ($flag === 'no_price') $q->where('price', 0);
        }

        return [
            'items' => $q->paginate(30),
            'filters' => [
                'category_id' => $request->integer('category_id') ?: null,
                'availability' => $request->string('availability')->toString() ?: null,
                'flag' => $request->string('flag')->toString() ?: null,
            ],
        ];
    }

    public function name(): ?string { return 'Блюда меню'; }

    public function description(): ?string
    {
        return 'Все позиции меню. Тогглы «Доступно/Хит/Шеф» сразу видны в списке. Изменения мгновенно применяются на сайте.';
    }

    public function commandBar(): iterable
    {
        return [
            Link::make('Новое блюдо')->route('platform.menu.items.edit')->icon('bs.plus')->type(Color::PRIMARY),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::rows([
                Group::make([
                    Select::make('category_id')
                        ->title('Категория')
                        ->fromModel(MenuCategory::class, 'name')
                        ->empty('Все категории'),
                    Select::make('availability')
                        ->title('Доступность')
                        ->options([
                            '' => 'Любая',
                            'available' => 'Только доступные',
                            'unavailable' => 'Только скрытые',
                        ]),
                    Select::make('flag')
                        ->title('Метки')
                        ->options([
                            '' => 'Все',
                            'featured' => '⭐ Хиты (на главной)',
                            'chef_pick' => '👨‍🍳 Рекомендации шефа',
                            'no_photo' => '⚠ Без фото',
                            'no_price' => '⚠ Цена 0 ₽',
                        ]),
                ]),
                Group::make([
                    Button::make('Применить фильтры')->method('filter')->type(Color::PRIMARY)->icon('bs.funnel'),
                    Link::make('Сбросить')->route('platform.menu.items')->icon('bs.x-circle'),
                ]),
            ])->title('Фильтры'),

            Layout::table('items', [
                TD::make('photo', 'Фото')->width('72px')->render(fn (MenuItem $i) =>
                    $i->photo
                        ? '<img src="'.e($i->photo).'" style="width:56px;height:42px;object-fit:cover;border:1px solid #ddd;border-radius:4px">'
                        : '<div style="width:56px;height:42px;background:#f0f0f0;border:1px dashed #ccc;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#888">нет</div>'
                ),
                TD::make('name', 'Название')->render(fn (MenuItem $i) =>
                    Link::make($i->name)->route('platform.menu.items.edit', $i)),
                TD::make('category', 'Категория')->render(fn (MenuItem $i) => $i->category?->name ?? '—'),
                TD::make('price', 'Цена')->align(TD::ALIGN_RIGHT)->render(fn (MenuItem $i) =>
                    $i->price > 0 ? '<b>'.$i->price.' ₽</b>' : '<span style="color:#c33">— ₽</span>'),
                TD::make('is_available', 'Доступно')->align(TD::ALIGN_CENTER)->render(fn (MenuItem $i) => $i->is_available ? '✅' : '⛔'),
                TD::make('is_featured', 'Хит')->align(TD::ALIGN_CENTER)->render(fn (MenuItem $i) => $i->is_featured ? '⭐' : ''),
                TD::make('is_chef_pick', 'Шеф')->align(TD::ALIGN_CENTER)->render(fn (MenuItem $i) => $i->is_chef_pick ? '👨‍🍳' : ''),
                TD::make('actions', '')->align(TD::ALIGN_RIGHT)->render(fn (MenuItem $i) =>
                    Link::make('Редактировать')->route('platform.menu.items.edit', $i)->icon('bs.pencil')->type(Color::PRIMARY)
                ),
            ]),
        ];
    }

    public function filter(Request $request)
    {
        return redirect()->route('platform.menu.items', array_filter([
            'category_id' => $request->integer('category_id') ?: null,
            'availability' => $request->string('availability')->toString() ?: null,
            'flag' => $request->string('flag')->toString() ?: null,
        ]));
    }
}
