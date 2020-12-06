/*!
 *  Lang.js for Laravel localization in JavaScript.
 *
 *  @version 1.1.10
 *  @license MIT https://github.com/rmariuzzo/Lang.js/blob/master/LICENSE
 *  @site    https://github.com/rmariuzzo/Lang.js
 *  @author  Rubens Mariuzzo <rubens@mariuzzo.com>
 */
(function(root,factory){"use strict";if(typeof define==="function"&&define.amd){define([],factory)}else if(typeof exports==="object"){module.exports=factory()}else{root.Lang=factory()}})(this,function(){"use strict";function inferLocale(){if(typeof document!=="undefined"&&document.documentElement){return document.documentElement.lang}}function convertNumber(str){if(str==="-Inf"){return-Infinity}else if(str==="+Inf"||str==="Inf"||str==="*"){return Infinity}return parseInt(str,10)}var intervalRegexp=/^({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])$/;var anyIntervalRegexp=/({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])/;var defaults={locale:"en"};var Lang=function(options){options=options||{};this.locale=options.locale||inferLocale()||defaults.locale;this.fallback=options.fallback;this.messages=options.messages};Lang.prototype.setMessages=function(messages){this.messages=messages};Lang.prototype.getLocale=function(){return this.locale||this.fallback};Lang.prototype.setLocale=function(locale){this.locale=locale};Lang.prototype.getFallback=function(){return this.fallback};Lang.prototype.setFallback=function(fallback){this.fallback=fallback};Lang.prototype.has=function(key,locale){if(typeof key!=="string"||!this.messages){return false}return this._getMessage(key,locale)!==null};Lang.prototype.get=function(key,replacements,locale){if(!this.has(key,locale)){return key}var message=this._getMessage(key,locale);if(message===null){return key}if(replacements){message=this._applyReplacements(message,replacements)}return message};Lang.prototype.trans=function(key,replacements){return this.get(key,replacements)};Lang.prototype.choice=function(key,number,replacements,locale){replacements=typeof replacements!=="undefined"?replacements:{};replacements.count=number;var message=this.get(key,replacements,locale);if(message===null||message===undefined){return message}var messageParts=message.split("|");var explicitRules=[];for(var i=0;i<messageParts.length;i++){messageParts[i]=messageParts[i].trim();if(anyIntervalRegexp.test(messageParts[i])){var messageSpaceSplit=messageParts[i].split(/\s/);explicitRules.push(messageSpaceSplit.shift());messageParts[i]=messageSpaceSplit.join(" ")}}if(messageParts.length===1){return message}for(var j=0;j<explicitRules.length;j++){if(this._testInterval(number,explicitRules[j])){return messageParts[j]}}var pluralForm=this._getPluralForm(number);return messageParts[pluralForm]};Lang.prototype.transChoice=function(key,count,replacements){return this.choice(key,count,replacements)};Lang.prototype._parseKey=function(key,locale){if(typeof key!=="string"||typeof locale!=="string"){return null}var segments=key.split(".");var source=segments[0].replace(/\//g,".");return{source:locale+"."+source,sourceFallback:this.getFallback()+"."+source,entries:segments.slice(1)}};Lang.prototype._getMessage=function(key,locale){locale=locale||this.getLocale();key=this._parseKey(key,locale);if(this.messages[key.source]===undefined&&this.messages[key.sourceFallback]===undefined){return null}var message=this.messages[key.source];var entries=key.entries.slice();var subKey="";while(entries.length&&message!==undefined){var subKey=!subKey?entries.shift():subKey.concat(".",entries.shift());if(message[subKey]!==undefined){message=message[subKey];subKey=""}}if(typeof message!=="string"&&this.messages[key.sourceFallback]){message=this.messages[key.sourceFallback];entries=key.entries.slice();subKey="";while(entries.length&&message!==undefined){var subKey=!subKey?entries.shift():subKey.concat(".",entries.shift());if(message[subKey]){message=message[subKey];subKey=""}}}if(typeof message!=="string"){return null}return message};Lang.prototype._findMessageInTree=function(pathSegments,tree){while(pathSegments.length&&tree!==undefined){var dottedKey=pathSegments.join(".");if(tree[dottedKey]){tree=tree[dottedKey];break}tree=tree[pathSegments.shift()]}return tree};Lang.prototype._applyReplacements=function(message,replacements){for(var replace in replacements){message=message.replace(new RegExp(":"+replace,"gi"),function(match){var value=replacements[replace];var allCaps=match===match.toUpperCase();if(allCaps){return value.toUpperCase()}var firstCap=match===match.replace(/\w/i,function(letter){return letter.toUpperCase()});if(firstCap){return value.charAt(0).toUpperCase()+value.slice(1)}return value})}return message};Lang.prototype._testInterval=function(count,interval){if(typeof interval!=="string"){throw"Invalid interval: should be a string."}interval=interval.trim();var matches=interval.match(intervalRegexp);if(!matches){throw"Invalid interval: "+interval}if(matches[2]){var items=matches[2].split(",");for(var i=0;i<items.length;i++){if(parseInt(items[i],10)===count){return true}}}else{matches=matches.filter(function(match){return!!match});var leftDelimiter=matches[1];var leftNumber=convertNumber(matches[2]);if(leftNumber===Infinity){leftNumber=-Infinity}var rightNumber=convertNumber(matches[3]);var rightDelimiter=matches[4];return(leftDelimiter==="["?count>=leftNumber:count>leftNumber)&&(rightDelimiter==="]"?count<=rightNumber:count<rightNumber)}return false};Lang.prototype._getPluralForm=function(count){switch(this.locale){case"az":case"bo":case"dz":case"id":case"ja":case"jv":case"ka":case"km":case"kn":case"ko":case"ms":case"th":case"tr":case"vi":case"zh":return 0;case"af":case"bn":case"bg":case"ca":case"da":case"de":case"el":case"en":case"eo":case"es":case"et":case"eu":case"fa":case"fi":case"fo":case"fur":case"fy":case"gl":case"gu":case"ha":case"he":case"hu":case"is":case"it":case"ku":case"lb":case"ml":case"mn":case"mr":case"nah":case"nb":case"ne":case"nl":case"nn":case"no":case"om":case"or":case"pa":case"pap":case"ps":case"pt":case"so":case"sq":case"sv":case"sw":case"ta":case"te":case"tk":case"ur":case"zu":return count==1?0:1;case"am":case"bh":case"fil":case"fr":case"gun":case"hi":case"hy":case"ln":case"mg":case"nso":case"xbr":case"ti":case"wa":return count===0||count===1?0:1;case"be":case"bs":case"hr":case"ru":case"sr":case"uk":return count%10==1&&count%100!=11?0:count%10>=2&&count%10<=4&&(count%100<10||count%100>=20)?1:2;case"cs":case"sk":return count==1?0:count>=2&&count<=4?1:2;case"ga":return count==1?0:count==2?1:2;case"lt":return count%10==1&&count%100!=11?0:count%10>=2&&(count%100<10||count%100>=20)?1:2;case"sl":return count%100==1?0:count%100==2?1:count%100==3||count%100==4?2:3;case"mk":return count%10==1?0:1;case"mt":return count==1?0:count===0||count%100>1&&count%100<11?1:count%100>10&&count%100<20?2:3;case"lv":return count===0?0:count%10==1&&count%100!=11?1:2;case"pl":return count==1?0:count%10>=2&&count%10<=4&&(count%100<12||count%100>14)?1:2;case"cy":return count==1?0:count==2?1:count==8||count==11?2:3;case"ro":return count==1?0:count===0||count%100>0&&count%100<20?1:2;case"ar":return count===0?0:count==1?1:count==2?2:count%100>=3&&count%100<=10?3:count%100>=11&&count%100<=99?4:5;default:return 0}};return Lang});

(function () {
    Lang = new Lang();
    Lang.setMessages({"en.auth":{"failed":"These credentials do not match our records.","throttle":"Too many login attempts. Please try again in :seconds seconds."},"en.messages":{"CSRFTokenError":"The CSRF Token is missing or has expired.","ConsentEmail":"Email:","ConsentName":"Name:","ConsentParticipation":"Consent to participate","ConsentParticipationConsent":"I have read the consent form above and consent to participate.","ConsentPublication":"2. Consent to publish excerpts from recordings","ConsentPublicationConsent":"I consent to excerpts of my recordings being published. (Optional)","ConsentTitle":"Consent Form","DemoTitle":"Demographic questionnaire","IndexLink":"Participate in the experiment.","IndexTitle":"Xling","Next":"Next page","OK":"OK","Optional":"Optional","RecorderActivateAudioButton":"Activate Audio","RecorderActivateAudioPrompt":"Please click the button below to activate the audio recording functionality in your web browser. If your computer or device has multiple microphone inputs, you may be prompted for which input you wish to activate. If you select the wrong input by mistake, please reload this page and you should be prompted again.","RecorderActivateAudioTitle":"Audio Activation","RecorderAdditionalReadingTitle":"Spontaneous Speech Prompts","RecorderBrowserError":"Sorry, your web browser does not seem to support Web Audio API. The online recorder will not function. Please try upgrading your browser, or try a different browser.","RecorderClose":"Close Recorder","RecorderEncoding":"Please wait while encoding audio. This may take a minute...","RecorderInputLevelLabel":"Input Level Meter","RecorderInstructionsTitle":"Instructions","RecorderMicInputCheckAbove":"Now, check your microphone input levels. Your microphone is activated, but you are not currently being recorded. Try speaking random sentences into the microphone and see how the volume meter reacts (this volume meter also appears in the recording panel). The numbers on the top represent the decibel level, with the quietest sound at -42 dB, and the loudest at 0 dB. As you speak, one or two green bar(s) should appear below indicating what your current recording level is.","RecorderMicInputCheckBelow":"As long as your normal speaking volume is between -24 and -12 (decibels), your current volume is excellent. If your normal speaking is below -36 decibels, you should move closer to the microphone and\/or adjust your settings. If you you are so loud that the input level is reaching 0 (the loudest possible level it can record), please lower your volume or move further away to avoid distortion in the recording.","RecorderMicInputCheckNoSignal":"If you are not seeing any reaction on the level meter, try refreshing this webpage and selecting a different audio input source when activating audio.","RecorderMicInputCheckTitle":"Input Level Check","RecorderNotYet":"Recording not yet submitted","RecorderPlaybackSubmitLabel":"Playback \/ Submit","RecorderReadingTitle":"Reading Sample: Vancouver Dawn","RecorderRec":"Click to Start Recording","RecorderSave":"Submit Recording","RecorderStatusDialogTitle":"Status","RecorderStop":"Recording - Click When Finished","RecorderSubmitBegin":"Beginning recording submission process...","RecorderSubmitConfirm":"Are you sure you wish to submit this recording?","RecorderTestTitle":"Test Recording","RecorderTitle":"Create Recording","RecorderToolTitle":"Recording Tool","RecorderUploadAborted":"Upload Aborted!","RecorderUploadErrorPrefix":"Error: ","RecorderUploadFailed":"Failed to upload to server.","RecorderUploadGettingFileURL":"Getting File URL...","RecorderUploadProgressPrefix":"Upload Progress ","RecorderUploadStarted":"Upload Started...","RecorderUploadSuccessful":"Upload Successful!","RecorderUploadThankYou":"If you still have additional recordings to complete and submit, click OK to return to the interface and proceed with recording them.<br><br>If this was your final recording, thank you for participating! You may now close this window.","SelectLanguageTitle":"Select Language","SomethingWentWrong":"Something went wrong. Please click OK and try submitting your recording again.","Submit":"Submit","WelcomeTitle":"Welcome"},"en.pagination":{"next":"Next &raquo;","previous":"&laquo; Previous"},"en.passwords":{"reset":"Your password has been reset!","sent":"We have emailed your password reset link!","throttled":"Please wait before retrying.","token":"This password reset token is invalid.","user":"We can't find a user with that email address."},"en.questionnaire":{"Age":"Age *","CityPlaceHolder":"City, Country","Gender":"Gender *","Location":"Current place of residence *","PoB":"Place of birth","SpokenLanguages":"Other languages that you are fluent in:"},"en.validation":{"accepted":"The :attribute must be accepted.","active_url":"The :attribute is not a valid URL.","after":"The :attribute must be a date after :date.","after_or_equal":"The :attribute must be a date after or equal to :date.","alpha":"The :attribute may only contain letters.","alpha_dash":"The :attribute may only contain letters, numbers, dashes and underscores.","alpha_num":"The :attribute may only contain letters and numbers.","array":"The :attribute must be an array.","attributes":[],"before":"The :attribute must be a date before :date.","before_or_equal":"The :attribute must be a date before or equal to :date.","between":{"array":"The :attribute must have between :min and :max items.","file":"The :attribute must be between :min and :max kilobytes.","numeric":"The :attribute must be between :min and :max.","string":"The :attribute must be between :min and :max characters."},"boolean":"The :attribute field must be true or false.","confirmed":"The :attribute confirmation does not match.","custom":{"attribute-name":{"rule-name":"custom-message"}},"date":"The :attribute is not a valid date.","date_equals":"The :attribute must be a date equal to :date.","date_format":"The :attribute does not match the format :format.","different":"The :attribute and :other must be different.","digits":"The :attribute must be :digits digits.","digits_between":"The :attribute must be between :min and :max digits.","dimensions":"The :attribute has invalid image dimensions.","distinct":"The :attribute field has a duplicate value.","email":"The :attribute must be a valid email address.","ends_with":"The :attribute must end with one of the following: :values.","exists":"The selected :attribute is invalid.","file":"The :attribute must be a file.","filled":"The :attribute field must have a value.","gt":{"array":"The :attribute must have more than :value items.","file":"The :attribute must be greater than :value kilobytes.","numeric":"The :attribute must be greater than :value.","string":"The :attribute must be greater than :value characters."},"gte":{"array":"The :attribute must have :value items or more.","file":"The :attribute must be greater than or equal :value kilobytes.","numeric":"The :attribute must be greater than or equal :value.","string":"The :attribute must be greater than or equal :value characters."},"image":"The :attribute must be an image.","in":"The selected :attribute is invalid.","in_array":"The :attribute field does not exist in :other.","integer":"The :attribute must be an integer.","ip":"The :attribute must be a valid IP address.","ipv4":"The :attribute must be a valid IPv4 address.","ipv6":"The :attribute must be a valid IPv6 address.","json":"The :attribute must be a valid JSON string.","lt":{"array":"The :attribute must have less than :value items.","file":"The :attribute must be less than :value kilobytes.","numeric":"The :attribute must be less than :value.","string":"The :attribute must be less than :value characters."},"lte":{"array":"The :attribute must not have more than :value items.","file":"The :attribute must be less than or equal :value kilobytes.","numeric":"The :attribute must be less than or equal :value.","string":"The :attribute must be less than or equal :value characters."},"max":{"array":"The :attribute may not have more than :max items.","file":"The :attribute may not be greater than :max kilobytes.","numeric":"The :attribute may not be greater than :max.","string":"The :attribute may not be greater than :max characters."},"mimes":"The :attribute must be a file of type: :values.","mimetypes":"The :attribute must be a file of type: :values.","min":{"array":"The :attribute must have at least :min items.","file":"The :attribute must be at least :min kilobytes.","numeric":"The :attribute must be at least :min.","string":"The :attribute must be at least :min characters."},"not_in":"The selected :attribute is invalid.","not_regex":"The :attribute format is invalid.","numeric":"The :attribute must be a number.","password":"The password is incorrect.","present":"The :attribute field must be present.","regex":"The :attribute format is invalid.","required":"The :attribute field is required.","required_if":"The :attribute field is required when :other is :value.","required_unless":"The :attribute field is required unless :other is in :values.","required_with":"The :attribute field is required when :values is present.","required_with_all":"The :attribute field is required when :values are present.","required_without":"The :attribute field is required when :values is not present.","required_without_all":"The :attribute field is required when none of :values are present.","same":"The :attribute and :other must match.","size":{"array":"The :attribute must contain :size items.","file":"The :attribute must be :size kilobytes.","numeric":"The :attribute must be :size.","string":"The :attribute must be :size characters."},"starts_with":"The :attribute must start with one of the following: :values.","string":"The :attribute must be a string.","timezone":"The :attribute must be a valid zone.","unique":"The :attribute has already been taken.","uploaded":"The :attribute failed to upload.","url":"The :attribute format is invalid.","uuid":"The :attribute must be a valid UUID."},"mn_tw.messages":{"CSRFTokenError":"The CSRF Token is missing or has expired.","ConsentEmail":"\u96fb\u5b50\u4fe1\u7bb1","ConsentName":"\u59d3\u540d","ConsentParticipation":"1\u3001\u60a8\u540c\u610f\u53c3\u8207\u672c\u7814\u7a76","ConsentParticipationConsent":"\u6211\u540c\u610f\u53c3\u8207\u672c\u7814\u7a76\u3002","ConsentPublication":"2\u3001\u60a8\u540c\u610f\u6211\u5011\u767c\u8868\u60a8\u7684\u90e8\u5206\u9304\u97f3","ConsentPublicationConsent":"\u6211\u540c\u610f\u7814\u7a76\u8005\u53ef\u767c\u8868\u9304\u97f3\u7684\u90e8\u5206\u5167\u5bb9\uff08\u81ea\u7531\u52fe\u9078\uff09\u3002","ConsentTitle":"\u7814\u7a76\u53d7\u8a66\u540c\u610f\u66f8","DemoTitle":"\u8a9e\u8a00\u80cc\u666f\u554f\u5377","IndexLink":"\u9ede\u64ca\u6b64\u9375\u9032\u5165\u7814\u7a76\u9801\u9762","IndexTitle":"Xling\u8de8\u8a9e\u8a00\u8a9e\u6599\u5eab","Next":"\u4e0b\u4e00\u9801","OK":"\u4e86\u89e3","Optional":"\u81ea\u7531\u9078\u586b","RecorderActivateAudioButton":"\u555f\u7528\u9ea5\u514b\u98a8","RecorderActivateAudioPrompt":"\u8acb\u9ede\u64ca\u4e0b\u65b9\u300c\u555f\u7528\u9ea5\u514b\u98a8\u300d\u9375\u4ee5\u555f\u7528\u700f\u89bd\u5668\u7684\u9ea5\u514b\u98a8\u3002\u82e5\u60a8\u7684\u96fb\u8166\u6216\u8a2d\u5099\u5177\u5099\u591a\u500b\u9ea5\u514b\u98a8\u97f3\u6e90\uff0c\u8acb\u9078\u64c7\u9069\u7576\u7684\u9ea5\u514b\u98a8\u97f3\u6e90\u3002\u82e5\u60a8\u9078\u64c7\u932f\u8aa4\u7684\u9ea5\u514b\u98a8\u97f3\u6e90\uff0c\u8acb\u91cd\u65b0\u6574\u7406\u672c\u9801\u9762\u5f8c\u518d\u6b21\u9078\u64c7\u3002","RecorderActivateAudioTitle":"\u700f\u89bd\u5668\u9ea5\u514b\u98a8\u6b0a\u9650","RecorderAdditionalReadingTitle":"\u81ea\u7531\u66a2\u8ac7","RecorderBrowserError":"\u62b1\u6b49\u60a8\u7684\u7db2\u8def\u700f\u89bd\u5668\u4e0d\u652f\u63f4Audio API\u3002\u7dda\u4e0a\u9304\u97f3\u5c07\u7121\u6cd5\u6b63\u5e38\u57f7\u884c\u3002\u8acb\u66f4\u65b0\u6216\u4f7f\u7528\u5176\u4ed6\u700f\u89bd\u5668\u3002","RecorderClose":"\u95dc\u9589\u9ea5\u53ef\u98a8","RecorderEncoding":"\u9304\u97f3\u6a94\u8655\u7406\u4e2d\uff0c\u8acb\u8010\u5fc3\u7b49\u5f85\u3002\u6b64\u6b65\u9a5f\u53ef\u80fd\u8017\u6642\u5e7e\u5206\u9418...","RecorderInputLevelLabel":"\u9ea5\u514b\u98a8\u97f3\u91cf","RecorderInstructionsTitle":"\u64cd\u4f5c\u8aaa\u660e","RecorderMicInputCheckAbove":"\u73fe\u5728\u8acb\u8abf\u6574\u9ea5\u514b\u98a8\u97f3\u91cf\u3002\u60a8\u7684\u9ea5\u514b\u98a8\u5df2\u958b\u555f\uff0c\u4f46\u76ee\u524d\u9084\u672a\u958b\u59cb\u9304\u97f3\uff0c\u8acb\u8a66\u8457\u5c0d\u9ea5\u514b\u98a8\u96a8\u610f\u8aaa\u5e7e\u500b\u53e5\u5b50\uff0c\u4e26\u78ba\u5b9a\u4e0b\u65b9\u97f3\u91cf\u8a08\u4e2d\u7684\u9577\u689d\u6709\u78ba\u5be6\u79fb\u52d5\u3002\u97f3\u91cf\u8a08\u4e0a\u7684\u6578\u5b57\u986f\u793a\u76ee\u524d\u7684\u97f3\u91cf\u5206\u8c9d\uff0c\u6700\u5c0f\u97f3\u91cf\u70ba-42\u5206\u8c9d\uff0c\u6700\u5927\u97f3\u91cf\u70ba0\u5206\u8c9d\u3002\u7576\u60a8\u958b\u59cb\u8aaa\u8a71\u6642\uff0c\u97f3\u91cf\u8a08\u4e2d\u7684\u7da0\u8272\u9577\u689d\u6703\u986f\u793a\u60a8\u76ee\u524d\u97f3\u91cf\u7684\u5206\u8c9d\u6578\u3002","RecorderMicInputCheckBelow":"\u82e5\u60a8\u6b63\u5e38\u8aaa\u8a71\u6642\u7684\u97f3\u91cf\u4ecb\u65bc-24\u548c-12\u5206\u8c9d\u4e4b\u9593\uff0c\u8868\u793a\u60a8\u76ee\u524d\u7684\u8aaa\u8a71\u97f3\u91cf\u826f\u597d\u3002\u82e5\u60a8\u6b63\u5e38\u8aaa\u8a71\u6642\u7684\u97f3\u91cf\u5c0f\u65bc-36\u5206\u8c9d\uff0c\u8acb\u79fb\u8fd1\u60a8\u7684\u9ea5\u514b\u98a8\u6216\u662f\u8abf\u6574\u9ea5\u514b\u98a8\u7684\u97f3\u91cf\u8a2d\u5b9a\u3002\u82e5\u60a8\u6b63\u5e38\u8aaa\u8a71\u6642\u7684\u97f3\u91cf\u63a5\u8fd10\u5206\u8c9d\uff0c\u8acb\u964d\u4f4e\u60a8\u7684\u97f3\u91cf\u6216\u662f\u5c07\u9ea5\u514b\u98a8\u79fb\u9060\u4ee5\u907f\u514d\u60a8\u7684\u9304\u97f3\u5931\u771f\u3002","RecorderMicInputCheckNoSignal":"\u5982\u679c\u60a8\u4e0a\u65b9\u7684\u97f3\u91cf\u8a08\u4e26\u672a\u986f\u793a\u4efb\u4f55\u6d3b\u52d5\uff0c\u8acb\u91cd\u65b0\u6574\u7406\u672c\u9801\u9762\u4e26\u9078\u64c7\u53e6\u4e00\u9ea5\u514b\u98a8\u97f3\u6e90\u3002","RecorderMicInputCheckTitle":"\u9ea5\u514b\u98a8\u97f3\u91cf","RecorderNotYet":"\u9304\u97f3\u6a94\u5c1a\u672a\u4e0a\u50b3","RecorderPlaybackSubmitLabel":"\u9304\u97f3\u7d50\u679c","RecorderReadingTitle":"\u6587\u7ae0\u95b1\u8b80","RecorderRec":"\u6309\u6b64\u958b\u59cb\u9304\u97f3","RecorderSave":"\u4e0a\u50b3\u9304\u97f3\u6a94","RecorderStatusDialogTitle":"\u6a94\u6848\u4e0a\u50b3\u8cc7\u8a0a","RecorderStop":"\u9304\u97f3\u4e2d \u2014 \u6309\u6b64\u7d50\u675f\u9304\u97f3","RecorderSubmitBegin":"\u6e96\u5099\u4e0a\u50b3...","RecorderSubmitConfirm":"\u60a8\u78ba\u5b9a\u8981\u4e0a\u50b3\u672c\u97f3\u6a94\uff1f","RecorderTestTitle":"\u9304\u97f3\u6e2c\u8a66","RecorderTitle":"\u8a9e\u6599\u9304\u88fd","RecorderToolTitle":"\u9304\u97f3\u5de5\u5177","RecorderUploadAborted":"\u6368\u68c4\u4e0a\u50b3","RecorderUploadErrorPrefix":"\u932f\u8aa4\uff1a ","RecorderUploadFailed":"\u4e0a\u50b3\u4f3a\u670d\u5668\u5931\u6557","RecorderUploadGettingFileURL":"\u53d6\u5f97\u6a94\u6848URL...","RecorderUploadProgressPrefix":"\u4e0a\u50b3\u9032\u5ea6 ","RecorderUploadStarted":"\u4e0a\u50b3\u958b\u59cb...","RecorderUploadSuccessful":"\u4e0a\u50b3\u6210\u529f","RecorderUploadThankYou":"\u82e5\u60a8\u9084\u6709\u5176\u4ed6\u9304\u97f3\u6a94\u9808\u5b8c\u6210\u6216\u662f\u4e0a\u50b3\uff0c\u8acb\u6309OK\u81f3\u9304\u97f3\u4ecb\u9762\u4e26\u7e7c\u7e8c\u9304\u97f3\u3002<br><br>\u82e5\u6b64\u70ba\u60a8\u6700\u5f8c\u7684\u9304\u97f3\u6a94\uff0c\u518d\u6b21\u611f\u8b1d\u60a8\u7684\u53c3\u8207\uff01\u60a8\u73fe\u5728\u53ef\u4ee5\u95dc\u9589\u672c\u9801\u9762\u3002","SelectLanguageTitle":"\u9078\u64c7\u8a9e\u8a00","SomethingWentWrong":"\u4e0a\u50b3\u5931\u6557\uff0c\u8acb\u6309\u300c\u4e86\u89e3\u300d\u4e26\u518d\u5617\u8a66\u4e0a\u50b3\u4e00\u6b21\u3002","Submit":"\u63d0\u4ea4","WelcomeTitle":"\u6b61\u8fce"},"mn_tw.questionnaire":{"Age":"\u5e74\u9f61 *","CityPlaceHolder":"\u57ce\u5e02\u540d","Gender":"\u6027\u5225 *","Location":"\u73fe\u5c45\u5730 *","PoB":"\u51fa\u751f\u5730 *","SpokenLanguages":"\u60a8\u6703\u8aaa\u7684\u5176\u4ed6\u8a9e\u8a00\uff08\u5305\u542b\u53f0\u8a9e\u3001\u5ba2\u8a9e\u53ca\u539f\u4f4f\u540d\u8a9e\u8a00\uff09\uff1a"}});
})();
