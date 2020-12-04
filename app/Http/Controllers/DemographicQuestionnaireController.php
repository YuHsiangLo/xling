<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\DemographicQuestionnaire;
use Illuminate\Support\Facades\Log;
use UA;
use Illuminate\Support\Facades\Gate;

class DemographicQuestionnaireController extends Controller
{
    /**
     * Create a new demographic questionnaire instance so that user can submit
     */
    public function create(Request $request)
    {
        return view('demographic_questionnaire',
            [ 'locale' => \App::getLocale(), 'useragent' => UA::parse($request->header('user-agent'))]);
    }

    /**
     * Save the user's demographic questionnaire
     */
    public function store(Request $request)
    {
        // define variables
        $user = $request->session()->get('user_id');

        $questionnaire = new DemographicQuestionnaire;

        $questionnaire->consent_form_id = $user;

        // iterate through all form variables to store questionnaire data
        foreach($request->all() as $key => $value) {
            if ($key != "_token") {
                $questionnaire[$key] = $value;
            }
        }

        $questionnaire->save();

        return redirect()->route('recordings.create');
    }

    // delete the demographic questionnaire
    public function destroy($id)
    {
        if (Gate::allows('manage-data')) {
            $demographic_questionnaire = app(\App\DemographicQuestionnaire::class)->where('consent_form_id', '=', $id)->first();;
            if (is_null($demographic_questionnaire)) {
                // User could not be found
                return back()->with('error', 'Delete failed - this demographic questionnaire could not be found!');
            };
            $demographic_questionnaire->delete();
            return back()->with('status', 'Demographic questionnaire ID ' . $demographic_questionnaire->consent_form_id . ' has been successfully deleted!');
        }

        return redirect('admin')->with('error', 'You are not currently authorized to manage submissions!');
    }
}
