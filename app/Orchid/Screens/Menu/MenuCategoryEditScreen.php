<?php

namespace App\Orchid\Screens\Menu;

use App\Models\MenuCategory;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Screen;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class MenuCategoryEditScreen extends Screen
{
    public MenuCategory $category;

    public function query(MenuCategory $category): iterable
    {
        return ['category' => $category];
    }

    public function name(): ?string
    {
        return $this->category->exists ? 'Категория: '.$this->category->name : 'Новая категория';
    }

    public function commandBar(): iterable
    {
        return [
            Button::make('Сохранить')->method('save')->type(Color::PRIMARY)->icon('bs.check'),
            Button::make('Удалить')->method('remove')->type(Color::DANGER)->icon('bs.trash')
                ->confirm('Удалить категорию со всеми блюдами?')->canSee($this->category->exists),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::rows([
                Input::make('category.name')->title('Название')->required()->maxlength(100),
                Input::make('category.slug')->title('Slug')->help('Оставьте пустым для автогенерации')->maxlength(100),
                Input::make('category.icon')->title('Иконка / эмодзи')->placeholder('🥩')->maxlength(20),
                Input::make('category.sort_order')->type('number')->title('Порядок')->value($this->category->sort_order ?? 0),
                CheckBox::make('category.is_active')->title('Активна')->sendTrueOrFalse()->value($this->category->is_active ?? true),
            ]),
        ];
    }

    public function save(Request $request, MenuCategory $category)
    {
        $data = $request->validate([
            'category.name' => 'required|string|max:100',
            'category.slug' => 'nullable|string|max:100',
            'category.icon' => 'nullable|string|max:20',
            'category.sort_order' => 'nullable|integer',
            'category.is_active' => 'nullable|boolean',
        ])['category'];
        $category->fill($data)->save();
        Toast::info('Сохранено');
        return redirect()->route('platform.menu.categories');
    }

    public function remove(MenuCategory $category)
    {
        $category->delete();
        Toast::info('Удалено');
        return redirect()->route('platform.menu.categories');
    }
}
