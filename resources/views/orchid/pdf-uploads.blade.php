@php
    use App\Models\SiteSetting;
    $items = [
        ['key' => 'menu_pdf',       'label' => 'Основное меню',  'help' => 'Кнопка «Скачать меню» в Хитах с хоспера, на /menu и в футере.'],
        ['key' => 'bar_menu_pdf',   'label' => 'Барная карта',   'help' => 'Кнопка «Барная карта» в манифесте и на /menu.'],
        ['key' => 'wine_card_pdf',  'label' => 'Винная карта',   'help' => 'Кнопка «Винная карта» в манифесте и на /menu.'],
    ];
@endphp

{{-- NOTE: no <form> tags here — we're inside Orchid's main screen form.
     File upload uses JS fetch() to avoid nested-form HTML violation. --}}
<div class="bg-white rounded shadow-sm p-4">
    <p class="text-muted small mb-4">
        Загрузите PDF-файл — он сохранится на сервере и URL пропишется автоматически.
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

            <div class="d-flex gap-2 align-items-center">
                <input
                    type="file"
                    id="pdf-{{ $item['key'] }}"
                    accept="application/pdf"
                    class="form-control form-control-sm"
                    style="max-width: 360px;"
                >
                <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    onclick="uploadPdf('{{ $item['key'] }}', this)"
                >
                    <x-orchid-icon path="bs.upload" /> Загрузить
                </button>
                @if($current)
                    <button
                        type="button"
                        class="btn btn-outline-danger btn-sm"
                        onclick="deletePdf('{{ $item['key'] }}', this)"
                    >
                        <x-orchid-icon path="bs.trash" /> Удалить
                    </button>
                @endif
            </div>
        </div>
    @endforeach
</div>

<script>
function getCsrf() {
    const el = document.querySelector('meta[name="csrf-token"]');
    return el ? el.content : '{{ csrf_token() }}';
}

function uploadPdf(key, btn) {
    const input = document.getElementById('pdf-' + key);
    if (!input || !input.files.length) {
        alert('Выберите PDF-файл');
        return;
    }
    btn.disabled = true;
    btn.textContent = 'Загрузка…';
    const fd = new FormData();
    fd.append('pdf', input.files[0]);
    fd.append('_token', getCsrf());

    fetch('/admin/settings/upload-pdf/' + key, { method: 'POST', body: fd })
        .then(function(r) {
            if (r.ok || r.redirected) {
                location.reload();
            } else {
                r.text().then(function(t) { alert('Ошибка: ' + r.status); });
            }
        })
        .catch(function(e) { alert('Ошибка сети'); })
        .finally(function() { btn.disabled = false; btn.textContent = 'Загрузить'; });
}

function deletePdf(key, btn) {
    if (!confirm('Удалить файл?')) return;
    btn.disabled = true;
    const fd = new FormData();
    fd.append('_token', getCsrf());

    fetch('/admin/settings/delete-pdf/' + key, { method: 'POST', body: fd })
        .then(function(r) { if (r.ok || r.redirected) location.reload(); else alert('Ошибка'); })
        .catch(function(e) { alert('Ошибка сети'); })
        .finally(function() { btn.disabled = false; });
}
</script>
