<?php

namespace App\Orchid\Screens\Hero;

use App\Models\HeroSlide;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
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
        return 'Слайды Hero';
    }

    public function commandBar(): iterable
    {
        return [
            Link::make('Добавить слайд')->route('platform.hero.edit')->icon('bs.plus'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::table('slides', [
                TD::make('sort_order', '№')->width('60px')->sort(),
                TD::make('title', 'Заголовок')->render(fn (HeroSlide $s) =>
                    Link::make($s->title ?: '—')->route('platform.hero.edit.existing', $s)
                ),
                TD::make('subtitle', 'Подзаголовок'),
                TD::make('is_active', 'Активен')->render(fn (HeroSlide $s) => $s->is_active ? '✅' : '—'),
                TD::make('updated_at', 'Обновлён')->render(fn (HeroSlide $s) => $s->updated_at?->format('d.m.Y H:i')),
            ]),
        ];
    }
}
