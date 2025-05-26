<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhraseologyDeletionRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'phraseology_id',
        'moderator_id',
        'reason',
        'status',
        'comment',
        'admin_id',
        'reviewed_at',
    ];

    public function phraseology()
    {
        return $this->belongsTo(Phraseology::class);
    }

    public function moderator()
    {
        return $this->belongsTo(Moderator::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
