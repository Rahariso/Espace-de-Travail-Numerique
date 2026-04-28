<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activites', function (Blueprint $table) {
            $table->id();
            $table->string('nom_activite');
            $table->string('statut');
            $table->string('responsable');
            $table->json('participants')->nullable();
            $table->text('commentaire')->nullable();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->foreignId('profil_id')->constrained('profils')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activites');
    }
};
