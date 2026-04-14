<?php

namespace App\Orchid\Screens\Gallery;

use App\Models\GalleryPhoto;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;

class GalleryListScreen extends Screen
{
    public function query(Request $request): iterable
    {
        $q = GalleryPhoto::orderBy('section')->orderBy('sort_order');
        if ($request->filled('section')) {
            $q->section($request->string('section'));
        }
        return ['photos' => $q->paginate(40)];
    }

    public function name(): ?string { return 'Галерея'; }

    public function commandBar(): iterable
    {
        return [Link::make('Новое фото')->route('platform.gallery.edit')->icon('bs.plus')];
    }

    public function layout(): iterable
    {
        return [
            Layout::table('photos', [
                TD::make('photo', 'Фото')->render(fn (GalleryPhoto $p) =>
                    $p->photo ? '<img src="'.e($p->photo).'" style="max-width:80px;max-height:60px;object-fit:cover">' : '—'),
                TD::make('section', 'Секция')->render(fn (GalleryPhoto $p) => [
                    'atmosphere' => 'Атмосфера',
                    'dishes' => 'Блюда',
                    'team' => 'Команда',
                ][$p->section] ?? $p->section),
                TD::make('alt_text', 'Alt'),
                TD::make('sort_order', '№'),
                TD::make('is_active', 'Активна')->render(fn (GalleryPhoto $p) => $p->is_active ? '✅' : '—'),
                TD::make('actions', '')->render(fn (GalleryPhoto $p) =>
                    Link::make('Редактировать')->route('platform.gallery.edit', $p)),
            ]),
        ];
    }
}
