/* 일상 속 디지털 기술 이해 프로그램 (program-b.html) — 영상 1 → 영상 2 → 활동 1 → 영상 3 → 활동 2 → 영상 4 → 마무리 → 저장
   주소 예: program-b.html?pid=P001   응답은 스프레드시트의 "프로그램_B" 탭에 저장되고 cond 열에 "B"가 기록됩니다.
   program-main.js와 같은 틀(영상 뒤 확인 1문항·평정, 활동 = 읽기 자료 → 첫인상 → A 5문항 → B 5문항, 영상 4 중간 입력)을 씁니다. */

STEPS = ["영상 1", "영상 2", "활동 1", "영상 3", "활동 2", "영상 4", "마무리"];
const IS_PILOT = false; const pilotComment = () => "";
sheetName = () => "프로그램_B";
jsPsych.data.addProperties({ cond: "B" });
const PROG = "일상 속 디지털 기술 이해 프로그램";
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const OPT5 = ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"];

/* ---------- 0. 시작 ---------- */
const pidEntry = pidEntryTrial(PROG);
const TITLES = ["터치스크린은 어떻게 작동할까?", "스마트폰 카메라는 어떻게 정보를 읽을까?", "스마트폰은 어떻게 인터넷에 연결될까?", "디지털 기술은 어떻게 우리 일상에 자리 잡았을까?"];
const ACT_T = ["카메라가 정보를 읽는 과정 살펴보기", "정보의 이동 과정 살펴보기"];
const welcome = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<h1>${PROG}</h1>
    <div class="card"><p>앞으로 1주일 동안 ${PROG}에 참여합니다. 프로그램은 <b>모두 6일</b>입니다.</p>
    <table style="width:100%;border-collapse:collapse;font-size:16px;line-height:1.5;margin:6px 0 4px">
      <tr><th style="width:92px;text-align:left;vertical-align:top;white-space:nowrap;background:#EEF1FB;border:1px solid #E1E4EE;padding:9px 10px">1일차 (오늘)</th><td style="border:1px solid #E1E4EE;padding:9px 10px">영상 4편과 활동 2개<br><b>40분 이내</b></td></tr>
      <tr><th style="text-align:left;vertical-align:top;white-space:nowrap;background:#EAF6F1;border:1px solid #E1E4EE;padding:9px 10px">2~6일차</th><td style="border:1px solid #E1E4EE;padding:9px 10px">카드뉴스와 자가점검<br><b>하루 5분 이내</b><br><span class="sub" style="word-break:keep-all">매일 저녁 6시에 링크를 보내 드려요.</span></td></tr>
    </table></div>
    <div class="card"><p><b>오늘(1일차)의 순서</b></p>
    <ol><li>영상 1. ${TITLES[0]}</li><li>영상 2. ${TITLES[1]}</li><li>활동 1. ${ACT_T[0]}</li>
    <li>영상 3. ${TITLES[2]}</li><li>활동 2. ${ACT_T[1]}</li><li>영상 4. ${TITLES[3]}</li></ol>
    <p>영상과 활동 사이사이에 짧은 질문이 있습니다. 끝까지 집중해서 적극적으로 참여해 주시면 감사하겠습니다.</p></div>`,
  choices: ["다음"],
  data: { task: "welcome" },
};

/* ---------- 1. 영상 + 확인 문항·영상 평정 ---------- */
// 영상 뒤: 내용 확인 1문항(check_vN, check_vN_correct) + 평정 1문항(rate_vN_like). 생각 변화(rate_vN_chg)·실천 의향(rate_vN_int) 문항은 묻지 않음
function checkTrial(n, stepIdx, q, options, correct) {
  return {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<h2>영상 ${n} 확인 문항</h2>
      <div class="card"><div class="lq">${q}</div>
      <div class="opts">${options.map((o, i) => `<label><input type="radio" name="check_v${n}" value="${i + 1}" required> ${o}</label>`).join("")}</div></div>
      <h2>영상 ${n}에 대한 생각</h2>
      <div class="card">
        ${likert(`rate_v${n}_like`, "이 영상이 흥미로웠다.", OPT5)}
      </div>`,
    button_label: "다음",
    data: { task: "video_check", video: n },
    on_finish: d => { flatten(d); d[`check_v${n}_correct`] = Number(d[`check_v${n}`]) === correct ? 1 : 0; window.scrollTo(0, 0); },
  };
}
const VSRC = "1126d";
function vt(n, stepIdx, task) { const v = videoTrial(n, stepIdx, TITLES[n - 1], task); v.stimulus = v.stimulus.replace(new RegExp(`src="video${n}\\.mp4[^"]*"`), `src="tech${n}.mp4?v=${VSRC}"`); return v; }
const video1 = vt(1, 0);
const check1 = checkTrial(1, 0, "영상에서 설명한 정전식 터치스크린이 손가락의 위치를 아는 방법은?", [
  "화면을 누르는 힘을 잰다", "손가락이 다가올 때 생기는 전기의 변화를 잰다", "손가락의 온도를 잰다", "카메라로 손가락을 찍는다"], 2);
const video2 = vt(2, 1);
const check2 = checkTrial(2, 1, "영상에서 QR코드에 대해 말한 내용과 가장 가까운 것은?", [
  "가로 한 방향으로만 정보를 담는다", "조금이라도 가려지면 읽을 수 없다", "세 모서리의 무늬 덕분에 어느 방향에서도 읽힌다", "크기는 한 가지뿐이다"], 3);
const video3 = vt(3, 3);
const check3 = checkTrial(3, 3, "영상에서 설명한, 스마트폰이 선 없이 정보를 주고받을 수 있게 해 주는 것은?", ["전파", "소리", "바람", "열"], 1);
// 영상 4: 2분 51초쯤(한 줄 적기 안내가 끝난 뒤) 영상이 멈추고 아래에 입력창이 뜹니다. 입력하면 적는 시간(약 10초)을 건너뛰고 이어서 재생합니다.
const video4 = vt(4, 5, {
  at: 170.9, skipTo: 180.7,
  html: `<h2>가장 기억에 남은 내용</h2>
    <label class="f"><b>오늘 본 내용 가운데 가장 기억에 남은 것을 한 가지 적어 주세요.</b></label>
    <textarea name="memo_text" placeholder="여기에 적어 주세요"></textarea>`,
  collect: f => {
    const txt = f.querySelector('textarea[name="memo_text"]').value.trim();
    if (!DEBUG && txt.length < 2) return "가장 기억에 남은 내용을 적어 주세요.";
    return { memo_text: txt };
  },
});
const check4 = checkTrial(4, 5, "영상에서 사진과 음악을 하나의 기기에서 저장하고 처리할 수 있는 까닭으로 설명한 것은?", [
  "둘 다 전파로 바뀌어서", "둘 다 같은 크기여서", "둘 다 종이에 기록되어서", "둘 다 숫자로 표현되어서"], 4);

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
  return {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<h1>활동 ${k}에 대한 생각</h1><div class="card">
      ${likert(`eng_a${k}_beh`, "나는 이 활동에 집중해서 참여했다.", OPT5)}
      ${likert(`eng_a${k}_emo`, "이 활동은 흥미로웠다.", OPT5)}
      ${likert(`eng_a${k}_cog`, "나는 활동 내용을 충분히 이해하기 위해 깊이 생각하였다.", OPT5)}</div>`,
    button_label: "다음",
    data: { task: `act${k}_eng` },
    on_finish: d => { flatten(d); window.scrollTo(0, 0); },
  };
}

/* ---------- 읽기 자료 (그림과 설명) ---------- */
const FIGCSS = `<style>.fig{background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px;margin:10px 0}.fig svg{width:100%;height:auto;display:block}.fig .cap{font-weight:700;margin:2px 4px 8px}
  .rt{width:100%;border-collapse:collapse;font-size:15px;line-height:1.5;margin:8px 0 2px}.rt th{width:104px;text-align:left;vertical-align:top;white-space:nowrap;background:#EEF1FB;border:1px solid #E1E4EE;padding:8px 10px}.rt td{border:1px solid #E1E4EE;padding:8px 10px}</style>`;
const T = (x, y, s, o = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-size="17" font-weight="700" fill="#23284A" ${o}>${s}</text>`;
const AR = (x1, y, x2) => `<path d="M${x1} ${y} H${x2 - 8} M${x2 - 18} ${y - 9} L${x2 - 4} ${y} L${x2 - 18} ${y + 9}" fill="none" stroke="#8A8FA8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
// 그림 A. 카메라가 사진을 만드는 과정
const FIG_A = (() => {
  const cols = ["#EE6F6F", "#5CC9AE", "#5CC9AE", "#4C6FE8"];
  let f = "", s = "", p = "";
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {
    f += `<rect x="${300 + i * 22}" y="${58 + j * 22}" width="20" height="20" rx="3" fill="${cols[(j % 2) * 2 + (i % 2)]}"/>`;
    s += `<rect x="${440 + i * 22}" y="${58 + j * 22}" width="20" height="20" rx="3" fill="#3A4170" stroke="#8FA2F5" stroke-width="1.5"/>`;
  }
  const pic = ["#8DA6F2", "#8DA6F2", "#F7E7B0", "#8DA6F2", "#AFB0D3", "#AFB0D3", "#AFB0D3", "#AFB0D3", "#F7C9A8", "#3E5C76", "#F7C9A8", "#3E5C76", "#27405A", "#27405A", "#27405A", "#27405A"];
  pic.forEach((c, k) => { p += `<rect x="${590 + (k % 4) * 22}" y="${58 + Math.floor(k / 4) * 22}" width="21" height="21" fill="${c}"/>`; });
  return `<svg viewBox="0 0 720 200" role="img" aria-label="빛이 렌즈를 지나 색 필터와 이미지 센서에 닿고 픽셀로 이루어진 사진이 되는 순서">
    <g stroke="#F2A65A" stroke-width="4" stroke-linecap="round"><path d="M20 70 H110 M20 102 H110 M20 134 H110"/></g>${T(64, 178, "빛")}
    <ellipse cx="170" cy="102" rx="20" ry="52" fill="#CFE6FB" stroke="#4C6FE8" stroke-width="3"/>${T(170, 178, "렌즈")}
    ${AR(200, 102, 290)}${f}${T(344, 178, "색 필터")}${AR(392, 102, 436)}${s}${T(484, 178, "이미지 센서")}${AR(532, 102, 586)}${p}
    <rect x="590" y="58" width="21" height="21" fill="none" stroke="#23284A" stroke-width="3"/>${T(634, 178, "픽셀로 된 사진")}<text x="601" y="50" text-anchor="middle" font-size="14" font-weight="700" fill="#23284A">픽셀</text></svg>`;
})();
// 그림 B. QR코드에 정보가 담기는 방식 (구조 설명용 예시 무늬. 실제로 읽히지 않음)
const FIG_B = (() => {
  const n = 15, c = 16, ox = 40, oy = 16; let s = `<rect x="${ox - 8}" y="${oy - 8}" width="${n * c + 16}" height="${n * c + 16}" rx="8" fill="#fff" stroke="#E1E4EE"/>`;
  const inF = (i, j) => (i < 5 && j < 5) || (i < 5 && j > n - 6) || (i > n - 6 && j < 5);
  let seed = 11; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  s += `<rect x="${ox}" y="${oy}" width="${n * c}" height="${n * c}" fill="#DFF7EF"/>`;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { if (inF(i, j)) continue; if (rnd() < 0.5) s += `<rect x="${ox + i * c}" y="${oy + j * c}" width="${c}" height="${c}" fill="#23284A"/>`; }
  [[0, 0], [n - 5, 0], [0, n - 5]].forEach(([i, j]) => { const x = ox + i * c, y = oy + j * c;
    s += `<rect x="${x}" y="${y}" width="${5 * c}" height="${5 * c}" fill="#fff"/><rect x="${x + 3}" y="${y + 3}" width="${5 * c - 6}" height="${5 * c - 6}" fill="none" stroke="#4C6FE8" stroke-width="${c - 4}" /><rect x="${x + 2 * c - 2}" y="${y + 2 * c - 2}" width="${c + 4}" height="${c + 4}" fill="#4C6FE8"/>`; });
  const mx = ox + 9 * c, my = oy + 9 * c;
  s += `<rect x="${mx}" y="${my}" width="${c}" height="${c}" fill="#23284A" stroke="#F2A65A" stroke-width="4"/>`;
  const lab = (y, col, t, d) => `<rect x="330" y="${y - 15}" width="22" height="22" rx="4" fill="${col}"/><text x="364" y="${y + 3}" font-size="17" font-weight="700" fill="#23284A">${t}</text><text x="364" y="${y + 25}" font-size="14" fill="#5B6078">${d}</text>`;
  return `<svg viewBox="0 0 720 292" role="img" aria-label="세 부분에 색을 칠한 QR코드 구조 그림">${s}
    ${lab(50, "#4C6FE8", "위치 찾기 무늬", "세 모서리의 큰 네모")}${lab(128, "#F2A65A", "모듈", "검고 흰 작은 칸 하나")}${lab(206, "#BFE6DA", "데이터 영역", "정보와 여분의 정보가 들어 있는 곳")}
    <text x="${ox + n * c / 2}" y="284" text-anchor="middle" font-size="13" fill="#8A8FA8">구조 설명용 예시 무늬</text></svg>`;
})();
// 그림. 스마트폰에서 서버까지 이어지는 길
const FIG_NET = (() => {
  const phone = (x, y) => `<rect x="${x - 16}" y="${y - 30}" width="32" height="60" rx="7" fill="#23284A"/><rect x="${x - 12}" y="${y - 24}" width="24" height="46" rx="3" fill="#CFD8FB"/>`;
  const wave = (x, y) => `<path d="M${x} ${y} q10 -14 20 0 t20 0 t20 0" fill="none" stroke="#F2A65A" stroke-width="4" stroke-linecap="round"/>`;
  const router = (x, y) => `<path d="M${x - 18} ${y - 22} V${y - 2} M${x + 18} ${y - 22} V${y - 2}" stroke="#8A8FA8" stroke-width="4" stroke-linecap="round"/><rect x="${x - 28}" y="${y - 4}" width="56" height="20" rx="7" fill="#E9ECF6" stroke="#8A8FA8" stroke-width="2"/><circle cx="${x - 14}" cy="${y + 6}" r="3" fill="#5CC9AE"/>`;
  const tower = (x, y) => `<path d="M${x} ${y - 30} L${x - 16} ${y + 22} M${x} ${y - 30} L${x + 16} ${y + 22} M${x - 11} ${y + 6} H${x + 11} M${x - 6} ${y - 10} H${x + 6}" stroke="#5A607F" stroke-width="4" stroke-linecap="round" fill="none"/><rect x="${x - 4}" y="${y - 40}" width="8" height="16" rx="3" fill="#23284A"/>`;
  const node = (x, y) => `<rect x="${x - 20}" y="${y - 12}" width="40" height="24" rx="6" fill="#fff" stroke="#8FA2F5" stroke-width="3"/><circle cx="${x - 9}" cy="${y}" r="3.5" fill="#5CC9AE"/><path d="M${x - 1} ${y} H${x + 12}" stroke="#8FA2F5" stroke-width="3" stroke-linecap="round"/>`;
  const server = `<rect x="640" y="78" width="50" height="84" rx="8" fill="#23284A"/>${[0, 1, 2].map(i => `<rect x="648" y="${88 + i * 24}" width="34" height="16" rx="4" fill="#3A4170"/><circle cx="656" cy="${96 + i * 24}" r="3" fill="#5CC9AE"/>`).join("")}`;
  const pk = [0, 1, 2].map(i => `<rect x="${452 + i * 26}" y="150" width="18" height="18" rx="4" fill="#DDE3FA" stroke="#4C6FE8" stroke-width="2"/>`).join("");
  return `<svg viewBox="0 0 720 250" role="img" aria-label="스마트폰에서 공유기 또는 기지국, 여러 통신 장치, 바다 밑 광케이블을 거쳐 서버까지 이어지는 길">
    <text x="16" y="24" font-size="15" font-weight="700" fill="#D9822B">카페 (와이파이)</text><text x="16" y="230" font-size="15" font-weight="700" fill="#4C6FE8">거리 (이동통신)</text>
    ${phone(40, 70)}${wave(64, 70)}${router(160, 70)}${T(160, 112, "공유기")}<text x="96" y="46" text-anchor="middle" font-size="14" font-weight="700" fill="#D9822B">전파</text>
    ${phone(40, 172)}${wave(64, 172)}${tower(160, 172)}${T(160, 218, "기지국")}<text x="96" y="148" text-anchor="middle" font-size="14" font-weight="700" fill="#D9822B">전파</text>
    <path d="M190 70 C240 70 250 120 290 120 M178 172 C240 172 250 120 290 120 H360" fill="none" stroke="#8FA2F5" stroke-width="4"/>
    ${node(310, 120)}${T(310, 96, "통신 장치")}
    <path d="M360 120 C380 120 384 138 400 138 H520 C536 138 540 120 560 120 H640" fill="none" stroke="#8FA2F5" stroke-width="4"/>
    <rect x="392" y="126" width="136" height="60" rx="10" fill="#CFE6FB" opacity=".7"/><path d="M400 138 H520" stroke="#2E7FD0" stroke-width="5"/>${T(460, 206, "바다 밑 광케이블")}
    ${pk}<text x="488" y="184" text-anchor="middle" font-size="13" font-weight="700" fill="#4C6FE8">패킷 ← </text>
    ${node(590, 120)}${server}${T(665, 184, "서버")}</svg>`;
})();
const READ1 = `${FIGCSS}<div class="fig"><div class="cap">그림 A. 카메라가 사진을 만드는 과정</div>${FIG_A}<table class="rt"><tr><th>렌즈</th><td>카메라 앞쪽에 있는 투명한 부품입니다. 바깥에서 들어오는 빛을 모아 카메라 안쪽의 이미지 센서에 비춥니다.</td></tr><tr><th>이미지 센서</th><td>렌즈 뒤, 필름 카메라의 필름 자리에 있는 부품입니다. 렌즈를 지나 들어온 빛을 전기 신호로 바꿉니다.</td></tr><tr><th>색 필터</th><td>이미지 센서의 칸 위에 씌운 빨강, 초록, 파랑 필터입니다. 빛의 세기만 잴 수 있는 이미지 센서가 세 가지 색을 따로 기록할 수 있게 합니다.</td></tr><tr><th>픽셀</th><td>디지털 사진을 크게 확대하면 보이는 작은 네모 하나하나입니다. 픽셀이 많을수록 사진이 더 세밀해집니다.</td></tr></table></div>
  <div class="fig"><div class="cap">그림 B. QR코드에 정보가 담기는 방식</div>${FIG_B}<table class="rt"><tr><th>위치 찾기 무늬</th><td>QR코드의 세 모서리에 있는 큰 네모 무늬입니다. 카메라는 이 무늬를 먼저 찾아 QR코드가 어디에 있는지, 얼마나 돌아가 있는지 알아냅니다.</td></tr><tr><th>모듈</th><td>QR코드를 이루는 검고 흰 작은 칸 하나하나입니다. 어느 칸이 검고 어느 칸이 흰지가 곧 정보입니다.</td></tr><tr><th>데이터 영역</th><td>QR코드에 담으려는 정보가 들어 있는 부분입니다. 코드가 손상되었을 때 정보를 되살리기 위한 여분의 정보도 함께 들어 있습니다.</td></tr></table></div>`;
const FIGS1 = `${FIGCSS}<div class="fig"><div class="cap">그림 A. 카메라가 사진을 만드는 과정</div>${FIG_A}</div><div class="fig"><div class="cap">그림 B. QR코드에 정보가 담기는 방식</div>${FIG_B.replace(/<text[^>]*fill="#5B6078">[^<]*<\/text>/g, "")}</div>`;
const FIGS2 = `${FIGCSS}<div class="fig"><div class="cap">그림. 스마트폰에서 서버까지 이어지는 길</div>${FIG_NET}</div>`;
const READ2 = `${FIGCSS}<div class="fig"><div class="cap">그림. 스마트폰에서 서버까지 이어지는 길</div>${FIG_NET}<table class="rt"><tr><th>전파</th><td>선 없이 공간으로 퍼져 나가며, 스마트폰과 공유기, 스마트폰과 기지국 사이를 이어 줍니다.</td></tr><tr><th>공유기</th><td>집이나 카페에서 스마트폰이 와이파이로 보낸 요청을 받아 인터넷으로 넘겨 줍니다.</td></tr><tr><th>기지국</th><td>거리에서 스마트폰과 전파를 주고받고, 그 정보를 통신망을 거쳐 인터넷으로 넘겨 줍니다.</td></tr><tr><th>서버</th><td>웹페이지와 사진, 영상을 저장하고 있다가, 요청이 오면 그 정보를 보내 줍니다.</td></tr><tr><th>패킷</th><td>서버가 정보를 나누어 보내는 작은 조각입니다. 스마트폰에 도착하면 순서대로 다시 맞춰집니다.</td></tr><tr><th>광케이블</th><td>바다 밑에 깔린 통신선입니다. 나라와 나라 사이를 오가는 정보의 95% 이상이 이 선을 지납니다.</td></tr></table></div>`;
const CPLX5 = ["매우 단순하다", "단순하다", "보통이다", "복잡하다", "매우 복잡하다"], FAM5 = ["전혀 익숙하지 않다", "익숙하지 않다", "보통이다", "익숙하다", "매우 익숙하다"];

/* ---------- 활동 만들기: 읽기 자료 → 첫인상(채점 없음) → A 짝짓기 5문항 → B 퀴즈 5문항 (10점) ---------- */
function makeActivity(k, stepIdx, title, read, figs, figWord, aOpts, aItems, bItems, vN) {
  const p = `a${k}`;
  const intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `${steps(stepIdx)}<h1>활동 ${k}. ${title}</h1>
      <div class="card"><p>${figWord}과 설명을 읽은 뒤, 일상의 상황마다 어떤 구성 요소가 일하고 있는지 찾아봅니다. 이어서 영상 ${vN}의 내용을 떠올려 봅니다.</p>
      <p><b>1단계</b> 그림과 설명 읽기, 첫인상 (약 1분, 정답 없음)<br><b>A. 상황 속 구성 요소 찾기</b> (5문항, 약 2분)<br><b>B. 영상 내용 확인하기</b> (5문항, 약 2분)</p>
      <p class="sub">A와 B는 정답이 하나씩 있고, 제출하면 바로 정답과 해설을 볼 수 있어요. 한 번 넘어간 단계로는 되돌아갈 수 없어요.</p></div>`,
    choices: ["시작하기"], data: { task: `act${k}_intro` },
  };
  const s1 = {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<span class="timer" id="acttimer"></span><h1>1단계. 그림과 설명 읽기</h1>
      <div class="note">아래 ${figWord}과 설명을 읽고, <b>느낌대로</b> 답해 주세요. 정답은 없어요.</div>${read}
      <div class="card">${likert(`${p}s1_complex`, `${figWord}의 내용이 얼마나 복잡하게 느껴졌나요?`, CPLX5)}
      ${likert(`${p}s1_familiar`, `${figWord}의 내용이 얼마나 익숙했나요?`, FAM5)}</div>`,
    button_label: "다음 단계로", data: { task: `act${k}s1` },
    on_load: () => startActivityTimer(1),
    on_finish: d => { stopActivityTimer(); flatten(d); window.scrollTo(0, 0); },
  };
  const A = {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<span class="timer" id="acttimer"></span><h1>활동 ${k}-A. 상황 속 구성 요소 찾기</h1>
      <div class="note">앞에서 읽은 설명을 떠올리며, 각 상황에서 일하고 있는 <b>구성 요소</b>를 하나씩 골라 주세요. 설명은 다시 나오지 않고 그림만 보여 드려요. 다섯 문항에 보기 다섯 개가 <b>하나씩 짝지어지고</b>, 같은 보기를 두 번 쓰지 않습니다.</div>${figs}
      <h3>상황별로 골라 주세요</h3>
      ${aItems.map((it, i) => mcqItem(`${p}a_${it.id}`, i + 1, it.stem, aOpts.map((o, j) => `${j + 1}. ${o}`), true)).join("")}`,
    button_label: "제출하기", data: { task: `act${k}a` },
    on_load: () => startActivityTimer(2),
    on_finish: d => { stopActivityTimer(); flatten(d); scoreItems(d, `${p}a`, aItems); },
  };
  const AFb = feedbackTrial(stepIdx, `act${k}a`, `활동 ${k}-A`, `${p}a`, aItems, () => aOpts);
  const B = {
    type: jsPsychSurveyHtmlForm,
    html: `${steps(stepIdx)}<span class="timer" id="acttimer"></span><h1>활동 ${k}-B. 영상 내용 확인하기</h1>
      <div class="note">영상 ${vN}에서 본 내용을 떠올리며, 각 질문에 가장 알맞은 답을 하나씩 골라 주세요.</div>
      ${bItems.map((it, i) => mcqItem(`${p}b_${it.id}`, i + 1, it.stem, it.opts)).join("")}`,
    button_label: "제출하기", data: { task: `act${k}b` },
    on_load: () => startActivityTimer(2),
    on_finish: d => {
      stopActivityTimer(); flatten(d); scoreItems(d, `${p}b`, bItems);
      const a = jsPsych.data.get().filter({ task: `act${k}a` }).last(1).values()[0] || {};
      d[`act${k}_total`] = (a[`${p}a_score`] || 0) + d[`${p}b_score`];
    },
  };
  const BFb = feedbackTrial(stepIdx, `act${k}b`, `활동 ${k}-B`, `${p}b`, bItems, it => it.opts);
  return [intro, s1, A, AFb, B, BFb, engageTrial(stepIdx, k)];
}
const A1A_OPTS = ["렌즈", "이미지 센서", "색 필터", "위치 찾기 무늬", "데이터 영역"];
const A1A_ITEMS = [{"id": "A1", "key": 1, "stem": "사진을 찍으려고 스마트폰을 들었다. 눈앞의 장면에서 오는 빛이 카메라에서 가장 먼저 지나가며 한데 모이는 곳은?", "why": "빛은 카메라 앞쪽의 렌즈를 가장 먼저 지납니다. 렌즈가 빛을 모아 안쪽의 이미지 센서에 비춥니다."}, {"id": "A2", "key": 4, "stem": "식당에서 QR코드를 거꾸로 놓인 채로 비췄는데도 메뉴판이 열렸다. 코드가 얼마나 돌아가 있는지 카메라에 알려 준 것은?", "why": "카메라는 세 모서리의 위치 찾기 무늬를 먼저 찾아 QR코드의 위치와 돌아간 정도를 알아냅니다. 그래서 거꾸로 비춰도 읽힙니다."}, {"id": "A3", "key": 2, "stem": "밝은 낮과 어두운 밤에는 카메라로 들어오는 빛의 양이 다르다. 칸마다 빛이 얼마나 들어왔는지를 재는 부품은?", "why": "이미지 센서의 작은 칸들이 빛이 얼마나 들어왔는지를 재고, 그 빛을 전기 신호로 바꿉니다."}, {"id": "A4", "key": 5, "stem": "QR코드 한쪽에 얼룩이 묻어 일부가 가려졌는데도 읽혔다. 가려진 부분을 되살릴 수 있게 해 준 여분의 정보가 들어 있는 곳은?", "why": "데이터 영역에는 담으려는 정보와 함께, 손상된 부분을 되살리기 위한 여분의 정보가 들어 있습니다."}, {"id": "A5", "key": 3, "stem": "이미지 센서의 칸은 빛이 센지 약한지만 잴 수 있다. 그런데도 사진에 빨간 꽃과 파란 하늘이 구분되어 담기게 해 주는 것은?", "why": "칸 위에 씌운 빨강, 초록, 파랑 색 필터가 빛을 세 가지 색으로 나누어 기록하게 합니다."}];
const A1B_ITEMS = [{"id": "B1", "key": 3, "stem": "사진을 크게 확대하면 보이는 작은 네모 하나를 무엇이라고 하나요?", "opts": ["모듈", "렌즈", "픽셀", "필터"], "why": "디지털 사진은 픽셀이라는 작은 네모들로 이루어져 있습니다. 모듈은 QR코드의 작은 칸을 가리키는 말입니다."}, {"id": "B2", "key": 2, "stem": "QR코드의 일부가 가려져도 읽힐 수 있는 이유는?", "opts": ["카메라가 가려진 부분을 투시해서", "손상된 부분을 되살리기 위한 여분의 정보가 함께 들어 있어서", "인터넷에서 나머지를 내려받아서", "모든 QR코드의 내용이 같아서"], "why": "여분의 정보 덕분에 약 30%가 손상되어도 정보를 되살릴 수 있습니다."}, {"id": "B3", "key": 4, "stem": "카메라가 사진을 만드는 순서로 알맞은 것은?", "opts": ["빛 → 이미지 센서 → 렌즈 → 디지털 사진", "디지털 사진 → 렌즈 → 빛 → 이미지 센서", "이미지 센서 → 빛 → 렌즈 → 디지털 사진", "빛 → 렌즈 → 이미지 센서 → 디지털 사진"], "why": "렌즈가 빛을 모아 이미지 센서에 전달하면, 센서가 바꾼 신호가 디지털 사진이 됩니다."}, {"id": "B4", "key": 1, "stem": "막대 모양 바코드와 비교한 QR코드의 특징은?", "opts": ["가로와 세로 두 방향으로 정보를 담는다", "가로 한 방향으로만 정보를 담는다", "검은 칸의 개수만으로 정보를 담는다", "여러 가지 색을 섞어 정보를 담는다"], "why": "QR코드는 가로와 세로 두 방향에 검고 흰 칸을 배열해 정보를 담습니다."}, {"id": "B5", "key": 3, "stem": "스마트폰이 QR코드에 담긴 정보를 읽는 과정으로 알맞은 것은?", "opts": ["무늬를 찍으면 어느 QR코드에서나 같은 정보가 나온다", "카메라로 찍지 않고도 안에 담긴 정보를 읽는다", "카메라로 무늬를 찍은 뒤 검고 흰 칸의 배열을 풀어 읽는다", "QR코드의 전체 크기만 재어 정보를 읽는다"], "why": "스마트폰은 찍은 사진에서 위치 찾기 무늬를 찾고, 검고 흰 칸의 배열을 풀어 정보를 읽습니다."}];
const A2A_OPTS = ["전파", "공유기", "기지국", "서버", "광케이블"];
const A2A_ITEMS = [{"id": "A1", "key": 4, "stem": "친구가 올린 사진을 눌렀더니 화면에 사진이 떴다. 이 사진을 저장하고 있다가 요청을 받고 보내 준 곳은?", "why": "웹페이지와 사진, 영상은 서버에 저장되어 있고, 스마트폰이 요청하면 서버가 그 정보를 보내 줍니다."}, {"id": "A2", "key": 1, "stem": "스마트폰에는 선이 하나도 꽂혀 있지 않은데 카페에서 웹페이지가 열렸다. 스마트폰과 카페의 장치 사이에서 정보를 실어 나른 것은?", "why": "스마트폰과 공유기, 스마트폰과 기지국 사이는 선 대신 전파가 정보를 실어 나릅니다."}, {"id": "A3", "key": 3, "stem": "와이파이가 없는 길 위에서 지도를 열었는데도 지도가 떴다. 이때 스마트폰과 직접 신호를 주고받은 시설은?", "why": "와이파이가 없는 거리에서는 기지국이 스마트폰과 전파를 주고받고, 그 정보를 인터넷으로 넘겨 줍니다."}, {"id": "A4", "key": 5, "stem": "다른 나라에 있는 서버의 영상을 보았다. 나라와 나라 사이에서 이 영상이 지나온 길로 가장 알맞은 것은?", "why": "나라와 나라 사이를 오가는 정보의 95% 이상이 바다 밑 광케이블을 지납니다."}, {"id": "A5", "key": 2, "stem": "카페에서 스마트폰이 와이파이로 보낸 요청을 가장 먼저 받아 인터넷으로 넘겨 준 장치는?", "why": "카페나 집에서는 공유기가 스마트폰의 요청을 받아 인터넷으로 넘겨 줍니다."}];
const A2B_ITEMS = [{"id": "B1", "key": 2, "stem": "화면에 와이파이 표시가 떠 있다는 것은 무엇을 뜻하나요?", "opts": ["스마트폰이 서버와 연결되었다", "스마트폰이 공유기와 연결되었다", "스마트폰이 기지국과 연결되었다", "스마트폰이 광케이블과 연결되었다"], "why": "와이파이 표시는 스마트폰이 공유기와 연결되었다는 뜻일 뿐입니다. 공유기와 인터넷 사이의 연결이 끊기면 웹페이지가 열리지 않습니다."}, {"id": "B2", "key": 4, "stem": "서버가 웹페이지를 보낼 때 나누는 작은 조각을 무엇이라고 하나요?", "opts": ["픽셀", "모듈", "전파", "패킷"], "why": "서버는 웹페이지를 패킷이라는 작은 조각으로 나누어 보내고, 스마트폰이 이것을 순서대로 다시 맞춥니다."}, {"id": "B3", "key": 1, "stem": "인터넷에 대한 설명으로 알맞은 것은?", "opts": ["수많은 컴퓨터와 통신 장치가 서로 이어진 연결망이다", "어느 한 곳에 있는 커다란 컴퓨터 한 대이다", "스마트폰 안에 들어 있는 부품이다", "공유기의 다른 이름이다"], "why": "인터넷은 전 세계의 수많은 컴퓨터와 통신 장치가 서로 이어진 거대한 연결망입니다."}, {"id": "B4", "key": 3, "stem": "버스를 타고 가면서 영상을 봐도 끊기지 않는 이유는?", "opts": ["처음 연결된 기지국이 버스를 따라 움직여서", "영상이 스마트폰에 미리 모두 저장되어 있어서", "구역을 벗어나면 다음 기지국이 연결을 이어받아서", "버스 안에서는 전파를 쓰지 않아서"], "why": "기지국은 저마다 맡은 구역이 있고, 한 구역을 벗어나면 다음 기지국이 연결을 이어받습니다."}, {"id": "B5", "key": 1, "stem": "카페에서 웹페이지를 열 때, 스마트폰의 요청이 지나가는 순서로 알맞은 것은?", "opts": ["스마트폰 → 공유기 → 여러 통신 장치 → 서버", "스마트폰 → 서버 → 공유기 → 여러 통신 장치", "스마트폰 → 기지국 → 공유기 → 서버", "스마트폰 → 광케이블 → 공유기 → 서버"], "why": "스마트폰은 와이파이로 공유기에 요청을 보내고, 요청은 여러 통신 장치를 거쳐 서버에 도착합니다."}];
const act1 = makeActivity(1, 2, ACT_T[0], READ1, FIGS1, "두 그림", A1A_OPTS, A1A_ITEMS, A1B_ITEMS, 2);
const act2 = makeActivity(2, 4, ACT_T[1], READ2, FIGS2, "그림", A2A_OPTS, A2A_ITEMS, A2B_ITEMS, 3);

const best = {
  type: jsPsychSurveyHtmlForm,
  html: `${steps(6)}<h1>가장 좋았던 것</h1>
    <div class="card"><div class="lq" style="margin-bottom:8px">오늘 본 영상과 활동</div>
      <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.5">${[
        ["영상 1", TITLES[0], "누르는 방식과 정전식, 보이지 않는 격자와 좌표, 화면에 물이 묻거나 장갑을 꼈을 때"],
        ["영상 2", TITLES[1], "렌즈와 이미지 센서, 픽셀과 색, QR코드의 세 가지 특징과 읽는 과정"],
        ["활동 1", ACT_T[0], "사진 찍기와 QR코드 읽기의 상황에서 구성 요소 찾기, 영상 2 내용 퀴즈"],
        ["영상 3", TITLES[2], "전파, 인터넷과 서버, 와이파이와 이동통신, 기지국, 바다 밑 광케이블"],
        ["활동 2", ACT_T[1], "인터넷을 쓰는 상황에서 구성 요소 찾기, 영상 3 내용 퀴즈"],
        ["영상 4", TITLES[3], "스마트폰이 없던 시절, 기능이 하나의 기기에 모인 세 가지 배경, 가장 기억에 남은 내용 적기"],
      ].map(([k, t, d]) => `<tr><th style="width:62px;text-align:left;vertical-align:top;white-space:nowrap;background:${k.startsWith("활동") ? "#EAF6F1" : "#EEF1FB"};border:1px solid #E1E4EE;padding:8px 10px">${k}</th><td style="border:1px solid #E1E4EE;padding:8px 10px"><b>${t}</b><br><span style="color:#5B6078">${d}</span></td></tr>`).join("")}</table></div>
    <div class="card">
    <div class="lq">가장 좋았던 영상은?</div>
    <div class="opts">${TITLES.map((o, i) => `<label><input type="radio" name="best_video" value="${i + 1}" required> 영상 ${i + 1}. ${o}</label>`).join("")}</div>
    <div class="lq" style="margin-top:16px">가장 좋았던 활동은?</div>
    <div class="opts">${ACT_T.map((o, i) => `<label><input type="radio" name="best_activity" value="${i + 1}" required> 활동 ${i + 1}. ${o}</label>`).join("")}</div>
    <label class="f" style="margin-top:16px;display:block"><b>그렇게 고른 이유</b> <span class="sub">(선택)</span></label>
    <input type="text" name="best_reason" placeholder="한 줄로 적어 주세요"></div>`,
  button_label: "다음",
  data: { task: "best" },
  on_finish: d => { flatten(d); window.scrollTo(0, 0); },
};
const debrief = {
  type: jsPsychHtmlButtonResponse,
  stimulus: () => `${steps(6)}<h1>참여해 주셔서 감사합니다</h1>
    <div class="card"><p>오늘의 영상과 활동을 모두 마쳤습니다.</p><p class="sub">${CONFIG.CONTACT_HTML}</p></div>
    <p class="center sub">아래 버튼을 누르면 응답이 저장됩니다.</p>`,
  choices: ["응답 저장하기"],
  data: { task: "debrief" },
};
function END_EXTRA() { return CONFIG.AFTER_PROGRAM_HTML ? `<div class="card">${CONFIG.AFTER_PROGRAM_HTML}</div>` : ""; }

/* ---------- 타임라인 ---------- */
// 시작 전 AI 사용 자가점검(d0_*)은 묻지 않음 (AI 사용 자가점검은 T1 사전 설문에서만)
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
const main = [welcome, setupGuide, soundCheck, video1, check1, video2, check2, ...act1, video3, check3, ...act2, video4, check4, best, dailyTime, debrief, save, endPage];

// ?debug=1&start=act1 또는 ?preview=1&start=video2 처럼 특정 지점부터 시작 (연구자 확인용, 데이터에 debug/preview 표시됨)
const PREVIEW = URLP.get("preview") === "1";
if (PREVIEW) jsPsych.data.addProperties({ preview: true });
const START = (DEBUG || PREVIEW) ? URLP.get("start") : null;
const STARTS = { video1, video2, act1: act1[0], video3, act2: act2[0], video4, best };
jsPsych.run(START && STARTS[START] ? [browserCheck, ...main.slice(main.indexOf(STARTS[START]))] : [browserCheck, ...(HAS_PID ? [] : [pidEntry]), ...main]);
