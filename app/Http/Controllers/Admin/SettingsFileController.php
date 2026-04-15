<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Orchid\Support\Facades\Toast;

class SettingsFileController extends Controller
{
    private const ALLOWED_KEYS = ['menu_pdf', 'bar_menu_pdf', 'wine_card_pdf'];
    private const ALLOWED_LABELS = [
        'menu_pdf' => 'основное меню',
        'bar_menu_pdf' => 'барная карта',
        'wine_card_pdf' => 'винная карта',
    ];

    public function uploadPdf(Request $request, string $key): RedirectResponse
    {
        abort_unless(in_array($key, self::ALLOWED_KEYS, true), 404);

        $request->validate([
            'pdf' => ['required', 'file', 'mimes:pdf', 'max:25600'],
        ], [
            'pdf.required' => 'Прикрепите PDF-файл.',
            'pdf.mimes' => 'Файл должен быть в формате PDF.',
            'pdf.max' => 'Файл больше 25 МБ — слишком большой.',
        ]);

        $file = $request->file('pdf');
        $dir = public_path('files');
        if (!File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        $filename = Str::slug(str_replace('_', '-', $key)) . '-' . time() . '.pdf';
        $file->move($dir, $filename);
        $url = '/files/' . $filename;

        // Optionally remove the previously stored file (if it lived under /files/)
        $prev = SiteSetting::get($key);
        if ($prev && Str::startsWith($prev, '/files/') && $prev !== $url) {
            $prevPath = public_path(ltrim($prev, '/'));
            if (File::exists($prevPath)) {
                @File::delete($prevPath);
            }
        }

        SiteSetting::put($key, $url);

        Toast::info('Загружен файл «' . self::ALLOWED_LABELS[$key] . '».');

        return back();
    }

    public function deletePdf(string $key): RedirectResponse
    {
        abort_unless(in_array($key, self::ALLOWED_KEYS, true), 404);

        $prev = SiteSetting::get($key);
        if ($prev && Str::startsWith($prev, '/files/')) {
            $prevPath = public_path(ltrim($prev, '/'));
            if (File::exists($prevPath)) {
                @File::delete($prevPath);
            }
        }
        SiteSetting::put($key, '');
        Toast::info('Файл «' . self::ALLOWED_LABELS[$key] . '» удалён.');

        return back();
    }
}
