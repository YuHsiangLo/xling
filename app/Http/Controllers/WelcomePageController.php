<?php

namespace App\Http\Controllers;

class WelcomePageController extends Controller
{
    /**
     * Show the welcome page
     */
    public function show($locale)
    {
        \App::setLocale($locale);
        session(['my_locale' => $locale]);
        return view('welcome',
        [    'locale' => \App::getLocale() ]);
    }
}
