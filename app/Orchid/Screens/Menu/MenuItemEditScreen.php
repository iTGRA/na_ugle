<?php

namespace App\Orchid\Screens\Menu;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Picture;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class MenuItemEditScreen extends Screen
{
    public MenuItem $item;

    public function query(MenuItem $item): iterable
    {
        return ['item' => $item];
    }

    public function name(): ?string
    {
        return $this->item->exists ? 'Блюдо: '.$this->item->name : 'Новое блюдо';
    }

    public function commandBar(): iterable
    {
        return [
            Button::make('Сохранить')->method('save')->type(Color::PRIMARY)->icon('bs.check'),
            Button::make('Удалить')->method('remove')->type(Color::DANGER)->icon('bs.trash')
                ->confirm('Удалить блюдо?')->canSee($this->item->exists),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::rows([
                Select::make('item.category_id')
                    ->title('Категория')
                    ->fromModel(MenuCategory::class, 'name')
                    ->required(),
                Picture::make('item.photo')->title('Фотография')->targetRelativeUrl(),
                Input::make('item.name')->title('Название')->required()->maxlength(150),
                TextArea::make('item.description')->title('Описание')->rows(3),
                Input::make('item.price')->type('number')->title('Цена, ₽')->required(),
                CheckBox::make('item.is_available')->title('В наличии')->sendTrueOrFalse()->value($this->item->is_available ?? true),
                CheckBox::make('item.is_featured')->title('Хит (показывать в блоке «Хиты»)')->sendTrueOrFalse()->value($this->item->is_featured ?? false),
                CheckBox::make('item.is_chef_pick')->title('Рекомендует шеф (отдельный блок)')->sendTrueOrFalse()->value($this->item->is_chef_pick ?? false),
                TextArea::make('item.chef_comment')->title('Комментарий шефа')->rows(2)
                    ->help('Появляется, если блюдо отмечено как «Рекомендует шеф»'),
                Input::make('item.sort_order')->type('number')->title('Порядок в категории')->value($this->item->sort_order ?? 0),
            ]),
        ];
    }

    public function save(Request $request, MenuItem $item)
    {
        $data = $request->validate([
            'item.category_id' => 'required|exists:menu_categories,id',
            'item.photo' => 'nullable|string',
            'item.name' => 'required|string|max:150',
            'item.description' => 'nullable|string',
            'item.price' => 'required|integer|min:0',
            'item.is_available' => 'nullable|boolean',
            'item.is_featured' => 'nullable|boolean',
            'item.is_chef_pick' => 'nullable|boolean',
            'item.chef_comment' => 'nullable|string',
            'item.sort_order' => 'nullable|integer',
        ])['item'];
        $item->fill($data)->save();
        Toast::info('Сохранено');
        return redirect()->route('platform.menu.items');
    }

    public function remove(MenuItem $item)
    {
        $item->delete();
        Toast::info('Удалено');
        return redirect()->route('platform.menu.items');
    }
}
