/**
 * AI 리터러시 프로그램 – 응답을 이 스프레드시트에 1명당 1줄로 저장합니다.
 * 사전 설문과 프로그램은 서로 다른 탭(config.js의 SHEET_PRE, SHEET_PROGRAM)에 저장됩니다.
 * 설치: 스프레드시트 > 확장 프로그램 > Apps Script 에 이 코드를 붙여 넣고 '웹 앱'으로 배포하세요.
 */
const SHEET_NAME = '응답';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
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
    sh.appendRow(values);
    return json({ ok: true, row: sh.getLastRow() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, message: '저장 주소가 정상적으로 작동합니다.' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
