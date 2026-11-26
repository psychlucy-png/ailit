/* 일상 속 디지털 기술 이해 프로그램 · 사후·추적 설문 — survey-b.html?t=2 (5일 복습 직후) · ?t=3 (1주 뒤) · ?t=4 (1달 뒤)
   문항은 survey.html과 같되(measures-main.js의 WAVES), ‘나의 작은 변화 실천’(chg)과 AI 사용 자가점검(s)은 묻지 않습니다. 열 이름도 같습니다(t2_lit_1 …).
   응답은 "T2_직후_B", "T3_1주뒤_B", "T4_1달뒤_B" 탭에 저장되고 cond 열에 "B"가 기록됩니다. */

sheetName = () => ({ 2: "T2_직후_B", 3: "T3_1주뒤_B", 4: "T4_1달뒤_B" })[WAVE] || "T_B";
[2, 3, 4].forEach(t => { WAVES[t] = WAVES[t].filter(id => id !== "chg" && id !== "s"); }); // AI 사용 자가점검(s)은 T1에서만
BLOCK.csq.instruction = "참여하신 프로그램(영상·활동·5일 복습) 전체를 떠올리며 답해 주세요.";
STEPS = ["설문", "완료"];
jsPsych.data.addProperties({ wave: WAVE, cond: "B" });

const surveyIntro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: () => `${steps(0)}<h1>${WAVE_NAMES[WAVE]}</h1><div class="card">
    <p>프로그램에 참여해 주셔서 고맙습니다. ${WAVE === 2 ? "영상·활동과 5일 복습을 모두 마친 지금의 생각을" : WAVE === 3 ? "프로그램을 마치고 1주일이 지난 지금의 생각과 생활을" : "프로그램을 마치고 한 달이 지난 지금의 생각과 생활을"} 묻는 설문이에요.</p>
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
  const blocks = waveBlocks(WAVE).map(b => b.id === "s" ? selfUseTrial(b, 0, `t${WAVE}`) : blockTrial(b, null, 0, `t${WAVE}`));
  jsPsych.run([browserCheck, ...(HAS_PID ? [] : [pidEntryTrial(WAVE_NAMES[WAVE])]), surveyIntro, ...blocks, save, endPage]);
}
