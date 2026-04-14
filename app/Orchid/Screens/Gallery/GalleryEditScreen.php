<?php

namespace App\Orchid\Screens\Gallery;

use App\Models\GalleryPhoto;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Picture;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Screen;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class GalleryEditScreen extends Screen
{
    public GalleryPhoto $photo;

    public function query(GalleryPhoto $photo): iterable
    {
        return ['photo' => $photo];
    }

    public function name(): ?string
    {
        return $this->photo->exists ? 'Фото галереи' : 'Новое фото';
    }

    public function commandBar(): iterable
    {
        return [
            Button::make('Сохранить')->method('save')->type(Color::PRIMARY),
            Button::make('Удалить')->method('remove')->type(Color::DANGER)
                ->confirm('Удалить фото?')->canSee($this->photo->exists),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::rows([
                Picture::make('photo.photo')->title('Фотография')->targetRelativeUrl(),
                Select::make('photo.section')->title('Секция')->options([
                    'atmosphere' => 'Атмосфера (горизонтальная галерея)',
                    'dishes' => 'Блюда',
                    'team' => 'Команда / Кухня (блок шефа)',
                ])->required(),
                Input::make('photo.alt_text')->title('Alt-текст')->help('Для SEO и доступности'),
                Input::make('photo.sort_order')->type('number')->title('Порядок')->value($this->photo->sort_order ?? 0),
                CheckBox::make('photo.is_active')->title('Активна')->sendTrueOrFalse()->value($this->photo->is_active ?? true),
            ]),
        ];
    }

    public function save(Request $request, GalleryPhoto $photo)
    {
        $data = $request->validate([
            'photo.photo' => 'required|string',
            'photo.section' => 'required|in:atmosphere,dishes,team',
            'photo.alt_text' => 'nullable|string|max:200',
            'photo.sort_order' => 'nullable|integer',
            'photo.is_active' => 'nullable|boolean',
        ])['photo'];
        $photo->fill($data)->save();
        Toast::info('Сохранено');
        return redirect()->route('platform.gallery');
    }

    public function remove(GalleryPhoto $photo)
    {
        $photo->delete();
        Toast::info('Удалено');
        return redirect()->route('platform.gallery');
    }
}
