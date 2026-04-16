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
    /**
     * All uploadable settings with allowed mime types and labels.
     */
    private const UPLOADS = [
        // PDFs
        'menu_pdf'         => ['label' => 'основное меню',        'mimes' => 'pdf',              'dir' => 'files'],
        'bar_menu_pdf'     => ['label' => 'барная карта',         'mimes' => 'pdf',              'dir' => 'files'],
        'wine_card_pdf'    => ['label' => 'винная карта',         'mimes' => 'pdf',              'dir' => 'files'],
        // Images
        'gallery_bg_image' => ['label' => 'фон галереи',          'mimes' => 'jpg,jpeg,png,webp', 'dir' => 'images/uploads'],
        'footer_logo'      => ['label' => 'логотип футера',       'mimes' => 'svg,png,jpg,webp',  'dir' => 'images/uploads'],
    ];

    public function upload(Request $request, string $key): RedirectResponse
    {
        $cfg = self::UPLOADS[$key] ?? null;
        abort_unless($cfg, 404);

        $request->validate([
            'file' => ['required', 'file', 'mimes:' . $cfg['mimes'], 'max:25600'],
        ], [
            'file.required' => 'Прикрепите файл.',
            'file.mimes' => 'Допустимые форматы: ' . $cfg['mimes'],
            'file.max' => 'Файл слишком большой (макс 25 МБ).',
        ]);

        $file = $request->file('file');
        $dir = public_path($cfg['dir']);
        if (!File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        $ext = $file->getClientOriginalExtension() ?: 'bin';
        $filename = Str::slug(str_replace('_', '-', $key)) . '-' . time() . '.' . $ext;
        $file->move($dir, $filename);
        $url = '/' . $cfg['dir'] . '/' . $filename;

        // Remove previous file
        $prev = SiteSetting::get($key);
        if ($prev && Str::startsWith($prev, '/') && $prev !== $url) {
            $prevPath = public_path(ltrim($prev, '/'));
            if (File::exists($prevPath)) {
                @File::delete($prevPath);
            }
        }

        SiteSetting::put($key, $url);
        Toast::info('Загружен: «' . $cfg['label'] . '».');

        return back();
    }

    public function delete(string $key): RedirectResponse
    {
        $cfg = self::UPLOADS[$key] ?? null;
        abort_unless($cfg, 404);

        $prev = SiteSetting::get($key);
        if ($prev && Str::startsWith($prev, '/')) {
            $prevPath = public_path(ltrim($prev, '/'));
            if (File::exists($prevPath)) {
                @File::delete($prevPath);
            }
        }
        SiteSetting::put($key, '');
        Toast::info('Удалён: «' . $cfg['label'] . '».');

        return back();
    }

    // Legacy aliases (PDF-specific routes still work)
    public function uploadPdf(Request $request, string $key): RedirectResponse
    {
        // Remap old 'pdf' field name to 'file'
        if (!$request->hasFile('file') && $request->hasFile('pdf')) {
            $request->files->set('file', $request->file('pdf'));
        }
        return $this->upload($request, $key);
    }

    public function deletePdf(string $key): RedirectResponse
    {
        return $this->delete($key);
    }
}
