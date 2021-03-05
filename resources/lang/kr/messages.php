﻿<?php

// resources/lang/en/messages.php

return [
    "IndexTitle" => "Xling Corpus",
    "IndexLink" => "연구 참여",
    "SelectLanguageTitle" => "언어 선택",
    "WelcomeTitle" => "환영합니다",
    "UploadInstructionText" => "You'll need to record yourself and upload the recordings through this website. To make sure the file-uploading function is working properly,",  //TODO
    "UploadButtonText" => "click here to test file upload.", //TODO
    "ConsentTitle" => "동의 양식",
    "ConsentParticipation" => "1. 참여 동의",
    "Optional" => "선택",
    "ConsentName" => "이름",
    "ConsentEmail" => "이메일",
    "ConsentParticipationConsent" => "위의 동의 양식을 읽었으며 참여에 동의합니다.",
    "ConsentPublication" => "2. 녹음의 일부분을 발췌하여 대중과 공유하는 것에 대한 동의",
    "ConsentPublicationConsent" => "녹음에서 말한 내용을 게시하는 데 동의합니다. (선택사항)",
    "Submit" => "제출하기",
    "DemoTitle" => "통계 설문지",
    "Next" => "다음",
    "OK" => "확인",
    "CSRFTokenError" => "CSRF 토큰이 없거나 만료되었습니다.",
    "SomethingWentWrong" => "문제가 발생했습니다. 확인을 클릭하고 녹음을 다시 제출하십시오.",
    "RecorderTitle" => "녹음 시작",
    "RecorderInstructionsTitle" => "설명",
    "RecorderTestTitle" => "녹음 연습",
    "RecorderToolTitle" => "녹음",
    "RecorderInputLevelLabel" => "소리 레벨",
    "RecorderPlaybackSubmitLabel" => "재생",
    "RecorderReadingTitle" => "말하기 샘플",
    "RecorderAdditionalReadingTitle" => "자발적 말하기",
    "RecorderActivateAudioTitle" => "오디오 활성하기",
    "RecorderActivateAudioPrompt" => "웹 브라우저에서 오디오 녹음 기능을 활성화하려면 아래 버튼을 클릭하십시오. 컴퓨터 또는 장치에 여러 마이크 입력이있는 경우 활성화 할 입력을 묻는 메시지가 표시 될 수 있습니다. 실수로 잘못 입력 한 경우이 페이지를 새로 고침하면 다시 메시지가 표시됩니다.",
    "RecorderActivateAudioButton" => "오디오 활성하기",
    "RecorderRec" => "녹음시작버튼",
    "RecorderStop" => "녹음중 - 끝나면 다시 눌러주세요",
    "RecorderSave" => "녹음 제출하기",
    "RecorderDownload" => "녹음본 다운받기",
    "RecorderClose" => "녹음 닫기",
    "RecorderNotYet" => "녹음을 아직 제출하지 않으셨습니다.",
    "RecorderEncoding" => "녹음를 저장하는 동안 잠시 기다려주십시오. 이 작업은 몇 분 정도 걸릴 수 있습니다...",
    "RecorderMicInputCheckTitle" => "소리 레벨 확인",
    "RecorderMicInputCheckAbove" => "이제 마이크 입력 레벨을 확인하십시오. 마이크가 활성화되었지만 현재 녹음 중이 아닙니다. 마이크에 연습문장을 말하고 볼륨 미터가 어떻게 반응하는지 확인하십시오. 이 볼륨 미터는 녹음 패널에도 나타납니다. 상단의 숫자는 데시벨 레벨을 나타내며 가장 조용한 사운드는 -42dB, 가장 큰 사운드는 0dB입니다. 말할 때 아래에 하나 또는 두 개의 녹색 막대가 나타나 현재 녹음 수준을 나타냅니다.",
    "RecorderMicInputCheckBelow" => "정상적으로 말할때 볼륨이 -24에서 -12 데시벨 사이라면 현재 볼륨은 훌륭합니다. 정상적으로 말할때 -36 데시벨 미만이면 마이크에 더 가까이 이동하거나 설정을 조정해야합니다. 너무 크게 말하여 입력 레벨이 0에 도달하면 볼륨을 낮추거나 녹음이 왜곡되지 않도록 멀리 이동하십시오.",
    "RecorderMicInputCheckNoSignal" => "레벨 미터에서 반응이 보이지 않으면이 웹 페이지를 새로 고침하고 오디오를 활성화할때 다른 오디오 입력 소스를 선택하십시오.",
    "RecorderStatusDialogTitle" => "상태",
    "RecorderSubmitConfirm" => "이 녹음을 제출 하시겠습니까?",
    "RecorderSubmitBegin" => "녹음 제출 시작 중 ...",
    "RecorderUploadStarted" => "업로드 시작 ...",
    "RecorderUploadProgressPrefix" => "업로드 진행률",
    "RecorderUploadErrorPrefix" => "오류: ",
    "RecorderUploadGettingFileURL" => "파일 URL을 가져 오는 중 ...",
    "RecorderUploadFailed" => "서버에 업로드하지 못했습니다. Please use the 'Download recording' button to save the recording to your device and send it to research assistant XXX at YYY@ZZZ.",
    "RecorderUploadAborted" => "업로드가 중단되었습니다! Please use the 'Download recording' button to save the recording to your device and send it to research assistant XXX at YYY@ZZZ.",
    "RecorderUploadSuccessful" => "업로드 성공!",
    "RecorderUploadThankYou" => "완료하고 제출해야할 추가 녹음이있는 경우, 확인을 클릭하여 페이지로 돌아가서 녹음을 계속하십시오.<br><br>모든 녹음이 완료되었다면 참여해 주셔서 감사합니다! 이제 이 창을 닫아도됩니다.",
    "RecorderBrowserError" => "죄송합니다. 웹 브라우저가 Web Audio API를 지원하지 않습니다. 온라인 녹음이 작동하지 않습니다. 브라우저를 업그레이드하거나 다른 브라우저를 사용해보십시오.",
    "UploadTestPassed" => "Upload test passed!", //TODO
    "UploadTestFailed" =>
        "업로드를 실패하였습니다. 다른 브라우저를 사용하거나 컴퓨터로 다시 시도해보십시오.
        이미 완료한 녹음본으로 제출하려면 '녹음본 다운받기'로 녹음본을 저장하신 후 연구 조교에게 보내주시면 됩니다.
        질문이 있으시다면 연구조교 XXX의 이메일 XXX@YY로 연락주세요."
];
