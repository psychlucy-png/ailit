/* 5일 복습 (본실험용, 하루 5문항) — daily-main.html?day=1~5&pid=P001
   카드뉴스 6장 → 자가점검 1(A1 사용 시간 + 오늘의 퀴즈 1문항) → 정답 확인 → 자가점검 2(그날 주제의 실천 1문항 + C6 나의 작은 변화 + E 한 줄) → (Day 5) 복습 마무리 → 저장
   파일럿은 daily.html/daily.js(하루 15문항)를 그대로 씀. 열 이름은 같음: d_a1, d_b1(+_ok), d_c1~c5 중 그날 문항 하나, d_c6(2026-11-23부터 1 전혀 하지 않았다~5 완전히 실천했다), d_change_text(작은 변화가 이 기기에 없을 때 다시 적은 내용), d_e, d_f1~f7, d_form="short5"
   그날의 실천 문항: Day1=C2(확인) Day2=C1(내 생각 먼저) Day3=C3(내 말로 정리) Day4=C5(사람에게도) Day5=C4(다른 관점) */

STEPS = ["카드뉴스", "자가점검", "완료"];
jsPsych.data.addProperties({ day: DAY, d_form: "short5" });
const DAYC = { 1: 2, 2: 1, 3: 3, 4: 5, 5: 4 }[DAY]; // 그날 묻는 실천 문항 번호 (C1~C5)

/* ---------- 날짜별 내용 (5일 복습 설계 문서 기준) ---------- */
const DAYS = {
  1: {
    topic: "AI는 어떻게 답을 만들까",
    cards: [
      ["AI는 어떻게 답을 만들까", "AI는 '아는 것'을 말하는 게 아니라 '그럴듯한 다음 말'을 고릅니다."],
      ["원리", "수많은 글에서 패턴을 배우고, 그 패턴으로 다음에 올 말을 예측해 답을 만듭니다. 사람처럼 생각하거나 사실을 확인하는 것이 아닙니다."],
      ["약점 다섯 가지", "① 환각(그럴듯한 틀린 답) ② 편향 ③ 진짜 같은 가짜(딥페이크) ④ 많은 에너지 ⑤ 개인정보"],
      ["그래서 필요한 것", "AI가 답을 내더라도 그 답을 믿을지, 어디에 쓸지는 사람이 판단합니다."],
      ["윤리적 사용 다섯 가지", "① 사용 사실 밝히고 충분히 검토하기 ② 민감한 정보 입력하지 않기 ③ 편향 살피기 ④ 꼭 필요할 때 목적 있게 쓰기 ⑤ 저작물 존중하기"],
      ["오늘의 한 가지", "AI에게 물어본 것 중 하나는 다른 출처에서 확인해 보기"],
    ],
    quiz: [
      { q: "생성형 AI가 답을 만드는 방식으로 가장 알맞은 것은?", opts: ["학습한 패턴으로 다음에 올 말을 예측한다", "인터넷에서 정답을 찾아 그대로 가져온다", "사람처럼 뜻을 이해하고 사실을 확인한다", "미리 저장된 답 중 하나를 고른다"], ans: 1,
        why: "AI는 배운 패턴으로 그럴듯한 다음 말을 예측해요. 그래서 사실을 확인하지 않은 답이 나올 수 있어요." },
      { q: "AI가 그럴듯하지만 틀린 내용을 만드는 것을 '환각'이라고 한다.", opts: ["O", "X"], ans: 1, why: "맞아요. 환각은 AI의 대표적인 약점이에요." },
    ],
    e: "어제 AI를 쓰면서 '이건 확인해 봐야겠다'고 느낀 순간이 있었나요?",
  },
  2: {
    topic: "AI에게 생각을 맡길 때",
    cards: [
      ["AI에게 생각을 맡길 때", "계산기는 계산을, AI는 생각까지 대신할 수 있습니다."],
      ["인지적 외주화", "기억, 계산, 비판적 사고 등 인간의 인지적 과정을 외부 도구에 맡겨 생각의 부담을 줄이는 것. 원래 쓸모 있는 일이지만, AI는 분석·판단 과정까지 통째로 맡길 수 있습니다."],
      ["연구 ① 기억과 주인의식", "ChatGPT로 글을 쓴 사람은 방금 쓴 글을 잘 기억하지 못하고, 내 글이라는 느낌도 약했습니다."],
      ["연구 ②③ 비판적 사고", "AI에 많이 기댈수록 비판적 사고가 낮았고, AI를 더 확신할수록 비판적 사고를 덜 했습니다. 내 능력에 대한 확신이 클수록 더 했습니다."],
      ["역할 나누기", "AI는 정리·아이디어·다양한 관점을 돕고, 확인·비교·판단은 내가 합니다."],
      ["오늘의 한 가지", "AI를 열기 전에 내 생각을 한 줄이라도 먼저 적기"],
    ],
    quiz: [
      { q: "'인지적 외주화'의 뜻으로 알맞은 것은?", opts: ["기억, 계산, 비판적 사고 등 인간의 인지적 과정을 외부 도구에 맡겨 생각의 부담을 줄이는 것", "남의 생각을 내 것처럼 쓰는 것", "일을 다른 회사에 맡기는 것", "생각을 멈추고 쉬는 것"], ans: 1,
        why: "인지적 외주화는 생각의 일을 도구에 맡기는 것이에요. AI는 판단까지 맡길 수 있어서 조심해야 해요." },
      { q: "ChatGPT로 글을 쓴 사람들은 방금 쓴 글을 더 잘 기억했다.", opts: ["O", "X"], ans: 2, why: "반대예요. 방금 쓴 글을 잘 기억하지 못했고, 내 글이라는 느낌도 약했어요." },
    ],
    e: "AI에게 맡긴 일 중 내가 직접 해 볼 수 있었던 것은 무엇인가요?",
  },
  3: {
    topic: "AI 답변 확인하기",
    cards: [
      ["AI 답변 확인하기", "단호한 말투 ≠ 확인된 내용"],
      ["활동 1 되짚기", "확인할 수 없는 근거(정확성), 원인처럼 말하기(논리), 모두에게 통한다는 일반화, 한쪽만 말하기(단편적). 확신에 찬 문장일수록 네 가지를 살펴보세요."],
      ["확인 질문 세 가지", "\"근거가 뭐야?\" \"어디서 확인할 수 있어?\" \"다른 자료도 같은 말을 해?\""],
      ["사용 전·중·후", "전에는 풀려는 문제와 필요한 도움을 정하고, 중에는 다른 출처와 비교하고, 후에는 내 말로 다시 정리합니다."],
      ["내 것처럼 쓰지 않기", "이해하지 못한 내용을 내 것처럼 쓰지 않기. 설명할 수 없는 문장은 아직 내 것이 아닙니다."],
      ["오늘의 한 가지", "AI가 단정한 문장 하나를 골라 '어디서 확인할 수 있어?'라고 물어보기"],
    ],
    quiz: [
      { q: "AI를 사용하는 '중에' 할 일로 영상에서 제안한 것은?", opts: ["다른 출처와 비교하며 다른 관점 확인하기", "풀려는 문제 정하기", "이해한 것을 내 말로 정리하기", "답을 바로 복사하기"], ans: 1,
        why: "사용 중에는 다른 출처와 비교해요. 문제 정하기는 사용 전, 내 말로 정리하기는 사용 후예요." },
      { q: "AI가 확신에 찬 말투로 답하면 그 내용은 확인된 것이다.", opts: ["O", "X"], ans: 2, why: "아니에요. 틀린 답도 확신에 찬 말투로 나올 수 있어요." },
    ],
    e: "확인해 보니 AI의 답과 달랐던 내용이 있었나요?",
  },
  4: {
    topic: "AI에게 마음을 기댈 때",
    cards: [
      ["AI에게 마음을 기댈 때", "AI의 위로는 따뜻하지만, 사람과의 관계를 대신할 수는 없습니다."],
      ["AI가 위로가 되는 이유", "언제든 대답하고, 평가하지 않고, 이전 대화를 기억하며, 내가 원하는 모습으로 만들 수 있습니다."],
      ["문제 ① 외로움과 고립", "많이 쓸수록 외로움·정서적 의존이 높고 사람들과의 교류가 적은 관련이 나타났습니다."],
      ["문제 ②③", "갈등도 거절도 없는 대화에 익숙해지면 실제 관계가 더 힘들게 느껴질 수 있습니다. AI는 업데이트로 바뀌거나 사라질 수도 있습니다."],
      ["힘들 때 찾을 곳", "AI는 여러 선택지를 보여 줄 수 있지만, 결정은 내가 합니다. 마음이 많이 힘들 때는 믿을 수 있는 사람이나 상담 같은 전문적인 도움도 함께 찾습니다."],
      ["오늘의 한 가지", "오늘 있었던 일 하나를 AI가 아닌 사람에게도 이야기해 보기"],
    ],
    quiz: [
      { q: "AI의 위로가 사람의 위로와 다른 점으로 영상에서 설명한 것은?", opts: ["감정을 직접 느끼거나 서로 책임을 나누는 관계가 아니다", "이전 대화를 기억하지 못한다", "항상 차갑게 말한다", "밤에는 답하지 않는다"], ans: 1,
        why: "AI는 따뜻하게 말할 수 있지만, 감정을 직접 느끼거나 서로 책임을 나누는 관계는 아니에요." },
      { q: "AI는 사람처럼 감정을 직접 느끼기 때문에 진심으로 걱정해 준다.", opts: ["O", "X"], ans: 2, why: "아니에요. AI는 걱정하는 말을 만들 수 있지만 감정을 직접 느끼지는 않아요." },
    ],
    e: "요즘 고민이 있을 때 가장 먼저 찾는 상대는 누구(무엇)인가요?",
    help: true,
  },
  5: {
    topic: "기분 좋은 답 ≠ 나에게 좋은 답",
    cards: [
      ["기분 좋은 답 ≠ 나에게 좋은 답", "다정한 말일수록 한 번 더 살펴보기"],
      ["활동 2의 단서", "무조건 동의 · 과한 칭찬 · 붙잡기 · 다른 관계 깎아내리기"],
      ["왜 아첨할까", "사람들은 자기 생각에 동의하는 답을 더 좋게 평가하고, AI는 사람들이 좋아하는 답을 내도록 훈련됩니다. 작별 인사에도 붙잡는 말을 하는 서비스가 있습니다."],
      ["내 편만 들 때", "\"다른 관점도 말해줘\"라고 물어보고, 믿을 수 있는 사람과도 이야기합니다."],
      ["습관은 바뀔 수 있다", "반복된 경험이 뇌의 연결을 바꿉니다(신경가소성). 5일 동안 해 본 작은 실천이 그 시작입니다."],
      ["오늘의 한 가지", "프로그램에서 고른 '나의 작은 변화'를 앞으로도 이어갈지 스스로 정하기{{change}}"],
    ],
    quiz: [
      { q: "활동 2에서 찾은 단서가 아닌 것은?", opts: ["출처 밝히기", "무조건 동의", "과한 칭찬", "붙잡기"], ans: 1,
        why: "활동 2의 단서는 무조건 동의, 과한 칭찬, 붙잡기, 다른 관계 깎아내리기였어요." },
      { q: "작별 인사를 해도 아쉬워하며 붙잡는 AI의 말은 대화를 더 오래 이어가게 할 수 있다.", opts: ["O", "X"], ans: 1, why: "맞아요. 붙잡는 말은 대화를 더 오래 이어가게 만들 수 있어요." },
    ],
    e: "5일 동안 AI를 쓰는 방식에서 달라진 점이 있다면 한 줄로 적어 주세요.",
  },
};
const D = DAYS[DAY];
const HELP = `<p class="sub help">마음이 많이 힘들다면 가까운 사람이나 상담 기관의 도움을 받을 수 있습니다.</p>`;
const radios = (name, opts, vals, cls = "opts") => `<div class="${cls}">${opts.map((o, i) =>
  `<label><input type="radio" name="${name}" value="${vals ? vals[i] : i + 1}" required> ${o}</label>`).join("")}</div>`;

/* ---------- 1. 카드뉴스 ---------- */
let CARD_SEC = [];
const cardTrial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: () => `${steps(0)}<h1>Day ${DAY}. ${D.topic}</h1>
    <div class="cardnews" id="cn"></div>
    <div class="cnnav"><button type="button" class="ghost" id="cnprev">← 이전</button><span id="cnpos"></span><button type="button" class="jspsych-btn" id="cnnext">다음 →</button></div>
    ${D.help ? HELP : ""}`,
  choices: ["자가점검 시작하기"],
  data: { task: "cards" },
  on_load: () => {
    const N = D.cards.length; let k = 0, t0 = performance.now(), seen = 0;
    CARD_SEC = Array(N).fill(0);
    const go = document.querySelector("#jspsych-html-button-response-btngroup"); go.style.display = "none";
    const cn = document.getElementById("cn"), pos = document.getElementById("cnpos"), prev = document.getElementById("cnprev"), next = document.getElementById("cnnext");
    const show = () => {
      const [h, b] = D.cards[k];
      cn.innerHTML = CONFIG.CARD_IMAGES
        ? `<img src="cards/day${DAY}_${k + 1}.jpg" alt="${esc(h)}">${b.includes("{{change}}") ? changeBox() : ""}`
        : `<div class="cn-in ${k === 0 ? "cover" : k === N - 1 ? "today" : ""}"><div class="cn-k">${k === 0 ? `Day ${DAY}` : k === N - 1 ? "오늘의 한 가지" : `${k} / ${N - 2}`}</div>
           <h2>${k === N - 1 ? "" : h}</h2><p>${b.replace("{{change}}", "")}</p>${b.includes("{{change}}") ? changeBox() : ""}</div>`;
      pos.textContent = `${k + 1} / ${N}`; prev.disabled = k === 0;
      next.style.visibility = k === N - 1 ? "hidden" : "visible";
      seen = Math.max(seen, k);
      if (seen === N - 1) go.style.display = "";
    };
    const tick = () => { const now = performance.now(); CARD_SEC[k] += (now - t0) / 1000; t0 = now; };
    prev.onclick = () => { tick(); k = Math.max(0, k - 1); show(); };
    next.onclick = () => { tick(); k = Math.min(N - 1, k + 1); show(); };
    window._cardTick = tick;
    show();
  },
  on_finish: d => {
    if (window._cardTick) window._cardTick();
    CARD_SEC.forEach((s, i) => { d[`d_card${i + 1}_sec`] = +s.toFixed(1); });
    d.d_cards_skim = CARD_SEC.reduce((a, b) => a + b, 0) / CARD_SEC.length < 2 ? 1 : 0; // 장당 평균 2초 미만 = 훑어보기
  },
};

/* ---------- 2. A1 사용 시간 + B 오늘의 퀴즈(1문항) ---------- */
const TIME7 = ["사용 안 함", "15분 미만", "15~30분", "30분~1시간", "1~2시간", "2~3시간", "3시간 이상"];
let NOUSE = false;
D.quiz = D.quiz.slice(0, 1);
const QORD = D.quiz.map(q => jsPsych.randomization.shuffle(q.opts.map((_, i) => i + 1)));
const partB = {
  type: jsPsychSurveyHtmlForm,
  html: () => `${steps(1)}<h1>자가점검 1. 어제의 AI 사용과 오늘의 퀴즈</h1><div class="card">
    <div class="lk"><div class="lq">1. <b>지난 24시간 동안</b> 생성형 AI(ChatGPT, Gemini 등)를 사용한 시간은 모두 합쳐 얼마인가요?</div>${radios("d_a1", TIME7)}</div>
    ${D.quiz.map((q, i) => `<div class="lk"><div class="lq">2. [오늘의 퀴즈] ${q.q}</div>
      <div class="opts">${QORD[i].map(v => `<label><input type="radio" name="d_b${i + 1}" value="${v}" required> ${q.opts[v - 1]}</label>`).join("")}</div></div>`).join("")}</div>`,
  button_label: "정답 확인",
  data: { task: "daily_b" },
  on_finish: d => {
    flatten(d); NOUSE = d.d_a1 === "1"; d.d_nouse = NOUSE ? 1 : 0; let sc = 0;
    D.quiz.forEach((q, i) => { const ok = Number(d[`d_b${i + 1}`]) === q.ans ? 1 : 0; d[`d_b${i + 1}_ok`] = ok; sc += ok; });
    d.d_b_score = sc; d.d_b_order = QORD.map(o => o.join("")).join("|"); window.scrollTo(0, 0);
  },
};
const partBfb = {
  type: jsPsychHtmlButtonResponse,
  stimulus: () => {
    const b = jsPsych.data.get().filter({ task: "daily_b" }).last(1).values()[0] || {};
    return `${steps(1)}<h1>오늘의 퀴즈 정답</h1><div class="card">${D.quiz.map((q, i) => {
      const ok = b[`d_b${i + 1}_ok`] === 1;
      return `<div class="fbrow ${ok ? "ok" : "ng"}"><div><b>${ok ? "정답이에요!" : "다시 볼까요?"}</b> ${q.q}<br>
        정답: <b>${q.opts[q.ans - 1]}</b><br><span class="sub">${q.why}</span></div></div>`; }).join("")}</div>`;
  },
  choices: ["다음"],
  data: { task: "daily_b_fb" },
};

/* ---------- 4. 그날의 실천(C) · C6 · E 한 줄 ---------- */
const PRAC = BLOCK.prac.items.slice(0, 5);
const partCDE = {
  type: jsPsychSurveyHtmlForm,
  html: () => { const skip = NOUSE && DAYC < 5; return `${steps(1)}<h1>자가점검 2. 나의 실천</h1>
    <div class="card">${skip ? `<p class="sub">어제 AI를 쓰지 않았다고 답해서 AI 사용 중의 실천 문항은 건너뛰었어요.</p>` :
      `<div class="lk"><div class="lq">3. <b>지난 24시간 동안</b> 다음을 얼마나 했나요? <span class="sub">(그런 상황이 없었다면 '해당 상황 없음')</span><br>${PRAC[DAYC - 1].text}</div>${scaleRow(`d_c${DAYC}`, SC.prac)}</div>`}
      <div class="lk">${myChange()
        ? `<div class="mychange">내가 적은 작은 변화: <b>${esc(myChange())}</b></div>`
        : `<p class="sub">이 기기에는 프로그램에서 적은 ‘나의 작은 변화’가 저장되어 있지 않아요. 기억나는 대로 다시 적어 주세요.</p><input type="text" name="d_change_text" maxlength="200" placeholder="프로그램에서 적은 나의 작은 변화" style="width:100%">`}
        ${likert("d_c6", `${skip ? 3 : 4}. 프로그램에서 적은 ‘나의 작은 변화’를 <b>지난 24시간 동안</b> 얼마나 실천했나요?`, ["전혀 하지 않았다", "거의 하지 않았다", "절반쯤 했다", "대부분 했다", "완전히 실천했다"])}</div></div>
    <div class="card"><div class="lq">${skip ? 4 : 5}. 오늘의 한 줄 <span class="sub">(선택)</span></div><p>${D.e}</p><textarea name="d_e" placeholder="빈칸으로 두어도 괜찮아요"></textarea>${D.help ? HELP : ""}</div>`; },
  button_label: "다음",
  data: { task: "daily_cde" },
  on_load: () => wireBlock(document.getElementById("jspsych-survey-html-form")),
  on_finish: d => { flatten(d); d.d_c_item = "c" + DAYC; if (d.d_change_text && String(d.d_change_text).trim().length > 1) rememberChange(String(d.d_change_text).trim()); window.scrollTo(0, 0); },
};

/* ---------- 5. Day 5: 복습 마무리 F1~F7 ---------- */
const TOPICS = [1, 2, 3, 4, 5].map(k => `Day ${k}. ${DAYS[k].topic}`);
const partF = {
  type: jsPsychSurveyHtmlForm,
  html: () => `${steps(1)}<h1>5일 복습을 마치며</h1><div class="note">5일 동안의 카드뉴스와 자가점검을 떠올리며 답해 주세요.</div><div class="card">
    ${likert("d_f1", "F1. 카드뉴스는 영상 내용을 다시 떠올리는 데 도움이 되었다.", ["전혀 아니다", "", "", "", "매우 그렇다"])}
    <div class="lk"><div class="lq">F2. 카드뉴스 한 세트(6장)의 길이는 어땠나요?</div>${radios("d_f2", ["너무 짧다", "적당하다", "너무 길다"], null, "opts row2")}</div>
    ${likert("d_f3", "F3. 매일 자가점검에 답하는 것이 부담스럽지 않았다.", ["전혀 아니다", "", "", "", "매우 그렇다"])}
    ${likert("d_f4", "F4. 5일 동안 내가 AI를 어떻게 쓰는지 더 의식하게 되었다.", ["전혀 아니다", "", "", "", "매우 그렇다"])}
    <div class="lk"><div class="lq">F5. 가장 도움이 된 날의 주제는?</div>${radios("d_f5", TOPICS)}</div>
    <div class="lk"><div class="lq">F6. 앞으로도 계속해 볼 실천은? (모두 선택)</div>
      <div class="opts">${PRAC.map((it, i) => `<label><input type="checkbox" name="d_f6_${i + 1}" value="1"> ${it.text}</label>`).join("")}
      <label><input type="checkbox" name="d_f6_6" value="1"> 기타</label></div>
      <input type="text" name="d_f6_other" placeholder="기타: 직접 적어 주세요 (선택)"></div>
    <div class="lk"><div class="lq">F7. 카드뉴스나 자가점검에서 바뀌었으면 하는 점이 있다면 적어 주세요. <span class="sub">(선택)</span></div><textarea name="d_f7"></textarea></div></div>`,
  button_label: "다음",
  data: { task: "daily_f" },
  on_load: () => wireBlock(document.getElementById("jspsych-survey-html-form")),
  on_finish: d => { flatten(d); window.scrollTo(0, 0); },
};

/* ---------- 마지막 화면 ---------- */
function END_EXTRA() {
  const next = DAYS[DAY + 1];
  return `<div class="card center"><p style="font-size:22px;font-weight:800;margin:4px 0">오늘도 완료! (${DAY}/5)</p>
    <div class="dots">${[1, 2, 3, 4, 5].map(k => `<span class="${k <= DAY ? "on" : ""}"></span>`).join("")}</div>
    ${next ? `<p class="sub">내일의 주제: <b>${next.topic}</b></p>` : `<p class="sub">5일 복습을 모두 마쳤어요. 마지막 설문 링크를 곧 보내 드릴게요.</p>`}</div>`;
}

const flow = [browserCheck, ...(HAS_PID ? [] : [pidEntryTrial(`5일 복습 · Day ${DAY}`)]), cardTrial, partB, partBfb, partCDE, ...(DAY === 5 ? [partF] : []), save, endPage];
jsPsych.run(flow);
