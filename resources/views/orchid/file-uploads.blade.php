{{-- Generic file upload partial for SiteSettings.
     Pass $uploads array from the Screen layout. --}}
@php
    use App\Models\SiteSetting;
    $uploads = $uploads ?? [];
@endphp

<div class="bg-white rounded shadow-sm p-4">
    @foreach($uploads as $item)
        @php $current = SiteSetting::get($item['key']); @endphp
        <div class="mb-4 pb-4 @if(!$loop->last) border-bottom @endif">
            <div class="d-flex align-items-center justify-content-between mb-2">
                <div>
                    <strong>{{ $item['label'] }}</strong>
                    @if(!empty($item['help']))
                        <small class="text-muted d-block">{{ $item['help'] }}</small>
                    @endif
                </div>
                @if($current)
                    @if(Str::endsWith($current, ['.jpg','.jpeg','.png','.webp','.svg']))
                        <img src="{{ $current }}" alt="" style="max-height: 40px; max-width: 120px; border: 1px solid #ddd; border-radius: 4px;">
                    @else
                        <a href="{{ $current }}" target="_blank" class="text-decoration-none small">📄 текущий файл</a>
                    @endif
                @else
                    <span class="badge bg-secondary">не загружен</span>
                @endif
            </div>
            <div class="d-flex gap-2 align-items-center">
                <input type="file" id="file-{{ $item['key'] }}" accept="{{ $item['accept'] ?? '*/*' }}" class="form-control form-control-sm" style="max-width: 360px;">
                <button type="button" class="btn btn-primary btn-sm" onclick="uploadSettingsFile('{{ $item['key'] }}', this)">Загрузить</button>
                @if($current)
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteSettingsFile('{{ $item['key'] }}', this)">Удалить</button>
                @endif
            </div>
        </div>
    @endforeach
</div>

<script>
function getSettingsCsrf() {
    const el = document.querySelector('meta[name="csrf-token"]');
    return el ? el.content : '{{ csrf_token() }}';
}
function uploadSettingsFile(key, btn) {
    const input = document.getElementById('file-' + key);
    if (!input || !input.files.length) { alert('Выберите файл'); return; }
    btn.disabled = true; btn.textContent = 'Загрузка…';
    const fd = new FormData();
    fd.append('file', input.files[0]);
    fd.append('_token', getSettingsCsrf());
    fetch('/admin/settings/upload-file/' + key, { method: 'POST', body: fd })
        .then(r => { if (r.ok || r.redirected) location.reload(); else alert('Ошибка: ' + r.status); })
        .catch(() => alert('Ошибка сети'))
        .finally(() => { btn.disabled = false; btn.textContent = 'Загрузить'; });
}
function deleteSettingsFile(key, btn) {
    if (!confirm('Удалить файл?')) return;
    btn.disabled = true;
    const fd = new FormData();
    fd.append('_token', getSettingsCsrf());
    fetch('/admin/settings/delete-file/' + key, { method: 'POST', body: fd })
        .then(r => { if (r.ok || r.redirected) location.reload(); else alert('Ошибка'); })
        .catch(() => alert('Ошибка сети'))
        .finally(() => { btn.disabled = false; });
}
</script>
