<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('phraseology_deletion_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phraseology_id')->constrained()->onDelete('cascade');
            $table->foreignId('moderator_id')->constrained('moderators')->onDelete('cascade');
            $table->text('reason')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('comment')->nullable();
            $table->foreignId('admin_id')->nullable()->constrained('admins')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phraseology_deletion_requests');
    }
};
