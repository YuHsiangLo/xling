<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ConsentForm extends Model
{
    // Store consent forms as JSON
    use \Okipa\LaravelModelJsonStorage\ModelJsonStorage;

    public $fillable = [
        'consent_form_id',
        'name',
        'email',
        'public',
        'language'
    ];

}
