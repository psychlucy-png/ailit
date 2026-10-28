// ===================== 연구자가 수정하는 설정 =====================
// 이 파일만 고치면 대부분의 설정을 바꿀 수 있습니다.
const CONFIG = {
  // DataPipe(https://pipe.jspsych.org)에서 Google Drive 저장으로 만든 실험 ID.
  // 비워 두면 "로컬 테스트 모드": 데이터를 서버로 보내지 않고 마지막 화면에서 CSV 파일로 내려받습니다.
  DATAPIPE_ID: "1kKB1xVeGkvG",

  // 영상 시청 인정 기준: 실제 재생 시간이 영상 길이의 몇 % 이상이어야 '다음' 버튼이 열리는지
  MIN_WATCH_RATIO: 0.95,

  // 소리 확인 문항을 몇 번 틀리면 그냥 통과시킬지 (통과 여부는 데이터에 기록됨)
  SOUNDCHECK_MAX_TRIES: 3,

  // 활동 페이지 최소 체류 시간(초). 0이면 제한 없음. 예: 60으로 하면 1분 전에는 '다음'을 눌러도 넘어가지 않음
  MIN_ACTIVITY_SEC: 0,

  // 연구 정보 (동의서·디브리핑에 표시)
  STUDY_TITLE: "AI 리터러시 프로그램",
  RESEARCHER_CONTACT: "[연구자 이름 · 소속 · 이메일을 입력하세요]",
  IRB_INFO: "[IRB 승인 번호를 입력하세요]",
  COUNSELING_INFO: "[학교 상담센터 이름 · 전화번호 · 위치를 입력하세요]",
  EST_MINUTES: 30,

  // 종료 후 패널 업체 등으로 돌려보낼 주소 (선택). {pid}는 참가자 ID로 바뀝니다.
  REDIRECT_URL: "",
  // 종료 화면에 보여줄 완료 코드 (선택)
  COMPLETION_CODE: "",
};
