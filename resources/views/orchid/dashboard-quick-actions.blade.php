@php
    $actions = [
        ['route' => 'platform.menu.items', 'label' => 'Блюда меню', 'desc' => 'Цены, фото, наличие, хиты, рекомендации шефа', 'icon' => 'bs.egg-fried'],
        ['route' => 'platform.menu.categories', 'label' => 'Категории меню', 'desc' => 'Названия, иконки, порядок', 'icon' => 'bs.tags'],
        ['route' => 'platform.hero', 'label' => 'Hero-слайдер', 'desc' => '3 слайда сверху главной — фото и тексты', 'icon' => 'bs.images'],
        ['route' => 'platform.gallery', 'label' => 'Галерея атмосферы', 'desc' => 'Фото интерьера, заката, команды', 'icon' => 'bs.camera'],
        ['route' => 'platform.chef', 'label' => 'Шеф-повар', 'desc' => 'Имя, фото, биография, цитата, факты', 'icon' => 'bs.person-badge'],
        ['route' => 'platform.settings', 'label' => 'Настройки сайта', 'desc' => 'Адрес, телефон, часы, тексты, PDF, соцсети', 'icon' => 'bs.gear'],
    ];
@endphp

<div class="bg-white rounded shadow-sm p-3 mb-3">
    <h6 class="text-uppercase text-muted mb-3" style="letter-spacing:0.05em; font-size:11px;">Быстрый доступ</h6>
    <div class="row g-2">
        @foreach($actions as $a)
            <div class="col-md-6 col-lg-4">
                <a href="{{ route($a['route']) }}" class="text-decoration-none">
                    <div class="d-flex align-items-start gap-2 p-3 rounded border h-100 hover-shadow"
                         style="transition: background 0.15s ease, border-color 0.15s ease; min-height:74px;"
                         onmouseover="this.style.background='#f8f9fa'; this.style.borderColor='#0d6efd'"
                         onmouseout="this.style.background='white'; this.style.borderColor='#dee2e6'">
                        <x-orchid-icon path="{{ $a['icon'] }}" class="text-primary mt-1" style="width:18px; height:18px;" />
                        <div class="flex-grow-1">
                            <div class="text-dark fw-bold">{{ $a['label'] }}</div>
                            <small class="text-muted d-block">{{ $a['desc'] }}</small>
                        </div>
                    </div>
                </a>
            </div>
        @endforeach
    </div>
</div>
