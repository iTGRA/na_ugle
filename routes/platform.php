<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\SettingsFileController;
use App\Orchid\Screens\Chef\ChefProfileScreen;
use App\Orchid\Screens\DashboardScreen;
use App\Orchid\Screens\Examples\ExampleActionsScreen;
use App\Orchid\Screens\Examples\ExampleCardsScreen;
use App\Orchid\Screens\Examples\ExampleChartsScreen;
use App\Orchid\Screens\Examples\ExampleFieldsAdvancedScreen;
use App\Orchid\Screens\Examples\ExampleFieldsScreen;
use App\Orchid\Screens\Examples\ExampleGridScreen;
use App\Orchid\Screens\Examples\ExampleLayoutsScreen;
use App\Orchid\Screens\Examples\ExampleScreen;
use App\Orchid\Screens\Examples\ExampleTextEditorsScreen;
use App\Orchid\Screens\Gallery\GalleryEditScreen;
use App\Orchid\Screens\Gallery\GalleryListScreen;
use App\Orchid\Screens\Hero\HeroSlideEditScreen;
use App\Orchid\Screens\Hero\HeroSlideListScreen;
use App\Orchid\Screens\Menu\MenuCategoryEditScreen;
use App\Orchid\Screens\Menu\MenuCategoryListScreen;
use App\Orchid\Screens\Menu\MenuItemEditScreen;
use App\Orchid\Screens\Menu\MenuItemListScreen;
use App\Orchid\Screens\PlatformScreen;
use App\Orchid\Screens\Reservation\ReservationEditScreen;
use App\Orchid\Screens\Reservation\ReservationListScreen;
use App\Orchid\Screens\Role\RoleEditScreen;
use App\Orchid\Screens\Role\RoleListScreen;
use App\Orchid\Screens\Settings\SiteSettingsScreen;
use App\Orchid\Screens\User\UserEditScreen;
use App\Orchid\Screens\User\UserListScreen;
use App\Orchid\Screens\User\UserProfileScreen;
use Illuminate\Support\Facades\Route;
use Tabuna\Breadcrumbs\Trail;

// Main dashboard — Na Ugle custom
Route::screen('/main', DashboardScreen::class)->name('platform.main');

// Hero slides
Route::screen('hero-slides', HeroSlideListScreen::class)->name('platform.hero');
Route::screen('hero-slides/create', HeroSlideEditScreen::class)->name('platform.hero.edit');
Route::screen('hero-slides/{slide}/edit', HeroSlideEditScreen::class)->name('platform.hero.edit.existing');

// Menu
Route::screen('menu/categories', MenuCategoryListScreen::class)->name('platform.menu.categories');
Route::screen('menu/categories/create', MenuCategoryEditScreen::class)->name('platform.menu.categories.edit');
Route::screen('menu/categories/{category}/edit', MenuCategoryEditScreen::class)->name('platform.menu.categories.edit.existing');
Route::screen('menu/items', MenuItemListScreen::class)->name('platform.menu.items');
Route::screen('menu/items/create', MenuItemEditScreen::class)->name('platform.menu.items.edit');
Route::screen('menu/items/{item}/edit', MenuItemEditScreen::class)->name('platform.menu.items.edit.existing');

// Gallery
Route::screen('gallery', GalleryListScreen::class)->name('platform.gallery');
Route::screen('gallery/create', GalleryEditScreen::class)->name('platform.gallery.edit');
Route::screen('gallery/{photo}/edit', GalleryEditScreen::class)->name('platform.gallery.edit.existing');

// Chef
Route::screen('chef', ChefProfileScreen::class)->name('platform.chef');

// Reservations
Route::screen('reservations', ReservationListScreen::class)->name('platform.reservations');
Route::screen('reservations/{reservation}/edit', ReservationEditScreen::class)->name('platform.reservations.edit');

// Settings
Route::screen('settings', SiteSettingsScreen::class)->name('platform.settings');
Route::post('settings/upload-pdf/{key}', [SettingsFileController::class, 'uploadPdf'])->name('platform.settings.upload-pdf');
Route::post('settings/delete-pdf/{key}', [SettingsFileController::class, 'deletePdf'])->name('platform.settings.delete-pdf');

// Platform > Profile
Route::screen('profile', UserProfileScreen::class)
    ->name('platform.profile')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Profile'), route('platform.profile')));

// Platform > System > Users
Route::screen('users/{user}/edit', UserEditScreen::class)
    ->name('platform.systems.users.edit')
    ->breadcrumbs(fn (Trail $trail, $user) => $trail
        ->parent('platform.systems.users')
        ->push($user->name, route('platform.systems.users.edit', $user)));
Route::screen('users/create', UserEditScreen::class)
    ->name('platform.systems.users.create')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.systems.users')
        ->push(__('Create'), route('platform.systems.users.create')));
Route::screen('users', UserListScreen::class)
    ->name('platform.systems.users')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Users'), route('platform.systems.users')));

// Platform > System > Roles
Route::screen('roles/{role}/edit', RoleEditScreen::class)
    ->name('platform.systems.roles.edit')
    ->breadcrumbs(fn (Trail $trail, $role) => $trail
        ->parent('platform.systems.roles')
        ->push($role->name, route('platform.systems.roles.edit', $role)));
Route::screen('roles/create', RoleEditScreen::class)
    ->name('platform.systems.roles.create')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.systems.roles')
        ->push(__('Create'), route('platform.systems.roles.create')));
Route::screen('roles', RoleListScreen::class)
    ->name('platform.systems.roles')
    ->breadcrumbs(fn (Trail $trail) => $trail
        ->parent('platform.index')
        ->push(__('Roles'), route('platform.systems.roles')));

// Examples (kept for reference, accessible but not in menu)
Route::screen('examples', ExampleScreen::class)->name('platform.example');
Route::screen('example-fields', ExampleFieldsScreen::class)->name('platform.example.fields');
Route::screen('example-layouts', ExampleLayoutsScreen::class)->name('platform.example.layouts');
Route::screen('example-charts', ExampleChartsScreen::class)->name('platform.example.charts');
Route::screen('example-editors', ExampleTextEditorsScreen::class)->name('platform.example.editors');
Route::screen('example-cards', ExampleCardsScreen::class)->name('platform.example.cards');
Route::screen('example-advanced', ExampleFieldsAdvancedScreen::class)->name('platform.example.advanced');
Route::screen('example-actions', ExampleActionsScreen::class)->name('platform.example.actions');
Route::screen('example-grid', ExampleGridScreen::class)->name('platform.example.grid');
