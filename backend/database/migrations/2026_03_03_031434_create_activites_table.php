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
    Schema::create('activites', function (Blueprint $table) {
        $table->id();
        $table->string('reference')->unique();
        $table->text('description');
        $table->string('pta');
        $table->string('bailleur');
        $table->date('date_debut');
        $table->date('date_fin');

        $table->foreignId('profil_id')
              ->constrained('profils')
              ->onDelete('cascade');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activites');
    }
};
