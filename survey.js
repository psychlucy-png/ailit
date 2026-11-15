/* 사후·추적 설문 — survey.html?t=2 (5일 복습 직후) · ?t=3 (1주 뒤) · ?t=4 (1달 뒤)
   주소 예: survey.html?t=3&pid=P001  (pid가 없으면 첫 화면에서 참여 번호를 입력받음)
   문항 구성은 measures.js의 WAVES[2~4] (척도북 T2, T3·T4 시트와 같음) */

STEPS = ["설문", "완료"];
jsPsych.data.addProperties({ wave: WAVE });

const surveyIntro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: () => `${steps(0)}<h1>${WAVE_NAMES[WAVE]}</h1><div class="card">
    <p>AI 리터러시 프로그램에 참여해 주셔서 고맙습니다. ${WAVE === 2 ? "영상·활동과 5일 복습을 모두 마친 지금의 생각을" : WAVE === 3 ? "프로그램을 마치고 1주일이 지난 지금의 생각과 생활을" : "프로그램을 마치고 한 달이 지난 지금의 생각과 생활을"} 묻는 설문이에요.</p>
    <p>약 ${Math.round(waveBlocks(WAVE).reduce((a, b) => a + b.items.length, 0) / 5)}분 걸리며, 정답이 없으니 솔직하게 답해 주세요.</p>
    <p class="sub">${CONFIG.CONTACT_HTML}</p></div>`,
  choices: ["시작하기"],
  data: { task: "survey_intro" },
};
const badWave = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<h1>주소를 확인해 주세요</h1><div class="card"><p>설문 주소가 올바르지 않아요. 받은 링크를 그대로 다시 열어 주세요.</p><p class="sub">${CONFIG.CONTACT_HTML}</p></div>`,
  choices: [], data: { task: "bad_link" },
};

if (!WAVES[WAVE]) {
  window.removeEventListener("beforeunload", warnLeave);
  jsPsych.run([badWave]);
} else {
  const blocks = waveBlocks(WAVE).map(b => blockTrial(b, null, 0, `t${WAVE}`));
  jsPsych.run([browserCheck, ...(HAS_PID ? [] : [pidEntryTrial(WAVE_NAMES[WAVE])]), surveyIntro, ...blocks, save, endPage]);
}
