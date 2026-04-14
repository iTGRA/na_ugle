<?php

namespace App\Orchid\Screens\Chef;

use App\Models\ChefProfile;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Picture;
use Orchid\Screen\Fields\Quill;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class ChefProfileScreen extends Screen
{
    public ?ChefProfile $chef = null;

    public function query(): iterable
    {
        $chef = ChefProfile::query()->firstOrNew(['is_active' => true]);
        $this->chef = $chef;
        return [
            'chef' => $chef,
            'facts_text' => $this->factsToText($chef->facts ?? []),
        ];
    }

    public function name(): ?string { return 'Шеф-повар'; }
    public function description(): ?string { return 'Данные для блока «Шеф» на главной странице.'; }

    public function commandBar(): iterable
    {
        return [Button::make('Сохранить')->method('save')->type(Color::PRIMARY)->icon('bs.check')];
    }

    public function layout(): iterable
    {
        return [
            Layout::rows([
                Picture::make('chef.photo')->title('Фотография')->targetRelativeUrl(),
                Input::make('chef.name')->title('Имя')->required(),
                Input::make('chef.position')->title('Должность')->placeholder('Шеф-повар'),
                Quill::make('chef.bio_text')->title('Биография'),
                TextArea::make('chef.quote')->title('Цитата (рукописный шрифт на сайте)')->rows(3),
                TextArea::make('facts_text')->title('Факты')
                    ->rows(6)->help('По одному на строку в формате «Ключ: значение». Например: «Стаж: 14 лет»'),
                TextArea::make('chef.lavolt_note')->title('Заметка о La Volte')->rows(2),
                CheckBox::make('chef.is_active')->title('Показывать на сайте')->sendTrueOrFalse()->value($this->chef?->is_active ?? true),
            ]),
        ];
    }

    public function save(Request $request)
    {
        $data = $request->validate([
            'chef.name' => 'required|string|max:150',
            'chef.position' => 'nullable|string|max:150',
            'chef.photo' => 'nullable|string',
            'chef.bio_text' => 'nullable|string',
            'chef.quote' => 'nullable|string',
            'chef.lavolt_note' => 'nullable|string',
            'chef.is_active' => 'nullable|boolean',
            'facts_text' => 'nullable|string',
        ]);

        $chef = ChefProfile::query()->firstOrNew(['is_active' => true]);
        $chef->fill($data['chef']);
        $chef->facts = $this->parseFacts($data['facts_text'] ?? '');
        $chef->save();

        Toast::info('Сохранено');
    }

    private function factsToText(array $facts): string
    {
        return collect($facts)->map(fn ($v, $k) => "{$k}: {$v}")->implode("\n");
    }

    private function parseFacts(string $text): array
    {
        $out = [];
        foreach (preg_split('/\r\n|\r|\n/', $text) as $line) {
            $line = trim($line);
            if ($line === '' || !str_contains($line, ':')) continue;
            [$k, $v] = explode(':', $line, 2);
            $out[trim($k)] = trim($v);
        }
        return $out;
    }
}
