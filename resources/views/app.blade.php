<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#F5F0E8">
    <title inertia>{{ $title ?? 'НА УГЛЕ' }}</title>
    <meta name="description" content="{{ $description ?? 'Гриль-бистро на набережной Самары' }}" />
    <meta property="og:title" content="{{ $title ?? 'НА УГЛЕ' }}" />
    <meta property="og:description" content="{{ $description ?? 'Гриль-бистро на набережной Самары' }}" />
    <meta property="og:type" content="website" />
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
