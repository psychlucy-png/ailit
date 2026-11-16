/* 공통 도우미 — 사전 설문·프로그램·5일 복습·사후/추적 설문 페이지가 함께 씁니다. jsPsych 7.3.4 */
const URLP = new URLSearchParams(location.search);
const DEBUG = URLP.get("debug") === "1" || window.ARTIFACT_PREVIEW === true;
let PID = (URLP.get("pid") || URLP.get("id") || URLP.get("PROLIFIC_PID") || randomId()).replace(/[^\w-]/g, "").slice(0, 40);
function randomId() {
  const c = "abcdefghjkmnpqrstuvwxyz23456789"; let s = "";
  for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

// SID: 이번 접속(세션) 고유 번호. 같은 pid로 다시 들어와도 줄이 섞이지 않게, 스프레드시트에서 이 번호로 같은 줄을 찾아 덮어씁니다.
const SID = Date.now().toString(36) + "-" + randomId().slice(0, 6);
const jsPsych = initJsPsych({
  display_element: "app",
  on_trial_finish: d => autosave(d),
  on_finish: () => window.removeEventListener("beforeunload", warnLeave),
});
jsPsych.data.addProperties({ pid: PID, sid: SID, form: FORM, debug: DEBUG, started_at: new Date().toISOString(), url_params: location.search });

function warnLeave(e) { e.preventDefault(); e.returnValue = ""; }
if (!DEBUG) window.addEventListener("beforeunload", warnLeave);

/* ---------- 공통 도우미 ---------- */
let STEPS = []; // 각 페이지에서 정함
function steps(now) {
  if (!STEPS.length) return "";
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

/* ---------- 1. 시작 ---------- */
const browserCheck = {
  type: jsPsychBrowserCheck,
  features: ["width", "height", "browser", "browser_version", "mobile", "os"],
  data: { task: "browser" },
};

const yesno = (name, q) => `<div class="lk"><div class="lq">${q}</div><div class="opts row2">
  <label><input type="radio" name="${name}" value="1" required> 예</label><label><input type="radio" name="${name}" value="2" required> 아니오</label></div></div>`;
const agreeQ = (name, q) => `<div class="lk"><div class="lq">${q}</div><div class="opts row2">
  <label><input type="radio" name="${name}" value="1" required> 동의한다</label><label><input type="radio" name="${name}" value="2" required> 동의하지 않는다</label></div></div>`;

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

/* ---------- 설문 블록 렌더링 ---------- */
function scaleRow(name, sc, required = true) {
  const st = sc.start ?? 1, req = required ? "required" : "";
  return `<div class="row${sc.na ? " hasna" : ""}">${Array.from({ length: sc.n }, (_, i) => i + st).map(v =>
    `<label><input type="radio" name="${name}" value="${v}" ${req}><span class="num">${v}</span>${sc.labels[v] || ""}</label>`).join("")}${
    sc.na ? `<label class="na"><input type="radio" name="${name}" value="NA" ${req}><span class="num">–</span>${sc.na}</label>` : ""}</div>`;
}
// 프로그램에서 고른 '나의 작은 변화' (같은 기기·브라우저일 때만 기억됨)
function myChange() { try { return localStorage.getItem("ailit_change_" + PID) || localStorage.getItem("ailit_change") || ""; } catch (e) { return ""; } }
function rememberChange(txt) { try { localStorage.setItem("ailit_change_" + PID, txt); localStorage.setItem("ailit_change", txt); } catch (e) {} }
function changeBox() { const c = myChange(); return c ? `<div class="mychange">내가 고른 작은 변화: <b>${esc(c)}</b></div>` : ""; }
const proxy = name => `<input class="vproxy" id="${name}__proxy" tabindex="-1" aria-hidden="true">`;
function itemHTML(block, it, name) {
  const t = it.type || "likert";
  const sc = it.scale || block.scale;
  const show = it.showIf ? ` data-showif="${name.slice(0, name.length - it.id.length)}${it.showIf.id}" data-showval="${it.showIf.value}" hidden` : "";
  const q = it.text ? `<div class="lq">${it.text.replace("{{change}}", changeBox())}</div>` : "";
  let body = "";
  if (t === "likert") body = scaleRow(name, sc);
  else if (t === "semdiff") return `<div class="sd"><span class="l">${it.left}</span>${scaleRow(name, sc)}<span class="r">${it.right}</span></div>`;
  else if (t === "text") body = `<input type="text" name="${name}" required placeholder="${it.placeholder || ""}" style="max-width:280px">`;
  else if (t === "textarea") body = `<textarea name="${name}" ${it.optional ? "" : "required"}></textarea>`;
  else if (t === "number") body = `<input type="number" name="${name}" min="${it.min}" max="${it.max}" required style="max-width:160px"> <span class="sub">만 ${it.min}~${it.max}세</span>`;
  else if (t === "choice") body = `<div class="opts">${it.options.map((o, i) => `<label><input type="radio" name="${name}" value="${it.values ? it.values[i] : i + 1}" required> ${o}</label>`).join("")}</div>`;
  else if (t === "multi") body = `<div class="opts" data-multi="${name}">${it.options.map((o, i) => `<label><input type="checkbox" name="${name}_${i + 1}" value="1"> ${o}</label>`).join("")}</div>${proxy(name)}`;
  else if (t === "rank") body = `<p class="sub">가장 자주 하는 것부터 차례로 누르세요. 다시 누르면 취소돼요. (최대 ${it.max}개)</p>
      <div class="opts rank" data-rank="${name}" data-max="${it.max}">${it.options.map((o, i) => `<button type="button" class="rk" data-v="${i + 1}"><span class="badge"></span><span>${o}</span></button>`).join("")}</div>
      ${Array.from({ length: it.max }, (_, k) => `<input type="hidden" name="${name}${k + 1}" id="${name}${k + 1}">`).join("")}${proxy(name)}`;
  else if (t === "ladder") body = `<div class="ladder">${Array.from({ length: 10 }, (_, k) => 10 - k).map(v =>
      `<label><input type="radio" name="${name}" value="${v}" required><span>${v}${v === 10 ? " (가장 높음)" : v === 1 ? " (가장 낮음)" : ""}</span></label>`).join("")}</div>`;
  if (it.other) body += `<input type="text" name="${name}_other" class="other" data-for="${name}" data-opt="${it.other}" placeholder="기타 내용을 적어 주세요" disabled hidden>`;
  return `<div class="lk"${show}>${q}${body}</div>`;
}
function wireBlock(root) {
  const REQ = CONFIG.SURVEY_REQUIRED !== false;
  if (!REQ) root.querySelectorAll("[required]").forEach(e => e.required = false);
  // 조건부 문항
  root.querySelectorAll("[data-showif]").forEach(box => {
    const ctl = box.dataset.showif, want = box.dataset.showval;
    const nm = ctl;
    const upd = () => { const sel = root.querySelector(`input[name="${nm}"]:checked`); const on = sel && sel.value === want;
      box.hidden = !on; box.querySelectorAll("input").forEach(i => i.disabled = !on); };
    root.querySelectorAll(`input[name="${nm}"]`).forEach(r => r.addEventListener("change", upd)); upd();
  });
  // '기타' 직접 입력
  root.querySelectorAll("input.other").forEach(o => {
    const nm = o.dataset.for, opt = o.dataset.opt;
    const upd = () => {
      const r = root.querySelector(`input[name="${nm}"][value="${opt}"]`), c = root.querySelector(`input[name="${nm}_${opt}"]`);
      const rk = root.querySelector(`[data-rank="${nm}"] .rk[data-v="${opt}"]`);
      const on = (r && r.checked) || (c && c.checked) || (rk && rk.classList.contains("on"));
      o.hidden = !on; o.disabled = !on; o.required = REQ && !!on;
    };
    root.addEventListener("change", upd); root.addEventListener("click", () => setTimeout(upd, 0)); upd();
  });
  // 복수 선택: 1개 이상
  root.querySelectorAll("[data-multi]").forEach(g => {
    const px = document.getElementById(g.dataset.multi + "__proxy");
    const upd = () => px.setCustomValidity(!REQ || [...g.querySelectorAll("input")].some(c => c.checked) ? "" : "하나 이상 선택해 주세요.");
    g.addEventListener("change", upd); upd();
  });
  // 순위 선택
  root.querySelectorAll("[data-rank]").forEach(g => {
    const nm = g.dataset.rank, max = +g.dataset.max, order = [];
    const px = document.getElementById(nm + "__proxy");
    const render = () => {
      g.querySelectorAll(".rk").forEach(b => { const k = order.indexOf(b.dataset.v); b.classList.toggle("on", k >= 0); b.querySelector(".badge").textContent = k >= 0 ? k + 1 : ""; });
      for (let k = 0; k < max; k++) document.getElementById(nm + (k + 1)).value = order[k] || "";
      px.setCustomValidity(!REQ || order.length ? "" : "하나 이상 선택해 주세요.");
    };
    g.querySelectorAll(".rk").forEach(b => b.addEventListener("click", () => {
      const k = order.indexOf(b.dataset.v);
      if (k >= 0) order.splice(k, 1); else if (order.length < max) order.push(b.dataset.v);
      render();
    }));
    render();
  });
}
function blockTrial(block, prefix, stepIdx, task) {
  if (prefix == null) prefix = block.prefix || "";
  const name = it => `${prefix}${block.id}_${it.id}`;
  return {
    type: jsPsychSurveyHtmlForm,
    html: () => `${steps(stepIdx)}<h1>${block.title}</h1>${block.instruction ? `<div class="note">${block.instruction}</div>` : ""}
      <div class="card">${block.items.map(it => itemHTML(block, it, name(it))).join("")}</div>`,
    button_label: "다음",
    data: { task, block: block.id },
    on_load: () => wireBlock(document.getElementById("jspsych-survey-html-form")),
    on_finish: d => {
      flatten(d); window.scrollTo(0, 0);
      if (block.quiz) { // 정답 채점: 열이름_ok (0/1), 앞부분_quiz_score
        let sc = 0;
        block.items.forEach(it => { if (it.answer == null) return; const ok = Number(d[name(it)]) === it.answer ? 1 : 0; d[name(it) + "_ok"] = ok; sc += ok; });
        d[`${prefix}${block.id}_score`] = sc;
      }
    },
  };
}
// 참여 번호 입력 (주소에 pid가 없을 때)
const HAS_PID = !!(URLP.get("pid") || URLP.get("id") || URLP.get("PROLIFIC_PID"));
function pidEntryTrial(title) {
  return {
    type: jsPsychSurveyHtmlForm,
    html: `<h1>${title}</h1>
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
}

/* ---------- 2. 영상 페이지 ---------- */
// task (선택): { at: 초, skipTo: 초, html: 입력 화면 HTML, collect: form => 값 객체 또는 오류 문자열 }
//  → 영상이 task.at에 이르면 멈추고 영상 아래에 입력창을 띄웁니다. 입력하면 skipTo부터 이어서 재생합니다.
function videoTrial(n, stepIdx, title, task) { // video{n}.mp4
  const S = {}; let cleanup = () => {};
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `${steps(stepIdx)}<h1>영상 ${n}. ${title}</h1>
      <div class="vwrap" id="vwrap">
        <video id="vid" src="video${n}.mp4?v=1117a" playsinline preload="auto"></video>
        <div class="vbig" id="vbig"><span id="vbigtxt">▶ 영상 재생하기</span></div>
        <div class="vctl"><button type="button" id="vplay">▶ 재생</button><div class="vbar"><div id="vfill"></div></div>
          <span class="vtime" id="vtime">0:00</span><button type="button" id="vfs">⛶ 전체화면</button></div>
      </div>
      ${task ? `<form class="vtask" id="vtask" style="display:none" onsubmit="return false">${task.html}
        <div class="vtaskerr" id="vtaskerr"></div><p class="center"><button type="button" class="jspsych-btn" id="vtaskgo">입력하고 이어서 보기</button></p></form>` : ""}
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

      S.taskOn = false; S.taskDone = false; S.taskVals = {};
      const toggle = () => { if (S.taskOn) return; if (v.paused || v.ended) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause(); };
      big.addEventListener("click", toggle); btnP.addEventListener("click", toggle);
      v.addEventListener("play", () => { S.plays++; if (S.firstPlayMs == null) S.firstPlayMs = Math.round(performance.now() - S.t0); big.style.display = "none"; btnP.textContent = "❚❚ 일시정지"; S.last = v.currentTime; });
      v.addEventListener("pause", () => { if (v.ended) return; S.pauses++; if (S.taskOn) { big.style.display = "none"; btnP.textContent = "▶ 재생"; return; } big.style.display = "flex"; bigTxt.textContent = "▶ 이어서 보기"; btnP.textContent = "▶ 재생"; });
      v.addEventListener("loadedmetadata", () => { tm.textContent = `0:00 / ${fmt(v.duration)}`; bigTxt.textContent = `▶ 영상 재생하기 (${fmt(v.duration)})`; });
      v.addEventListener("timeupdate", () => {
        const t = v.currentTime, d = t - S.last;
        if (d > 0 && d < 1.5 && !v.paused) S.watched += d;
        S.last = t; if (t > S.maxPos) S.maxPos = t;
        if (v.duration) { fill.style.width = (100 * t / v.duration) + "%"; tm.textContent = `${fmt(t)} / ${fmt(v.duration)}`; }
        if (task && !S.taskDone && !S.taskOn && t >= task.at) {
          S.taskOn = true; S.taskShownAt = performance.now(); v.pause();
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
          const f = document.getElementById("vtask"); f.style.display = "block"; st.textContent = "아래에 입력하면 영상이 이어서 재생돼요.";
          setTimeout(() => f.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
        }
      });
      if (task) document.getElementById("vtaskgo").addEventListener("click", () => {
        const f = document.getElementById("vtask"), r = task.collect(f);
        if (typeof r === "string") { document.getElementById("vtaskerr").textContent = r; return; }
        S.taskVals = r; S.taskSec = +((performance.now() - S.taskShownAt) / 1000).toFixed(1); S.taskDone = true; S.taskOn = false;
        f.querySelectorAll("input,textarea,select,button").forEach(x => x.disabled = true);
        document.getElementById("vtaskgo").textContent = "✓ 입력 완료"; document.getElementById("vtaskerr").textContent = "";
        st.textContent = "영상을 끝까지 보면 아래 '다음' 버튼이 활성화돼요.";
        if (task.skipTo && v.currentTime < task.skipTo) { S.watched += task.skipTo - v.currentTime; S.maxPos = Math.max(S.maxPos, task.skipTo); v.currentTime = task.skipTo; S.last = task.skipTo; }
        wrap.scrollIntoView({ behavior: "smooth", block: "center" });
        const p = v.play(); if (p && p.catch) p.catch(() => { big.style.display = "flex"; bigTxt.textContent = "▶ 이어서 보기"; });
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
      if (task) Object.assign(d, S.taskVals, { task_keys: Object.keys(S.taskVals), task_shown: S.taskShownAt != null, task_sec: S.taskSec ?? null });
    },
  };
}

let saveStatus = "pending";
function csvData() { return jsPsych.data.get().filterCustom(t => t.task !== undefined).ignore("stimulus").csv(); }
let lastSaveError = "";
let saveFilename = null;
async function sendToDataPipe() {
  if (!saveFilename) saveFilename = `${FORM}_${PID}_${Date.now()}.csv`;
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
/* ---------- Google 스프레드시트 저장 (참가자 1명 = 1줄) ----------
   · 진행 중 자동 저장: 응답을 제출하는 화면(설문·영상·활동)이 끝날 때마다 지금까지의 응답을 같은 줄에 덮어씁니다 (status = in_progress).
   · 창을 닫거나 다른 페이지로 나가면 마지막 상태를 한 번 더 보냅니다 (status = left).
   · 끝까지 마치면 status = complete (사전 설문에서 대상이 아니면 screened_out).
   · seq(보낸 순서)가 더 큰 것만 반영되므로, 늦게 도착한 예전 저장이 최신 응답을 덮어쓰지 않습니다. */
const SAVE_STATE = { status: "in_progress", seq: 0, busy: false, again: false, done: false };
function sheetName() {
  const m = { pre: CONFIG.SHEET_PRE, pilot: CONFIG.SHEET_PILOT || "파일럿", program: CONFIG.SHEET_PROGRAM,
    t2: CONFIG.SHEET_T2 || "T2_직후", t3: CONFIG.SHEET_T3 || "T3_1주뒤", t4: CONFIG.SHEET_T4 || "T4_1달뒤" };
  return m[FORM] || (FORM.startsWith("day") ? (CONFIG.SHEET_DAILY || "5일복습") : CONFIG.SHEET_PROGRAM);
}
function sheetPayload() { return JSON.stringify({ sheet: sheetName(), row: wideRow() }); }
const AUTOSAVE_SKIP = new Set(["browser", "welcome", "pilot_intro", "setup", "act1_intro", "act2_intro", "debrief"]);
function autosave(d) {
  if (!CONFIG.SHEETS_URL || SAVE_STATE.done || window.ARTIFACT_PREVIEW) return;
  if (!d || !d.task || AUTOSAVE_SKIP.has(d.task) || d.task.endsWith("_fb") || d.trial_type === "call-function") return;
  if (SAVE_STATE.busy) { SAVE_STATE.again = true; return; }
  SAVE_STATE.busy = true;
  fetch(CONFIG.SHEETS_URL, { method: "POST", body: sheetPayload(), keepalive: false })
    .then(r => r.text()).then(t => console.log("[autosave]", t)).catch(e => console.warn("[autosave] 실패 (다음 화면에서 다시 시도)", e))
    .finally(() => { SAVE_STATE.busy = false; if (SAVE_STATE.again && !SAVE_STATE.done) { SAVE_STATE.again = false; autosave({ task: "retry" }); } });
}
// 창을 닫거나 나갈 때: 그때까지의 응답을 sendBeacon으로 한 번 더 보냄
let _lastBeacon = 0;
function beaconLeave() {
  if (!CONFIG.SHEETS_URL || SAVE_STATE.done || window.ARTIFACT_PREVIEW || jsPsych.data.get().count() < 2) return;
  if (Date.now() - _lastBeacon < 15000) return; _lastBeacon = Date.now(); // 탭을 자주 오가도 15초에 한 번만
  SAVE_STATE.status = "left";
  try { navigator.sendBeacon(CONFIG.SHEETS_URL, new Blob([sheetPayload()], { type: "text/plain;charset=utf-8" })); } catch (e) {}
  SAVE_STATE.status = "in_progress";
}
window.addEventListener("pagehide", beaconLeave);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") beaconLeave(); });
const META_KEYS = new Set(["pid", "sid", "form", "debug", "started_at", "url_params", "preview", "eligible", "soundcheck_failed", "finished_at"]);
const SKIP_KEYS = new Set(["trial_type", "trial_index", "time_elapsed", "internal_node_id", "response", "stimulus", "task", "block", "rt", "video", "save"]);
const VIDEO_KEYS = ["completed", "video_duration", "watched_sec", "watched_ratio", "max_position", "n_plays", "n_pauses",
  "n_tab_hidden", "tab_hidden_sec", "n_paused_by_tab", "n_seek_blocked", "n_load_errors", "n_fullscreen", "first_play_ms"];
function wideRow() {
  const all = jsPsych.data.get().values();
  const last = all[all.length - 1] || {};
  const row = { pid: PID, sid: SID, form: FORM, status: SAVE_STATE.status, seq: ++SAVE_STATE.seq, last_task: last.task || "", n_screens: all.length, saved_at: new Date().toISOString() };
  ["started_at", "finished_at", "eligible", "debug", "preview", "soundcheck_failed"].forEach(k => { if (last[k] !== undefined) row[k] = last[k]; });
  row.total_min = +((last.time_elapsed || 0) / 60000).toFixed(1);
  for (const t of all) {
    if (!t.task) continue;
    if (t.task === "video") {
      VIDEO_KEYS.forEach(k => { row[`v${t.video}_${k}`] = t[k]; });
      row[`v${t.video}_page_sec`] = Math.round((t.rt || 0) / 1000);
      if (t.task_shown !== undefined) { row[`v${t.video}_task_shown`] = t.task_shown; row[`v${t.video}_task_sec`] = t.task_sec; }
      (t.task_keys || []).forEach(k => { row[k] = t[k]; });
      continue;
    }
    for (const [k, v] of Object.entries(t)) {
      if (SKIP_KEYS.has(k) || META_KEYS.has(k) || v === null || v === undefined || typeof v === "object") continue;
      row[k] = v;
    }
    if (t.rt != null && t.task !== "browser") row[`sec_${t.task}${t.block ? "_" + t.block : ""}${t.video ? "_v" + t.video : ""}`] = Math.round(t.rt / 1000);
  }
  return row;
}
async function sendToSheets() {
  const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    // text/plain 으로 보내야 브라우저 사전 확인(CORS preflight) 없이 Apps Script로 전달됨
    const res = await fetch(CONFIG.SHEETS_URL, { method: "POST", body: sheetPayload(), signal: ctrl.signal });
    const txt = await res.text().catch(() => "");
    console.log("[Sheets]", res.status, txt);
    let ok = res.ok; try { ok = ok && JSON.parse(txt).ok === true; } catch (e) { ok = false; }
    if (!ok) throw new Error(`Sheets ${res.status} ${txt.slice(0, 200)}`);
  } catch (e) {
    lastSaveError = e.name === "AbortError" ? "스프레드시트 응답 시간 초과" : String(e.message || e);
    console.error("[Sheets] 저장 실패:", lastSaveError); throw e;
  } finally { clearTimeout(timer); }
}
// 스프레드시트가 주 저장소, DataPipe(설정한 경우)는 원자료 백업
async function sendAll() {
  if (CONFIG.DATAPIPE_ID && CONFIG.SHEETS_URL) sendToDataPipe().catch(() => {});
  if (CONFIG.SHEETS_URL) return sendToSheets();
  return sendToDataPipe();
}
const save = {
  type: jsPsychCallFunction,
  async: true,
  func: done => {
    jsPsych.data.addProperties({ finished_at: new Date().toISOString() });
    SAVE_STATE.status = (typeof ELIGIBLE !== "undefined" && !ELIGIBLE) ? "screened_out" : "complete";
    SAVE_STATE.done = true; // 이후 자동 저장·나가기 저장은 보내지 않음
    if (!CONFIG.DATAPIPE_ID && !CONFIG.SHEETS_URL) { saveStatus = "local"; done({ save: "local" }); return; }
    jsPsych.getDisplayElement().innerHTML = `<div class="center"><h2>응답을 저장하는 중이에요…</h2><p class="sub">창을 닫지 말아 주세요.</p></div>`;
    const attempt = (k) => sendAll().then(() => { saveStatus = "ok"; done({ save: "ok" }); })
      .catch(() => { if (k < 4) setTimeout(() => attempt(k + 1), 1500 * k); else { saveStatus = "fail"; done({ save: "fail" }); } });
    attempt(1);
  },
};
function toCSV(row) { const q = v => `"${String(v ?? "").replace(/"/g, '""')}"`; return Object.keys(row).map(q).join(",") + "\n" + Object.values(row).map(q).join(","); }
function downloadCSV() {
  const blob = new Blob(["﻿" + (CONFIG.SHEETS_URL ? toCSV(wideRow()) : csvData())], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `ai_literacy_${FORM}_${PID}.csv`; a.click();
}
const endPage = {
  type: jsPsychHtmlButtonResponse,
  stimulus: () => {
    window.removeEventListener("beforeunload", warnLeave);
    const extra = typeof END_EXTRA === "function" ? END_EXTRA() : "";
    if (saveStatus === "ok") return `<h1>저장 완료</h1><div class="card"><p>응답이 안전하게 저장되었어요.${extra ? "" : " 이제 창을 닫아도 됩니다."}</p>
      ${CONFIG.COMPLETION_CODE ? `<p>완료 코드: <b style="font-size:22px">${CONFIG.COMPLETION_CODE}</b></p>` : ""}</div>${extra}`;
    if (window.ARTIFACT_PREVIEW) return `<h1>미리보기 끝</h1><div class="card"><p>실제 참가자는 여기서 응답이 저장돼요. 미리보기에서는 아무것도 저장하지 않아요.</p></div>${extra}`;
    if (saveStatus === "local") return `<h1>로컬 테스트 모드</h1><div class="card"><p>DATAPIPE_ID가 비어 있어 서버로 보내지 않았어요. 아래 버튼으로 CSV를 내려받아 확인하세요.</p>
      <p class="center"><button type="button" class="ghost" onclick="downloadCSV()">CSV 내려받기</button></p></div>${extra}`;
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
      sendAll().then(() => { document.getElementById("rmsg").innerHTML = "<b>✓ 저장되었어요. 창을 닫아도 됩니다.</b>"; })
        .catch(() => { r.disabled = false; document.getElementById("rmsg").textContent = "다시 실패했어요. 파일로 내려받아 주세요."; }); };
  },
  on_finish: () => { if (CONFIG.REDIRECT_URL) location.href = CONFIG.REDIRECT_URL.replace("{pid}", encodeURIComponent(PID)); },
};
