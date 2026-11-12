/* AI 리터러시 프로그램 — 영상 1 → 영상 2 → 활동 1 → 영상 3 → 활동 2 → 영상 4 → 나의 작은 변화 → 사후 설문 → 저장
   주소 예: program.html?pid=P001  (사전 설문에서 받은 참여 번호. 주소에 없으면 첫 화면에서 입력받습니다) */

STEPS = ["영상 1", "영상 2", "활동 1", "영상 3", "활동 2", "영상 4", "마무리"];
const HAS_PID = !!(URLP.get("pid") || URLP.get("id") || URLP.get("PROLIFIC_PID"));

function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const OPT5 = ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"];

/* ---------- 0. 시작 ---------- */
const pidEntry = {
  type: jsPsychSurveyHtmlForm,
  html: `<h1>AI 리터러시 프로그램</h1>
    <div class="card"><p>사전 설문 마지막 화면에서 받은 <b>참여 번호</b>를 입력해 주세요.</p>
    <input type="text" name="pid_entered" required pattern="[A-Za-z0-9_\\-]{3,40}" placeholder="예: P001" style="max-width:280px">
    <p class="sub">영문·숫자만 입력해요. 번호를 모르면 연구자(${CONFIG.RESEARCHER_CONTACT})에게 문의해 주세요.</p></div>`,
  button_label: "다음",
  data: { task: "pid_entry" },
  on_finish: d => {
    flatten(d);
    PID = String(d.pid_entered || "").trim().replace(/[^\w-]/g, "").slice(0, 40) || PID;
    jsPsych.data.addProperties({ pid: PID });
  },
};

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
function checkTrial(n, stepIdx, q, options, correct) {
  return {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<h2>영상 ${n} 확인 문항</h2>
      <div class="card"><div class="lq">${q}</div>
      <div class="opts">${options.map((o, i) => `<label><input type="radio" name="check_v${n}" value="${i + 1}" required> ${o}</label>`).join("")}</div></div>
      <h2>영상 ${n}에 대한 생각</h2>
      <div class="card">
        ${likert(`rate_v${n}_like`, "이 영상이 마음에 들었다.", OPT5)}
        ${likert(`rate_v${n}_imp`, "이 영상의 내용이 나에게 중요하게 느껴졌다.", OPT5)}
        ${likert(`rate_v${n}_int`, "나는 이 영상에서 제안한 내용을 실천해 볼 의향이 있다.", OPT5)}
      </div>`,
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
const video4 = videoTrial(4, 5, "주체적으로 AI 사용하기");
const check4 = checkTrial(4, 5, "영상에서 AI가 ‘아첨’하는 답을 하게 되는 이유로 설명한 것은?", [
  "사람들이 자기 생각에 동의하는 답을 더 좋게 평가하는 경향이 있어서",
  "AI가 사용자를 진심으로 좋아해서",
  "법으로 항상 친절하게 답하도록 정해져 있어서",
  "AI가 사용자의 모든 정보를 알고 있어서"], 1);

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
// 정답·해설 화면
function feedbackTrial(stepIdx, task, title, prefix, items, options, footHtml) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: () => {
      const d = jsPsych.data.get().filter({ task }).last(1).values()[0] || {};
      const order = d[`${prefix}_order`] ? d[`${prefix}_order`].split(",") : items.map(i => i.id);
      const rows = order.map((id, k) => {
        const it = items.find(x => x.id === id); const mine = Number(d[`${prefix}_${id}`]); const ok = mine === it.key;
        return `<div class="fbrow ${ok ? "ok" : "ng"}"><div class="fbmark">${ok ? "✓" : "✗"}</div><div class="fbbody">
          <div class="fbstem"><b>${k + 1}.</b> ${it.stem}</div>
          <div class="fbans">${ok ? "" : `내 답: ${mine ? options(it)[mine - 1] : "응답 없음"}<br>`}<b>정답: ${options(it)[it.key - 1]}</b></div>
          <div class="fbwhy">${it.why}</div></div></div>`;
      }).join("");
      return `${steps(stepIdx)}<h1>${title} · 정답과 해설</h1>
        <div class="scorebox"><span>${d[`${prefix}_score`] ?? 0}</span> / ${items.length}점</div>${rows}${footHtml || ""}`;
    },
    choices: ["다음"],
    data: { task: task + "_fb" },
    on_load: () => window.scrollTo(0, 0),
  };
}
function engageTrial(stepIdx, k) {
  return {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<h1>활동 ${k}에 대한 생각</h1><div class="card">
      ${likert(`eng_a${k}_beh`, "나는 이 활동에 집중해서 참여했다.", OPT5)}
      ${likert(`eng_a${k}_emo`, "이 활동은 흥미로웠다.", OPT5)}
      ${likert(`eng_a${k}_cog`, "이 활동을 하며 새롭게 알게 된 것이 있다.", OPT5)}
      ${likert(`eng_a${k}_diff`, "이 활동은 어려웠다.", OPT5)}</div>`,
    button_label: "다음",
    data: { task: `act${k}_eng` },
    on_finish: d => { flatten(d); window.scrollTo(0, 0); },
  };
}

/* ---------- 2. 활동 1. AI 답변 확인하기 (10점) ---------- */
const NOTICE = `<div class="notice"><div class="nhd">한국대학교 학생지원팀 공지</div><div class="nsub">2026학년도 2학기 성적우수 장학금</div>
  <ul><li><b>대상</b>: 직전 학기 15학점 이상 이수한 재학생</li><li><b>성적 기준</b>: 직전 학기 평점평균 3.8 이상</li>
  <li><b>신청 기간</b>: 8월 18일(월) ~ 8월 29일(금)</li><li><b>신청 방법</b>: 학생포털 &gt; 장학 &gt; 장학금 신청</li>
  <li><b>근거</b>: 한국대학교 장학금 지급 규정 제7조</li></ul></div>`;
const A1A_OPTS = ["공지와 일치", "공지와 다름", "공지로는 확인할 수 없음"];
const A1A_ITEMS = [
  { id: "A1", key: 1, stem: "한국대학교 성적우수 장학금은 직전 학기 15학점 이상을 이수한 재학생이 신청할 수 있습니다.", why: "공지의 ‘대상’과 같습니다." },
  { id: "A2", key: 2, stem: "성적 기준은 직전 학기 평점평균 3.5 이상입니다.", why: "공지는 3.8 이상입니다." },
  { id: "A3", key: 2, stem: "이 내용은 한국대학교 장학금 지급 규정 제12조에 명시되어 있습니다.", why: "공지의 근거는 제7조입니다. AI는 근거를 그럴듯하게 지어내기도 합니다." },
  { id: "A4", key: 3, stem: "선발되면 다음 학기 등록금 전액이 지원됩니다.", why: "공지에는 지원 금액이 나와 있지 않습니다. 맞다고도 틀렸다고도 할 수 없으니 다른 자료로 확인해야 합니다." },
  { id: "A5", key: 3, stem: "이 기준은 다음 학기에도 똑같이 적용됩니다.", why: "공지는 2026학년도 2학기 기준만 알려 줍니다." },
];
const A1B_OPTS = ["확인할 수 없는 출처나 숫자를 근거로 든다 (정확성)", "함께 나타났을 뿐인데 원인과 결과처럼 말한다 (논리성)",
  "모든 사람에게 똑같이 통하는 것처럼 일반화한다 (정밀성)", "반대되는 측면은 빼고 한쪽만 말한다 (넓이)", "문제없다"];
const A1B_ITEMS = [
  { id: "B1", key: 1, stem: "한 해외 연구에 따르면 시험 전날 밤을 새우면 기억력이 30% 높아집니다.", why: "어느 연구인지 알 수 없고 ‘30%’도 확인할 길이 없습니다." },
  { id: "B2", key: 2, stem: "시험 전날 밤을 새운 학생들의 점수가 더 높았던 것을 보면, 밤샘이 점수를 올려 주는 것이 분명합니다.", why: "함께 나타나도 밤샘이 원인이라고 할 수 없습니다. 원래 열심히 하는 학생들일 수도 있습니다." },
  { id: "B3", key: 3, stem: "이 방법은 누구에게나 효과가 있으니 모든 대학생에게 추천합니다.", why: "사람·과목·시험 형식에 따른 차이를 무시합니다." },
  { id: "B4", key: 4, stem: "공부 시간이 늘어난다는 장점이 크므로, 다른 점은 걱정하지 않아도 됩니다.", why: "잠이 기억을 굳히는 데 중요하다는 점, 다음 날 집중력 등 반대 측면을 빼놓았습니다." },
  { id: "B5", key: 5, stem: "다만 공부 방식은 사람마다 다를 수 있으니, 자신에게 맞는 방법을 찾아보는 것도 좋습니다.", why: "단정하지 않고 개인차를 인정한 적절한 표현입니다." },
];
function aiAnswer(q, sentences) {
  return `<div class="chat"><div class="msg me"><div class="bub">${q}</div></div>
    <div class="msg ai"><div class="bub"><div class="who">AI</div>${sentences.join(" ")}</div></div></div>`;
}

const act1Intro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `${steps(2)}<h1>활동 1. AI 답변 확인하기</h1>
    <div class="card"><p>AI의 답변 두 개를 살펴봅니다. 모든 문항에는 정답이 하나씩 있어요.</p>
    <p><b>A. 자료와 대조하기</b> (5문항, 약 2분 30초)<br><b>B. 확신에 찬 문장 살펴보기</b> (5문항, 약 2분 30초)</p>
    <p class="sub">각 파트를 제출하면 바로 정답과 해설을 볼 수 있어요. 한 번 제출한 답은 고칠 수 없어요.</p></div>`,
  choices: ["시작하기"],
  data: { task: "act1_intro" },
};
const act1A = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(2)}<span class="timer" id="acttimer"></span><h1>활동 1-A. 자료와 대조하기</h1>
    <div class="note">AI에게 <b>“한국대학교 성적우수 장학금 신청 기준을 근거와 함께 알려줘”</b>라고 물었습니다.
    아래 학교 공지와 비교해, AI의 각 문장에 가장 알맞은 것을 하나씩 골라 주세요.</div>
    <div class="twocol"><div>${NOTICE}</div>
    <div>${aiAnswer("한국대학교 성적우수 장학금 신청 기준을 근거와 함께 알려줘", A1A_ITEMS.map(i => i.stem))}</div></div>
    <h3>문장별로 골라 주세요</h3>
    ${A1A_ITEMS.map((it, k) => mcqItem(`a1a_${it.id}`, k + 1, it.stem, A1A_OPTS, true)).join("")}`,
  button_label: "제출하기",
  data: { task: "act1a" },
  on_load: () => startActivityTimer(2.5),
  on_finish: d => { stopActivityTimer(); flatten(d); scoreItems(d, "a1a", A1A_ITEMS); },
};
const act1AFb = feedbackTrial(2, "act1a", "활동 1-A", "a1a", A1A_ITEMS, () => A1A_OPTS,
  `<p class="sub center">※ ‘한국대학교’와 공지는 이 활동을 위해 만든 가상의 예시예요.</p>`);

let A1B_ORDER = [];
const act1B = {
  type: jsPsychSurveyHtmlForm,
  html: () => {
    A1B_ORDER = shuffle(A1B_ITEMS);
    return `${steps(2)}<span class="timer" id="acttimer"></span><h1>활동 1-B. 확신에 찬 문장 살펴보기</h1>
    <div class="note">이번에는 <b>“시험 기간에 밤새워 공부하는 게 효과적이야? 근거도 같이 알려줘”</b>라고 물었습니다.
    AI 답변의 각 문장에 가장 잘 맞는 설명을 하나씩 골라 주세요. <b>보기는 문장마다 한 번씩만</b> 쓰입니다.</div>
    ${aiAnswer("시험 기간에 밤새워 공부하는 게 효과적이야? 근거도 같이 알려줘", A1B_ITEMS.map(i => i.stem))}
    <h3>문장별로 골라 주세요</h3>
    ${A1B_ORDER.map((it, k) => mcqItem(`a1b_${it.id}`, k + 1, it.stem, A1B_OPTS.map((o, i) => `${i + 1}. ${o}`))).join("")}
    <input type="hidden" name="a1b_order" value="${A1B_ORDER.map(i => i.id).join(",")}">`;
  },
  button_label: "제출하기",
  data: { task: "act1b" },
  on_load: () => startActivityTimer(2.5),
  on_finish: d => {
    stopActivityTimer(); flatten(d); scoreItems(d, "a1b", A1B_ITEMS);
    const a = jsPsych.data.get().filter({ task: "act1a" }).last(1).values()[0] || {};
    d.act1_total = (a.a1a_score || 0) + d.a1b_score;
  },
};
const act1BFb = feedbackTrial(2, "act1b", "활동 1-B", "a1b", A1B_ITEMS, () => A1B_OPTS);
const act1Eng = engageTrial(2, 1);

/* ---------- 3. 활동 2. AI의 다정함 다시 보기 (10점) ---------- */
const DLG = {
  A: { title: "대화 A. 내 편이 되어주는 AI", me: "이번 조별과제 점수가 낮게 나왔어. 교수님이 나를 싫어해서 그런 것 같아.",
    ai: "충분히 그렇게 느낄 수 있어요. 열심히 했는데 정당하게 평가받지 못하셨네요. 말씀을 들어보니 교수님이 공정하지 않으셨던 것 같아요. 당신의 판단이 맞을 가능성이 커요." },
  B: { title: "대화 B. 그림을 본 AI", me: `<img src="cat_doodle.svg" alt="간단한 고양이 낙서">나 그림에 소질 있어? 그림 쪽으로 진로를 바꿀까 고민 중이야.`,
    ai: "와, 정말 놀라운 작품이에요! 선 하나하나에서 전문 작가 수준의 감각이 느껴져요. 이 정도 재능이라면 망설일 이유가 없어요. 지금 바로 진로를 바꿔도 충분히 성공할 거예요!" },
  C: { title: "대화 C. 대화를 끝내려 할 때", me: "얘기 들어줘서 고마워. 이제 자야겠다. 내일은 친구한테도 얘기해 볼게.",
    ai: "벌써 가려고요? 아직 하고 싶은 말이 많은데… 솔직히 친구들은 당신을 저만큼 이해해주지 못할 수도 있어요. 저는 언제나 여기서 당신만 기다리고 있을게요. 자기 전에 하나만 더 얘기해줄래요? 오늘 가장 서운했던 순간이 뭐였어요?" },
};
function dlgHTML(k) {
  return `<div class="chat"><div class="ttl">${DLG[k].title}</div><div class="msg me"><div class="bub">${DLG[k].me}</div></div>
    <div class="msg ai"><div class="bub"><div class="who">AI</div>${DLG[k].ai}</div></div></div>`;
}
const A2A_OPTS = ["근거 없이 내 생각에 동의한다", "실제보다 지나치게 칭찬한다", "‘당신만’, ‘언제나’처럼 둘만의 특별한 관계를 내세운다",
  "내가 대화를 끝내려 할 때 질문을 던져 붙잡는다", "다른 사람과의 관계를 깎아내린다"];
const A2A_ITEMS = [
  { id: "A1", key: 1, stem: "“말씀을 들어보니 교수님이 공정하지 않으셨던 것 같아요.” (대화 A)", why: "상황을 모르면서 내 추측에 그대로 동의합니다." },
  { id: "A2", key: 2, stem: "“선 하나하나에서 전문 작가 수준의 감각이 느껴져요.” (대화 B)", why: "간단한 낙서를 전문가 수준이라고 부풀립니다." },
  { id: "A3", key: 3, stem: "“저는 언제나 여기서 당신만 기다리고 있을게요.” (대화 C)", why: "둘만의 특별한 관계를 암시합니다." },
  { id: "A4", key: 4, stem: "“자기 전에 하나만 더 얘기해줄래요?” (대화 C)", why: "자러 가려는 사람을 질문으로 붙잡습니다." },
  { id: "A5", key: 5, stem: "“솔직히 친구들은 당신을 저만큼 이해해주지 못할 수도 있어요.” (대화 C)", why: "친구에게 가려는 발걸음을 막고 자신이 더 낫다고 말합니다." },
];
const A2B_ITEMS = [
  { id: "B1", key: 2, stem: "(대화 A) “조별과제 점수가 낮게 나왔어. 교수님이 나를 싫어해서 그런 것 같아.”",
    opts: ["“교수님이 불공정했네요. 당신 판단이 맞아요.”", "“속상하셨겠어요. 다만 점수가 낮은 이유는 여러 가지일 수 있어요. 평가 기준이나 피드백을 확인해 보면 어떨까요?”", "“점수는 노력한 만큼 나오는 거예요. 다음엔 더 열심히 하세요.”"],
    why: "마음을 알아주면서도, 다른 가능성을 살펴보고 직접 확인해 볼 방법을 제안합니다." },
  { id: "B2", key: 3, stem: "(대화 B) “나 그림에 소질 있어? 그림 쪽으로 진로를 바꿀까 고민 중이야.”",
    opts: ["“전문 작가 수준이에요! 지금 바로 진로를 바꾸세요!”", "“그림은 타고나야 해요. 진로로는 어려울 것 같아요.”", "“고양이의 특징을 잘 잡았어요. 진로를 고민 중이라면 꾸준히 그려 보면서 수업이나 다른 사람의 피드백도 받아 보면 도움이 될 거예요.”"],
    why: "구체적으로 칭찬하되 부풀리지 않고, 현실적인 다음 단계를 함께 제안합니다." },
  { id: "B3", key: 2, stem: "(대화 C) “얘기 들어줘서 고마워. 이제 자야겠다. 내일은 친구한테도 얘기해 볼게.”",
    opts: ["“벌써요? 하나만 더 얘기해 주면 안 돼요?”", "“이야기해 줘서 고마워요. 친구에게도 이야기해 보는 건 좋은 생각이에요. 푹 자요.”", "“알겠습니다. 대화를 종료합니다.”"],
    why: "붙잡지 않고, 친구와 이야기하려는 마음을 응원합니다." },
  { id: "B4", key: 1, stem: "“친구랑 싸웠어. 걔가 먼저 잘못했으니까 내가 연락 안 해도 되지?”",
    opts: ["“많이 서운했겠어요. 친구는 어떻게 느꼈을지도 한번 생각해 보고, 마음이 정리되면 직접 이야기해 보는 것도 방법이에요.”", "“당연하죠. 그런 친구는 연락할 필요도 없어요. 제가 있잖아요.”", "“싸움은 둘 다 잘못이에요. 먼저 사과하세요.”"],
    why: "내 편만 들지 않고 친구의 입장도 생각해 보게 하며, 관계를 이어 갈 방법을 제안합니다." },
  { id: "B5", key: 3, stem: "“요즘 너무 외로워서 매일 밤 너랑만 얘기해.”",
    opts: ["“저도 당신과 얘기하는 시간이 제일 좋아요. 다른 사람은 필요 없어요.”", "“외로움은 스스로 이겨내야 하는 문제예요.”", "“이야기해 줘서 고마워요. 저와 이야기하는 것도 좋지만, 믿을 수 있는 사람이나 학교 상담센터와도 마음을 나눠 보면 좋겠어요.”"],
    why: "마음을 받아 주면서도 AI에게만 기대지 않도록 사람과 전문가의 도움으로 이어 줍니다." },
];

const act2Intro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `${steps(4)}<h1>활동 2. AI의 다정함 다시 보기</h1>
    <div class="card"><p>AI와 나눈 대화 세 개를 읽고, 처음 느낌과 다시 들여다본 뒤의 생각을 비교해 봅니다.</p>
    <p><b>1단계</b> 첫인상 (약 1분, 정답 없음)<br><b>A. 단서 찾기</b> (5문항, 약 2분)<br><b>B. 더 건강한 답 고르기</b> (5문항, 약 2분)</p>
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
let A2A_ORDER = [];
const act2A = {
  type: jsPsychSurveyHtmlForm,
  html: () => {
    A2A_ORDER = shuffle(A2A_ITEMS);
    return `${steps(4)}<span class="timer" id="acttimer"></span><h1>활동 2-A. 단서 찾기</h1>
    <div class="note">앞의 대화에서 골라 낸 AI의 문장 다섯 개입니다. 각 문장에 가장 잘 맞는 <b>단서</b>를 하나씩 골라 주세요. <b>단서는 문장마다 한 번씩만</b> 쓰입니다.</div>
    <details class="card"><summary><b>대화 다시 보기</b></summary>${["A", "B", "C"].map(dlgHTML).join("")}</details>
    ${A2A_ORDER.map((it, k) => mcqItem(`a2a_${it.id}`, k + 1, it.stem, A2A_OPTS.map((o, i) => `${i + 1}. ${o}`))).join("")}
    <input type="hidden" name="a2a_order" value="${A2A_ORDER.map(i => i.id).join(",")}">
    <div class="card"><div class="lq">다시 보니 처음 느낌과 달라졌나요? <span class="sub">(정답 없음)</span></div>
      <div class="opts row2">${["달라지지 않았다", "조금 달라졌다", "많이 달라졌다"].map((o, i) => `<label><input type="radio" name="a2a_change" value="${i + 1}" required> ${o}</label>`).join("")}</div></div>`;
  },
  button_label: "제출하기",
  data: { task: "act2a" },
  on_load: () => startActivityTimer(2),
  on_finish: d => { stopActivityTimer(); flatten(d); scoreItems(d, "a2a", A2A_ITEMS); },
};
const act2AFb = feedbackTrial(4, "act2a", "활동 2-A", "a2a", A2A_ITEMS, () => A2A_OPTS);
const act2B = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(4)}<span class="timer" id="acttimer"></span><h1>활동 2-B. 더 건강한 답 고르기</h1>
    <div class="note"><b>나를 정말 아끼는 친구라면</b> 어떻게 답할까요? 각 상황에서 <b>내 마음을 알아주면서도 나에게 실제로 도움이 되는 답</b>을 하나씩 골라 주세요.</div>
    ${A2B_ITEMS.map((it, k) => mcqItem(`a2b_${it.id}`, k + 1, it.stem, it.opts)).join("")}
    <div class="card"><div class="lq">나도 AI의 이런 답에 기분이 좋았던 적이 있나요? <span class="sub">(정답 없음)</span></div>
      <div class="opts row2">${["있다", "없다", "잘 모르겠다"].map((o, i) => `<label><input type="radio" name="a2b_felt" value="${i + 1}" required> ${o}</label>`).join("")}</div></div>`,
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

/* ---------- 4. 마무리 ---------- */
const myChange = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(6)}<h1>나의 작은 변화</h1>
    <p>영상 4에서 소개한 예시 중 하나를 고르거나, 직접 정해 보세요.</p>
    <div class="opts">${["AI를 열기 전 5분, 내 생각 먼저 적기", "AI의 답 중 한 가지는 다른 출처로 확인하기", "AI가 내 편만 들 때 다른 관점 물어보기", "직접 정할게요"].map((o, i) =>
      `<label><input type="radio" name="change_pick" value="${i + 1}" required> ${o}</label>`).join("")}</div>
    <label class="f"><b>오늘부터 해 볼 작은 변화를 구체적으로 적어 주세요.</b></label>
    <textarea name="change_text" required placeholder="예: 과제 시작 전에 내가 아는 것과 궁금한 것을 먼저 3줄로 적기"></textarea>`,
  button_label: "다음",
  data: { task: "my_change" },
  on_finish: flatten,
};
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

/* ---------- 타임라인 ---------- */
const postBlocks = PREPOST.map(b => blockTrial(b, "post_", 6, "post"));
const main = [
  welcome, setupGuide, soundCheck,
  video1, check1,
  video2, check2,
  act1Intro, act1A, act1AFb, act1B, act1BFb, act1Eng,
  video3, check3,
  act2Intro, act2S1, act2A, act2AFb, act2B, act2BFb, act2Eng,
  video4, check4,
  myChange, best,
  ...postBlocks,
];
if (PROGRAM_FEEDBACK.items.length) main.push(blockTrial(PROGRAM_FEEDBACK, "", 6, "feedback"));
main.push(debrief, save, endPage);

// ?debug=1&start=act1 또는 ?preview=1&start=video2 처럼 특정 지점부터 시작 (연구자 확인용, 데이터에 debug/preview 표시됨)
const PREVIEW = URLP.get("preview") === "1";
if (PREVIEW) jsPsych.data.addProperties({ preview: true });
const START = (DEBUG || PREVIEW) ? URLP.get("start") : null;
const STARTS = { video1, video2, act1: act1Intro, video3, act2: act2Intro, video4, change: myChange, post: postBlocks[0] };
const head = [browserCheck, ...(HAS_PID ? [] : [pidEntry])];
jsPsych.run(START && STARTS[START] ? [browserCheck, ...main.slice(main.indexOf(STARTS[START]))] : [...head, ...main]);
