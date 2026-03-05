<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profils', function (Blueprint $table) {

            $table->id();

            $table->string('nom');
            $table->string('matricule')->unique();
            $table->string('role');
            $table->string('fonction');
            $table->string('telephone')->nullable();
            $table->string('mot_de_passe');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profils');
    }
};