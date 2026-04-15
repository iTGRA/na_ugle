<?php

namespace App\Orchid\Screens\Hero;

use App\Models\HeroSlide;
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
        return ['slide' => $slide];
    }

    public function name(): ?string
    {
        return ($this->slide?->exists ?? false) ? 'Слайд: '.$this->slide?->title : 'Новый слайд';
    }

    public function description(): ?string
    {
        return 'Все тексты этого слайда — заголовок, главный слоган и подзаголовок — настраиваются здесь. На каждом слайде они свои.';
    }

    public function commandBar(): iterable
    {
        return [
            Button::make('Сохранить')->method('save')->type(Color::PRIMARY)->icon('bs.check'),
            Button::make('Удалить')->method('remove')->type(Color::DANGER)->icon('bs.trash')
                ->confirm('Удалить этот слайд?')->canSee(($this->slide?->exists ?? false)),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::rows([
                Cropper::make('slide.photo')
                    ->title('Фотография слайда')
                    ->targetRelativeUrl()
                    ->width(1920)
                    ->height(1080)
                    ->help('Загрузите файл (JPG/PNG/WebP). Идеальный размер 1920×1080. После загрузки можно подрезать. Замените картинку, кликнув по миниатюре.'),

                Input::make('slide.title')
                    ->title('Заголовок (метка слайда)')
                    ->required()
                    ->maxlength(200)
                    ->placeholder('Огонь и дым')
                    ->help('Маленькая uppercase-метка над слоганом, формат на сайте: «01 / 03 · {Заголовок}». Например: Огонь и дым, Интерьер, Закат.'),

                TextArea::make('slide.slogan')
                    ->title('Главный слоган (огромный текст)')
                    ->rows(4)
                    ->placeholder("Гриль, колбаски и пиво.\nПростые удовольствия\nна набережной Самары.")
                    ->help('Многострочный — каждая строка с новой. Огромный шрифт поверх фото. У каждого слайда свой слоган.'),

                TextArea::make('slide.subtitle')
                    ->title('Подзаголовок (описание под слоганом)')
                    ->rows(3)
                    ->placeholder('Живой огонь, хоспер и уголь — основа всей нашей кухни.')
                    ->help('Короткий описательный текст под слоганом — раскрывает тему конкретного слайда.'),

                Input::make('slide.cta_text')->title('Текст кнопки')->placeholder('Смотреть меню'),
                Input::make('slide.cta_url')->title('Ссылка кнопки')->placeholder('#menu или /menu'),
                Input::make('slide.sort_order')->type('number')->title('Порядок показа')->value($this->slide?->sort_order ?? 0),
                CheckBox::make('slide.is_active')->title('Активен (показывать в ротации)')->sendTrueOrFalse()->value($this->slide?->is_active ?? true),
            ]),
        ];
    }

    public function save(Request $request, HeroSlide $slide)
    {
        $data = $request->validate([
            'slide.photo' => 'nullable|string',
            'slide.title' => 'required|string|max:200',
            'slide.slogan' => 'nullable|string|max:500',
            'slide.subtitle' => 'nullable|string|max:500',
            'slide.cta_text' => 'nullable|string|max:100',
            'slide.cta_url' => 'nullable|string|max:500',
            'slide.sort_order' => 'nullable|integer',
            'slide.is_active' => 'nullable|boolean',
        ])['slide'];

        $slide->fill($data)->save();

        Toast::info('Слайд сохранён.');
        return redirect()->route('platform.hero');
    }

    public function remove(HeroSlide $slide)
    {
        $slide->delete();
        Toast::info('Слайд удалён.');
        return redirect()->route('platform.hero');
    }
}
