<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $table = 'tags';
    
    protected $fillable = ['content'];

    public function phraseologies()
    {
        return $this->belongsToMany(Phraseology::class, 'phraseology_tag', 'tag_id', 'phraseology_id');
    }

}


