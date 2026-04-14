<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->date('date');
            $table->time('time')->nullable();
            $table->unsignedSmallInteger('guests')->default(1);
            $table->text('comment')->nullable();
            $table->enum('status', ['new', 'confirmed', 'cancelled'])->default('new');
            $table->timestamps();
            $table->index(['status', 'date']);
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
