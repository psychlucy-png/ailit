/* 사전 설문 — 안내문·동의 → 참여 대상 확인 → 사전 설문 → 저장
   주소 예: pre-survey.html?pid=P001  (pid가 없으면 무작위 참여 번호를 만들어 마지막 화면에 보여 줍니다) */

STEPS = ["동의·확인", "사전 설문", "완료"];

const consent = {
  type: jsPsychSurveyHtmlForm,
  html: `<h1>연구 참여 안내문</h1>
    <div class="card consent">
      <h3>연구 제목</h3><p>${CONFIG.STUDY_TITLE}</p>
      <p>본 연구는 생성형 AI를 비판적이고 건강하게 활용할 수 있도록 돕는 교육 프로그램을 개발하여 그 효과를 검증하고자 합니다. 귀하의 참여는 향후 AI 리터러시 증진 및 건강한 AI 사용을 위한 교육 프로그램 개발에 중요한 기초자료가 될 것입니다.</p>
      <h3>연구 참여 대상</h3>
      <p>AI를 사용하는 만 19세~30세 성인 대학생 및 대학원생</p>
      <ol><li>컴퓨터 또는 모바일 기기를 활용하여 온라인 프로그램에 참여할 수 있음</li><li>한국어를 통한 의사소통에 어려움이 없음</li></ol>
      <p class="sub">* 현재 우울증, 불안장애, 그리고 기타 중증도 이상의 심리적 질환으로 인한 정기적인 상담이나 병원/약물 치료를 받고 있는 자는 연구 참여에서 배제됩니다.</p>
      <h3>연구 참여 절차</h3>
      <ol><li>사전 온라인 설문: 20분 이내 소요</li><li>온라인 AI 리터러시 교육 프로그램 참여: 1주일</li><li>프로그램 종료 직후 온라인 설문: 20분 이내 소요</li><li>참여 1주일 뒤 온라인 설문: 20분 이내 소요</li><li>참여 1개월 뒤 온라인 설문: 20분 이내 소요</li></ol>
      <p class="sub">* 보상: 전문조사기관으로 참여해주시는 분들께서는 설문 조사 기관의 보상 절차에 따라 소정의 보상을 받게 됩니다. 온라인 모집으로 본 연구에 참여해주신 분들께는 참여 시간에 대해 소정의 보상을 절차에 따라 지급해드릴 것입니다. 단, 중도에 참여를 철회하시는 경우 철회 이후의 보상은 지급하지 않습니다.</p>
      <h3>위험 및 불편 사항</h3>
      <p>연구 참여와 관련하여 시간이 소요되거나 컴퓨터 사용으로 인한 눈의 피로 외에 알려진 위험 요소는 없습니다.</p>
      <h3>자발적 참여 및 철회</h3>
      <p>연구 참여는 전적으로 자발적이며, 언제든지 설문창을 닫아 참여를 철회할 수 있습니다. 이 경우 귀하의 데이터는 즉시 삭제됩니다. 단, 데이터는 익명으로 저장되기 때문에 설문이 완료된 후에는 철회가 불가능합니다.</p>
      <h3>개인정보 보호 및 기밀 유지</h3>
      <p>모든 데이터는 익명으로 처리되며, 연구자만 접근 가능한 암호화된 클라우드 드라이브에 안전하게 보관됩니다. 법규에 따라 데이터는 연구 종료 후 3년 동안 보관되며, 이후 영구적으로 삭제됩니다.</p>
      <h3>연락처</h3>
      <p>${CONFIG.CONTACT_HTML}</p>
    </div>
    <div class="card">
      ${agreeQ("consent_purpose", "본 연구의 연구 목적을 이해하고 연구에 참여하기를 희망합니다.")}
      ${agreeQ("consent_withdraw", "본 연구 도중 자유롭게 참여를 철회할 수 있음을 이해하였습니다.")}
    </div>`,
  button_label: "다음",
  data: { task: "consent" },
  on_finish: d => {
    flatten(d);
    if (d.consent_purpose !== "1" || d.consent_withdraw !== "1") {
      window.removeEventListener("beforeunload", warnLeave);
      jsPsych.endExperiment(`<div class="jspsych-content"><h1>참여해 주셔서 감사합니다</h1><div class="card"><p>연구 참여에 동의하지 않으셨기 때문에 여기서 마칩니다. 어떤 응답도 저장되지 않았습니다. 이 창을 닫아 주세요.</p></div></div>`);
    }
  },
};

let ELIGIBLE = true;
const screening = {
  type: jsPsychSurveyHtmlForm,
  html: `<h1>참여 대상 확인</h1><div class="card">
    ${yesno("scr_student", "현재 대학생 또는 대학원생이십니까?")}
    ${yesno("scr_age", "만 19세 이상 30세 이하이십니까?")}
    ${yesno("scr_ai", "생성형 AI(ChatGPT, Gemini, Claude 등)를 사용하고 계십니까?")}
    ${yesno("scr_treat", "현재 우울증, 불안장애, 그리고 기타 중증도 이상의 심리적 질환으로 인한 정기적인 상담이나 병원/약물 치료를 받고 계십니까?")}
  </div>`,
  button_label: "다음",
  data: { task: "screening" },
  on_finish: d => {
    flatten(d);
    ELIGIBLE = d.scr_student === "1" && d.scr_age === "1" && d.scr_ai === "1" && d.scr_treat === "2";
    d.eligible = ELIGIBLE;
    jsPsych.data.addProperties({ eligible: ELIGIBLE });
  },
};
const screenOutPage = {
  type: jsPsychHtmlButtonResponse,
  stimulus: () => { window.removeEventListener("beforeunload", warnLeave);
    return `<h1>참여해 주셔서 감사합니다</h1><div class="card"><p>아쉽지만 이번 연구의 참여 대상에 해당하지 않아 여기서 마칩니다. 이 창을 닫아 주세요.</p>
      <p class="sub">${CONFIG.CONTACT_HTML}</p></div>`; },
  choices: [],
  data: { task: "screen_out" },
};

// 마지막 화면: 참여 번호 + (설정한 경우) 프로그램으로 이어가기 버튼
function END_EXTRA() {
  const url = CONFIG.PROGRAM_URL ? `${CONFIG.PROGRAM_URL}${CONFIG.PROGRAM_URL.includes("?") ? "&" : "?"}pid=${encodeURIComponent(PID)}` : "";
  return `<div class="card center"><p>나의 참여 번호</p><p style="font-size:28px;font-weight:800;letter-spacing:2px;margin:4px 0">${esc(PID)}</p>
    <p class="sub">프로그램에 참여할 때 이 번호가 필요해요. 화면을 캡처하거나 적어 두세요.</p>
    ${url ? `<p style="margin-top:14px"><a class="jspsych-btn" style="display:inline-block;text-decoration:none" href="${url}">프로그램 시작하기</a></p>` : ""}</div>`;
}

const preBlocks = [...PRE_ONLY.map(b => blockTrial(b, "", 1, "pre")), ...PREPOST.map(b => blockTrial(b, "pre_", 1, "pre"))];

const timeline = [
  browserCheck, consent, screening,
  { timeline: [save, screenOutPage], conditional_function: () => !ELIGIBLE },
  { timeline: [...preBlocks, save, endPage], conditional_function: () => ELIGIBLE },
];
jsPsych.run(timeline);
