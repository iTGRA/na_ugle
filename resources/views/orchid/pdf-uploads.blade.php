@php
    use App\Models\SiteSetting;
    $items = [
        ['key' => 'menu_pdf',       'label' => 'Основное меню',  'help' => 'Кнопка «Скачать меню» в Хитах с хоспера, на /menu и в футере.'],
        ['key' => 'bar_menu_pdf',   'label' => 'Барная карта',   'help' => 'Кнопка «Барная карта» в манифесте и на /menu.'],
        ['key' => 'wine_card_pdf',  'label' => 'Винная карта',   'help' => 'Кнопка «Винная карта» в манифесте и на /menu.'],
    ];
@endphp

<div class="bg-white rounded shadow-sm p-4">
    <p class="text-muted small mb-4">
        Загрузите PDF-файл — он сохранится в <code>/public/files/</code> и URL будет автоматически прописан в настройку.
        Максимум 25 МБ. Чтобы заменить — просто загрузите новый файл, старый удалится.
    </p>

    @foreach($items as $item)
        @php $current = SiteSetting::get($item['key']); @endphp
        <div class="mb-4 pb-4 @if(!$loop->last) border-bottom @endif">
            <div class="d-flex align-items-center justify-content-between mb-2">
                <div>
                    <strong>{{ $item['label'] }}</strong>
                    <small class="text-muted d-block">{{ $item['help'] }}</small>
                </div>
                @if($current)
                    <a href="{{ $current }}" target="_blank" class="text-decoration-none small">
                        <x-orchid-icon path="bs.file-earmark-pdf" /> текущий файл
                    </a>
                @else
                    <span class="badge bg-secondary">не загружен</span>
                @endif
            </div>

            <form method="POST" action="{{ route('platform.settings.upload-pdf', $item['key']) }}" enctype="multipart/form-data" class="d-flex gap-2 align-items-center">
                @csrf
                <input type="file" name="pdf" accept="application/pdf" required class="form-control form-control-sm" style="max-width: 360px;">
                <button type="submit" class="btn btn-primary btn-sm">
                    <x-orchid-icon path="bs.upload" /> Загрузить
                </button>
                @if($current)
                    <form method="POST" action="{{ route('platform.settings.delete-pdf', $item['key']) }}" class="d-inline" onsubmit="return confirm('Удалить файл?')">
                        @csrf
                        <button type="submit" class="btn btn-outline-danger btn-sm">
                            <x-orchid-icon path="bs.trash" /> Удалить
                        </button>
                    </form>
                @endif
            </form>
        </div>
    @endforeach
</div>
