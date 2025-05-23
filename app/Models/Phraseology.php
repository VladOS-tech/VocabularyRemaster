<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


class Phraseology extends Model
{
    use HasFactory;

    protected $table = 'phraseologies';

    protected $fillable = [
        'content',      
        'meaning',     
        'status',
        'confirmed_at',
        'moderator_id',
    ];

    public function moderator()
    {
        return $this->belongsTo(Moderator::class, 'moderator_id');
    }
    
    public function contexts()
    {
        return $this->hasMany(Context::class, 'phraseology_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'phraseology_tag', 'phraseology_id', 'tag_id');
    }
}

