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

  // 사전·사후 설문 문항을 꼭 답해야 넘어가는지 (true: 필수, false: 비워 두고 넘어갈 수 있음)
  // 동의·참여 대상 확인·활동 페이지에는 영향 없음
  SURVEY_REQUIRED: false,

  // 연구 정보 (안내문·디브리핑에 표시)
  STUDY_TITLE: "생성형 AI 활용 역량 증진을 위한 교육 프로그램 개발 및 평가",
  CONTACT_HTML: "연구 책임자: 양수진 교수 (sujinyang@ewha.ac.kr)<br>이화여자대학교 심리학과 대학원 성장경험연구실<br>문의: 석사과정생 이가희 (전화번호: 010-2468-1127 / 이메일: agelabewhaai@gmail.com)",
  RESEARCHER_CONTACT: "석사과정생 이가희, agelabewhaai@gmail.com",

  // 종료 후 패널 업체 등으로 돌려보낼 주소 (선택). {pid}는 참가자 ID로 바뀝니다.
  REDIRECT_URL: "",
  // 종료 화면에 보여줄 완료 코드 (선택)
  COMPLETION_CODE: "",
};
