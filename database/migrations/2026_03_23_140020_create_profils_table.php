<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profils', function (Blueprint $table) {
    $table->id();
    $table->string('matricule')->unique();
    $table->string('mot_de_passe');
    $table->string('nom');
    $table->string('role');
    $table->string('fonction');
    $table->string('telephone')->nullable();
    $table->longText('image')->nullable(); // base64
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profils');
    }
};
