<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('short_links', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->after('id')
                ->constrained()
                ->cascadeOnDelete();
            $table->boolean('locked')->default(false)->after('original_url');
            $table->unsignedInteger('clicks')->default(0)->after('locked');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('short_links', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'locked', 'clicks']);
        });
    }
};
