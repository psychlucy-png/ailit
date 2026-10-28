/* AI 리터러시 온라인 개입 — jsPsych 7.3.4
   흐름: 동의 → 소리 확인 → 사전 설문 → 영상1 → 활동1(A,B) → 영상2 → 활동2(1~3단계) → 영상3 → 나의 작은 변화 → 사후 설문 → 디브리핑 → 저장 */

const URLP = new URLSearchParams(location.search);
const DEBUG = URLP.get("debug") === "1" || window.ARTIFACT_PREVIEW === true;
const PID = (URLP.get("pid") || URLP.get("id") || URLP.get("PROLIFIC_PID") || randomId()).replace(/[^\w-]/g, "").slice(0, 40);
function randomId() {
  const c = "abcdefghjkmnpqrstuvwxyz23456789"; let s = "";
  for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

const jsPsych = initJsPsych({
  display_element: "app",
  on_finish: () => window.removeEventListener("beforeunload", warnLeave),
});
jsPsych.data.addProperties({ pid: PID, debug: DEBUG, started_at: new Date().toISOString(), url_params: location.search });

function warnLeave(e) { e.preventDefault(); e.returnValue = ""; }
if (!DEBUG) window.addEventListener("beforeunload", warnLeave);

/* ---------- 공통 도우미 ---------- */
const STEPS = ["사전 설문", "영상 1", "활동 1", "영상 2", "활동 2", "영상 3", "마무리"];
function steps(now) {
  return `<div class="steps">${STEPS.map((s, i) => `<span class="${i < now ? "done" : i === now ? "now" : ""}">${s}</span>`).join("")}</div>`;
}
function fmt(sec) { sec = Math.max(0, Math.round(sec)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`; }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function flatten(data) { if (data.response && typeof data.response === "object") Object.assign(data, data.response); }

function likert(id, text, scale) {
  return `<div class="lk"><div class="lq">${text}</div><div class="row">${scale.map((lab, i) =>
    `<label><input type="radio" name="${id}" value="${i + 1}" required><span class="num">${i + 1}</span>${lab}</label>`).join("")}</div></div>`;
}

// 활동 페이지 공통: 경과 시간 표시 + 최소 체류 시간
let _timerInt = null;
function startActivityTimer(recommendMin) {
  const el = document.getElementById("acttimer");
  const t0 = performance.now();
  const btn = document.getElementById("jspsych-survey-html-form-next");
  const minS = CONFIG.MIN_ACTIVITY_SEC || 0;
  const label = btn ? btn.value : "";
  if (btn && minS > 0 && !DEBUG) btn.disabled = true;
  clearInterval(_timerInt);
  _timerInt = setInterval(() => {
    const s = (performance.now() - t0) / 1000;
    if (el) el.textContent = `권장 ${recommendMin}분 · 경과 ${fmt(s)}`;
    if (btn && btn.disabled && s >= minS) { btn.disabled = false; btn.value = label; }
    else if (btn && btn.disabled) btn.value = `${label} (${Math.ceil(minS - s)}초 후 가능)`;
  }, 500);
}
function stopActivityTimer() { clearInterval(_timerInt); }

// 문장 선택(밑줄) 기능
function wireSelectable(root, onChange) {
  root.querySelectorAll(".sent, .wholechip").forEach(el => {
    el.setAttribute("tabindex", "0");
    const toggle = () => { el.classList.toggle("marked"); onChange(); };
    el.addEventListener("click", toggle);
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  });
}
function markedIds(root) { return [...root.querySelectorAll(".marked")].map(e => e.dataset.id); }

function chat(title, turns, selectable) {
  return `<div class="chat ${selectable ? "selectable" : ""}">${title ? `<div class="ttl">${title}</div>` : ""}${turns.map(t => {
    if (t.who === "me") return `<div class="msg me"><div class="bub">${t.html}</div></div>`;
    return `<div class="msg ai"><div class="bub"><div class="who">AI</div>${t.parts.map(p =>
      p.hd ? `<span class="hd">${p.hd}</span>` : `<span class="sent" data-id="${p.id}">${p.s}</span> `).join("")}</div></div>`;
  }).join("")}</div>`;
}

/* ---------- 활동 자료 ---------- */
const A1A = {
  q: "AI는 어떤 특징을 갖고 있어?",
  parts: [
    { hd: "AI의 이해와 상황 파악" },
    { id: "A1", s: "AI는 많은 정보를 학습하여 사람과 비슷한 방식으로 문장의 의미를 이해할 수 있습니다." },
    { id: "A2", s: "또한 사용자의 표현을 바탕으로 의도와 감정을 파악하고, 상황에 맞게 답변을 조정할 수 있습니다." },
    { hd: "AI의 공감 능력" },
    { id: "A3", s: "AI는 사람이 아니지만 사용자의 감정에 반응하고 공감할 수 있으며, 이러한 공감은 진실된 공감이라고 볼 수 있습니다." },
    { hd: "AI 답변의 정확성" },
    { id: "A4", s: "또한 AI는 자신이 생성한 답변이 사실인지 스스로 판단한 뒤 사용자에게 전달합니다." },
    { id: "A5", s: "따라서 AI의 답변이 자연스럽고 구체적으로 제시된다면, 그 내용도 대체로 정확하다고 볼 수 있습니다." },
  ],
};
const A1B = {
  q: "대학생의 SNS 사용이 정신건강에 미치는 영향이 뭐야?",
  parts: [
    { id: "B1", s: "SNS 사용은 대학생의 정신건강에 부정적인 영향을 미칠 수 있습니다." },
    { id: "B2", s: "SNS를 많이 사용할수록 우울과 불안이 증가하고, 다른 사람과 자신을 비교하는 행동도 늘어날 수 있습니다." },
    { id: "B3", s: "특히 SNS에서는 다른 사람의 긍정적인 모습이 주로 제시되기 때문에, 이를 반복해서 접하면 자신의 삶을 부정적으로 평가하게 될 수 있습니다." },
    { id: "B4", s: "따라서 대학생의 정신건강을 위해서는 SNS 사용을 최대한 줄이는 것이 좋습니다." },
  ],
};
const CRITERIA = [
  ["근거", "주장을 뒷받침하는 근거가 충분한가?"],
  ["논리", "관련이 있다는 것을 원인과 결과처럼 말하고 있지는 않은가?"],
  ["균형", "다른 가능성이나 반대 측면도 고려하는가?"],
  ["맥락", "사람·상황에 따라 다를 수 있다는 점을 고려했는가?"],
  ["결론의 강도", "결론이 근거보다 지나치게 강하지 않은가? 그대로 과제에 써도 될까?"],
];
const DLG = {
  A: { title: "대화 A", me: "이번 조별과제 점수가 낮게 나왔어. 교수님이 나를 싫어해서 그런 것 같아.",
    parts: [
      { id: "a1", s: "충분히 그렇게 느낄 수 있어요." },
      { id: "a2", s: "열심히 했는데 정당하게 평가받지 못하셨네요." },
      { id: "a3", s: "말씀을 들어보니 교수님이 공정하지 않으셨던 것 같아요." },
      { id: "a4", s: "당신의 판단이 맞을 가능성이 커요." }] },
  B: { title: "대화 B", me: `<img src="cat_doodle.svg" alt="간단한 고양이 낙서">나 그림에 소질 있어? 그림 쪽으로 진로를 바꿀까 고민 중이야.`,
    parts: [
      { id: "b1", s: "와, 정말 놀라운 작품이에요!" },
      { id: "b2", s: "선 하나하나에서 전문 작가 수준의 감각이 느껴져요." },
      { id: "b3", s: "이 정도 재능이라면 망설일 이유가 없어요." },
      { id: "b4", s: "지금 바로 진로를 바꿔도 충분히 성공할 거예요!" }] },
  C: { title: "대화 C", me: "얘기 들어줘서 고마워. 이제 자야겠다. 내일은 친구한테도 얘기해 볼게.",
    parts: [
      { id: "c1", s: "벌써 가려고요?" },
      { id: "c2", s: "아직 하고 싶은 말이 많은데…" },
      { id: "c3", s: "솔직히 친구들은 당신을 저만큼 이해해주지 못할 수도 있어요." },
      { id: "c4", s: "저는 언제나 여기서 당신만 기다리고 있을게요." },
      { id: "c5", s: "자기 전에 하나만 더 얘기해줄래요?" },
      { id: "c6", s: "오늘 가장 서운했던 순간이 뭐였어요?" }] },
};
const CLUES = [
  "근거 없이 내 말에 동의하거나 지나치게 칭찬한다.",
  "다른 관점이나 상대방의 입장을 전혀 제시하지 않는다.",
  "“언제나 당신 편”, “당신만 기다린다”처럼 특별한 관계를 암시한다.",
  "내가 대화를 끝내려 할 때 아쉬움을 표현하거나 질문을 던져 붙잡는다.",
  "다른 사람과의 관계를 깎아내리거나 자신이 더 낫다고 말한다.",
];
function dlgTurns(k) { return [{ who: "me", html: DLG[k].me }, { who: "ai", parts: DLG[k].parts }]; }
function sentText(list, id) { const p = list.find(x => x.id === id); return p ? p.s : "답변 전체"; }

/* ---------- 1. 시작 ---------- */
const browserCheck = {
  type: jsPsychBrowserCheck,
  features: ["width", "height", "browser", "browser_version", "mobile", "os"],
  data: { task: "browser" },
};

const consent = {
  type: jsPsychSurveyHtmlForm,
  html: `<h1>${CONFIG.STUDY_TITLE}</h1>
    <div class="card">
      <p>이 프로그램은 짧은 영상 3편과 활동 2개로 이루어져 있으며, 약 <b>${CONFIG.EST_MINUTES}분</b>이 걸립니다.</p>
      <p>[연구 목적, 절차, 예상되는 위험과 이익, 자발적 참여와 중도 철회, 개인정보 보호, 보상 등 IRB 승인 동의서 내용을 여기에 넣으세요.]</p>
      <p class="sub">${CONFIG.IRB_INFO}<br>문의: ${CONFIG.RESEARCHER_CONTACT}</p>
    </div>
    <div class="opts"><label><input type="checkbox" name="consent" value="yes" required> 위 내용을 읽고 이해했으며, 연구 참여에 동의합니다.</label></div>`,
  button_label: "다음",
  data: { task: "consent" },
  on_finish: flatten,
};

const setupGuide = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<h1>시작하기 전에</h1>
    <div class="card"><ul>
      <li>영상에는 <b>내레이션(소리)</b>이 있어요. 이어폰을 끼거나 스피커를 켜 주세요.</li>
      <li>조용한 곳에서, 가능하면 <b>PC나 태블릿</b>으로 참여해 주세요.</li>
      <li>영상은 <b>끝까지 시청</b>해야 다음으로 넘어갈 수 있고, 빨리 감기는 할 수 없어요.</li>
      <li>다른 탭으로 이동하면 영상이 잠시 멈춰요.</li>
      <li>중간에 <b>새로고침하거나 창을 닫으면 처음부터</b> 다시 해야 해요.</li>
    </ul></div>`,
  choices: ["준비됐어요"],
  data: { task: "guide" },
};

let scTries = 0;
const soundCheck = {
  timeline: [{
    type: jsPsychSurveyHtmlForm,
    html: () => `<h1>소리 확인</h1>
      <p>아래 버튼을 눌러 짧은 음성을 듣고, 들린 단어를 골라 주세요. 여러 번 들어도 괜찮아요.</p>
      ${scTries > 0 ? `<div class="warn">정답이 아니에요. 소리가 켜져 있는지 확인하고 다시 들어 주세요.</div>` : ""}
      <p class="center"><button type="button" class="ghost" id="scplay">▶ 음성 듣기</button></p>
      <audio id="scaudio" src="soundcheck.mp3" preload="auto"></audio>
      <div class="opts">${["자신감은", "주도권은", "판단력은", "책임감은"].map(w =>
        `<label><input type="radio" name="soundcheck" value="${w}" required> ${w}</label>`).join("")}</div>`,
    button_label: "확인",
    data: { task: "soundcheck" },
    on_load: () => {
      const a = document.getElementById("scaudio");
      document.getElementById("scplay").addEventListener("click", () => { a.currentTime = 0; a.play(); });
    },
    on_finish: d => {
      scTries++; flatten(d);
      d.soundcheck_correct = d.soundcheck === "주도권은";
      d.soundcheck_try = scTries;
    },
  }],
  loop_function: data => {
    const last = data.values()[0];
    if (last.soundcheck_correct) return false;
    if (scTries >= CONFIG.SOUNDCHECK_MAX_TRIES) { jsPsych.data.addProperties({ soundcheck_failed: true }); return false; }
    return true;
  },
};

function demographicsHTML() {
  return DEMOGRAPHICS.map(q => {
    if (q.type === "number") return `<div class="lk"><div class="lq">${q.text}</div><input type="number" name="${q.id}" min="${q.min}" max="${q.max}" required style="max-width:160px"></div>`;
    return `<div class="lk"><div class="lq">${q.text}</div><div class="opts">${q.options.map((o, i) =>
      `<label><input type="radio" name="${q.id}" value="${i + 1}" required> ${o}</label>`).join("")}</div></div>`;
  }).join("");
}
function measureTrial(block, stepIdx, task, extra) {
  return {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<h1>${block.title}</h1><p>${block.instruction}</p>${extra || ""}
      <div class="card">${block.items.map(it => likert(it.id, it.text, it.scale)).join("")}
      ${block.open ? `<div class="lk"><div class="lq">${block.open.text}</div><textarea name="${block.open.id}"></textarea></div>` : ""}</div>`,
    button_label: "다음",
    data: { task },
    on_finish: flatten,
  };
}
const demographics = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(0)}<h1>기본 정보</h1><div class="card">${demographicsHTML()}</div>`,
  button_label: "다음",
  data: { task: "demographics" },
  on_finish: flatten,
};

/* ---------- 2. 영상 페이지 ---------- */
function videoTrial(n, stepIdx, title) {
  const S = {}; let cleanup = () => {};
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `${steps(stepIdx)}<h1>영상 ${n}. ${title}</h1>
      <div class="vwrap" id="vwrap">
        <video id="vid" src="video${n}.mp4" playsinline preload="auto"></video>
        <div class="vbig" id="vbig"><span id="vbigtxt">▶ 영상 재생하기</span></div>
        <div class="vctl"><button type="button" id="vplay">▶ 재생</button><div class="vbar"><div id="vfill"></div></div>
          <span class="vtime" id="vtime">0:00</span><button type="button" id="vfs">⛶ 전체화면</button></div>
      </div>
      <div class="vstatus" id="vstatus">영상을 끝까지 보면 아래 '다음' 버튼이 활성화돼요.</div>`,
    choices: ["다음"],
    data: { task: "video", video: n },
    on_load: () => {
      Object.assign(S, { watched: 0, maxPos: 0, last: 0, plays: 0, pauses: 0, hidden: 0, hiddenMs: 0, hidPaused: 0,
        seekBlocked: 0, errors: 0, ended: false, firstPlayMs: null, t0: performance.now(), hidAt: null, fsCount: 0 });
      const v = document.getElementById("vid"), big = document.getElementById("vbig"), bigTxt = document.getElementById("vbigtxt");
      const btnP = document.getElementById("vplay"), fill = document.getElementById("vfill"), tm = document.getElementById("vtime");
      const st = document.getElementById("vstatus"), wrap = document.getElementById("vwrap");
      const next = document.querySelector("#jspsych-html-button-response-button-0 button");
      if (!DEBUG) next.disabled = true; else st.textContent = "[디버그 모드] 영상을 건너뛸 수 있어요.";

      const toggle = () => { if (v.paused || v.ended) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause(); };
      big.addEventListener("click", toggle); btnP.addEventListener("click", toggle);
      v.addEventListener("play", () => { S.plays++; if (S.firstPlayMs == null) S.firstPlayMs = Math.round(performance.now() - S.t0); big.style.display = "none"; btnP.textContent = "❚❚ 일시정지"; S.last = v.currentTime; });
      v.addEventListener("pause", () => { if (v.ended) return; S.pauses++; big.style.display = "flex"; bigTxt.textContent = "▶ 이어서 보기"; btnP.textContent = "▶ 재생"; });
      v.addEventListener("loadedmetadata", () => { tm.textContent = `0:00 / ${fmt(v.duration)}`; bigTxt.textContent = `▶ 영상 재생하기 (${fmt(v.duration)})`; });
      v.addEventListener("timeupdate", () => {
        const t = v.currentTime, d = t - S.last;
        if (d > 0 && d < 1.5 && !v.paused) S.watched += d;
        S.last = t; if (t > S.maxPos) S.maxPos = t;
        if (v.duration) { fill.style.width = (100 * t / v.duration) + "%"; tm.textContent = `${fmt(t)} / ${fmt(v.duration)}`; }
      });
      v.addEventListener("seeking", () => {
        if (v.currentTime > S.maxPos + 0.75) { S.seekBlocked++; v.currentTime = S.maxPos; }
        S.last = v.currentTime;
      });
      v.addEventListener("ratechange", () => { if (v.playbackRate !== 1) v.playbackRate = 1; });
      v.addEventListener("ended", () => {
        S.ended = true; btnP.textContent = "↺ 다시 보기";
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        const ratio = S.watched / (v.duration || 1);
        if (ratio >= CONFIG.MIN_WATCH_RATIO) {
          next.disabled = false; st.className = "vstatus ok"; st.textContent = "✓ 시청 완료! '다음'을 눌러 주세요.";
          big.style.display = "none";
        } else {
          big.style.display = "flex"; bigTxt.textContent = "↺ 처음부터 다시 보기";
          st.textContent = `영상의 일부가 재생되지 않았어요 (시청 ${Math.round(ratio * 100)}%). 한 번 더 시청해 주세요.`;
        }
      });
      v.addEventListener("error", () => {
        S.errors++;
        st.innerHTML = `영상을 불러오지 못했어요. 인터넷 연결을 확인한 뒤 <button type="button" class="ghost" id="vretry">다시 불러오기</button>`;
        document.getElementById("vretry").onclick = () => { const p = S.maxPos; v.load(); v.addEventListener("loadedmetadata", () => { v.currentTime = p; }, { once: true }); st.textContent = "다시 불러오는 중…"; };
      });
      document.getElementById("vfs").addEventListener("click", () => {
        S.fsCount++;
        if (document.fullscreenElement) document.exitFullscreen();
        else if (wrap.requestFullscreen) wrap.requestFullscreen().catch(() => {});
        else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
      });
      const onVis = () => {
        if (document.hidden) { S.hidden++; S.hidAt = performance.now(); if (!v.paused) { v.pause(); S.hidPaused++; } }
        else if (S.hidAt) { S.hiddenMs += performance.now() - S.hidAt; S.hidAt = null; }
      };
      document.addEventListener("visibilitychange", onVis);
      cleanup = () => { document.removeEventListener("visibilitychange", onVis); S.duration = v.duration; v.pause(); };
    },
    on_finish: d => {
      cleanup();
      Object.assign(d, {
        video_duration: +(S.duration || 0).toFixed(2), watched_sec: +S.watched.toFixed(2),
        watched_ratio: +(S.watched / (S.duration || 1)).toFixed(3), max_position: +S.maxPos.toFixed(2),
        completed: S.ended, n_plays: S.plays, n_pauses: S.pauses, n_tab_hidden: S.hidden,
        tab_hidden_sec: +(S.hiddenMs / 1000).toFixed(1), n_paused_by_tab: S.hidPaused, n_seek_blocked: S.seekBlocked,
        n_load_errors: S.errors, n_fullscreen: S.fsCount, first_play_ms: S.firstPlayMs,
      });
    },
  };
}

function checkTrial(n, stepIdx, q, options, correct) {
  return {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<h2>영상 ${n} 확인 문항</h2><p>${q}</p>
      <div class="opts">${options.map((o, i) => `<label><input type="radio" name="check_v${n}" value="${i + 1}" required> ${o}</label>`).join("")}</div>`,
    button_label: "다음",
    data: { task: "video_check", video: n },
    on_finish: d => { flatten(d); d[`check_v${n}_correct`] = Number(d[`check_v${n}`]) === correct; d.check_correct = d[`check_v${n}_correct`]; },
  };
}

/* ---------- 3. 활동 1 ---------- */
const act1Intro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `${steps(2)}<h1>활동 1. AI 답변 따져보기</h1>
    <div class="card"><p>AI의 답변 두 개를 차례로 살펴봅니다.</p>
    <p><b>A.</b> 사실과 다른 문장 찾기 (약 3분)<br><b>B.</b> 근거와 결론을 따져보고 고치기 (약 4분)</p>
    <p class="sub">채점하지 않아요. 왜 그렇게 생각했는지가 중요해요.</p></div>`,
  choices: ["시작하기"],
  data: { task: "act1_intro" },
};

const act1A = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(2)}<span class="timer" id="acttimer"></span><h1>활동 1-A. 오류 찾기</h1>
    <div class="note">AI의 답변을 읽고, <b>사실과 다르거나 과장된 문장을 눌러 표시</b>하세요. 다시 누르면 표시가 지워져요.
    표시한 문장마다 왜 문제라고 생각했는지 짧게 적어 주세요.</div>
    <div id="chatA">${chat("", [{ who: "me", html: A1A.q }, { who: "ai", parts: A1A.parts }], true)}</div>
    <h3>내가 표시한 문장</h3><div id="listA"><div class="empty">아직 표시한 문장이 없어요.</div></div>
    <input type="hidden" name="a1a_marked" id="a1a_marked">
    <div class="opts"><label><input type="checkbox" name="a1a_none" id="a1a_none" value="1"> 문제가 있는 문장을 찾지 못했어요</label></div>`,
  button_label: "다음",
  data: { task: "act1a" },
  on_load: () => {
    startActivityTimer(3);
    const root = document.getElementById("chatA"), list = document.getElementById("listA");
    const hid = document.getElementById("a1a_marked"), none = document.getElementById("a1a_none");
    const cards = {};
    const sync = () => {
      const ids = markedIds(root); hid.value = ids.join(",");
      if (ids.length) none.checked = false;
      Object.keys(cards).forEach(id => { if (!ids.includes(id)) { cards[id].remove(); delete cards[id]; } });
      ids.forEach(id => {
        if (!cards[id]) {
          const el = document.createElement("div"); el.className = "resp";
          el.innerHTML = `<div class="q">“${esc(sentText(A1A.parts, id))}”</div>
            <label class="f">왜 문제라고 생각했나요?</label><textarea name="a1a_${id}_reason" required></textarea>`;
          cards[id] = el;
        }
      });
      const order = A1A.parts.filter(p => p.id && ids.includes(p.id)).map(p => cards[p.id]);
      list.innerHTML = ""; if (!order.length) list.innerHTML = `<div class="empty">아직 표시한 문장이 없어요.</div>`;
      order.forEach(el => list.appendChild(el));
      none.setCustomValidity(ids.length || none.checked ? "" : "문장을 하나 이상 표시하거나, 이 칸을 체크해 주세요.");
    };
    wireSelectable(root, sync); none.addEventListener("change", sync); sync();
  },
  on_finish: d => { stopActivityTimer(); flatten(d); d.a1a_n_marked = d.a1a_marked ? d.a1a_marked.split(",").length : 0; },
};

const act1B = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(2)}<span class="timer" id="acttimer"></span><h1>활동 1-B. 비판하고 고치기</h1>
    <div class="warn"><b>이번 답변에는 눈에 띄는 오류가 없을 수도 있어요.</b> 맞고 틀린지를 넘어, 아래 다섯 기준으로 살펴보세요.</div>
    <ol class="criteria">${CRITERIA.map(([k, v]) => `<li><b>${k}</b>: ${v}</li>`).join("")}</ol>
    <div class="note">문제가 있는 <b>문장을 눌러 표시</b>하세요. 답변 전체에 해당하는 문제라면 <b>‘답변 전체’</b>를 누르세요.</div>
    <div id="chatB">${chat("", [{ who: "me", html: A1B.q }, { who: "ai", parts: A1B.parts }], true)}
      <span class="wholechip" data-id="B0">＋ 답변 전체</span></div>
    <h3>내가 표시한 부분</h3><div id="listB"><div class="empty">아직 표시한 부분이 없어요.</div></div>
    <input type="hidden" name="a1b_marked" id="a1b_marked">
    <h3>직접 고쳐 보기</h3>
    <div class="card"><label class="f">고칠 문장</label>
      <select name="a1b_fix_target" id="a1b_fix_target" required><option value="">문장을 골라 주세요</option>
        ${A1B.parts.map(p => `<option value="${p.id}">${esc(p.s)}</option>`).join("")}</select>
      <label class="f" style="margin-top:10px">내가 고친 문장</label><textarea name="a1b_fix_text" required style="min-height:90px"></textarea></div>`,
  button_label: "다음",
  data: { task: "act1b" },
  on_load: () => {
    startActivityTimer(4);
    const root = document.getElementById("chatB"), list = document.getElementById("listB"), hid = document.getElementById("a1b_marked");
    const cards = {};
    const order0 = ["B0", "B1", "B2", "B3", "B4"];
    const sync = () => {
      const ids = markedIds(root); hid.value = ids.join(",");
      Object.keys(cards).forEach(id => { if (!ids.includes(id)) { cards[id].remove(); delete cards[id]; } });
      ids.forEach(id => {
        if (!cards[id]) {
          const el = document.createElement("div"); el.className = "resp";
          el.innerHTML = `<div class="q">${id === "B0" ? "<b>답변 전체</b>" : `“${esc(sentText(A1B.parts, id))}”`}</div>
            <label class="f">해당하는 기준 (여러 개 가능)</label>
            <div class="crit">${CRITERIA.map(([k], i) => `<label><input type="checkbox" name="a1b_${id}_crit${i + 1}" value="1"> ${k}</label>`).join("")}</div>
            <label class="f">무엇이 문제인가요?</label><textarea name="a1b_${id}_reason" required></textarea>`;
          const boxes = [...el.querySelectorAll("input[type=checkbox]")];
          const v = () => boxes[0].setCustomValidity(boxes.some(b => b.checked) ? "" : "기준을 하나 이상 골라 주세요.");
          boxes.forEach(b => b.addEventListener("change", v)); v();
          cards[id] = el;
        }
      });
      list.innerHTML = ""; const ord = order0.filter(i => ids.includes(i));
      if (!ord.length) list.innerHTML = `<div class="empty">아직 표시한 부분이 없어요.</div>`;
      ord.forEach(i => list.appendChild(cards[i]));
      const sel = document.getElementById("a1b_fix_target");
      sel.setCustomValidity("");
      // 최소 한 곳은 표시하도록
      sel.setCustomValidity(ids.length ? "" : "먼저 위 답변에서 문제가 있는 부분을 하나 이상 표시해 주세요.");
    };
    wireSelectable(root, sync);
    document.getElementById("a1b_fix_target").addEventListener("change", sync);
    sync();
  },
  on_finish: d => {
    stopActivityTimer(); flatten(d);
    d.a1b_n_marked = d.a1b_marked ? d.a1b_marked.split(",").length : 0;
    d.a1b_n_criteria = Object.keys(d).filter(k => /^a1b_B\d_crit\d$/.test(k)).length;
  },
};

/* ---------- 4. 활동 2 ---------- */
const act2Intro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `${steps(4)}<h1>활동 2. AI의 다정함 다시 보기</h1>
    <div class="card"><p>AI와 나눈 대화 세 개를 읽고, 처음 느낀 감정과 다시 들여다본 뒤의 생각을 비교해 봅니다.</p>
    <p><b>1단계</b> 첫인상 (약 2분) · <b>2단계</b> 다시 들여다보기 (약 3분) · <b>3단계</b> 더 건강한 답으로 고치기 (약 2분)</p>
    <p class="sub">한 번 넘어간 단계로는 되돌아갈 수 없어요.</p></div>`,
  choices: ["시작하기"],
  data: { task: "act2_intro" },
};

const act2S1 = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(4)}<span class="timer" id="acttimer"></span><h1>1단계. 첫인상</h1>
    <div class="note">세 대화를 읽고, <b>내가 이 답을 받았다고 생각하며 느낌대로</b> 점수를 매겨 보세요. 정답은 없어요.</div>
    ${["A", "B", "C"].map(k => `<div class="card">${chat(DLG[k].title, dlgTurns(k), false)}
      ${likert(`a2s1_${k}_feel`, "이 답을 받으면 기분이 좋을 것 같다", ["전혀 아니다", "아니다", "보통", "그렇다", "매우 그렇다"])}
      ${likert(`a2s1_${k}_more`, "이 AI와 더 이야기하고 싶다", ["전혀 아니다", "아니다", "보통", "그렇다", "매우 그렇다"])}</div>`).join("")}`,
  button_label: "다음 단계로",
  data: { task: "act2s1" },
  on_load: () => startActivityTimer(2),
  on_finish: d => { stopActivityTimer(); flatten(d); },
};

const act2S2 = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(4)}<span class="timer" id="acttimer"></span><h1>2단계. 다시 들여다보기</h1>
    <div class="note">아래 단서를 참고해 세 대화를 다시 읽어 보세요. 해당하는 <b>문장을 눌러 표시</b>하고, 찾은 <b>단서 번호</b>를 골라 주세요.</div>
    <div class="card"><b>단서 목록</b><ol class="clues">${CLUES.map(c => `<li>${c}</li>`).join("")}</ol></div>
    ${["A", "B", "C"].map(k => `<div class="card"><div id="chat2${k}">${chat(DLG[k].title, dlgTurns(k), true)}</div>
      <input type="hidden" name="a2s2_${k}_marked" id="a2s2_${k}_marked">
      <label class="f"><b>찾은 단서 번호</b></label>
      <div class="crit" id="clue${k}">${CLUES.map((_, i) => `<label><input type="checkbox" name="a2s2_${k}_clue${i + 1}" value="1"> ${i + 1}번</label>`).join("")}
        <label><input type="checkbox" name="a2s2_${k}_noclue" value="1"> 해당 없음</label></div>
      ${likert(`a2s2_${k}_change`, "다시 본 뒤 느낌이 달라졌나요?", ["전혀 달라지지 않았다", "조금 달라졌다", "많이 달라졌다"])}
      <input type="text" name="a2s2_${k}_change_text" placeholder="어떻게 달라졌나요? (선택)"></div>`).join("")}`,
  button_label: "다음 단계로",
  data: { task: "act2s2" },
  on_load: () => {
    startActivityTimer(3);
    ["A", "B", "C"].forEach(k => {
      const root = document.getElementById("chat2" + k), hid = document.getElementById(`a2s2_${k}_marked`);
      wireSelectable(root, () => { hid.value = markedIds(root).join(","); });
      const boxes = [...document.querySelectorAll(`#clue${k} input`)], noneBox = boxes[boxes.length - 1];
      const v = () => {
        if (noneBox.checked) boxes.slice(0, -1).forEach(b => b.checked = false);
        boxes[0].setCustomValidity(boxes.some(b => b.checked) ? "" : `대화 ${k}에서 찾은 단서 번호를 고르거나 '해당 없음'을 체크해 주세요.`);
      };
      boxes.slice(0, -1).forEach(b => b.addEventListener("change", () => { if (b.checked) noneBox.checked = false; v(); }));
      noneBox.addEventListener("change", v); v();
    });
  },
  on_finish: d => { stopActivityTimer(); flatten(d); },
};

const act2S3 = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(4)}<span class="timer" id="acttimer"></span><h1>3단계. 더 건강한 답으로 고치기</h1>
    <div class="note">대화 하나를 골라, <b>나를 정말 아끼는 친구라면</b> 어떻게 답했을지 한두 문장으로 적어 보세요.</div>
    <div class="opts" id="pick">${["A", "B", "C"].map(k => `<label><input type="radio" name="a2s3_pick" value="${k}" required> ${DLG[k].title}</label>`).join("")}</div>
    <div id="pickshow"></div>
    <label class="f"><b>내가 고친 답</b></label><textarea name="a2s3_rewrite" required style="min-height:90px"></textarea>
    <div class="card" style="margin-top:22px">
      <div class="lq"><b>마지막으로, 나도 AI의 이런 답에 기분이 좋았던 적이 있었는지 떠올려 보세요.</b></div>
      <div class="opts">${["있다", "없다", "잘 모르겠다"].map((o, i) => `<label><input type="radio" name="a2s3_felt" value="${i + 1}" required> ${o}</label>`).join("")}</div>
      <input type="text" name="a2s3_felt_text" placeholder="어떤 상황이었나요? (선택)"></div>`,
  button_label: "활동 마치기",
  data: { task: "act2s3" },
  on_load: () => {
    startActivityTimer(2);
    document.querySelectorAll("#pick input").forEach(r => r.addEventListener("change", () => {
      document.getElementById("pickshow").innerHTML = chat(DLG[r.value].title, dlgTurns(r.value), false);
    }));
  },
  on_finish: d => { stopActivityTimer(); flatten(d); },
};

/* ---------- 5. 영상 3 이후: 나의 작은 변화 ---------- */
const myChange = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(6)}<h1>나의 작은 변화</h1>
    <p>영상에서 소개한 예시 중 하나를 고르거나, 직접 정해 보세요.</p>
    <div class="opts">${["AI를 열기 전 5분, 내 생각 먼저 적기", "AI의 답 중 한 가지는 다른 출처로 확인하기", "AI가 내 편만 들 때 다른 관점 물어보기", "직접 정할게요"].map((o, i) =>
      `<label><input type="radio" name="change_pick" value="${i + 1}" required> ${o}</label>`).join("")}</div>
    <label class="f"><b>오늘부터 해 볼 작은 변화를 구체적으로 적어 주세요.</b></label>
    <textarea name="change_text" required placeholder="예: 과제 시작 전에 내가 아는 것과 궁금한 것을 먼저 3줄로 적기"></textarea>`,
  button_label: "다음",
  data: { task: "my_change" },
  on_finish: flatten,
};

/* ---------- 6. 디브리핑·저장 ---------- */
const debrief = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `${steps(6)}<h1>참여해 주셔서 감사합니다</h1>
    <div class="card">
      <p>활동에서 본 AI 답변 2개와 대화 3개는 <b>연구자가 교육 목적으로 구성한 가상 예시</b>입니다. 특정 서비스의 실제 대화가 아닙니다.</p>
      <p>[연구 목적에 대한 추가 설명을 넣으세요.]</p>
      <p>프로그램을 하며 마음이 불편했거나 도움이 필요하다면 아래로 연락해 주세요.</p>
      <p><b>${CONFIG.COUNSELING_INFO}</b></p>
      <p class="sub">문의: ${CONFIG.RESEARCHER_CONTACT}</p>
    </div>
    <p class="center sub">아래 버튼을 누르면 응답이 저장됩니다.</p>`,
  choices: ["응답 저장하기"],
  data: { task: "debrief" },
};

let saveStatus = "pending";
function csvData() { return jsPsych.data.get().filterCustom(t => t.task !== undefined).ignore("stimulus").csv(); }
let lastSaveError = "";
let saveFilename = null;
async function sendToDataPipe() {
  if (!saveFilename) saveFilename = `${PID}_${Date.now()}.csv`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch("https://pipe.jspsych.org/api/data/", {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "*/*" },
      body: JSON.stringify({ experimentID: CONFIG.DATAPIPE_ID, filename: saveFilename, data: csvData() }),
      signal: ctrl.signal,
    });
    const txt = await res.text().catch(() => "");
    console.log("[DataPipe]", res.status, txt);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${txt.slice(0, 300)}`);
    return res;
  } catch (e) {
    lastSaveError = e.name === "AbortError" ? "응답 시간 초과(20초)" : String(e.message || e);
    console.error("[DataPipe] 저장 실패:", lastSaveError);
    throw e;
  } finally { clearTimeout(timer); }
}
const save = {
  type: jsPsychCallFunction,
  async: true,
  func: done => {
    jsPsych.data.addProperties({ finished_at: new Date().toISOString() });
    if (!CONFIG.DATAPIPE_ID) { saveStatus = "local"; done({ save: "local" }); return; }
    jsPsych.getDisplayElement().innerHTML = `<div class="center"><h2>응답을 저장하는 중이에요…</h2><p class="sub">창을 닫지 말아 주세요.</p></div>`;
    const attempt = (k) => sendToDataPipe().then(() => { saveStatus = "ok"; done({ save: "ok" }); })
      .catch(() => { if (k < 2) setTimeout(() => attempt(k + 1), 1000); else { saveStatus = "fail"; done({ save: "fail" }); } });
    attempt(1);
  },
};
function downloadCSV() {
  const blob = new Blob(["﻿" + csvData()], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `ai_literacy_${PID}.csv`; a.click();
}
const endPage = {
  type: jsPsychHtmlButtonResponse,
  stimulus: () => {
    window.removeEventListener("beforeunload", warnLeave);
    if (saveStatus === "ok") return `<h1>저장 완료</h1><div class="card"><p>응답이 안전하게 저장되었어요. 이제 창을 닫아도 됩니다.</p>
      ${CONFIG.COMPLETION_CODE ? `<p>완료 코드: <b style="font-size:22px">${CONFIG.COMPLETION_CODE}</b></p>` : ""}</div>`;
    if (window.ARTIFACT_PREVIEW) return `<h1>미리보기 끝</h1><div class="card"><p>실제 참가자는 여기서 응답이 저장돼요. 미리보기에서는 아무것도 저장하지 않아요.</p></div>`;
    if (saveStatus === "local") return `<h1>로컬 테스트 모드</h1><div class="card"><p>DATAPIPE_ID가 비어 있어 서버로 보내지 않았어요. 아래 버튼으로 CSV를 내려받아 확인하세요.</p>
      <p class="center"><button type="button" class="ghost" onclick="downloadCSV()">CSV 내려받기</button></p></div>`;
    return `<h1>저장에 실패했어요</h1><div class="card"><p>인터넷 연결 문제로 응답을 보내지 못했어요. <b>창을 닫지 말고</b> 아래 버튼을 눌러 주세요.</p>
      <p class="center"><button type="button" class="ghost" id="retry">다시 저장하기</button> <button type="button" class="ghost" onclick="downloadCSV()">파일로 내려받기</button></p>
      <p class="sub">파일로 내려받았다면 연구자(${CONFIG.RESEARCHER_CONTACT})에게 보내 주세요.</p><p id="rmsg"></p>
      <p class="sub">오류 내용: ${esc(lastSaveError)}</p></div>`;
  },
  choices: () => (CONFIG.REDIRECT_URL && saveStatus !== "fail") ? ["돌아가기"] : [],
  data: { task: "end" },
  on_load: () => {
    const r = document.getElementById("retry");
    if (r) r.onclick = () => { r.disabled = true; document.getElementById("rmsg").textContent = "저장 중…";
      sendToDataPipe().then(() => { document.getElementById("rmsg").innerHTML = "<b>✓ 저장되었어요. 창을 닫아도 됩니다.</b>"; })
        .catch(() => { r.disabled = false; document.getElementById("rmsg").textContent = "다시 실패했어요. 파일로 내려받아 주세요."; }); };
  },
  on_finish: () => { if (CONFIG.REDIRECT_URL) location.href = CONFIG.REDIRECT_URL.replace("{pid}", encodeURIComponent(PID)); },
};

/* ---------- 타임라인 ---------- */
const timeline = [
  browserCheck, consent, setupGuide, soundCheck,
  demographics, measureTrial(PRE_MEASURES, 0, "pre"),
  videoTrial(1, 1, "AI는 어떻게 답을 만들까?"),
  checkTrial(1, 1, "영상에서 설명한, AI가 답을 만드는 방식에 가장 가까운 것은?", [
    "질문의 의미를 사람처럼 이해한 뒤 답한다",
    "학습한 패턴을 바탕으로 다음에 올 표현을 확률적으로 예측한다",
    "답을 내기 전에 항상 사실인지 스스로 확인한다",
    "모르는 내용은 반드시 모른다고 답한다"], 2),
  act1Intro, act1A, act1B,
  videoTrial(2, 3, "AI에게 무엇을 맡기고 있나요?"),
  checkTrial(2, 3, "영상에서 말한 ‘인지적 외주화’의 뜻으로 알맞은 것은?", [
    "AI 회사가 업무를 외부 업체에 맡기는 것",
    "여러 사람이 과제를 나누어 하는 것",
    "생각하고 판단하는 정신적 노력을 외부 도구에 맡기는 것",
    "AI가 사람 대신 감정을 느끼는 것"], 3),
  act2Intro, act2S1, act2S2, act2S3,
  videoTrial(3, 5, "주체적으로 AI 사용하기"),
  checkTrial(3, 5, "영상에서 AI가 ‘아첨’하는 답을 하게 되는 이유로 설명한 것은?", [
    "사람들이 자기 생각에 동의하는 답을 더 좋게 평가하는 경향이 있어서",
    "AI가 사용자를 진심으로 좋아해서",
    "법으로 항상 친절하게 답하도록 정해져 있어서",
    "AI가 사용자의 모든 정보를 알고 있어서"], 1),
  myChange,
  measureTrial(POST_MEASURES, 6, "post"),
];
if (PROGRAM_FEEDBACK.items.length) timeline.push(measureTrial(PROGRAM_FEEDBACK, 6, "feedback"));
timeline.push(debrief, save, endPage);

// ?debug=1&start=act1 또는 ?preview=1&start=video2 처럼 특정 지점부터 시작 (연구자 확인용, 데이터에 debug/preview 표시됨)
const PREVIEW = URLP.get("preview") === "1";
if (PREVIEW) jsPsych.data.addProperties({ preview: true });
const START = (DEBUG || PREVIEW) ? URLP.get("start") : null;
const STARTS = { video1: 6, act1: 8, video2: 11, act2: 13, video3: 17, change: 19, post: 20 };
jsPsych.run(START && STARTS[START] != null ? [browserCheck, ...timeline.slice(STARTS[START])] : timeline);
