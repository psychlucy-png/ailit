/* 일상 속 디지털 기술 이해 프로그램 · 5일 복습 — daily-b.html?day=1~5&pid=P001
   카드뉴스 6장(글 카드) → 오늘의 퀴즈 1문항 → 정답 확인 → 오늘의 점검 6문항(d_k1~d_k6) → 오늘의 한 줄(d_e). AI 사용 자가점검은 묻지 않음 → (Day 5) 복습 마무리 1문항 → 저장
   응답은 "5일복습_B" 탭에 저장되고 cond 열에 "B"가 기록됩니다. */

sheetName = () => "5일복습_B";
STEPS = ["카드뉴스", "자가점검", "완료"];
jsPsych.data.addProperties({ day: DAY, d_form: "b1126b", cond: "B" });

/* ---------- 날짜별 내용 (5일 복습 설계 문서 기준) ---------- */
const DAYS = {
 "1": {
  "topic": "터치스크린은 어떻게 작동할까",
  "cards": [
   [
    "터치스크린은 어떻게 작동할까",
    "유리판처럼 보이는 화면이 손가락의 자리를 알아내는 방법"
   ],
   [
    "두 가지 방식",
    "꾹 누르는 힘을 이용하는 저항막 방식과, 우리 몸에 전기가 통한다는 점을 이용하는 정전식이 있습니다. 휴대폰은 정전식을 씁니다."
   ],
   [
    "정전식의 원리",
    "유리 아래의 투명한 막에 아주 약한 전기가 고르게 퍼져 있습니다. 손가락이 다가오면 그 자리의 전기 상태가 살짝 달라지고, 화면은 달라진 곳을 찾아냅니다."
   ],
   [
    "보이지 않는 격자와 좌표",
    "화면에는 가로줄과 세로줄이 모눈종이처럼 깔려 있습니다. 작은 칩이 줄과 줄이 만나는 점을 차례로 확인해 손가락의 자리를 찾고, 그 자리를 좌표로 바꾸어 앱에 알려 줍니다."
   ],
   [
    "물과 장갑",
    "물도 전기가 통해서, 물방울이 묻으면 화면이 손가락이 닿은 것으로 받아들일 수 있습니다. 두꺼운 장갑은 전기가 잘 통하지 않아 화면이 반응하지 않습니다."
   ],
   [
    "한 줄 정리",
    "정전식 화면은 누르는 힘이 아니라 전기의 변화를 잽니다."
   ]
  ],
  "quiz": [
   {
    "q": "정전식 터치스크린이 손가락의 위치를 알아내는 방법은?",
    "opts": [
     "손가락이 다가올 때 생기는 전기의 변화를 잰다",
     "화면을 누르는 힘을 잰다",
     "손가락의 온도를 잰다",
     "카메라로 손가락을 찍는다"
    ],
    "ans": 1,
    "why": "정전식 화면은 손가락이 다가올 때 달라지는 전기 상태를 찾아 위치를 알아내요."
   }
  ]
 },
 "2": {
  "topic": "스마트폰 카메라는 어떻게 정보를 읽을까",
  "cards": [
   [
    "스마트폰 카메라는 어떻게 정보를 읽을까",
    "빛이 사진이 되고, 무늬가 정보가 되는 과정"
   ],
   [
    "빛을 받아들이기",
    "카메라 앞쪽의 렌즈가 빛을 모아 안쪽의 이미지 센서에 비춥니다. 이미지 센서는 받은 빛을 전기 신호로 바꿉니다."
   ],
   [
    "픽셀",
    "이미지 센서의 작은 칸마다 빛이 얼마나 들어왔는지를 재어 숫자로 저장합니다. 사진을 크게 확대하면 보이는 작은 네모 하나하나가 픽셀입니다."
   ],
   [
    "색",
    "이미지 센서의 칸은 빛의 세기만 잴 수 있습니다. 그래서 칸 위에 빨강, 초록, 파랑 필터를 씌워 세 가지 색을 따로 기록한 뒤 다시 합칩니다."
   ],
   [
    "QR코드",
    "QR코드는 가로와 세로 두 방향으로 정보를 담습니다. 검고 흰 작은 칸을 모듈이라고 하고, 세 모서리의 큰 네모(위치 찾기 무늬) 덕분에 어느 방향에서도 읽힙니다."
   ],
   [
    "한 줄 정리",
    "카메라는 빛을 전기 신호로 바꾸고, 그 값을 숫자로 저장합니다."
   ]
  ],
  "quiz": [
   {
    "q": "사진을 크게 확대하면 보이는 작은 네모 하나를 무엇이라고 하나요?",
    "opts": [
     "픽셀",
     "모듈",
     "렌즈",
     "필터"
    ],
    "ans": 1,
    "why": "디지털 사진은 픽셀이라는 작은 네모들로 이루어져 있어요. 모듈은 QR코드의 작은 칸을 가리키는 말이에요."
   }
  ]
 },
 "3": {
  "topic": "카메라가 정보를 읽는 과정",
  "cards": [
   [
    "카메라가 정보를 읽는 과정",
    "활동 1에서 본 두 그림 다시 보기"
   ],
   [
    "사진이 만들어지는 순서",
    "빛 → 렌즈 → 이미지 센서 → 디지털 사진. 렌즈가 모은 빛을 이미지 센서가 전기 신호로 바꿉니다."
   ],
   [
    "QR코드의 세 부분",
    "위치 찾기 무늬는 코드의 위치와 방향을 알려 줍니다. 모듈은 검고 흰 작은 칸입니다. 데이터 영역에는 담으려는 정보와 여분의 정보가 들어 있습니다."
   ],
   [
    "가려져도 읽히는 이유",
    "손상된 부분을 되살리기 위한 여분의 정보가 함께 들어 있습니다. 가장 높은 단계에서는 코드의 약 30%가 손상되어도 정보를 되살릴 수 있습니다."
   ],
   [
    "QR코드의 크기",
    "담을 정보가 많을수록 칸이 많아집니다. 가장 작은 QR코드는 가로세로 21칸이고, 가장 큰 것은 177칸입니다."
   ],
   [
    "한 줄 정리",
    "스마트폰은 찍은 사진에서 위치 찾기 무늬를 찾고, 칸의 배열을 풀어 글자와 숫자로 되돌립니다."
   ]
  ],
  "quiz": [
   {
    "q": "QR코드의 일부가 가려져도 읽힐 수 있는 이유는?",
    "opts": [
     "손상된 부분을 되살리기 위한 여분의 정보가 함께 들어 있어서",
     "카메라가 가려진 부분을 투시해서",
     "인터넷에서 나머지를 내려받아서",
     "모든 QR코드의 내용이 같아서"
    ],
    "ans": 1,
    "why": "QR코드에는 원래의 정보 말고도, 손상된 부분을 되살리기 위한 여분의 정보가 함께 들어 있어요."
   }
  ]
 },
 "4": {
  "topic": "스마트폰은 어떻게 인터넷에 연결될까",
  "cards": [
   [
    "스마트폰은 어떻게 인터넷에 연결될까",
    "선이 없는 스마트폰이 정보를 주고받는 방법"
   ],
   [
    "전파",
    "스마트폰에는 인터넷 선이 꽂혀 있지 않습니다. 전파가 공간으로 퍼져 나가며 정보를 실어 나릅니다."
   ],
   [
    "인터넷과 서버",
    "인터넷은 수많은 컴퓨터와 통신 장치가 서로 이어진 거대한 연결망입니다. 웹페이지와 사진, 영상은 그 연결망 어딘가에 있는 서버라는 컴퓨터에 저장되어 있습니다."
   ],
   [
    "와이파이와 이동통신",
    "집이나 카페에서는 공유기가, 거리에서는 기지국이 스마트폰과 전파를 주고받습니다. 기지국은 저마다 맡은 구역이 있고, 한 구역을 벗어나면 다음 기지국이 연결을 이어받습니다."
   ],
   [
    "와이파이 표시의 뜻",
    "와이파이 표시는 스마트폰이 공유기와 연결되었다는 뜻입니다. 공유기와 인터넷 사이의 연결이 끊기면 웹페이지가 열리지 않습니다."
   ],
   [
    "한 줄 정리",
    "와이파이는 공유기를, 이동통신은 기지국을 거쳐 스마트폰을 인터넷에 이어 줍니다."
   ]
  ],
  "quiz": [
   {
    "q": "화면에 와이파이 표시가 떠 있다는 것은 무엇을 뜻하나요?",
    "opts": [
     "스마트폰이 공유기와 연결되었다",
     "스마트폰이 서버와 연결되었다",
     "스마트폰이 기지국과 연결되었다",
     "스마트폰이 광케이블과 연결되었다"
    ],
    "ans": 1,
    "why": "와이파이 표시는 스마트폰이 공유기와 연결되었다는 뜻일 뿐이에요. 공유기와 인터넷 사이의 연결은 따로 있어요."
   }
  ]
 },
 "5": {
  "topic": "스마트폰에서 인터넷까지, 정보의 이동 과정",
  "cards": [
   [
    "스마트폰에서 인터넷까지",
    "활동 2에서 본 그림 다시 보기"
   ],
   [
    "요청이 가는 길",
    "카페에서 웹페이지를 열면, 요청은 스마트폰 → 공유기 → 여러 통신 장치 → 서버의 순서로 갑니다."
   ],
   [
    "패킷",
    "서버는 웹페이지를 패킷이라는 작은 조각으로 나누어 보냅니다. 조각들이 도착하면 스마트폰이 순서대로 다시 맞춥니다."
   ],
   [
    "바다 밑 광케이블",
    "나라와 나라 사이를 오가는 정보의 95% 이상이 바다 밑에 깔린 광케이블을 지납니다."
   ],
   [
    "하나의 기기에 모인 기술",
    "사진도 소리도 숫자로 나타낼 수 있고, 전자 부품이 작아졌고, 기기 하나가 여러 프로그램을 실행합니다. 그래서 서로 다른 기능이 스마트폰 하나에 모였습니다."
   ],
   [
    "한 줄 정리",
    "무선 인터넷의 뒤에는 눈에 보이지 않는 수많은 선이 있습니다."
   ]
  ],
  "quiz": [
   {
    "q": "서버가 웹페이지를 보낼 때 나누는 작은 조각을 무엇이라고 하나요?",
    "opts": [
     "패킷",
     "픽셀",
     "모듈",
     "전파"
    ],
    "ans": 1,
    "why": "서버는 웹페이지를 패킷이라는 작은 조각으로 나누어 보내고, 스마트폰이 이것을 순서대로 다시 맞춰요."
   }
  ]
 }
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
    const HOLD_MS = (typeof DEBUG !== "undefined" && DEBUG) ? 0 : 4000, held = Array(N).fill(false); let holdT = null;
    const go = document.querySelector("#jspsych-html-button-response-btngroup"); go.style.display = "none";
    const cn = document.getElementById("cn"), pos = document.getElementById("cnpos"), prev = document.getElementById("cnprev"), next = document.getElementById("cnnext");
    const show = () => {
      const [h, b] = D.cards[k];
      cn.innerHTML = false
        ? `<img src="cards-main/day${DAY}_${k + 1}.jpg?v=1123k" alt="${esc(h + ". " + b.replace("{{change}}", ""))}">${b.includes("{{change}}") && myChange() ? `<div class="mychange">내가 적은 작은 변화: <b>${esc(myChange())}</b></div>` : ""}`
        : `<div class="cn-in ${k === 0 ? "cover" : k === N - 1 ? "today" : ""}"><div class="cn-k">${k === 0 ? `Day ${DAY}` : k === N - 1 ? "한 줄 정리" : `${k} / ${N - 2}`}</div>
           <h2>${k === N - 1 ? "" : h}</h2><p>${b.replace("{{change}}", "")}</p>${b.includes("{{change}}") ? changeBox() : ""}</div>`;
      pos.textContent = `${k + 1} / ${N}`; prev.disabled = k === 0;
      seen = Math.max(seen, k);
      // 2026-11-23: 처음 보는 카드는 4초(첫 장은 2초) 머문 뒤에야 넘어가는 버튼이 나타남 (이미 본 카드로 돌아가면 바로 나타남)
      clearTimeout(holdT);
      const reveal = () => { held[k] = true; next.style.visibility = k === N - 1 ? "hidden" : "visible"; if (k === N - 1) go.style.display = ""; };
      next.style.visibility = "hidden"; go.style.display = "none";
      if (held[k] || HOLD_MS <= 0) reveal(); else { const kk = k; holdT = setTimeout(() => { if (k === kk) reveal(); }, k === 0 ? 2000 : HOLD_MS); } // 첫 장(표지)은 2초
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
D.quiz = D.quiz.slice(0, 1);
const QORD = D.quiz.map(q => jsPsych.randomization.shuffle(q.opts.map((_, i) => i + 1)));
const partB = {
  type: jsPsychSurveyHtmlForm,
  html: () => `${steps(1)}<h1>자가점검 1. 오늘의 퀴즈</h1><div class="card">
    ${D.quiz.map((q, i) => `<div class="lk"><div class="lq">1. [오늘의 퀴즈] ${q.q}</div>
      <div class="opts">${QORD[i].map(v => `<label><input type="radio" name="d_b${i + 1}" value="${v}" required> ${q.opts[v - 1]}</label>`).join("")}</div></div>`).join("")}</div>`,
  button_label: "정답 확인",
  data: { task: "daily_b" },
  on_finish: d => {
    flatten(d); let sc = 0;
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

/* ---------- 4. 오늘의 점검 (2~7번) + 오늘의 한 줄 (8번) ----------
   d_k1~d_k6: 지난 24시간 동안 프로그램에서 다룬 기술을 떠올리거나 살펴본 정도 (1 전혀 그렇지 않았다 ~ 7 매우 그랬다) · d_e 오늘의 한 줄 */
const FREQ5 = { n: 7, labels: { 1: "전혀 그렇지 않았다", 2: "그렇지 않았다", 3: "약간 그렇지 않았다", 4: "보통이었다", 5: "약간 그랬다", 6: "그랬다", 7: "매우 그랬다" } };
const SELF = [
  "스마트폰 화면을 누르면서, 화면이 손가락의 위치를 알아내는 원리를 떠올렸다.",
  "사진을 찍거나 QR코드를 비추면서, 카메라가 빛을 정보로 바꾸는 과정을 떠올렸다.",
  "인터넷을 쓰면서, 정보가 어떤 길을 거쳐 오가는지 떠올렸다.",
  "주변의 기기나 화면이 어떻게 작동하는지 눈여겨보았다.",
  "프로그램에서 본 내용을 다른 사람에게 이야기했다.",
  "프로그램에서 다룬 기술에 대해 더 찾아보거나 알아보았다.",
];
const partCDE = {
  type: jsPsychSurveyHtmlForm,
  html: () => `${steps(1)}<h1>자가점검 2. 오늘의 점검</h1>
    <div class="card"><p class="sub" style="margin:0 0 4px"><b>오늘 하루(지난 24시간) 동안</b> 다음 각 문장이 얼마나 해당했는지 골라 주세요.</p>
      ${SELF.map((t, i) => `<div class="lk"><div class="lq">${i + 2}. ${t}</div>${scaleRow(`d_k${i + 1}`, FREQ5, false)}</div>`).join("")}</div>
    <div class="card"><div class="lq">8. 오늘의 한 줄</div><p>오늘 카드뉴스에서 가장 기억에 남은 내용을 한 줄로 적어 주세요.</p><textarea name="d_e" required></textarea></div>`,
  button_label: "다음",
  data: { task: "daily_cde" },
  on_load: () => { const form = document.getElementById("jspsych-survey-html-form"); wireBlock(form);
    form.querySelectorAll('input[type="radio"], textarea[name="d_e"]').forEach(el => { el.required = true; }); },
  on_finish: d => { flatten(d); SELF.forEach((_, i) => { const k = `d_k${i + 1}`; d[k] = d[k] ? Number(d[k]) : ""; }); window.scrollTo(0, 0); },
};

/* ---------- 5. Day 5: 복습 마무리 F1~F7 ---------- */
const partF = {
  type: jsPsychSurveyHtmlForm,
  html: () => `${steps(1)}<h1>5일 복습을 마치며</h1><div class="note">5일 동안의 카드뉴스와 자가점검을 떠올리며 답해 주세요.</div><div class="card">
    ${likert("d_f1", "카드뉴스는 영상 내용을 다시 떠올리는 데 도움이 되었다.", ["전혀 아니다", "", "", "", "매우 그렇다"])}</div>`,
  button_label: "다음",
  data: { task: "daily_f" },
  on_load: () => { const form = document.getElementById("jspsych-survey-html-form"); wireBlock(form);
    form.querySelectorAll('input[name="d_f1"]').forEach(el => { el.required = true; }); },
  on_finish: d => { flatten(d); window.scrollTo(0, 0); },
};

/* ---------- 마지막 화면 ---------- */
function END_EXTRA() {
  const next = DAYS[DAY + 1];
  return `<div class="card center"><p style="font-size:22px;font-weight:800;margin:4px 0">오늘도 완료! (${DAY}/5)</p>
    <div class="dots">${[1, 2, 3, 4, 5].map(k => `<span class="${k <= DAY ? "on" : ""}"></span>`).join("")}</div>
    ${next ? `<p class="sub">내일의 주제: <b>${next.topic}</b></p>` : `<p class="sub">5일 복습을 모두 마쳤어요. 이어서 <b>마지막 설문</b>에 답해 주세요.</p>
      <p style="margin:16px 0 4px"><a class="jspsych-btn" id="tot2" href="survey-b.html?t=2&pid=${encodeURIComponent(PID)}" style="display:inline-block;text-decoration:none">마지막 설문 시작하기 →</a></p>`}</div>`;
}

const flow = [browserCheck, ...(HAS_PID ? [] : [pidEntryTrial(`5일 복습 · Day ${DAY}`)]), cardTrial, partB, partBfb, partCDE, ...(DAY === 5 ? [partF] : []), save, endPage];
jsPsych.run(flow);
