<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Context extends Model
{
    use HasFactory;

    protected $table = 'contexts';

    protected $fillable = [
        'phraseology_id', 
        'content',         
    ];

    public function phraseology()
    {
        return $this->belongsTo(Phraseology::class, 'phraseology_id');
    }
}

