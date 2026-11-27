/* 사전 설문 — 안내문·동의 → 참여 대상 확인 → 사전 설문 → 저장
   주소 예: pre-survey.html  (pid가 없으면 시작할 때 1~1000 가운데 다음 참여 번호를 자동으로 받습니다. pre-survey.html?pid=P001처럼 pid를 붙이면 그 번호를 씁니다) */

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
      <ol><li>사전 온라인 설문: 20분 이내 소요</li><li>온라인 AI 리터러시 교육 프로그램 참여: 1주일(1일차: 40분, 2~6일차: 5분씩)</li><li>프로그램 종료 직후 온라인 설문: 20분 이내 소요</li><li>참여 1주일 뒤 온라인 설문: 20분 이내 소요</li><li>참여 1개월 뒤 온라인 설문: 20분 이내 소요</li></ol>
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

// 보상 지급용 연락처 (설문 마지막). 설문 문항 필수 설정과 상관없이 세 칸 모두 필수.
// 열 이름: contact_name, contact_phone(010-0000-0000 꼴로 저장), contact_email, agree_link(프로그램 링크 수신·성실 참여 동의 체크, 1). 개인정보이므로 분석 자료에서는 뺀다.
const contact = {
  type: jsPsychSurveyHtmlForm,
  html: `<h1>연락처</h1>
    <div class="note">참여 보상을 지급하기 위해 이름, 전화번호, 이메일을 받습니다. 이 정보는 <b>보상 지급에만</b> 사용하며, 설문 응답과는 따로 관리합니다.</div>
    <div class="card">
      <label class="f"><b>이름</b></label>
      <p><input type="text" name="contact_name" required autocomplete="name" placeholder="홍길동" style="font-size:18px;padding:8px 12px;width:100%;max-width:320px"></p>
      <label class="f"><b>휴대전화 번호</b></label>
      <p><input type="tel" name="contact_phone" required inputmode="tel" autocomplete="tel" pattern="01[016789][\\-\\s]?[0-9]{3,4}[\\-\\s]?[0-9]{4}" placeholder="010-0000-0000" title="휴대전화 번호를 010-0000-0000 형식으로 적어 주세요." style="font-size:18px;padding:8px 12px;width:100%;max-width:320px"></p>
      <label class="f"><b>이메일</b></label>
      <p><input type="email" name="contact_email" required inputmode="email" autocomplete="email" placeholder="name@example.com" style="font-size:18px;padding:8px 12px;width:100%;max-width:320px"></p>
    </div>
    <div class="card">
      <p>1주일 뒤에 온라인 교육 프로그램에 참여할 수 있도록 링크가 발송될 예정입니다.</p>
      <div class="opts"><label><input type="checkbox" name="agree_link" value="1" required> <b>링크 수신에 동의하고 성실히 참여하겠습니다.</b></label></div>
    </div>`,
  button_label: "제출하기",
  data: { task: "contact" },
  on_finish: d => { flatten(d);
    d.agree_link = String(d.agree_link) === "1" ? 1 : 0;
    d.contact_name = String(d.contact_name || "").trim(); d.contact_email = String(d.contact_email || "").trim();
    const n = String(d.contact_phone || "").replace(/\D/g, ""); if (n.length >= 10) d.contact_phone = `${n.slice(0, 3)}-${n.slice(3, n.length - 4)}-${n.slice(-4)}`;
    window.scrollTo(0, 0); },
};

const preBlocks = waveBlocks(1).map(b => b.id === "s" ? selfUseTrial(b, 1, "pre") : blockTrial(b, null, 1, "pre")); // 척도북 T1 (measures.js의 WAVES[1])

// 참여 번호 자동 부여: 주소에 pid가 없으면 시작할 때 저장 서버에서 1~1000 가운데 다음 번호를 받아 옵니다.
// · 같은 브라우저에서 새로고침하거나 다시 들어오면 받은 번호를 그대로 씁니다(번호가 낭비되지 않게).
// · 서버에서 번호를 받지 못하면(연결 문제, Apps Script 미배포) 예전처럼 무작위 번호로 진행하고 pid_source에 "random"이 남습니다.
// · debug=1(연구자 확인용)일 때는 번호를 받지 않습니다.
const PID_KEY = "ailit_main_pid";
function setPid(v, src) { PID = String(v); jsPsych.data.addProperties({ pid: PID, pid_source: src }); }
const assignPid = {
  type: jsPsychCallFunction,
  async: true,
  func: async done => {
    if (HAS_PID) { jsPsych.data.addProperties({ pid_source: "url" }); return done(); }
    if (DEBUG) { jsPsych.data.addProperties({ pid_source: "debug" }); return done(); }
    try { const saved = localStorage.getItem(PID_KEY); if (/^\d{1,4}$/.test(saved || "")) { setPid(saved, "auto_saved"); return done(); } } catch (e) {}
    jsPsych.getDisplayElement().innerHTML = `<div class="card center"><p>설문을 준비하고 있어요. 잠시만 기다려 주세요.</p></div>`;
    for (let i = 0; i < 2; i++) {
      try {
        const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 10000);
        const r = await (await fetch(`${CONFIG.SHEETS_URL}?get=newid`, { signal: ctl.signal })).json();
        clearTimeout(tm);
        if (r && r.ok && Number(r.pid) >= 1 && Number(r.pid) <= 1000) {
          setPid(Number(r.pid), "auto");
          try { localStorage.setItem(PID_KEY, PID); } catch (e) {}
          return done();
        }
        if (r && r.error === "full") break;
      } catch (e) {}
    }
    jsPsych.data.addProperties({ pid_source: "random" });
    done();
  },
  data: { task: "assign_pid" },
};

const timeline = [
  assignPid, browserCheck, consent, screening,
  { timeline: [save, screenOutPage], conditional_function: () => !ELIGIBLE },
  { timeline: [...preBlocks, contact, save, endPage], conditional_function: () => ELIGIBLE },
];
jsPsych.run(timeline);
