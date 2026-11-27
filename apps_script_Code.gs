/**
 * AI 리터러시 프로그램 – 응답을 이 스프레드시트에 1명(1회 접속)당 1줄로 저장합니다.
 * · 사전 설문·프로그램·파일럿은 서로 다른 탭(config.js의 SHEET_PRE, SHEET_PROGRAM, SHEET_PILOT)에 저장됩니다.
 * · 참여 중에도 화면을 제출할 때마다 자동 저장되며, 같은 접속(sid)의 줄을 찾아 최신 응답으로 덮어씁니다.
 *   중간에 그만둔 사람도 마지막으로 제출한 화면까지 남습니다(status 열: in_progress / left / complete / screened_out).
 * · seq(보낸 순서)가 지금 줄보다 큰 저장만 반영하므로, 늦게 도착한 예전 저장이 최신 응답을 덮어쓰지 않습니다.
 * · 여러 사람이 동시에 저장해도 LockService로 한 번에 하나씩 처리합니다.
 */
const SHEET_NAME = '응답';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(28000);
  } catch (err) {
    return json({ ok: false, error: 'busy' }); // 사이트가 잠시 뒤 다시 보냅니다
  }
  try {
    const body = JSON.parse(e.postData.contents);
    const row = body.row || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const name = String(body.sheet || SHEET_NAME).slice(0, 90);
    const sh = ss.getSheetByName(name) || ss.insertSheet(name);

    // 첫 줄(열 제목)을 읽고, 처음 보는 항목이 있으면 오른쪽 끝에 열을 추가
    let headers = sh.getLastColumn() > 0 ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0] : [];
    const missing = Object.keys(row).filter(k => headers.indexOf(k) < 0);
    if (missing.length) {
      sh.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
      headers = headers.concat(missing);
      sh.setFrozenRows(1);
    }

    const values = headers.map(h => {
      const v = row[h];
      if (v === undefined || v === null) return '';
      // 응답 글이 = + - @ 로 시작하면 수식으로 해석되지 않게 막음
      if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
      return v;
    });

    // 같은 접속(sid)의 줄이 있으면 덮어쓰기, 없으면 새 줄
    const sidCol = headers.indexOf('sid') + 1, seqCol = headers.indexOf('seq') + 1;
    const last = sh.getLastRow();
    if (row.sid && sidCol > 0 && last > 1) {
      const sids = sh.getRange(2, sidCol, last - 1, 1).getValues();
      for (let i = sids.length - 1; i >= 0; i--) {
        if (String(sids[i][0]) === String(row.sid)) {
          const r = i + 2;
          const oldSeq = seqCol > 0 ? Number(sh.getRange(r, seqCol).getValue()) || 0 : 0;
          if (Number(row.seq || 0) <= oldSeq) return json({ ok: true, row: r, skipped: 'older' });
          sh.getRange(r, 1, 1, values.length).setValues([values]);
          return json({ ok: true, row: r, updated: true });
        }
      }
    }
    sh.appendRow(values);
    return json({ ok: true, row: sh.getLastRow() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// 설문 화면이 참가자의 '나의 작은 변화' 문장을 불러올 때 씁니다: …/exec?get=change&pid=참여번호
// '프로그램' 탭에서 그 참여 번호의 change_text 한 칸만 돌려주며, 다른 응답은 내보내지 않습니다.
const SHEET_PROGRAM_NAME = '프로그램';

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.get === 'change' && p.pid) {
    try {
      const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PROGRAM_NAME);
      if (!sh || sh.getLastRow() < 2) return json({ ok: true, change_text: '' });
      const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      const pidCol = headers.indexOf('pid'), txtCol = headers.indexOf('change_text');
      if (pidCol < 0 || txtCol < 0) return json({ ok: true, change_text: '' });
      const rows = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
      const pid = String(p.pid).trim().toLowerCase();
      for (let i = rows.length - 1; i >= 0; i--) { // 가장 최근에 적은 문장
        const t = String(rows[i][txtCol] || '').trim();
        if (t && String(rows[i][pidCol]).trim().toLowerCase() === pid) return json({ ok: true, change_text: t });
      }
      return json({ ok: true, change_text: '' });
    } catch (err) {
      return json({ ok: false, error: String(err) });
    }
  }
  // 본실험 T1: 참여 번호를 1부터 차례로 하나씩 내줍니다(최대 1000). 스크립트 속성 NEXT_PID에 다음 번호를 기억합니다.
  // 번호를 처음부터 다시 매기려면: 프로젝트 설정 > 스크립트 속성에서 NEXT_PID를 지우거나 원하는 숫자로 바꿉니다.
  if (p.get === 'newid') {
    const lock = LockService.getScriptLock();
    try { lock.waitLock(20000); } catch (err) { return json({ ok: false, error: 'busy' }); }
    try {
      const props = PropertiesService.getScriptProperties();
      const n = Number(props.getProperty('NEXT_PID')) || 1;
      if (n > 1000) return json({ ok: false, error: 'full' });
      props.setProperty('NEXT_PID', String(n + 1));
      return json({ ok: true, pid: n });
    } catch (err) {
      return json({ ok: false, error: String(err) });
    } finally {
      lock.releaseLock();
    }
  }
  return json({ ok: true, message: '저장 주소가 정상적으로 작동합니다.' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
