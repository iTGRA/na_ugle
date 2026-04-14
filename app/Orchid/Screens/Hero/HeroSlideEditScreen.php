<?php

namespace App\Orchid\Screens\Hero;

use App\Models\HeroSlide;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Picture;
use Orchid\Screen\Screen;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class HeroSlideEditScreen extends Screen
{
    public ?HeroSlide $slide = null;

    public function query(HeroSlide $slide): iterable
    {
        return ['slide' => $slide];
    }

    public function name(): ?string
    {
        return ($this->slide?->exists ?? false) ? 'Редактировать слайд' : 'Новый слайд';
    }

    public function commandBar(): iterable
    {
        return [
            Button::make('Сохранить')->method('save')->type(Color::PRIMARY)->icon('bs.check'),
            Button::make('Удалить')->method('remove')->type(Color::DANGER)->icon('bs.trash')
                ->confirm('Удалить слайд?')->canSee(($this->slide?->exists ?? false)),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::rows([
                Picture::make('slide.photo')->title('Фотография слайда')->targetRelativeUrl(),
                Input::make('slide.title')->title('Заголовок')->required()->maxlength(200),
                Input::make('slide.subtitle')->title('Подзаголовок')->maxlength(200),
                Input::make('slide.cta_text')->title('Текст кнопки')->placeholder('Смотреть меню'),
                Input::make('slide.cta_url')->title('Ссылка кнопки')->placeholder('#menu или /menu'),
                Input::make('slide.sort_order')->type('number')->title('Порядок')->value($this->slide?->sort_order ?? 0),
                CheckBox::make('slide.is_active')->title('Активен')->sendTrueOrFalse()->value($this->slide?->is_active ?? true),
            ]),
        ];
    }

    public function save(Request $request, HeroSlide $slide)
    {
        $data = $request->validate([
            'slide.photo' => 'nullable|string',
            'slide.title' => 'required|string|max:200',
            'slide.subtitle' => 'nullable|string|max:200',
            'slide.cta_text' => 'nullable|string|max:100',
            'slide.cta_url' => 'nullable|string|max:500',
            'slide.sort_order' => 'nullable|integer',
            'slide.is_active' => 'nullable|boolean',
        ])['slide'];
        $slide->fill($data)->save();
        Toast::info('Слайд сохранён');
        return redirect()->route('platform.hero');
    }

    public function remove(HeroSlide $slide)
    {
        $slide->delete();
        Toast::info('Удалено');
        return redirect()->route('platform.hero');
    }
}
