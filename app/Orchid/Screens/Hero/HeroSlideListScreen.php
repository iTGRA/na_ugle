<?php

namespace App\Orchid\Screens\Hero;

use App\Models\HeroSlide;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;

class HeroSlideListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'slides' => HeroSlide::orderBy('sort_order')->paginate(20),
        ];
    }

    public function name(): ?string
    {
        return 'Hero-слайдер';
    }

    public function description(): ?string
    {
        return 'Каждый слайд имеет свой заголовок, главный слоган и подзаголовок. На сайте они меняются вместе с фото в ротации.';
    }

    public function commandBar(): iterable
    {
        return [
            Link::make('Добавить слайд')->route('platform.hero.edit')->icon('bs.plus')->type(Color::PRIMARY),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::table('slides', [
                TD::make('sort_order', '№')->width('60px')->align(TD::ALIGN_CENTER),
                TD::make('photo', 'Фото')->width('100px')->render(fn (HeroSlide $s) =>
                    $s->photo
                        ? '<img src="'.e($s->photo).'" style="width:90px;height:50px;object-fit:cover;border:1px solid #ddd;border-radius:4px">'
                        : '<div style="width:90px;height:50px;background:#f0f0f0;border:1px dashed #ccc;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#888">нет фото</div>'
                ),
                TD::make('title', 'Заголовок (метка)')->render(fn (HeroSlide $s) =>
                    Link::make($s->title ?: '—')->route('platform.hero.edit.existing', $s)
                ),
                TD::make('slogan', 'Главный слоган')->render(fn (HeroSlide $s) =>
                    $s->slogan
                        ? '<span style="white-space:pre-line;display:block;line-height:1.25;font-weight:600;max-width:340px">'.e($s->slogan).'</span>'
                        : '<span style="color:#bbb">— не задан —</span>'
                ),
                TD::make('subtitle', 'Подзаголовок')->render(fn (HeroSlide $s) =>
                    $s->subtitle
                        ? '<span style="color:#666;display:block;line-height:1.3;max-width:280px">'.e($s->subtitle).'</span>'
                        : '<span style="color:#bbb">—</span>'
                ),
                TD::make('is_active', 'Активен')->align(TD::ALIGN_CENTER)->render(fn (HeroSlide $s) => $s->is_active ? '✅' : '⛔'),
                TD::make('actions', '')->align(TD::ALIGN_RIGHT)->render(fn (HeroSlide $s) =>
                    Link::make('Редактировать')->route('platform.hero.edit.existing', $s)->icon('bs.pencil')->type(Color::PRIMARY)
                ),
            ]),
        ];
    }
}
