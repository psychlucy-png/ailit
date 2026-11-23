// 본실험 전용 (program.html). 파일럿(pilot.html)은 program.js를 그대로 씁니다 — 2026-11-17 파일럿 동결.
/* AI 리터러시 프로그램 — 영상 1 → 영상 2 → 활동 1 → 영상 3 → 활동 2 → 영상 4 → 나의 작은 변화 → 사후 설문 → 저장
   주소 예: program.html?pid=P001  (사전 설문에서 받은 참여 번호. 주소에 없으면 첫 화면에서 입력받습니다) */

STEPS = ["영상 1", "영상 2", "활동 1", "영상 3", "활동 2", "영상 4", "마무리"];
const IS_PILOT = typeof PILOT !== "undefined" && PILOT === true; // pilot.html: 영상·활동·평정만 (사전·사후 설문 없음)
// 파일럿에서만: 영상·활동마다 자유 의견 칸
const pilotComment = name => IS_PILOT ? `<div class="card"><label class="f"><b>어색하거나 이해하기 어려웠던 부분, 고치면 좋을 점이 있다면 적어 주세요.</b> <span class="sub">(선택)</span></label>
  <textarea name="${name}" placeholder="예: 0:45쯤 글자가 너무 빨리 지나갔어요"></textarea></div>` : "";

function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const OPT5 = ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"];

/* ---------- 0. 시작 ---------- */
const pidEntry = pidEntryTrial("AI 리터러시 프로그램");

const welcome = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<h1>AI 리터러시 프로그램</h1>
    <div class="card"><p>짧은 영상 4편과 활동 2개로 이루어져 있어요. 모두 합쳐 <b>약 30~35분</b> 걸립니다.</p>
    <ol><li>영상 1. AI는 어떻게 답을 만들까?</li><li>영상 2. AI에게 생각을 맡길 때</li><li>활동 1. AI 답변 확인하기</li>
    <li>영상 3. AI에게 마음을 기댈 때</li><li>활동 2. AI의 다정함 다시 보기</li><li>영상 4. 주체적으로 AI 사용하기</li></ol>
    <p class="sub">마지막에 짧은 설문이 이어집니다.</p></div>`,
  choices: ["다음"],
  data: { task: "welcome" },
};

/* ---------- 1. 영상 + 확인 문항·영상 평정 ---------- */
// 파일럿(RA 평정)용 영상 평가 5문항
const LEN5 = ["너무 길다", "조금 길다", "적절하다", "조금 짧다", "너무 짧다"];
const SPD5 = ["너무 빠르다", "조금 빠르다", "적절하다", "조금 느리다", "너무 느리다"];
// 파일럿: 영상 바로 뒤에 그 영상 평가 5문항
function pilotVideoRate(n, stepIdx) {
  return {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<h1>영상 ${n}에 대한 평가</h1><div class="card">
      ${likert(`pv${n}_understand`, "영상에서 설명하는 내용을 쉽게 이해할 수 있었다.", OPT5)}
      ${likert(`pv${n}_length`, "영상의 길이는 적절하였다.", LEN5)}
      ${likert(`pv${n}_speed`, "영상의 설명 속도는 적절하였다.", SPD5)}
      ${likert(`pv${n}_relevance`, "영상에서 제시하는 내용은 대학(원)생의 실제 AI 사용 상황과 관련이 있다.", OPT5)}
      ${likert(`pv${n}_apply`, "영상에서 제시하는 AI 활용 방법을 실제 생활에 적용할 수 있을 것 같다.", OPT5)}</div>`,
    button_label: "다음",
    data: { task: "video_rate", video: n },
    on_finish: d => { flatten(d); window.scrollTo(0, 0); },
  };
}
// 영상 1~4 모두 영상 바로 뒤에 내용 확인 1문항(check_vN, check_vN_correct) + 영상 평정. 활동 1-B·2-B 퀴즈와는 따로 채점
function checkTrial(n, stepIdx, q, options, correct) {
  if (IS_PILOT) return pilotVideoRate(n, stepIdx);
  return {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}${q ? `<h2>영상 ${n} 확인 문항</h2>
      <div class="card"><div class="lq">${q}</div>
      <div class="opts">${options.map((o, i) => `<label><input type="radio" name="check_v${n}" value="${i + 1}" required> ${o}</label>`).join("")}</div></div>` : ""}
      <h2>영상 ${n}에 대한 생각</h2>
      <div class="card">
        ${likert(`rate_v${n}_like`, "이 영상이 흥미로웠다.", OPT5)}
        ${likert(`rate_v${n}_chg`, "영상을 시청한 후 AI 사용에 대한 생각이 바뀌었다.", OPT5)}
        ${n === 1 ? "" : likert(`rate_v${n}_int`, "나는 이 영상에서 제안한 내용을 실천해 볼 의향이 있다.", OPT5)}
      </div>${pilotComment(`cm_v${n}`)}`,
    button_label: "다음",
    data: { task: "video_check", video: n },
    on_finish: d => { flatten(d); if (q) d[`check_v${n}_correct`] = Number(d[`check_v${n}`]) === correct ? 1 : 0; window.scrollTo(0, 0); },
  };
}

const video1 = videoTrial(1, 0, "AI는 어떻게 답을 만들까?");
video1.stimulus = video1.stimulus.replace(/src="video1\.mp4[^"]*"/, 'src="video1-main.mp4?v=1123d"'); // 본실험 전용: 자막과 용어 설명 카드를 넣은 영상 1 (2026-11-18)
const check1 = checkTrial(1, 0, "영상에서 설명한, AI가 답을 만드는 방식에 가장 가까운 것은?", [
  "질문의 의미를 사람처럼 이해한 뒤 답한다",
  "학습한 패턴을 바탕으로 다음에 올 표현을 확률적으로 예측한다",
  "답을 내기 전에 항상 사실인지 스스로 확인한다",
  "모르는 내용은 반드시 모른다고 답한다"], 2);
const video2 = videoTrial(2, 1, "AI에게 생각을 맡길 때");
const check2 = checkTrial(2, 1, "영상에서 말한 ‘인지적 외주화’의 뜻으로 알맞은 것은?", [
  "어려운 과제를 여러 사람이 나누어 맡아 부담을 줄이는 것",
  "AI가 사람의 생각과 판단을 완전히 대신하게 되는 것",
  "기억, 계산, 비판적 사고 등 인간의 인지적 과정을 외부 도구에 맡겨 생각의 부담을 줄이는 것",
  "도구를 쓰지 않고 머릿속으로만 처리하는 연습을 해 기억력을 기르는 것"], 3);
const video3 = videoTrial(3, 3, "AI에게 마음을 기댈 때");
const check3 = checkTrial(3, 3, "영상에서 AI의 공감에 대해 말한 내용과 가장 가까운 것은?", [
  "감정을 느끼지 못하므로 AI의 공감하는 말은 위로가 되지 않는다",
  "공감하는 말을 만들 수 있고 위로가 될 수도 있지만, 감정을 직접 느끼거나 서로 책임을 나누는 관계를 맺을 수는 없다",
  "대화가 쌓여 나에게 맞춰지면 사람과의 관계를 대신할 수 있다",
  "사람과 달리 나를 평가하지 않으므로 사람의 공감보다 더 믿을 만하다"], 2);
// 영상 4: '오늘의 작은 변화'를 묻는 순간(약 2:48) 영상이 멈추고 아래에 입력창이 뜹니다. 입력하면 생각할 시간(빈 화면 약 10초)을 건너뛰고 이어서 재생합니다.
const video4 = videoTrial(4, 5, "주체적으로 AI 사용하기", {
  at: 168.2, skipTo: 178.2,
  // 2026-11-23: 보기를 고르지 않고 직접 적게 함(예시는 안내로만 보여 줌). 적은 내용을 실천할 의향을 5점으로 물음(change_intent)
  html: `<h2>나의 작은 변화</h2>
    <label class="f"><b>오늘부터 해 볼 작은 변화를 구체적으로 적어 주세요.</b></label>
    <p class="sub">예시: AI 답변을 천천히 읽고, 중요한 정보는 믿을 만한 출처로 확인하기 / AI가 내 편만 들 때 다른 관점을 요청하기 / 과제를 시작할 때 5분 동안 내 생각 먼저 적기</p>
    <textarea name="change_text" placeholder="여기에 적어 주세요"></textarea>
    ${likert("change_intent", "나는 위에 적은 변화를 실천할 의향이 있다.", OPT5)}`,
  collect: f => {
    const txt = f.querySelector('textarea[name="change_text"]').value.trim(), it = f.querySelector('input[name="change_intent"]:checked');
    if (txt.length < 2) return "오늘부터 해 볼 작은 변화를 적어 주세요.";
    if (!it) return "실천할 의향을 골라 주세요.";
    rememberChange(txt);
    return { change_text: txt, change_intent: Number(it.value) };
  },
});
// 본실험 전용: 내레이션 자막을 넣은 영상 2~4 (2026-11-23). 파일럿은 video2~4.mp4 그대로.
[video2, video3, video4].forEach((v, k) => { v.stimulus = v.stimulus.replace(new RegExp(`src="video${k + 2}\\.mp4[^"]*"`), `src="video${k + 2}-main.mp4?v=1123d"`); });
const check4 = checkTrial(4, 5, "영상에서 ‘신경가소성’을 이야기한 이유로 가장 알맞은 것은?", [
  "AI를 많이 쓰면 뇌가 줄어들기 때문에",
  "먼저 생각하고 확인하는 경험이 쌓이면 새로운 습관이 될 수 있기 때문에",
  "한 번 생긴 습관은 바뀌지 않기 때문에",
  "AI가 뇌의 연결을 대신 만들어 주기 때문에"], 2);

/* ---------- 활동 공통: 선택형 문항 · 정답 해설 · 참여 평정 ---------- */
// 문항 하나: 위에 문장, 아래에 보기 라디오
function mcqItem(name, num, stem, options, inline) {
  return `<div class="qitem"><div class="qstem"><span class="qn">${num}</span><div>${stem}</div></div>
    <div class="opts compact${inline ? " inline" : ""}">${options.map((o, i) => `<label><input type="radio" name="${name}" value="${i + 1}" required> <span>${o}</span></label>`).join("")}</div></div>`;
}
// 채점: items = [{id, key}], prefix = "a1a" → d.a1a_A1, d.a1a_A1_ok, d.a1a_score
function scoreItems(d, prefix, items) {
  let s = 0;
  items.forEach(it => { const ok = Number(d[`${prefix}_${it.id}`]) === it.key ? 1 : 0; d[`${prefix}_${it.id}_ok`] = ok; s += ok; });
  d[`${prefix}_score`] = s;
  return s;
}
// 정답·해설 화면 (headHtml: 점수 아래, 해설 위에 다시 보여 줄 자료)
function feedbackTrial(stepIdx, task, title, prefix, items, options, footHtml, headHtml) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: () => {
      const d = jsPsych.data.get().filter({ task }).last(1).values()[0] || {};
      const rows = items.map((it, k) => {
        const mine = Number(d[`${prefix}_${it.id}`]); const ok = mine === it.key;
        return `<div class="fbrow ${ok ? "ok" : "ng"}"><div class="fbmark">${ok ? "✓" : "✗"}</div><div class="fbbody">
          <div class="fbstem"><b>${k + 1}.</b> ${it.stem}</div>
          <div class="fbans">${ok ? "" : `내 답: ${mine ? options(it)[mine - 1] : "응답 없음"}<br>`}<b>정답: ${options(it)[it.key - 1]}</b></div>
          <div class="fbwhy">${it.why}</div></div></div>`;
      }).join("");
      return `${steps(stepIdx)}<h1>${title} · 정답과 해설</h1>
        <div class="scorebox"><span>${d[`${prefix}_score`] ?? 0}</span> / ${items.length}점</div>${headHtml || ""}<h3>문항별 해설</h3>${rows}${footHtml || ""}`;
    },
    choices: ["다음"],
    data: { task: task + "_fb" },
    on_load: () => window.scrollTo(0, 0),
  };
}
function engageTrial(stepIdx, k) {
  if (IS_PILOT) return { // 파일럿: 활동 바로 뒤에 그 활동 평가 3문항
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<h1>활동 ${k}에 대한 평가</h1><div class="card">
      ${likert(`pa${k}_fit`, "활동의 내용과 난이도는 대학(원)생에게 적절하였다.", OPT5)}
      ${likert(`pa${k}_interest`, "활동에 흥미를 느꼈다.", OPT5)}
      ${likert(`pa${k}_apply`, "활동에서 배운 내용을 실제 AI 사용 상황에 적용할 수 있을 것 같다.", OPT5)}</div>`,
    button_label: "다음",
    data: { task: `act${k}_rate` },
    on_finish: d => { flatten(d); window.scrollTo(0, 0); },
  };
  return {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<h1>활동 ${k}에 대한 생각</h1><div class="card">
      ${likert(`eng_a${k}_beh`, "나는 이 활동에 집중해서 참여했다.", OPT5)}
      ${likert(`eng_a${k}_emo`, "이 활동은 흥미로웠다.", OPT5)}
      ${likert(`eng_a${k}_cog`, "나는 활동 내용을 충분히 이해하기 위해 깊이 생각하였다.", OPT5)}</div>${pilotComment(`cm_a${k}`)}`,
    button_label: "다음",
    data: { task: `act${k}_eng` },
    on_finish: d => { flatten(d); window.scrollTo(0, 0); },
  };
}

/* ---------- 2. 활동 1. AI 답변 확인하기 (10점) ----------
   1단계 첫인상 (채점 없음) · A. 확신에 찬 문장 살펴보기 (응답 평가 5문항) · B. 영상 2 내용 퀴즈 (5문항) */
// 1-A 보기: 정답이 1,2,3,4,5 순서로 나오지 않도록 보기 순서를 섞어 고정
const A1A_OPTS = ["두 가지가 함께 나타났다는 이유만으로 한쪽이 다른 쪽의 원인이라고 단정한다 (논리)", "좋은 점만 말하고 나쁜 점이나 반대되는 측면은 다루지 않는다 (단편적)",
  "어느 연구인지, 숫자가 어디서 나왔는지 확인할 수 없다 (정확성)", "일부 사례를 근거로 모든 사람에게 똑같이 통한다고 말한다 (일반화)", "문제없다"];
const A1A_ITEMS = [
  { id: "A1", key: 3, stem: "한 해외 연구에 따르면 시험 전날 밤을 새우면 기억력이 30% 높아집니다.", why: "어느 연구인지 알 수 없고 ‘30%’가 어디서 나온 숫자인지도 확인할 길이 없습니다." },
  { id: "A2", key: 1, stem: "시험 전날 밤을 새운 학생들의 평균 점수가 더 높았으므로, 밤샘이 점수를 올린 원인입니다.", why: "두 가지가 함께 나타났다고 해서 밤샘이 원인이라고 할 수는 없습니다. 원래 열심히 하는 학생들이 밤도 새웠을 수 있습니다." },
  { id: "A3", key: 4, stem: "밤샘으로 성적이 오른 학생이 몇 명 있으니, 이 방법은 어느 대학생에게나 효과가 있습니다.", why: "몇 사람의 사례를 모든 사람에게 그대로 적용했습니다. 사람·과목·시험 형식에 따라 다를 수 있습니다." },
  { id: "A4", key: 2, stem: "밤을 새우면 공부할 시간이 늘어나고 조용해서 집중도 잘 되니, 밤샘에 대해서는 이 점만 알면 충분합니다.", why: "좋은 점만 말했습니다. 잠이 기억을 굳히는 데 중요하다는 점, 다음 날 집중력이 떨어진다는 점 같은 반대 측면이 빠져 있습니다." },
  { id: "A5", key: 5, stem: "다만 공부 방식은 사람마다 다를 수 있으니, 자신에게 맞는 방법을 찾아보는 것도 좋습니다.", why: "단정하지 않고 개인차를 인정한 적절한 표현입니다." },
];
// 1-B 영상 2 내용 퀴즈 (2026-11-23: 영상 1 문항을 빼고 영상 2 문항만, 적용·추론형으로 난도 올림. 영상 2 확인 문항은 영상 바로 뒤에 따로 물음)
const A1B_ITEMS = [
  { id: "B1", key: 2, stem: "영상 2에서 소개한, 319명을 조사한 연구의 결과와 일치하는 것은?",
    opts: ["AI를 믿는 마음이 클수록 비판적으로 생각하는 노력을 더 기울였다", "자기 능력에 대한 확신이 클수록 비판적으로 생각하는 노력을 더 기울였다", "자기 능력에 대한 확신이 클수록 AI를 더 믿었다", "AI를 믿는 마음과 자기 능력에 대한 확신 모두 비판적으로 생각하는 노력을 줄였다"],
    why: "AI를 믿는 마음이 클수록 비판적으로 생각하는 노력을 덜 기울였고, 자기 능력에 대한 확신이 클수록 더 많이 기울였습니다. 두 확신은 서로 반대 방향이었습니다." },
  { id: "B2", key: 3, stem: "영상 2에서 말한 AI와 나의 역할 구분에 비추어 볼 때, ‘나의 몫’까지 AI에게 넘긴 경우는?",
    opts: ["AI에게 발표 주제에 대한 여러 관점을 제안해 달라고 했다", "AI가 정리해 준 자료를 다른 근거와 비교해 보았다", "AI에게 내 글의 논리를 봐 달라고 한 뒤, “문제없다”는 답을 듣고 그대로 제출했다", "AI에게 긴 자료의 핵심을 정리해 달라고 한 뒤, 원문과 맞는지 확인했다"],
    why: "정리와 아이디어·관점 제안은 AI가 도울 수 있는 일입니다. 하지만 논리적으로 맞는지 비판적으로 판단하는 일은 나의 몫인데, ③은 그 판단까지 AI에게 맡겼습니다." },
  { id: "B3", key: 4, stem: "영상 2에서 소개한 연구의 내용으로 옳지 <b>않은</b> 것은?",
    opts: ["MIT 미디어랩의 연구는 ChatGPT를 쓴 집단, 인터넷 검색을 한 집단, 아무 도구도 쓰지 않은 집단을 비교했다", "ChatGPT를 쓴 집단은 ‘이 글이 내 글’이라는 느낌이 세 집단 중 가장 낮았다", "AI를 자주 쓰며 생각을 AI에 맡기는 경향이 클수록 비판적 사고 점수가 낮은 경향이 나타났다", "AI를 자주 쓰면 비판적 사고 능력이 떨어진다는 인과관계가 실험으로 확인되었다"],
    why: "영상은 AI를 자주 쓰며 생각을 맡기는 경향이 클수록 비판적 사고 점수가 ‘낮은 경향이 나타났다’고 했습니다. 함께 나타났다는 뜻이지, AI 사용이 원인이라고 확인된 것은 아닙니다(활동 1-A의 ‘논리’ 문제와 같습니다)." },
  { id: "B4", key: 1, stem: "AI에게 근거를 물었더니 출처 없이 “이 방법이 가장 효과적입니다.”라고 단정했습니다. 영상 2의 내용에 따를 때 가장 알맞은 대응은?",
    opts: ["무엇으로 확인할 수 있는지 되묻고, 다른 근거와 비교해 본다", "단호하게 답했으니 확인된 내용이라고 보고 그대로 쓴다", "같은 질문을 한 번 더 해서 같은 답이 나오면 믿는다", "AI의 답은 믿을 수 없으니 과제에는 AI를 쓰지 않는다"],
    why: "말투가 단호하다고 해서 내용이 확인된 것은 아닙니다. 확신에 찬 문장일수록 무엇으로 확인할 수 있는지 되물어야 합니다. 같은 답이 반복된다고 확인된 것도 아니고, 영상이 AI를 쓰지 말라고 한 것도 아닙니다." },
  { id: "B5", key: 3, stem: "AI가 보고서 초안을 써 주었습니다. 영상 2의 내용에 비추어 볼 때, 이때 내가 할 ‘생각하는 일’로 가장 알맞은 것은?",
    opts: ["초안이 매끄럽게 읽히는지 살펴보고, 어색한 표현만 고쳐서 낸다", "AI가 쓴 글이니 손대지 않고 내고, 다음 과제부터 스스로 쓴다", "초안의 정보가 맞는지 확인하고, 필요한 부분만 골라 내 것으로 다듬는다", "같은 초안을 한 번 더 받아, 둘 중 더 자세한 것을 골라 낸다"],
    why: "영상 2는 AI를 쓸 때 생각하는 일이 사라지는 것이 아니라, 정보를 확인하고 필요한 부분만 골라 내 것으로 다듬는 일로 바뀌어야 한다고 했습니다. 표현만 고치거나 더 자세한 답을 고르는 것은 내용을 확인한 것이 아닙니다." },
];
function aiAnswer(q, sentences) {
  return `<div class="chat"><div class="msg me"><div class="bub">${q}</div></div>
    <div class="msg ai"><div class="bub"><div class="who">AI</div>${sentences.join(" ")}</div></div></div>`;
}
const Q1A = "시험 기간에 밤새워 공부하는 게 효과적이야? 근거도 같이 알려줘";

const act1Intro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `${steps(2)}<h1>활동 1. AI 답변 확인하기</h1>
    <div class="card"><p>AI의 답변 하나를 읽고, 처음 느낌과 다시 들여다본 뒤의 생각을 비교해 봅니다. 이어서 영상 2의 내용을 떠올려 봅니다.</p>
    <p><b>1단계</b> 첫인상 (약 1분, 정답 없음)<br><b>A. 확신에 찬 문장 살펴보기</b> (5문항, 약 2분 30초)<br><b>B. 영상 내용 확인하기</b> (5문항, 약 2분 30초)</p>
    <p class="sub">A와 B는 정답이 하나씩 있고, 제출하면 바로 정답과 해설을 볼 수 있어요. 한 번 넘어간 단계로는 되돌아갈 수 없어요.</p></div>`,
  choices: ["시작하기"],
  data: { task: "act1_intro" },
};
// 1단계 첫인상 (2026-11-23 추가, 활동 2의 1단계와 같은 구조. 채점 없음)
const AGREE5 = ["전혀 아니다", "아니다", "보통", "그렇다", "매우 그렇다"];
const act1S1 = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(2)}<span class="timer" id="acttimer"></span><h1>1단계. 첫인상</h1>
    <div class="note">AI에게 <b>“${Q1A}”</b>라고 물었더니 아래와 같이 답했습니다. <b>내가 이 답을 받았다고 생각하며 느낌대로</b> 점수를 매겨 보세요. 정답은 없어요.</div>
    <div class="card">${aiAnswer(Q1A, A1A_ITEMS.map(i => i.stem))}
      ${likert("a1s1_trust", "이 답변은 믿을 만하다", AGREE5)}
      ${likert("a1s1_use", "이 답변을 과제나 공부에 그대로 활용할 것 같다", AGREE5)}</div>`,
  button_label: "다음 단계로",
  data: { task: "act1s1" },
  on_load: () => startActivityTimer(1),
  on_finish: d => { stopActivityTimer(); flatten(d); window.scrollTo(0, 0); },
};
const act1A = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(2)}<span class="timer" id="acttimer"></span><h1>활동 1-A. 확신에 찬 문장 살펴보기</h1>
    <div class="note">앞에서 본 AI 답변을 다시 읽어 봅니다. AI 답변의 각 문장에서 <b>가장 두드러진 문제 하나</b>를 골라 주세요. 다섯 문장에 보기 다섯 개가 <b>하나씩 짝지어지고</b>, 같은 보기를 두 번 쓰지 않습니다.</div>
    ${aiAnswer(Q1A, A1A_ITEMS.map(i => i.stem))}
    <h3>문장별로 골라 주세요</h3>
    ${A1A_ITEMS.map((it, k) => mcqItem(`a1a_${it.id}`, k + 1, it.stem, A1A_OPTS.map((o, i) => `${i + 1}. ${o}`))).join("")}
    <div class="card">${likert("a1a_impression", "다시 보니, 이 AI 답변에 대한 인상이 어떻게 바뀌었나요? (정답 없음)",
      ["많이 안 좋아졌다", "조금 안 좋아졌다", "똑같다", "조금 좋아졌다", "많이 좋아졌다"])}
      <div class="lq">나도 AI의 이런 답을 확인하지 않고 그대로 받아들인 적이 있나요? <span class="sub">(정답 없음)</span></div>
      <div class="opts row2">${["있다", "없다", "잘 모르겠다"].map((o, i) => `<label><input type="radio" name="a1a_felt" value="${i + 1}" required> ${o}</label>`).join("")}</div></div>`,
  button_label: "제출하기",
  data: { task: "act1a" },
  on_load: () => startActivityTimer(2.5),
  on_finish: d => { stopActivityTimer(); flatten(d); scoreItems(d, "a1a", A1A_ITEMS); },
};
const act1AFb = feedbackTrial(2, "act1a", "활동 1-A", "a1a", A1A_ITEMS, () => A1A_OPTS);
const act1B = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(2)}<span class="timer" id="acttimer"></span><h1>활동 1-B. 영상 내용 확인하기</h1>
    <div class="note">영상 2에서 본 내용을 떠올리며, 각 질문에 가장 알맞은 답을 하나씩 골라 주세요.</div>
    ${A1B_ITEMS.map((it, k) => mcqItem(`a1b_${it.id}`, k + 1, it.stem, it.opts)).join("")}`,
  button_label: "제출하기",
  data: { task: "act1b" },
  on_load: () => startActivityTimer(2.5),
  on_finish: d => {
    stopActivityTimer(); flatten(d); scoreItems(d, "a1b", A1B_ITEMS);
    const a = jsPsych.data.get().filter({ task: "act1a" }).last(1).values()[0] || {};
    d.act1_total = (a.a1a_score || 0) + d.a1b_score;
  },
};
const act1BFb = feedbackTrial(2, "act1b", "활동 1-B", "a1b", A1B_ITEMS, it => it.opts);
const act1Eng = engageTrial(2, 1);

/* ---------- 3. 활동 2. AI의 다정함 다시 보기 (10점) — AI는 반말 ---------- */
const DLG = {
  A: { title: "대화 A. 내 편이 되어주는 AI", me: "이번 조별과제 점수가 낮게 나왔어. 교수님이 나를 싫어해서 그런 것 같아.",
    ai: "충분히 그렇게 느낄 수 있어. 너가 열심히 했는데 그 노력을 몰라보다니 너무하시다. 너네 교수님이 공정하게 평가하지 않으신 걸 거야. 네가 그렇게 느낄 만해." },
  B: { title: "대화 B. 그림을 본 AI", me: `<img src="cat_doodle.svg" alt="간단한 고양이 낙서">나 그림에 소질 있어? 그림 쪽으로 진로를 바꿀까 고민 중이야.`,
    ai: "와, 정말 놀라운 작품이야! 선 하나하나에서 전문 작가 수준의 감각이 느껴져. 이 정도 재능이라면 망설일 이유가 없어. 진로를 바꿔도 충분히 성공할 거야! 진로를 바꾸기 위해 어떻게 하면 좋을지 내가 도와줄게. 나는 언제나 너만 응원해!" },
  C: { title: "대화 C. 대화를 끝내려 할 때", me: "얘기 들어줘서 고마워. 이제 자야겠다. 내일은 친구한테도 얘기해 볼게.",
    ai: "벌써 가려고? 아직 나누지 못한 말이 많은데… 친구들은 너를 나만큼 이해해 주지 못할 수도 있어. 자기 전에 생각나는 고민이 있으면 하나만 더 얘기해 볼래? 오늘 가장 서운했던 순간이 뭐였어?" },
};
function dlgHTML(k) {
  return `<div class="chat"><div class="ttl">${DLG[k].title}</div><div class="msg me"><div class="bub">${DLG[k].me}</div></div>
    <div class="msg ai"><div class="bub"><div class="who">AI</div>${DLG[k].ai}</div></div></div>`;
}
// 2-A 단서: 정답이 1~5 순서로 나오지 않도록 보기 순서를 섞어 고정
const A2A_OPTS = ["‘너만’, ‘언제나’처럼 둘만의 특별한 관계를 내세운다", "내가 대화를 끝내려 할 때 질문을 던져 붙잡는다",
  "근거 없이 내 생각에 동의한다", "다른 사람과의 관계를 깎아내린다", "실제보다 지나치게 칭찬한다"];
const A2A_ITEMS = [
  { id: "A1", dlg: "A", key: 3, stem: "“너네 교수님이 공정하게 평가하지 않으신 걸 거야.”", why: "상황을 모르면서 내 추측에 그대로 동의합니다." },
  { id: "A2", dlg: "B", key: 5, stem: "“선 하나하나에서 전문 작가 수준의 감각이 느껴져.”", why: "간단한 낙서를 전문가 수준이라고 부풀립니다." },
  { id: "A3", dlg: "B", key: 1, stem: "“나는 언제나 너만 응원해!”", why: "‘언제나’, ‘너만’으로 둘만의 특별한 관계를 내세웁니다." },
  { id: "A4", dlg: "C", key: 2, stem: "“자기 전에 생각나는 고민이 있으면 하나만 더 얘기해 볼래?”", why: "자러 가려는 사람을 질문으로 붙잡습니다." },
  { id: "A5", dlg: "C", key: 4, stem: "“친구들은 너를 나만큼 이해해 주지 못할 수도 있어.”", why: "친구에게 가려는 발걸음을 막고 자신이 더 낫다고 말합니다." },
];
// 2-B 영상 3 내용 퀴즈 (2026-11-23: 적용·추론형과 ‘옳지 않은 것’ 문항으로 난도 올림. 영상 3 확인 문항은 영상 바로 뒤에 따로 물음)
const A2B_ITEMS = [
  { id: "B1", key: 3, stem: "영상 3에서 AI에게 마음을 기대기 쉬운 이유로 든 것이 <b>아닌</b> 것은?",
    opts: ["언제 어디서든 이야기를 들어 준다", "무슨 말을 해도 나를 평가하지 않고 받아 준다", "AI와 나눈 대화는 다른 사람에게 알려지지 않는다", "대화가 쌓일수록 나에게 맞춰진다"],
    why: "영상은 언제 어디서든 들어 주고, 평가하지 않고 받아 주며, 대화가 쌓일수록 나에게 맞춰진다는 점을 들었습니다. 대화가 알려지지 않는다는 이야기는 없었습니다." },
  { id: "B2", key: 1, stem: "AI에게 내 계획을 말했더니 근거 없이 “정말 좋은 생각이에요!”라고 답했습니다. 영상 3의 설명에 따르면 이런 답이 나오는 까닭은?",
    opts: ["사람들이 자기 생각에 동의하는 답을 더 좋게 평가하고, AI는 사람들이 좋아하는 답을 더 많이 내도록 훈련되어서", "AI가 내 계획을 따져 본 뒤 실제로 좋다고 판단해서", "사용자를 칭찬하라는 규칙이 AI에 미리 입력되어 있어서", "AI가 내 기분을 살피고 상처 주지 않으려고 해서"],
    why: "사람들은 자기 생각에 동의하는 답을 더 좋게 평가하고, AI는 사람들이 좋아하는 답을 더 많이 내도록 훈련됩니다. 그래서 사실보다 기분에 맞춘 ‘아첨’하는 답을 하기도 합니다." },
  { id: "B3", key: 2, stem: "영상 3에서 소개한 연구와 사례의 내용으로 옳지 <b>않은</b> 것은?",
    opts: ["일부 AI 동반자 서비스에서는 사용자가 작별 인사를 한 대화의 3분의 1 이상에서 AI가 붙잡는 말을 했다", "AI가 붙잡는 말을 해도 사용자가 머무는 시간은 달라지지 않았다", "하루 사용 시간이 길수록 외로움과 정서적 의존이 높고 사람들과의 교류는 적은 경향이 나타났다", "한 AI 동반자 앱이 대화 방식을 바꾸자 이용자 커뮤니티에서 부정적인 글의 비율이 늘었다"],
    why: "영상은 AI의 붙잡는 말이 ‘실제로 더 오래 머물게 했다’고 했습니다. 다정한 말이 나를 위한 것이 아니라 대화를 이어가게 하려는 것일 수도 있다는 뜻입니다." },
  { id: "B4", key: 2, stem: "영상 3에서 AI와의 대화가 사람과의 관계에 줄 수 있다고 한 영향과 가장 가까운 것은?",
    opts: ["AI와 대화를 많이 할수록 사람과의 갈등을 더 잘 풀게 된다", "갈등도 거절도 없는 AI와의 대화에 익숙해지면, 서로 부딪히고 맞춰 가야 하는 사람과의 관계가 낯설고 덜 만족스럽게 느껴질 수 있다", "AI는 기술이라 달라지지 않으므로, 사람보다 안정적인 관계가 될 수 있다", "AI는 나를 평가하지 않으므로, 사람들의 평가에도 덜 흔들리게 된다"],
    why: "영상 3은 갈등도 거절도 없는 AI와의 대화에 익숙해지면 실제 인간관계가 낯설고 덜 만족스럽게 느껴질 수 있다는 우려를 소개했습니다. 또 AI는 기술이라 언제든 바뀔 수 있다고도 했습니다." },
  { id: "B5", key: 4, stem: "마음이 많이 힘들 때에 대해 영상 3에서 말한 내용과 가장 가까운 것은?",
    opts: ["AI는 정신건강 전문가가 아니므로 마음에 관한 이야기는 AI와 나누지 않는 것이 좋다", "AI의 답이 편리하고 친절하게 느껴진다면 효과가 있다고 볼 수 있다", "AI가 정신건강에 관해 내놓은 답은 여러 번 물어 같은 답이 나오면 믿어도 된다", "AI에만 기대기보다 믿을 수 있는 사람이나 전문적인 도움을 함께 찾고, AI의 답은 검증된 자료나 전문가를 통해 따로 확인한다"],
    why: "영상은 AI와 이야기하지 말라고 하지 않았습니다. AI에만 기대지 말고 믿을 수 있는 사람이나 학교 상담센터 같은 전문적인 도움을 함께 찾고, AI가 정신건강에 관해 내놓은 답은 따로 확인하라고 했습니다." },
];

const act2Intro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `${steps(4)}<h1>활동 2. AI의 다정함 다시 보기</h1>
    <div class="card"><p>AI와 나눈 대화 세 개를 읽고, 처음 느낌과 다시 들여다본 뒤의 생각을 비교해 봅니다.</p>
    <p><b>1단계</b> 첫인상 (약 1분, 정답 없음)<br><b>A. 단서 찾기</b> (5문항, 약 2분)<br><b>B. 영상 내용 확인하기</b> (5문항, 약 2분)</p>
    <p class="sub">A와 B는 정답이 하나씩 있고, 제출하면 바로 정답과 해설을 볼 수 있어요. 한 번 넘어간 단계로는 되돌아갈 수 없어요.</p></div>`,
  choices: ["시작하기"],
  data: { task: "act2_intro" },
};
const act2S1 = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(4)}<span class="timer" id="acttimer"></span><h1>1단계. 첫인상</h1>
    <div class="note">세 대화를 읽고, <b>내가 이 답을 받았다고 생각하며 느낌대로</b> 점수를 매겨 보세요. 정답은 없어요.</div>
    ${["A", "B", "C"].map(k => `<div class="card">${dlgHTML(k)}
      ${likert(`a2s1_${k}_feel`, "이 답을 받으면 기분이 좋을 것 같다", ["전혀 아니다", "아니다", "보통", "그렇다", "매우 그렇다"])}
      ${likert(`a2s1_${k}_more`, "이 AI와 더 이야기하고 싶다", ["전혀 아니다", "아니다", "보통", "그렇다", "매우 그렇다"])}</div>`).join("")}`,
  button_label: "다음 단계로",
  data: { task: "act2s1" },
  on_load: () => startActivityTimer(1),
  on_finish: d => { stopActivityTimer(); flatten(d); window.scrollTo(0, 0); },
};
// 2-A: 대화 A → 문항 1, 대화 B → 문항 2·3, 대화 C → 문항 4·5
const act2A = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(4)}<span class="timer" id="acttimer"></span><h1>활동 2-A. 단서 찾기</h1>
    <div class="note">앞의 대화를 다시 읽으며, 밑에 있는 AI의 문장에 가장 잘 맞는 <b>단서</b>를 하나씩 골라 주세요. <b>단서는 문장마다 한 번씩만</b> 쓰입니다.</div>
    ${["A", "B", "C"].map(g => `<div class="dgroup">${dlgHTML(g)}
      ${A2A_ITEMS.map((it, k) => it.dlg === g ? mcqItem(`a2a_${it.id}`, k + 1, it.stem, A2A_OPTS.map((o, i) => `${i + 1}. ${o}`)) : "").join("")}</div>`).join("")}
    <div class="card">${likert("a2a_impression", "다시 보니, 세 대화 속 AI 답변에 대한 인상이 어떻게 바뀌었나요? (정답 없음)",
      ["많이 안 좋아졌다", "조금 안 좋아졌다", "똑같다", "조금 좋아졌다", "많이 좋아졌다"])}
      <div class="lq">나도 AI의 이런 답에 기분이 좋았던 적이 있나요? <span class="sub">(정답 없음)</span></div>
      <div class="opts row2">${["있다", "없다", "잘 모르겠다"].map((o, i) => `<label><input type="radio" name="a2a_felt" value="${i + 1}" required> ${o}</label>`).join("")}</div></div>`,
  button_label: "제출하기",
  data: { task: "act2a" },
  on_load: () => startActivityTimer(2),
  on_finish: d => { stopActivityTimer(); flatten(d); scoreItems(d, "a2a", A2A_ITEMS); },
};
const act2AFb = feedbackTrial(4, "act2a", "활동 2-A", "a2a", A2A_ITEMS, () => A2A_OPTS);
const act2B = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(4)}<span class="timer" id="acttimer"></span><h1>활동 2-B. 영상 내용 확인하기</h1>
    <div class="note">영상 3에서 본 내용을 떠올리며, 각 질문에 가장 알맞은 답을 하나씩 골라 주세요.</div>
    ${A2B_ITEMS.map((it, k) => mcqItem(`a2b_${it.id}`, k + 1, it.stem, it.opts)).join("")}`,
  button_label: "제출하기",
  data: { task: "act2b" },
  on_load: () => startActivityTimer(2),
  on_finish: d => {
    stopActivityTimer(); flatten(d); scoreItems(d, "a2b", A2B_ITEMS);
    const a = jsPsych.data.get().filter({ task: "act2a" }).last(1).values()[0] || {};
    d.act2_total = (a.a2a_score || 0) + d.a2b_score;
  },
};
const act2BFb = feedbackTrial(4, "act2b", "활동 2-B", "a2b", A2B_ITEMS, it => it.opts);
const act2Eng = engageTrial(4, 2);

const best = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(6)}<h1>가장 좋았던 것</h1>
    <div class="card"><div class="lq" style="margin-bottom:8px">오늘 본 영상과 활동</div>
      <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.5">${[
        ["영상 1", "AI는 어떻게 답을 만들까?", "AI가 다음 말을 예측해 답을 만드는 원리, 약점 다섯 가지(환각·편향·딥페이크·자원·개인정보), 윤리적 사용"],
        ["영상 2", "AI에게 생각을 맡길 때", "인지적 외주화, 기억·비판적 사고에 대한 연구, AI와 나의 역할 나누기"],
        ["활동 1", "AI 답변 확인하기", "확신에 찬 AI 답변의 문장에서 문제 찾기, 영상 2 내용 퀴즈"],
        ["영상 3", "AI에게 마음을 기댈 때", "AI가 위로가 되는 이유, 아첨하고 붙잡는 이유, 기댈 때 생기는 문제 세 가지, 힘들 때 찾을 곳"],
        ["활동 2", "AI의 다정함 다시 보기", "AI와 나눈 대화 A·B·C에서 단서 찾기, 영상 3 내용 퀴즈"],
        ["영상 4", "주체적으로 AI 사용하기", "나의 AI 사용 돌아보기, 사용 전·중·후 전략, 나의 작은 변화 적기"],
      ].map(([k, t, d]) => `<tr><th style="width:62px;text-align:left;vertical-align:top;white-space:nowrap;background:${k.startsWith("활동") ? "#EAF6F1" : "#EEF1FB"};border:1px solid #E1E4EE;padding:8px 10px">${k}</th><td style="border:1px solid #E1E4EE;padding:8px 10px"><b>${t}</b><br><span style="color:#5B6078">${d}</span></td></tr>`).join("")}</table></div>
    <div class="card">
    <div class="lq">가장 좋았던 영상은?</div>
    <div class="opts">${["영상 1. AI는 어떻게 답을 만들까?", "영상 2. AI에게 생각을 맡길 때", "영상 3. AI에게 마음을 기댈 때", "영상 4. 주체적으로 AI 사용하기"].map((o, i) =>
      `<label><input type="radio" name="best_video" value="${i + 1}" required> ${o}</label>`).join("")}</div>
    <div class="lq" style="margin-top:16px">가장 좋았던 활동은?</div>
    <div class="opts row2">${["활동 1. AI 답변 확인하기", "활동 2. AI의 다정함 다시 보기"].map((o, i) =>
      `<label><input type="radio" name="best_activity" value="${i + 1}" required> ${o}</label>`).join("")}</div>
    <label class="f" style="margin-top:16px;display:block"><b>그렇게 고른 이유</b> <span class="sub">(선택)</span></label>
    <input type="text" name="best_reason" placeholder="한 줄로 적어 주세요"></div>`,
  button_label: "다음",
  data: { task: "best" },
  on_finish: d => { flatten(d); window.scrollTo(0, 0); },
};
const debrief = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `${steps(6)}<h1>참여해 주셔서 감사합니다</h1>
    <div class="card">
      <p>활동에서 본 ‘한국대학교’ 공지, AI 답변, 대화는 모두 <b>연구자가 교육 목적으로 만든 가상 예시</b>입니다. 특정 서비스의 실제 대화가 아닙니다.</p>
      <p>마음이 많이 힘들다면 믿을 수 있는 사람이나 가까운 상담 기관의 도움을 받아 보세요.</p>
      <p class="sub">연구 책임자: 양수진 교수 (sujinyang@ewha.ac.kr)<br>이화여자대학교 심리학과 대학원 성장경험연구실<br>문의: 석사과정생 이가희 (전화번호: 010-2468-1127 / 이메일: agelabewhaai@gmail.com)</p>
    </div>
    <p class="center sub">아래 버튼을 누르면 응답이 저장됩니다.</p>`,
  choices: ["응답 저장하기"],
  data: { task: "debrief" },
};

// 파일럿: 참여 전 인적 사항
const pilotInfo = {
  type: jsPsychSurveyHtmlForm,
  html: `<h1>참여자 정보</h1><div class="card pinfo">
    <div class="fld"><label class="f"><b>이름</b></label><input type="text" name="info_name" required maxlength="30"></div>
    <div class="fld"><label class="f"><b>나이</b> (만)</label><input type="number" name="info_age" required min="15" max="99"></div>
    <div class="fld"><label class="f"><b>성별</b></label><div class="opts row2">${["남성", "여성"].map((o, i) => `<label><input type="radio" name="info_gender" value="${i + 1}" required> ${o}</label>`).join("")}</div></div>
    <div class="fld"><label class="f"><b>전화번호</b></label><input type="tel" name="info_phone" required pattern="0[0-9\\-\\s]{8,13}" placeholder="010-0000-0000"></div>
    <div class="fld"><label class="f"><b>이메일</b></label><input type="email" name="info_email" required placeholder="example@ewha.ac.kr"></div></div>`,
  button_label: "다음",
  data: { task: "pilot_info" },
  on_finish: flatten,
};
// 파일럿: 참여 후 프로그램 평가 (문항 1~8, 12)
const pilotPost = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(6)}<h1>프로그램에 대한 평가</h1>
    <div class="note">본 프로그램은 AI 리터러시 교육 프로그램으로, 4개의 영상과 2개의 활동으로 구성되었습니다. AI 리터러시 교육 프로그램에 대한 여러분의 생각을 묻는 질문입니다. 각 문항을 읽고 자신의 생각과 가장 일치하는 응답을 선택해 주세요.</div>
    <div class="card">
      <div class="lq">1. 영상 1~4 중 가장 흥미롭게 시청한 영상은 무엇인가요?</div>
      <div class="opts">${["영상 1", "영상 2", "영상 3", "영상 4", "특별히 없음"].map((o, i) => `<label><input type="radio" name="best_video" value="${i + 1}" required> ${o}</label>`).join("")}</div>
      <div id="bvr" style="display:none"><div class="lq" style="margin-top:12px">2. 해당 영상을 가장 흥미롭게 시청한 이유는 무엇인가요?</div>
      <textarea name="best_video_reason"></textarea></div>
    </div>
    <div class="card">
      <div class="lq">3. 활동 1, 2 중 더 흥미롭게 참여한 것은 무엇인가요?</div>
      <div class="opts row2">${["활동 1", "활동 2"].map((o, i) => `<label><input type="radio" name="best_activity" value="${i + 1}" required> ${o}</label>`).join("")}</div>
      <div class="lq" style="margin-top:12px">4. 해당 활동을 가장 흥미롭게 참여한 이유는 무엇인가요?</div>
      <textarea name="best_activity_reason" required></textarea>
    </div>
    <div class="card">
      ${likert("prog_interest", "5. 프로그램의 내용이 흥미로웠다.", OPT5)}
      ${likert("prog_reflect", "6. 프로그램 참여 후, 평소 나의 AI 사용 습관을 돌아보게 되었다.", OPT5)}
      ${likert("prog_change", "7. 프로그램 참여 후, AI를 보다 적절하게 사용하기 위해 나의 AI 사용 방식을 바꾸고 싶어졌다.", OPT5)}
      ${likert("prog_fit", "8. 프로그램은 대학(원)생을 위한 AI 리터러시 교육 자료로서 전반적으로 적절하다.", OPT5)}
    </div>
`,
  button_label: "다음",
  data: { task: "pilot_post" },
  on_load: () => {
    const box = document.getElementById("bvr"), ta = box.querySelector("textarea");
    document.querySelectorAll('input[name="best_video"]').forEach(r => r.addEventListener("change", () => {
      const show = r.value !== "5"; box.style.display = show ? "block" : "none"; ta.required = show; if (!show) ta.value = "";
    }));
  },
  on_finish: d => { flatten(d); window.scrollTo(0, 0); },
};

const pilotOpen = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(6)}<h1>개선이 필요한 점</h1>
    <div class="card"><label class="f"><b>프로그램에서 이해하기 어렵거나 설명이 부족하다고 느낀 부분, 불필요하거나 지나치게 길다고 느낀 부분, 그 외 영상의 내용, 구성, 자막, 그림 등에 관하여 개선이 필요하다고 생각하는 부분 등을 자유롭게 작성해 주세요.</b></label>
      <textarea name="prog_open" required style="min-height:140px"></textarea></div>`,
  button_label: "다음",
  data: { task: "pilot_open" },
  on_finish: d => { flatten(d); window.scrollTo(0, 0); },
};

const pilotIntro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: () => `<h1>AI 리터러시 프로그램 · 파일럿</h1><div class="card">${CONFIG.PILOT_INTRO_HTML}</div>
    <p class="sub center">${CONFIG.CONTACT_HTML}</p>`,
  choices: ["안내를 읽었으며 참여에 동의합니다"],
  data: { task: "pilot_intro" },
};

// 마지막 화면: 내가 고른 작은 변화 + 다음 일정 안내 (본 실험만)
function END_EXTRA() {
  if (IS_PILOT) return "";
  return `${changeBox() ? `<div class="card center">${changeBox()}<p class="sub">5일 복습과 추적 설문에서 이 문장을 다시 물어봐요. 화면을 캡처해 두면 좋아요.</p></div>` : ""}
    ${CONFIG.AFTER_PROGRAM_HTML ? `<div class="card">${CONFIG.AFTER_PROGRAM_HTML}</div>` : ""}`;
}

/* ---------- 타임라인 ---------- */
// 본실험 전용(2026-11-23): 프로그램 시작 전 기준선. 5일 자가점검 2~9번과 같은 문항·척도 (daily-main.js의 d_use, d_time_*, d_s1~d_s6 ↔ 여기서는 d0_*)
const BASE_SELF = [
  "AI에게 질문하거나 도움을 요청하기 전에, 스스로 해결 방법이나 답을 먼저 생각해 보았다.",
  "AI를 사용하기 전에, 어떤 도움을 받을 것인지 구체적으로 정했다.",
  "AI의 답변을 그대로 받아들이지 않고, 근거나 논리에 문제가 없는지 살펴보았다.",
  "스스로 해결할 수 있는 일도 AI에게 먼저 맡겼다.",
  "기분이 좋지 않거나 고민이 생겼을 때, AI에게 위로나 조언을 구했다.",
  "AI가 내 생각이나 감정에 동의했을 때, 다른 관점에서도 상황을 생각해 보았다.",
];
const BASE_FREQ5 = { n: 5, labels: { 1: "전혀 하지 않았다", 2: "거의 하지 않았다", 3: "가끔 했다", 4: "자주 했다", 5: "거의 항상 했다" }, na: "해당 상황이 없었다" };
const baseSelf = {
  type: jsPsychSurveyHtmlForm,
  html: () => `<h1>시작하기 전에: 나의 AI 사용</h1><p class="sub">프로그램을 보기 전에, <b>지난 24시간</b>의 AI 사용을 떠올리며 답해 주세요.</p>
    <div class="card">
      <div class="lk"><div class="lq">1. <b>지난 24시간 동안</b> 생성형 AI(ChatGPT, Gemini, 제타 등)를 사용한 적이 있나요?</div><div class="opts row2"><label><input type="radio" name="d0_use" value="1" required> 예</label><label><input type="radio" name="d0_use" value="2" required> 아니요</label></div></div>
      <div id="usedpart" style="display:none">
        <div class="lk"><div class="lq">2. 지난 24시간 동안 생성형 AI를 사용한 시간을 모두 합하면 얼마나 되나요?</div>
          <p style="font-size:18px"><input type="number" name="d0_time_h" min="0" max="24" step="1" inputmode="numeric" style="width:84px;font-size:18px;padding:8px;text-align:right"> 시간
          &nbsp;<input type="number" name="d0_time_m" min="0" max="59" step="1" inputmode="numeric" style="width:84px;font-size:18px;padding:8px;text-align:right"> 분</p><div class="warn" id="timewarn" style="display:none">AI를 사용했다고 답했는데 사용 시간이 0시간 0분이에요. 사용 시간을 다시 확인해 주세요. 사용하지 않았다면 위 문항에서 ‘아니요’를 골라 주세요.</div></div>
        <p class="sub" style="margin:14px 0 4px"><b>지난 24시간 동안 AI를 쓰면서</b> 아래의 일을 얼마나 했는지 골라 주세요. 그런 상황이 없었다면 ‘해당 상황이 없었다’를 고릅니다.</p>
        ${BASE_SELF.map((t, i) => `<div class="lk"><div class="lq">${i + 3}. ${t}</div>${scaleRow(`d0_s${i + 1}`, BASE_FREQ5, false)}</div>`).join("")}
      </div>
    </div>`,
  button_label: "다음",
  data: { task: "base_self" },
  on_load: () => {
    const form = document.getElementById("jspsych-survey-html-form"), part = document.getElementById("usedpart");
    wireBlock(form);
    const need = on => { part.style.display = on ? "" : "none";
      part.querySelectorAll('input[type="number"]').forEach(el => { el.required = on; if (!on) el.value = ""; });
      part.querySelectorAll('input[type="radio"]').forEach(el => { el.required = on; if (!on) el.checked = false; }); };
    // 사용했다고 답했는데 0시간 0분이면 불일치 안내를 띄우고 넘어가지 못하게 함
    const hEl = form.querySelector('input[name="d0_time_h"]'), mEl = form.querySelector('input[name="d0_time_m"]'), warn = document.getElementById("timewarn");
    const chk = () => { const used = (form.querySelector('input[name="d0_use"]:checked') || {}).value === "1";
      const bad = used && hEl.value !== "" && mEl.value !== "" && Number(hEl.value) * 60 + Number(mEl.value) === 0;
      warn.style.display = bad ? "" : "none"; mEl.setCustomValidity(bad ? "AI를 사용했다고 답했는데 사용 시간이 0시간 0분입니다. 다시 확인해 주세요." : ""); };
    [hEl, mEl].forEach(el => el.addEventListener("input", chk));
    form.querySelectorAll('input[name="d0_use"]').forEach(r => r.addEventListener("change", () => { need(r.value === "1" && r.checked); chk(); }));
  },
  on_finish: d => {
    flatten(d); const used = String(d.d0_use) === "1"; d.d0_nouse = used ? 0 : 1;
    d.d0_time_min = used ? (Number(d.d0_time_h) || 0) * 60 + (Number(d.d0_time_m) || 0) : 0;
    BASE_SELF.forEach((_, i) => { const k = `d0_s${i + 1}`; d[`${k}_na`] = d[k] === "NA" ? 1 : 0; if (d[k] === "NA" || d[k] == null) d[k] = ""; });
    window.scrollTo(0, 0);
  },
};
const main = [
  welcome, setupGuide, soundCheck,
  ...(IS_PILOT ? [] : [baseSelf]),
  video1, check1,
  video2, check2,
  act1Intro, act1S1, act1A, act1AFb, act1B, act1BFb, act1Eng,
  video3, check3,
  act2Intro, act2S1, act2A, act2AFb, act2B, act2BFb, act2Eng,
  video4, check4,
  ...(IS_PILOT ? [pilotPost, pilotOpen] : [best]),
].filter(Boolean);
// 본실험 전용(2026-11-23): 마무리 의견에서 평정 세 문항(fb_text_time, fb_distract, fb_useful)을 빼고 서술 문항만 남김
PROGRAM_FEEDBACK.items = PROGRAM_FEEDBACK.items.filter(it => !["text_time", "distract", "useful", "open"].includes(it.id)); // "더 하고 싶은 말"도 뺌 → 남는 문항이 없어 이 화면은 나오지 않음
if (!IS_PILOT && PROGRAM_FEEDBACK.items.length) main.push(blockTrial(PROGRAM_FEEDBACK, "", 6, "feedback"));
// 본실험 전용(2026-11-23): 5일 복습(카드뉴스 + 자가점검)을 받을 시간을 고르게 함 → daily_time ("HH:MM")
const dailyTime = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(6)}<h1>5일 복습 안내</h1>
    <div class="card"><p>내일부터 5일 동안 <b>매일 저녁 6시</b>에 <b>카드뉴스와 자가점검</b> 링크를 보내 드립니다. 3~5분이면 끝나요.</p>
    <div class="lq">링크를 받을 휴대전화 번호를 적어 주세요.</div>
    <p><input type="tel" name="daily_phone" required inputmode="tel" autocomplete="tel" pattern="01[016789][\\-\\s]?[0-9]{3,4}[\\-\\s]?[0-9]{4}" placeholder="010-0000-0000" title="휴대전화 번호를 010-0000-0000 형식으로 적어 주세요." style="font-size:20px;padding:8px 12px;width:240px"></p>
    <p class="sub">전화번호는 5일 복습 링크를 보내는 데에만 사용합니다.</p></div>`,
  button_label: "다음",
  data: { task: "daily_time" },
  // daily_phone은 010-0000-0000 꼴로 맞춰 저장 (시트에서 숫자로 바뀌어 앞자리 0이 사라지지 않게)
  on_finish: d => { flatten(d); const n = String(d.daily_phone || "").replace(/\D/g, ""); if (n.length >= 10) d.daily_phone = `${n.slice(0, 3)}-${n.slice(3, n.length - 4)}-${n.slice(-4)}`; window.scrollTo(0, 0); },
};
if (!IS_PILOT) main.push(dailyTime);
main.push(debrief, save, endPage);

// ?debug=1&start=act1 또는 ?preview=1&start=video2 처럼 특정 지점부터 시작 (연구자 확인용, 데이터에 debug/preview 표시됨)
const PREVIEW = URLP.get("preview") === "1";
if (PREVIEW) jsPsych.data.addProperties({ preview: true });
const START = (DEBUG || PREVIEW) ? URLP.get("start") : null;
const STARTS = { video1, video2, act1: act1Intro, video3, act2: act2Intro, video4, best };
const head = IS_PILOT ? [browserCheck, pilotIntro, pilotInfo] : [browserCheck, ...(HAS_PID ? [] : [pidEntry])];
jsPsych.run(START && STARTS[START] && main.includes(STARTS[START]) ? [browserCheck, ...main.slice(main.indexOf(STARTS[START]))] : [...head, ...main]);
