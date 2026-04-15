<?php

namespace App\Orchid\Screens\Hero;

use App\Models\HeroSlide;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Cropper;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class HeroSlideEditScreen extends Screen
{
    public ?HeroSlide $slide = null;

    public function query(HeroSlide $slide): iterable
    {
        $this->slide = $slide;
        return [
            'slide' => $slide,
            'hero_slogan' => SiteSetting::get('hero_slogan'),
            'hero_description' => SiteSetting::get('hero_description'),
        ];
    }

    public function name(): ?string
    {
        return ($this->slide?->exists ?? false) ? 'Редактировать слайд' : 'Новый слайд';
    }

    public function description(): ?string
    {
        return 'Управление одним слайдом + общими текстами Hero (одинаковыми для всех слайдов).';
    }

    public function commandBar(): iterable
    {
        return [
            Button::make('Сохранить')->method('save')->type(Color::PRIMARY)->icon('bs.check'),
            Button::make('Удалить')->method('remove')->type(Color::DANGER)->icon('bs.trash')
                ->confirm('Удалить этот слайд? (общие тексты Hero не пострадают)')->canSee(($this->slide?->exists ?? false)),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::rows([
                TextArea::make('hero_slogan')
                    ->title('Главный слоган Hero')
                    ->rows(4)
                    ->help('Огромный текст поверх ВСЕХ слайдов. Одинаковый для всех. Многострочный — каждая строка с новой. Сохраняется в общие настройки сайта.'),
                TextArea::make('hero_description')
                    ->title('Описание под слоганом (общее)')
                    ->rows(3)
                    ->help('Появляется под слоганом. Если у слайда заполнено поле «Подзаголовок» — оно покажется вместо этого описания на конкретном слайде.'),
            ])->title('🔁 Общие тексты Hero (одинаковые для всех слайдов)'),

            Layout::rows([
                Cropper::make('slide.photo')
                    ->title('Фотография слайда')
                    ->targetRelativeUrl()
                    ->width(1920)
                    ->height(1080)
                    ->help('Загрузите файл (JPG/PNG/WebP). Идеальный размер 1920×1080. После загрузки можно подрезать. Замените картинку, кликнув по миниатюре.'),
                Input::make('slide.title')->title('Заголовок слайда')->required()->maxlength(200)
                    ->help('Маленькая метка над слоганом, формат: «01 / 03 · {Заголовок}». Например: Гриль, Интерьер, Закат.'),
                Input::make('slide.subtitle')->title('Подзаголовок этого слайда (опционально)')->maxlength(200)
                    ->help('Если заполнен — заменяет общее «Описание Hero» только для этого слайда.'),
                Input::make('slide.cta_text')->title('Текст кнопки')->placeholder('Смотреть меню'),
                Input::make('slide.cta_url')->title('Ссылка кнопки')->placeholder('#menu или /menu'),
                Input::make('slide.sort_order')->type('number')->title('Порядок показа')->value($this->slide?->sort_order ?? 0),
                CheckBox::make('slide.is_active')->title('Активен (показывать в ротации)')->sendTrueOrFalse()->value($this->slide?->is_active ?? true),
            ])->title('🖼 Этот слайд'),
        ];
    }

    public function save(Request $request, HeroSlide $slide)
    {
        $validated = $request->validate([
            'hero_slogan' => 'nullable|string|max:500',
            'hero_description' => 'nullable|string|max:1000',
            'slide.photo' => 'nullable|string',
            'slide.title' => 'required|string|max:200',
            'slide.subtitle' => 'nullable|string|max:200',
            'slide.cta_text' => 'nullable|string|max:100',
            'slide.cta_url' => 'nullable|string|max:500',
            'slide.sort_order' => 'nullable|integer',
            'slide.is_active' => 'nullable|boolean',
        ]);

        SiteSetting::put('hero_slogan', (string) ($validated['hero_slogan'] ?? ''));
        SiteSetting::put('hero_description', (string) ($validated['hero_description'] ?? ''));

        $slide->fill($validated['slide'])->save();

        Toast::info('Слайд и общие тексты Hero сохранены.');
        return redirect()->route('platform.hero');
    }

    public function remove(HeroSlide $slide)
    {
        $slide->delete();
        Toast::info('Слайд удалён.');
        return redirect()->route('platform.hero');
    }
}
