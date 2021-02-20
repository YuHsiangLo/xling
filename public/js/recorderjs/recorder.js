/*License (MIT)

Copyright © 2013 Matt Diamond

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

(function(window){

    var WORKER_PATH = '../js/recorderjs/recorderWorker.js';

    var Recorder = function(source, cfg){
        var config = cfg || {};
        var bufferLen = config.bufferLen || 4096;
        this.context = source.context;
        if(!this.context.createScriptProcessor){
            this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
        } else {
            this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
        }

        var worker = new Worker(config.workerPath || WORKER_PATH);
        worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate
            }
        });
        var recording = false,
            currCallback;

        this.node.onaudioprocess = function(e){
            if (!recording) return;
            worker.postMessage({
                command: 'record',
                buffer: [
                    e.inputBuffer.getChannelData(0),
                    e.inputBuffer.getChannelData(1)
                ]
            });
        }

        this.configure = function(cfg){
            for (var prop in cfg){
                if (cfg.hasOwnProperty(prop)){
                    config[prop] = cfg[prop];
                }
            }
        }

        this.record = function(){
            recording = true;
        }

        this.stop = function(){
            recording = false;
        }

        this.clear = function(){
            worker.postMessage({ command: 'clear' });
        }

        this.getBuffers = function(cb) {
            currCallback = cb || config.callback;
            worker.postMessage({ command: 'getBuffers' })
        }

        this.exportWAV = function(cb, type){
            currCallback = cb || config.callback;
            type = type || config.type || 'audio/wav';
            if (!currCallback) throw new Error('Callback not set');
            worker.postMessage({
                command: 'exportWAV',
                type: type
            });
        }

        this.exportMP3 = function(cb, type) {
            currCallback = cb || config.callback;
            type = type || config.type || 'audio/mpeg';
            if (!currCallback) throw new Error('Callback not set');
            worker.postMessage({
                command: 'exportMP3',
                type: type
            });
        }

        this.exportMonoWAV = function(cb, type){
            currCallback = cb || config.callback;
            type = type || config.type || 'audio/wav';
            if (!currCallback) throw new Error('Callback not set');
            worker.postMessage({
                command: 'exportMonoWAV',
                type: type
            });
        }

        worker.onmessage = function(e){
            var blob = e.data;
            currCallback(blob);
        }

        source.connect(this.node);
        this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
    };

    function makeXMLHttpRequest(url, data, callback) {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                if(request.responseText === 'success') {
                    callback('upload-ended');
                    return;
                } else {
                    callback(Lang.get('messages.RecorderUploadErrorPrefix') + request.responseText);
                }
            } else if (request.readyState == 4 && request.status == 400) {
                callback(Lang.get('messages.RecorderUploadErrorPrefix') + `${request.status}: ${request.statusText}` + '<br/><br/>' + Lang.get('messages.SomethingWentWrong'));
            } else if (request.readyState == 4 && request.status == 419) {
                callback(Lang.get('messages.RecorderUploadErrorPrefix') + `${request.status}: ${request.statusText}` + Lang.get('messages.CSRFTokenError')); // Laravel-specific error code
            } else if (request.readyState == 4 && request.status == 413) {
                callback(Lang.get('messages.RecorderUploadErrorPrefix') + `${request.status}: ${request.statusText}` + ': The uploaded file likely exceeds the post_max_size directive in php.ini'); // not bothering to translate since this should only come up if the server is misconfigured
            } else if (request.readyState == 4) {
                callback(Lang.get('messages.RecorderUploadErrorPrefix') + `${request.status}: ${request.statusText}`); // e.g. 404: Not Found
            }
        };

        request.upload.onloadstart = function() {
            callback(Lang.get('messages.RecorderUploadStarted'));
        };

        request.upload.onprogress = function(event) {
            callback(Lang.get('messages.RecorderUploadProgressPrefix') + Math.round(event.loaded / event.total * 100) + "%");
        };

        request.upload.onload = function() {
            callback(Lang.get('messages.RecorderUploadGettingFileURL'));
        };

        request.upload.onerror = function(error) {
            callback(Lang.get('messages.RecorderUploadFailed'));
        };

        request.upload.onabort = function(error) {
            callback(Lang.get('messages.RecorderUploadAborted'));
        };

        const token = document.querySelector('meta[name="csrf-token"]').content;

        request.open('POST', url);
        request.setRequestHeader('X-CSRF-TOKEN', token);
        request.send(data);
    }

    Recorder.setupDownload = function(blob, filename){
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = document.getElementById("save");
        link.href = url;
        link.download = filename || 'output.wav';
    }

    Recorder.setupPhpPost  = function(blob, callback){
        var date = new Date();
        var hour = date.getHours().toString();
        var minute = date.getMinutes().toString();
        var second = date.getSeconds().toString();
        var timestamp = hour + '-' + minute + '-' + second;

        var fileext = ".wav";
        if (blob.type == "audio/mpeg") {
            fileext = ".mp3";
        }
        console.log('Setting up Php Post');
        var filename = user_id + '_' + timestamp + fileext;
        var formData = new FormData();
        formData.append('participant_folder', user_id + '/');
        formData.append('audio-filename', filename);
        formData.append('audio-blob', blob);
        makeXMLHttpRequest('/recordings', formData, function(progress) {
            if (progress !== 'upload-ended') {
                callback(progress)
                return;
            }

            callback('ended');

        });
        // var request = new XMLHttpRequest();

        // request.open('POST', '/save.php');
        // request.send(formData);
        console.log('PHP post submitted');
        // var url = (window.URL || window.webkitURL).createObjectURL(blob);
        // var link = document.getElementById("save");
        // link.href = url;
        // link.download = filename || 'output.wav';
    }

    window.Recorder = Recorder;

})(window);
