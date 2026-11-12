# AI 리터러시 온라인 개입 — 배포 안내 (v4, 2026-11-12)

jsPsych 7.3.4로 만든 온라인 실험입니다. **사전 설문과 프로그램(영상·활동)을 두 페이지로 나눴습니다.** 같은 폴더 하나를 GitHub Pages에 올리면 두 주소가 생깁니다.

| 페이지 | 주소 | 흐름 |
|---|---|---|
| 사전 설문 | `.../pre-survey.html?pid=P001` | 안내문·동의 → 참여 대상 확인 → 사전 설문 → 저장 → 참여 번호 안내 |
| 프로그램 | `.../program.html?pid=P001` | 시작 안내 → 소리 확인 → **영상 1** → 확인·평정 → **영상 2** → 확인·평정 → **활동 1**(A·B, 10점) → 참여 평정 → **영상 3** → 확인·평정 → **활동 2**(첫인상 → A·B, 10점) → 참여 평정 → **영상 4** → 확인·평정 → 나의 작은 변화 → 가장 좋았던 영상·활동 → 사후 설문 → 프로그램 의견 → 디브리핑 → 저장 |

## 두 페이지 연결 (참여 번호 pid)

- 사전 설문 주소에 `?pid=`가 있으면 그 번호를, 없으면 무작위 번호를 씁니다. 마지막 화면에 **참여 번호**를 크게 보여 줍니다.
- 프로그램 주소에 `?pid=`가 있으면 바로 시작하고, 없으면 첫 화면에서 참여 번호를 입력받습니다.
- `config.js`의 `PROGRAM_URL`에 프로그램 주소를 넣으면, 사전 설문 마지막 화면에 **프로그램 시작하기** 버튼이 생기고 같은 번호로 이어집니다. 사전 설문과 프로그램을 다른 날 진행한다면 비워 두세요.
- 동의서는 사전 설문에만 있습니다. 프로그램만 따로 진행하는 참여자가 있다면 동의 절차를 따로 확인하세요.

## 폴더 구성

| 파일 | 내용 | 수정 필요 |
|---|---|---|
| `config.js` | 저장 주소, 시트 이름, 프로그램 주소, 시청 기준, 연락처 | **예** |
| `measures.js` | 사전·사후 설문 문항 (척도북 기준) | 문항 수정 시 |
| `pre-survey.html`, `pre-survey.js` | 사전 설문 페이지 | 동의서 문구 수정 시 |
| `program.html`, `program.js` | 프로그램 페이지 (영상·확인 문항·활동·사후 설문) | 문항 수정 시 |
| `common.js` | 두 페이지 공통 기능 (설문 화면, 영상 플레이어, 저장) | 아니오 |
| `style.css` | 화면 디자인 | 아니오 |
| `video1.mp4` ~ `video4.mp4` | 영상 4편 (웹용 압축, 1080p, 각 25MB 미만) | 영상 수정 시 같은 이름으로 교체 |
| `soundcheck.mp3`, `cat_doodle.svg` | 소리 확인 음성("주도권은"), 활동 2 고양이 낙서 | 아니오 |
| `jspsych.js`, `jspsych.css`, `plugin-*.js` | jsPsych 라이브러리 | 아니오 |
| `apps_script_Code.gs` | Google 스프레드시트 저장용 Apps Script | **다시 배포 필요** (아래) |

## 1. 내 컴퓨터에서 먼저 확인하기

폴더에서 `python3 -m http.server 8000`을 실행하고 브라우저에서 엽니다.

- `http://localhost:8000/pre-survey.html?debug=1`
- `http://localhost:8000/program.html?debug=1&pid=TEST` — 영상을 끝까지 보지 않아도 넘어갈 수 있는 확인용 모드
- `program.html?debug=1&start=act1` — 특정 지점부터 시작. `video1`, `video2`, `act1`, `video3`, `act2`, `video4`, `change`, `post`
- `?preview=1&start=video2` — 시청 확인 장치가 실제처럼 작동하는 상태로 특정 지점부터 확인

`SHEETS_URL`과 `DATAPIPE_ID`가 둘 다 비어 있으면 서버로 보내지 않고 마지막 화면에서 CSV를 내려받을 수 있습니다. debug·preview로 진행한 응답도 저장 주소가 있으면 실제로 저장되니(`debug`/`preview` 열로 구분), 확인할 때는 두 값을 잠시 비워 두는 것이 안전합니다.

## 2. 데이터 저장 (Google 스프레드시트, 참가자 1명 = 1줄)

사전 설문은 **`사전설문`** 탭, 프로그램은 **`프로그램`** 탭에 따로 쌓입니다(`config.js`의 `SHEET_PRE`, `SHEET_PROGRAM`). 두 탭은 `pid` 열로 연결하세요.

**Apps Script를 이번 버전으로 바꿔야 합니다.** 스프레드시트 → 확장 프로그램 → Apps Script에서 기존 코드를 `apps_script_Code.gs` 내용으로 바꾸고, **배포 → 배포 관리 → 수정(연필) → 버전: 새 버전 → 배포**를 누르세요. 이렇게 하면 웹 앱 주소가 바뀌지 않아 `config.js`의 `SHEETS_URL`을 그대로 쓸 수 있습니다. (예전 코드로 두면 두 페이지 응답이 모두 `응답` 탭에 섞여 저장됩니다.)

`DATAPIPE_ID`가 있으면 화면별 원자료 CSV도 Google Drive에 백업됩니다. 파일 이름은 `pre_참가자ID_시각.csv`, `program_참가자ID_시각.csv`입니다.

## 3. 웹에 올리기 (GitHub Pages)

1. 저장소에 이 폴더의 파일 전체를 올립니다(영상은 각각 25MB 미만이라 웹 업로드 가능). 기존 저장소라면 예전 `index.html`, `experiment.js`, `video1~3.mp4`는 지워도 됩니다.
2. Settings → Pages → Branch `main`, 폴더 `/ (root)`.
3. 참가자 링크: `https://내아이디.github.io/저장소이름/pre-survey.html`, `https://내아이디.github.io/저장소이름/program.html?pid=번호`

**배포 전 체크리스트**

- [ ] Apps Script를 새 코드로 바꾸고 "새 버전"으로 재배포
- [ ] `config.js`: 연락처, `PROGRAM_URL`(필요 시) 확인
- [ ] PC 크롬, 아이폰 사파리, 안드로이드 크롬에서 두 페이지를 처음부터 끝까지 진행
- [ ] 스프레드시트의 `사전설문`, `프로그램` 탭에 줄이 생겼는지 확인
- [ ] 파일럿으로 소요 시간(`total_min`)과 활동 문항별 정답률 확인

## 4. 영상 시청 확인 장치

영상이 끝나기 전에는 '다음' 버튼이 잠기고, 앞으로 건너뛰기·배속이 막혀 있습니다. 다른 탭으로 가면 영상이 멈추고, 실제 재생 시간이 길이의 95% 미만이면 다시 보게 합니다(`MIN_WATCH_RATIO`).

## 5. 데이터 변수 (프로그램 탭)

| 영역 | 열 |
|---|---|
| 공통 | `pid`, `form`(pre/program), `saved_at`, `started_at`, `finished_at`, `total_min`, `debug`, `preview`, `soundcheck_failed`, `sec_화면이름`(화면별 체류 초) |
| 영상 (n=1~4) | `vn_watched_ratio`, `vn_completed`, `vn_tab_hidden_sec`, `vn_n_seek_blocked` 등 노출 지표 |
| 영상 확인 (이해) | `check_vn`(보기 번호), `check_vn_correct`(0/1). 정답: 영상 1=2번, 2=3번, 3=2번, 4=1번 |
| 영상 평정 (수용성, 1~5) | `rate_vn_like`(호감), `rate_vn_imp`(내면화), `rate_vn_int`(실천 의도) |
| 활동 1 (수행) | `a1a_A1`~`A5`(1 일치, 2 다름, 3 확인 불가), `a1a_Ak_ok`, `a1a_score`(0~5) · `a1b_B1`~`B5`(보기 1~5), `a1b_Bk_ok`, `a1b_score`(0~5), `a1b_order`(화면에 나온 순서) · `act1_total`(0~10) |
| 활동 2 (수행) | `a2s1_A_feel`, `a2s1_A_more`(B, C도 같음, 1~5) · `a2a_A1`~`A5`(단서 1~5), `a2a_Ak_ok`, `a2a_score`, `a2a_order`, `a2a_change`(1 달라지지 않음, 2 조금, 3 많이) · `a2b_B1`~`B5`(보기 1~3), `a2b_Bk_ok`, `a2b_score`, `a2b_felt`(1 있다, 2 없다, 3 모르겠다) · `act2_total`(0~10) |
| 활동 참여 평정 (1~5) | `eng_a1_beh`, `eng_a1_emo`, `eng_a1_cog`, `eng_a1_diff`(난도, 참여 점수에서 제외) · `eng_a2_*` 같음 |
| 마무리 | `change_pick`(1~3 예시, 4 직접), `change_text`, `best_video`(1~4), `best_activity`(1~2), `best_reason`, `post_*`(사후 설문), `fb_*`(프로그램 의견) |

**정답표** — 활동 1-A: A1=1, A2=2, A3=2, A4=3, A5=3 · 1-B: B1=1, B2=2, B3=3, B4=4, B5=5 · 2-A: A1=1, A2=2, A3=3, A4=4, A5=5 · 2-B: B1=2, B2=3, B3=2, B4=1, B5=3. 1-B와 2-A는 문항 순서를 참여자마다 섞어 보여 주며, 데이터의 문항 번호는 위 고정 번호입니다.

**제외 기준 예시 (사전에 정해 두세요):** 영상 중 하나라도 `watched_ratio < 0.95`, 영상 확인 문항 4개 중 2개 이상 오답, 또는 `soundcheck_failed = true`.

## 참고

- 새로고침하거나 창을 닫으면 그 페이지의 처음부터 다시 시작합니다(사전 설문을 마친 뒤 프로그램을 새로고침해도 사전 설문은 다시 하지 않음).
- 영상 4의 자기점검(O/X)은 마음속으로 답하게 두고 저장하지 않습니다. '나의 작은 변화'는 영상 4 확인 문항 다음 화면에서 받습니다.
