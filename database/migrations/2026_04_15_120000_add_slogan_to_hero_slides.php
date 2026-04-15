<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->text('slogan')->nullable()->after('title');
        });

        // Backfill: copy current global hero_slogan into all existing slides
        $globalSlogan = DB::table('site_settings')->where('key', 'hero_slogan')->value('value');
        if ($globalSlogan) {
            DB::table('hero_slides')->update(['slogan' => $globalSlogan]);
        }
    }

    public function down(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropColumn('slogan');
        });
    }
};
