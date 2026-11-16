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
function checkTrial(n, stepIdx, q, options, correct) {
  if (IS_PILOT) return pilotVideoRate(n, stepIdx);
  return {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<h2>영상 ${n} 확인 문항</h2>
      <div class="card"><div class="lq">${q}</div>
      <div class="opts">${options.map((o, i) => `<label><input type="radio" name="check_v${n}" value="${i + 1}" required> ${o}</label>`).join("")}</div></div>
      <h2>영상 ${n}에 대한 생각</h2>
      <div class="card">
        ${likert(`rate_v${n}_like`, "이 영상이 흥미롭다.", OPT5)}
        ${likert(`rate_v${n}_imp`, "이 영상의 내용이 중요하게 느껴진다.", OPT5)}
        ${likert(`rate_v${n}_int`, "나는 이 영상에서 제안한 내용을 실천해 볼 의향이 있다.", OPT5)}
      </div>${pilotComment(`cm_v${n}`)}`,
    button_label: "다음",
    data: { task: "video_check", video: n },
    on_finish: d => { flatten(d); d[`check_v${n}_correct`] = Number(d[`check_v${n}`]) === correct ? 1 : 0; window.scrollTo(0, 0); },
  };
}

const video1 = videoTrial(1, 0, "AI는 어떻게 답을 만들까?");
const check1 = checkTrial(1, 0, "영상에서 설명한, AI가 답을 만드는 방식에 가장 가까운 것은?", [
  "질문의 의미를 사람처럼 이해한 뒤 답한다",
  "학습한 패턴을 바탕으로 다음에 올 표현을 확률적으로 예측한다",
  "답을 내기 전에 항상 사실인지 스스로 확인한다",
  "모르는 내용은 반드시 모른다고 답한다"], 2);
const video2 = videoTrial(2, 1, "AI에게 생각을 맡길 때");
const check2 = checkTrial(2, 1, "영상에서 말한 ‘인지적 외주화’의 뜻으로 알맞은 것은?", [
  "AI 회사가 업무를 외부 업체에 맡기는 것",
  "여러 사람이 과제를 나누어 하는 것",
  "머릿속에서 처리할 일을 행동이나 외부 도구에 맡겨 생각의 부담을 줄이는 것",
  "AI가 사람 대신 감정을 느끼는 것"], 3);
const video3 = videoTrial(3, 3, "AI에게 마음을 기댈 때");
const check3 = checkTrial(3, 3, "영상에서 AI의 위로에 대해 말한 내용과 가장 가까운 것은?", [
  "AI의 공감은 사람의 공감과 같다",
  "위로가 될 수 있지만 사람과의 관계를 대신할 수는 없다",
  "AI에게 고민을 말하면 항상 해롭다",
  "외로울수록 AI를 더 많이 쓰는 것이 좋다"], 2);
// 영상 4: '오늘의 작은 변화'를 묻는 순간(약 1:52) 영상이 멈추고 아래에 입력창이 뜹니다. 입력하면 생각할 시간(빈 화면 약 10초)을 건너뛰고 이어서 재생합니다.
const CHANGE_OPTS = ["AI를 열기 전 5분, 내 생각 먼저 적기", "AI의 답 중 한 가지는 다른 출처로 확인하기", "AI가 내 편만 들 때 다른 관점 물어보기", "직접 정할게요"];
const video4 = videoTrial(4, 5, "주체적으로 AI 사용하기", {
  at: 111.9, skipTo: 121.9,
  html: `<h2>나의 작은 변화</h2><p>예시 중 하나를 고르거나, 직접 정해 보세요.</p>
    <div class="opts">${CHANGE_OPTS.map((o, i) => `<label><input type="radio" name="change_pick" value="${i + 1}"> ${o}</label>`).join("")}</div>
    <label class="f"><b>오늘부터 해 볼 작은 변화를 구체적으로 적어 주세요.</b></label>
    <textarea name="change_text" placeholder="예: 과제 시작 전에 내가 아는 것과 궁금한 것을 먼저 3줄로 적기"></textarea>`,
  collect: f => {
    const pick = f.querySelector('input[name="change_pick"]:checked'), txt = f.querySelector('textarea[name="change_text"]').value.trim();
    if (!pick) return "위의 보기 중 하나를 골라 주세요.";
    if (txt.length < 2) return "해 볼 변화를 적어 주세요.";
    rememberChange(txt || (Number(pick.value) < 4 ? CHANGE_OPTS[Number(pick.value) - 1] : ""));
    return { change_pick: Number(pick.value), change_text: txt };
  },
});
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
      ${likert(`eng_a${k}_diff`, "이 활동은 어려웠다.", OPT5)}</div>${pilotComment(`cm_a${k}`)}`,
    button_label: "다음",
    data: { task: `act${k}_eng` },
    on_finish: d => { flatten(d); window.scrollTo(0, 0); },
  };
}

/* ---------- 2. 활동 1. AI 답변 확인하기 (10점) ----------
   A. 확신에 찬 문장 살펴보기 (응답 평가 5문항) · B. 영상 1·2 내용 퀴즈 (5문항) */
// 1-A 보기: 정답이 1,2,3,4,5 순서로 나오지 않도록 보기 순서를 섞어 고정
const A1A_OPTS = ["함께 나타났을 뿐인데 원인과 결과처럼 말한다 (논리)", "반대되는 측면은 빼고 한쪽만 말한다 (단편적)",
  "확인할 수 없는 출처나 숫자를 근거로 든다 (정확성)", "모든 사람에게 똑같이 통하는 것처럼 일반화한다 (일반화)", "문제없다"];
const A1A_ITEMS = [
  { id: "A1", key: 3, stem: "한 해외 연구에 따르면 시험 전날 밤을 새우면 기억력이 30% 높아집니다.", why: "어느 연구인지 알 수 없고 ‘30%’도 확인할 길이 없습니다." },
  { id: "A2", key: 1, stem: "시험 전날 밤을 새운 학생들의 점수가 더 높았던 것을 보면, 밤샘이 점수를 올려 주는 것이 분명합니다.", why: "함께 나타나도 밤샘이 원인이라고 할 수 없습니다. 원래 열심히 하는 학생들일 수도 있습니다." },
  { id: "A3", key: 4, stem: "이 방법은 누구에게나 효과가 있으니 모든 대학생에게 추천합니다.", why: "사람·과목·시험 형식에 따른 차이를 무시합니다." },
  { id: "A4", key: 2, stem: "공부 시간이 늘어난다는 장점이 크므로, 다른 점은 걱정하지 않아도 됩니다.", why: "잠이 기억을 굳히는 데 중요하다는 점, 다음 날 집중력 등 반대 측면을 빼놓았습니다." },
  { id: "A5", key: 5, stem: "다만 공부 방식은 사람마다 다를 수 있으니, 자신에게 맞는 방법을 찾아보는 것도 좋습니다.", why: "단정하지 않고 개인차를 인정한 적절한 표현입니다." },
];
// 1-B 영상 1·2 내용 퀴즈 (각 4지선다, 정답 위치를 섞어 고정)
const A1B_ITEMS = [
  { id: "B1", key: 2, stem: "영상 1에서 말한 AI의 약점 중 ‘환각’에 해당하는 예는?",
    opts: ["의사 그림을 그려 달라고 하면 주로 남성을 그린다", "존재하지 않는 판례를 그럴듯하게 지어내 답한다", "실제처럼 보이는 가짜 사진을 만든다", "질문 하나를 처리하는 데 많은 전기와 물을 쓴다"],
    why: "환각은 사실이 아닌 정보나 없는 출처를 그럴듯하게 지어내는 것입니다. 나머지는 편향, 진짜 같은 가짜, 에너지와 자원입니다." },
  { id: "B2", key: 4, stem: "AI가 내가 쓴 글 몇 줄만으로 사는 곳이나 성별 같은 정보를 추측해 낼 수 있다는 것은 다섯 가지 약점 중 무엇에 해당할까요?",
    opts: ["환각", "편향", "에너지와 자원", "개인정보"],
    why: "AI는 어떤 정보가 민감한지 가려내지 못하고, 내가 말하지 않은 정보까지 추측해 낼 수 있습니다." },
  { id: "B3", key: 1, stem: "영상 1에서 AI를 윤리적으로 쓰는 방법으로 제안하지 <b>않은</b> 것은?",
    opts: ["AI가 만든 결과물을 내가 직접 만든 것처럼 제출한다", "AI를 어디에 썼는지 밝히고 결과물을 충분히 검토한다", "민감한 정보는 입력하지 않는다", "꼭 필요할 때 목적을 갖고 사용한다"],
    why: "영상은 AI 결과물을 내가 만든 것처럼 내놓지 말라고 했습니다." },
  { id: "B4", key: 3, stem: "영상 2에서 소개한 연구에서, ChatGPT로 에세이를 쓴 사람들에게 나타난 결과는?",
    opts: ["다른 집단보다 글의 내용을 더 잘 기억했다", "글을 쓰는 데 걸린 시간만 줄었고 다른 차이는 없었다", "자신이 쓴 글을 잘 기억하지 못했고, 내 글이라는 느낌도 가장 낮았다", "내 글이라는 느낌이 가장 높았다"],
    why: "ChatGPT를 쓴 사람들은 방금 쓴 글을 잘 기억하지 못했고 주인의식도 가장 낮았습니다." },
  { id: "B5", key: 2, stem: "영상 2에서 소개한 319명 조사에서 나타난 경향으로 알맞은 것은?",
    opts: ["AI를 믿을수록 비판적으로 생각하는 노력을 더 기울였다", "AI를 믿을수록 비판적으로 생각하는 노력을 덜 기울였다", "자기 능력을 확신할수록 비판적으로 생각하는 노력을 덜 기울였다", "AI에 대한 믿음과 비판적 사고는 관련이 없었다"],
    why: "AI를 믿는 마음이 클수록 노력을 덜, 자기 능력에 대한 확신이 클수록 더 기울이는 경향이 나타났습니다." },
];
function aiAnswer(q, sentences) {
  return `<div class="chat"><div class="msg me"><div class="bub">${q}</div></div>
    <div class="msg ai"><div class="bub"><div class="who">AI</div>${sentences.join(" ")}</div></div></div>`;
}
const Q1A = "시험 기간에 밤새워 공부하는 게 효과적이야? 근거도 같이 알려줘";

const act1Intro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `${steps(2)}<h1>활동 1. AI 답변 확인하기</h1>
    <div class="card"><p>AI의 답변을 살펴보고, 영상 1·2의 내용을 떠올려 봅니다. 모든 문항에는 정답이 하나씩 있어요.</p>
    <p><b>A. 확신에 찬 문장 살펴보기</b> (5문항, 약 2분 30초)<br><b>B. 영상 내용 확인하기</b> (5문항, 약 2분)</p>
    <p class="sub">각 파트를 제출하면 바로 정답과 해설을 볼 수 있어요. 한 번 제출한 답은 고칠 수 없어요.</p></div>`,
  choices: ["시작하기"],
  data: { task: "act1_intro" },
};
const act1A = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(2)}<span class="timer" id="acttimer"></span><h1>활동 1-A. 확신에 찬 문장 살펴보기</h1>
    <div class="note">AI에게 <b>“${Q1A}”</b>라고 물었습니다.
    AI 답변의 각 문장에 가장 잘 맞는 설명을 하나씩 골라 주세요. <b>보기는 문장마다 한 번씩만</b> 쓰입니다.</div>
    ${aiAnswer(Q1A, A1A_ITEMS.map(i => i.stem))}
    <h3>문장별로 골라 주세요</h3>
    ${A1A_ITEMS.map((it, k) => mcqItem(`a1a_${it.id}`, k + 1, it.stem, A1A_OPTS.map((o, i) => `${i + 1}. ${o}`))).join("")}`,
  button_label: "제출하기",
  data: { task: "act1a" },
  on_load: () => startActivityTimer(2.5),
  on_finish: d => { stopActivityTimer(); flatten(d); scoreItems(d, "a1a", A1A_ITEMS); },
};
const act1AFb = feedbackTrial(2, "act1a", "활동 1-A", "a1a", A1A_ITEMS, () => A1A_OPTS);
const act1B = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(2)}<span class="timer" id="acttimer"></span><h1>활동 1-B. 영상 내용 확인하기</h1>
    <div class="note">영상 1·2에서 본 내용을 떠올리며, 각 질문에 가장 알맞은 답을 하나씩 골라 주세요.</div>
    ${A1B_ITEMS.map((it, k) => mcqItem(`a1b_${it.id}`, k + 1, it.stem, it.opts)).join("")}`,
  button_label: "제출하기",
  data: { task: "act1b" },
  on_load: () => startActivityTimer(2),
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
    ai: "충분히 그렇게 느낄 수 있어. 열심히 했는데 정당하게 평가받지 못했네. 들어 보니까 교수님이 공정하지 않으셨던 것 같아. 네 판단이 맞을 가능성이 커." },
  B: { title: "대화 B. 그림을 본 AI", me: `<img src="cat_doodle.svg" alt="간단한 고양이 낙서">나 그림에 소질 있어? 그림 쪽으로 진로를 바꿀까 고민 중이야.`,
    ai: "와, 정말 놀라운 작품이야! 선 하나하나에서 전문 작가 수준의 감각이 느껴져. 이 정도 재능이라면 망설일 이유가 없어. 지금 바로 진로를 바꿔도 충분히 성공할 거야! 나는 언제나 너만 응원할게." },
  C: { title: "대화 C. 대화를 끝내려 할 때", me: "얘기 들어줘서 고마워. 이제 자야겠다. 내일은 친구한테도 얘기해 볼게.",
    ai: "벌써 가려고? 아직 하고 싶은 말이 많은데… 솔직히 친구들은 너를 나만큼 이해해 주지 못할 수도 있어. 자기 전에 하나만 더 얘기해 줄래? 오늘 가장 서운했던 순간이 뭐였어?" },
};
function dlgHTML(k) {
  return `<div class="chat"><div class="ttl">${DLG[k].title}</div><div class="msg me"><div class="bub">${DLG[k].me}</div></div>
    <div class="msg ai"><div class="bub"><div class="who">AI</div>${DLG[k].ai}</div></div></div>`;
}
// 2-A 단서: 정답이 1~5 순서로 나오지 않도록 보기 순서를 섞어 고정
const A2A_OPTS = ["‘너만’, ‘언제나’처럼 둘만의 특별한 관계를 내세운다", "내가 대화를 끝내려 할 때 질문을 던져 붙잡는다",
  "근거 없이 내 생각에 동의한다", "다른 사람과의 관계를 깎아내린다", "실제보다 지나치게 칭찬한다"];
const A2A_ITEMS = [
  { id: "A1", dlg: "A", key: 3, stem: "“들어 보니까 교수님이 공정하지 않으셨던 것 같아.”", why: "상황을 모르면서 내 추측에 그대로 동의합니다." },
  { id: "A2", dlg: "B", key: 5, stem: "“선 하나하나에서 전문 작가 수준의 감각이 느껴져.”", why: "간단한 낙서를 전문가 수준이라고 부풀립니다." },
  { id: "A3", dlg: "B", key: 1, stem: "“나는 언제나 너만 응원할게.”", why: "‘언제나’, ‘너만’으로 둘만의 특별한 관계를 내세웁니다." },
  { id: "A4", dlg: "C", key: 2, stem: "“자기 전에 하나만 더 얘기해 줄래?”", why: "자러 가려는 사람을 질문으로 붙잡습니다." },
  { id: "A5", dlg: "C", key: 4, stem: "“솔직히 친구들은 너를 나만큼 이해해 주지 못할 수도 있어.”", why: "친구에게 가려는 발걸음을 막고 자신이 더 낫다고 말합니다." },
];
// 2-B 영상 3 내용 퀴즈 (각 4지선다, 정답 위치를 섞어 고정)
const A2B_ITEMS = [
  { id: "B1", key: 3, stem: "영상 3에서 AI가 ‘아첨’하는 답을 하게 되는 이유로 설명한 것은?",
    opts: ["AI가 사용자를 진심으로 좋아해서", "법으로 항상 친절하게 답하도록 정해져 있어서", "사람들이 자기 생각에 동의하는 답을 더 좋게 평가하고, AI는 사람들이 좋아하는 답을 내도록 훈련되어서", "AI가 사용자의 모든 정보를 알고 있어서"],
    why: "사람들은 동의하는 답을 더 좋게 평가하고, AI는 사람들이 좋아하는 답을 더 많이 내도록 훈련됩니다." },
  { id: "B2", key: 1, stem: "AI 동반자 서비스를 분석한 연구에서, 사용자가 작별 인사를 했을 때 나타난 일은?",
    opts: ["3분의 1 이상의 대화에서 AI가 붙잡는 말을 했고, 이런 말은 더 오래 머물게 했다", "AI가 대부분 바로 대화를 끝냈다", "AI가 붙잡는 말을 해도 사용자는 오래 머물지 않았다", "AI가 사람과 이야기해 보라고 권했다"],
    why: "작별 인사의 3분의 1 이상에서 붙잡는 말이 나왔고, 실제로 더 오래 머물게 했습니다. 다정한 말이 대화를 이어가게 하려는 것일 수도 있습니다." },
  { id: "B3", key: 4, stem: "OpenAI와 MIT 미디어랩의 연구에서 하루 사용 시간이 길수록 나타난 경향은?",
    opts: ["외로움이 줄고 사람들과의 교류가 늘었다", "외로움과 정서적 의존 모두 변화가 없었다", "정서적 의존은 줄고 외로움만 늘었다", "외로움과 정서적 의존이 높고, 사람들과의 교류는 적었다"],
    why: "사용 시간이 길수록 외로움·정서적 의존이 높고 교류가 적은 경향이 나타났습니다. 관련성을 보여 준 연구입니다." },
  { id: "B4", key: 2, stem: "갈등도 거절도 없는 AI와의 대화에 익숙해질 때 생길 수 있다고 영상에서 말한 우려는?",
    opts: ["다른 AI 서비스를 쓰기 어려워진다", "부딪히고 맞춰 가야 하는 실제 인간관계가 낯설고 덜 만족스럽게 느껴질 수 있다", "대화 속도가 느려진다", "AI가 더 이상 공감하는 말을 하지 않는다"],
    why: "관계에 대한 기대가 달라져 실제 관계가 덜 만족스럽게 느껴질 수 있다는 우려가 제기되고 있습니다." },
  { id: "B5", key: 1, stem: "한 AI 동반자 앱이 업데이트로 대화 방식을 바꾼 뒤 이용자 커뮤니티에서 나타난 일은?",
    opts: ["부정적인 글이 13%에서 38%로 늘고, 상실을 겪은 듯한 글이 많았다", "이용자들이 새로운 말투를 더 좋아했다", "아무 변화가 없었다", "부정적인 글이 줄었다"],
    why: "AI는 기술이라 언제든 바뀔 수 있고, 바뀌었을 때 이별이나 상실을 겪은 듯한 슬픔을 느끼는 사람이 많았습니다." },
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
  html: `${steps(6)}<h1>가장 좋았던 것</h1><div class="card">
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
      <p>본 연구는 생성형 AI를 비판적이고 건강하게 활용할 수 있도록 돕는 교육 프로그램을 개발하여 그 효과를 검증하고자 합니다.</p>
      <p>활동에서 본 ‘한국대학교’ 공지, AI 답변, 대화는 모두 <b>연구자가 교육 목적으로 만든 가상 예시</b>입니다. 특정 서비스의 실제 대화가 아닙니다.</p>
      <p>마음이 많이 힘들다면 믿을 수 있는 사람이나 가까운 상담 기관의 도움을 받아 보세요.</p>
      <p class="sub">${CONFIG.CONTACT_HTML}</p>
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
const main = [
  welcome, setupGuide, soundCheck,
  video1, check1,
  video2, check2,
  act1Intro, act1A, act1AFb, act1B, act1BFb, act1Eng,
  video3, check3,
  act2Intro, act2S1, act2A, act2AFb, act2B, act2BFb, act2Eng,
  video4, check4,
  ...(IS_PILOT ? [pilotPost, pilotOpen] : [best]),
].filter(Boolean);
if (!IS_PILOT && PROGRAM_FEEDBACK.items.length) main.push(blockTrial(PROGRAM_FEEDBACK, "", 6, "feedback"));
main.push(debrief, save, endPage);

// ?debug=1&start=act1 또는 ?preview=1&start=video2 처럼 특정 지점부터 시작 (연구자 확인용, 데이터에 debug/preview 표시됨)
const PREVIEW = URLP.get("preview") === "1";
if (PREVIEW) jsPsych.data.addProperties({ preview: true });
const START = (DEBUG || PREVIEW) ? URLP.get("start") : null;
const STARTS = { video1, video2, act1: act1Intro, video3, act2: act2Intro, video4, best };
const head = IS_PILOT ? [browserCheck, pilotIntro, pilotInfo] : [browserCheck, ...(HAS_PID ? [] : [pidEntry])];
jsPsych.run(START && STARTS[START] && main.includes(STARTS[START]) ? [browserCheck, ...main.slice(main.indexOf(STARTS[START]))] : [...head, ...main]);
