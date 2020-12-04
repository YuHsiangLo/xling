<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Recording;
use Exception;

class RecordingController extends Controller
{
    /**
     * Create a new recorder instance so that user can submit
     */
    public function create()
    {
        return view('recorder',
            [ 'locale' => \App::getLocale() ]);
    }

    /**
     * Save the user's recording
     */
    public function store(Request $request)
    {
        // Muaz Khan     - www.MuazKhan.com
        // MIT License   - https://www.webrtc-experiment.com/licence/
        // Documentation - https://github.com/muaz-khan/RecordRTC

        Log::Info('About to upload recording.');

        // define variables and set to empty values
        $user = $request->session()->get('user_id');

        if (!isset($request['audio-filename']) && !isset($request['video-filename'])) {
            Log::Error('Empty file name');
            return response('Empty file name.');
        }

        // do NOT allow empty file names
        if (empty($request['audio-filename']) && empty($request['video-filename'])) {
            Log::Error('Empty file name');
            return response('Empty file name.');
        }

        $fileName = '';
        $tempName = '';
        $file_idx = '';
        $participantFolder = $request['participant_folder'];

        if (!empty($request->file('audio-blob'))) {
            $file_idx = 'audio-blob';
            $fileName = $request['audio-filename'];
            $tempName = $_FILES[$file_idx]['tmp_name'];
        } else {
            $file_idx = 'video-blob';
            $fileName = $request['video-filename'];
            $tempName = $_FILES[$file_idx]['tmp_name'];
        }

        if(!empty($_FILES[$file_idx]["error"]) && ($_FILES[$file_idx]["error"] != 0)) {
            $listOfErrors = array(
                '1' => 'The uploaded file exceeds the upload_max_filesize directive in php.ini.',
                '2' => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form.',
                '3' => 'The uploaded file was only partially uploaded.',
                '4' => 'No file was uploaded.',
                '6' => 'Missing a temporary folder. Introduced in PHP 5.0.3.',
                '7' => 'Failed to write file to disk. Introduced in PHP 5.1.0.',
                '8' => 'A PHP extension stopped the file upload. PHP does not provide a way to ascertain which extension caused the file upload to stop; examining the list of loaded extensions with phpinfo() may help.'
            );
            $error = $_FILES[$file_idx]["error"];

            if(!empty($listOfErrors[$error])) {
                Log::Error($listOfErrors[$error]);
                return response($listOfErrors[$error]);
            }
            else {
                Log::Error('Not uploaded because of error #'.$_FILES["$file_idx"]["error"]);
                return response('Not uploaded because of error #'.$_FILES["$file_idx"]["error"]);
            }
        }

        if (empty($fileName) || empty($tempName)) {
            if(empty($tempName)) {
                Log::Error('Invalid temp_name: '.$tempName);
                return response('Invalid temp_name: '.$tempName);
            }
            Log::Error('Invalid file name: '.$fileName);
            return response('Invalid file name: '.$fileName);
        }


        $filePath = '../storage/app/audio/' . $participantFolder . $fileName;

        // make sure that one can upload only allowed audio/video files
        $allowed = array(
            'webm',
            'wav',
            'mp4',
            "mkv",
            'mp3',
            'ogg'
        );

        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        if (!$extension || empty($extension) || !in_array($extension, $allowed)) {
            Log::Error('Invalid file extension: '.$extension);
            return response('Invalid file extension: '.$extension);
        }

        if (!file_exists('../storage/app/audio/'.$participantFolder)) {
            try {
                mkdir('../storage/app/audio/'.$participantFolder, 0775, true);
            } catch (Exception $e) {
                Log::Error('Problem creating participant folder: ../storage/app/audio'.$participantFolder.' : '.$e);
                return response('Problem creating participant folder: ../storage/app/audio'.$participantFolder.' : '.$e->getMessage());
            }
        }

        try {
            if (!move_uploaded_file($tempName, $filePath)) {
                Log::Error('Problem saving file: '.$tempName.','.$filePath);
                return response('Problem saving file: '.$tempName.','.$filePath);
            }
        } catch (Exception $e) {
            Log::Error('Problem saving file: '.$tempName.','.$filePath.' : '.$e);
            return response('Problem saving file: '.$tempName.','.$filePath.' : '.$e->getMessage());
        }

        echo 'success';

        $testModel = Recording::create([
            'consent_form_id' => $user,
            'recording_filename' => $fileName
        ]);

    }

    // delete the recording
    public function destroy($id)
    {
        if (Gate::allows('manage-data')) {
            $recording = app(\App\Recording::class)->where('consent_form_id', '=', $id)->first();;
            if (is_null($recording)) {
                // Recording could not be found
                return back()->with('error', 'Delete failed - this recording could not be found!');
            };
            Storage::delete('audio/' . $recording->consent_form_id . '/' . $recording->recording_filename);
            $recording->delete();
            return back()->with('status', 'Recording ID ' . $recording->consent_form_id . ' has been successfully deleted!');
        }

        return redirect('admin')->with('error', 'You are not currently authorized to manage submissions!');
    }

}

