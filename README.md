# AI 리터러시 온라인 개입 — 배포 안내

jsPsych 7.3.4로 만든 온라인 실험입니다. 참가자는 링크 하나로 아래 순서를 진행합니다.

동의 → 시작 안내 → 소리 확인 → 기본 정보·사전 설문 → **영상 1** → 확인 문항 → **활동 1**(A 오류 찾기, B 비판하고 고치기) → **영상 2** → 확인 문항 → **활동 2**(1단계 첫인상 → 2단계 다시 들여다보기 → 3단계 고치기) → **영상 3** → 확인 문항 → 나의 작은 변화 → 사후 설문 → 프로그램 의견 → 디브리핑 → 저장

## 폴더 구성

| 파일 | 내용 | 수정 필요 |
|---|---|---|
| `config.js` | DataPipe ID, 시청 기준, 연락처·IRB·상담센터 문구 | **예** |
| `measures.js` | 기본 정보, 사전·사후 설문, 프로그램 의견 문항 | **예** (예시 문항을 실제 척도로 교체) |
| `experiment.js` | 실험 흐름, 영상 페이지, 활동 페이지 | 동의서 본문·디브리핑 문구만 |
| `style.css` | 화면 디자인 | 아니오 |
| `videos/` | 영상 3편 (웹용으로 압축, 1080p) | 영상 수정 시 같은 이름으로 교체 |
| `media/` | 소리 확인 음성("주도권은"), 활동 2 고양이 낙서 | 아니오 |
| `lib/` | jsPsych 라이브러리 (인터넷 CDN 없이도 작동하도록 포함) | 아니오 |

`experiment.js`에서 고쳐야 할 곳은 `[ ... 넣으세요]`라고 표시된 두 곳(동의서 본문, 디브리핑 연구 목적)입니다.

## 1. 내 컴퓨터에서 먼저 확인하기

폴더에서 터미널을 열고 아래를 실행한 뒤, 브라우저에서 `http://localhost:8000` 을 엽니다.

```
python3 -m http.server 8000
```

- **`?debug=1`** — 영상을 끝까지 보지 않아도 넘어갈 수 있는 확인용 모드. 예: `http://localhost:8000/?debug=1`
- **`?debug=1&start=act2`** — 특정 지점부터 시작. `video1`, `act1`, `video2`, `act2`, `video3`, `change`, `post` 사용 가능
- **`?preview=1&start=video2`** — 시청 확인 장치가 실제처럼 작동하는 상태로 특정 지점부터 확인

> 파이썬 기본 서버는 영상 구간 이동(range 요청)을 지원하지 않아서, 로컬에서는 영상이 가끔 처음으로 되돌아갈 수 있어요. GitHub Pages에서는 정상 작동합니다.

`config.js`의 `DATAPIPE_ID`가 비어 있으면 서버로 보내지 않고, 마지막 화면에서 CSV를 내려받을 수 있어요. 데이터가 잘 쌓이는지 이걸로 먼저 확인하세요.

## 2. 데이터 저장 설정 (DataPipe + Google Drive, 무료)

DataPipe는 OSF 프로젝트 기능 종료로 2026년 11월 16일 이후 OSF에 저장하지 않습니다. 그래서 저장 위치를 **Google Drive**로 연결합니다.

1. [pipe.jspsych.org](https://pipe.jspsych.org)에 가입합니다.
2. 계정 설정에서 저장 위치(provider)로 **Google Drive**를 연결합니다. 구글 로그인 후 접근 권한을 허용하면 됩니다.
3. DataPipe에서 새 실험을 만들고, 저장 위치를 Google Drive로 고릅니다.
4. 실험 페이지에서 **데이터 수집(Enable data collection)** 을 켭니다.
5. 실험 ID(영문·숫자 문자열)를 복사해 `config.js`의 `DATAPIPE_ID`에 붙여 넣습니다.

참가자 한 명이 끝날 때마다 `참가자ID_시각.csv` 파일이 연결한 Google Drive 폴더에 하나씩 쌓입니다. 화면의 메뉴 이름은 조금 다를 수 있어요.

> **IRB 확인:** Google Drive 데이터는 Google의 서버(해외 포함)에 저장됩니다. 개인정보를 받지 않더라도 IRB 서류의 '자료 보관 장소'에 "DataPipe를 통해 연구자 Google Drive에 저장"이라고 적어 두세요. 연구실 공용 계정보다 연구 책임자 계정을 쓰는 편이 관리가 쉽습니다.

## 3. 웹에 올리기 (GitHub Pages, 무료)

1. GitHub에 가입하고 새 저장소(repository)를 만듭니다. (무료 계정의 GitHub Pages는 **공개 저장소**에서만 됩니다. 저장소에는 영상·코드만 있고 참가자 데이터는 들어가지 않습니다.)
2. 이 폴더 안의 파일 전체를 저장소에 올립니다. (웹 화면의 Add file → Upload files로 끌어다 놓기. 영상 파일은 각각 25MB 미만이라 웹 업로드가 가능합니다.)
3. 저장소 Settings → Pages → Branch를 `main`, 폴더를 `/ (root)`로 정하고 저장합니다.
4. 1~2분 뒤 `https://내아이디.github.io/저장소이름/` 주소가 생깁니다. 이 주소가 참가자 링크입니다.

## 4. 참가자에게 링크 보내기

- 기본 링크: `https://내아이디.github.io/저장소이름/`
- 참가자 번호를 붙이려면: `...저장소이름/?pid=P001` (번호가 없으면 무작위 ID가 자동으로 만들어집니다)
- 패널 업체를 쓰면 업체가 주는 참가자 ID를 `?pid=` 뒤에 붙이고, 종료 후 돌려보낼 주소는 `config.js`의 `REDIRECT_URL`에 넣으세요.

**배포 전 체크리스트**

- [ ] `config.js`의 연락처·IRB·상담센터 정보, `DATAPIPE_ID` 입력
- [ ] `measures.js`의 예시 문항을 실제 척도로 교체
- [ ] `experiment.js`의 동의서 본문과 디브리핑 문구 입력
- [ ] PC 크롬, 휴대폰(아이폰 사파리, 안드로이드 크롬)에서 처음부터 끝까지 한 번씩 진행
- [ ] Google Drive에 CSV가 실제로 들어왔는지 확인
- [ ] 파일럿 참가자 몇 명으로 소요 시간 확인 (`time_elapsed` 열, 단위 ms)

## 5. 영상 시청 확인 장치

- 영상이 끝나기 전에는 '다음' 버튼이 잠겨 있습니다.
- 재생바가 없고, 아직 본 적 없는 부분으로 건너뛰려 하면 마지막으로 본 지점으로 되돌아갑니다. 재생 속도도 1배속으로 고정됩니다.
- 다른 탭으로 이동하면 영상이 자동으로 멈춥니다.
- 실제 재생 시간이 영상 길이의 95% 미만이면 다시 보게 합니다. (`config.js`의 `MIN_WATCH_RATIO`)
- 영상마다 내용 확인 문항이 하나씩 있습니다.

**제외 기준 예시 (사전에 정해 두세요):** 영상 중 하나라도 `watched_ratio < 0.95`, 또는 확인 문항 3개 중 2개 이상 오답, 또는 `soundcheck_failed = true`.

## 6. 데이터 변수 (CSV 열)

한 참가자 파일에서 한 행이 한 화면입니다. 화면 종류는 `task` 열로 구분하세요.

**공통:** `pid`, `started_at`, `finished_at`, `rt`(화면 체류 ms), `time_elapsed`, `debug`, `preview`, `soundcheck_failed`

| task | 주요 열 |
|---|---|
| `browser` | `browser`, `os`, `mobile`, `width`, `height` |
| `soundcheck` | `soundcheck`(고른 단어), `soundcheck_correct`, `soundcheck_try` |
| `demographics` | `age`, `gender`, `year`, `ai_freq` (보기 번호) |
| `pre` / `post` / `feedback` | `measures.js`의 문항 id (1~5) |
| `video` | `video`(1~3), `video_duration`, `watched_sec`, `watched_ratio`, `max_position`, `completed`, `n_plays`, `n_pauses`, `n_tab_hidden`, `tab_hidden_sec`, `n_paused_by_tab`, `n_seek_blocked`, `n_load_errors`, `n_fullscreen`, `first_play_ms` |
| `video_check` | `check_v1`·`check_v2`·`check_v3` (보기 번호), `check_correct` |
| `act1a` | `a1a_marked`(표시한 문장 A1~A5), `a1a_n_marked`, `a1a_A1_reason` …, `a1a_none` |
| `act1b` | `a1b_marked`(B0=답변 전체, B1~B4), `a1b_n_marked`, `a1b_B2_crit1`~`crit5`(1=근거, 2=논리, 3=균형, 4=맥락, 5=결론의 강도), `a1b_B2_reason` …, `a1b_n_criteria`, `a1b_fix_target`, `a1b_fix_text` |
| `act2s1` | `a2s1_A_feel`, `a2s1_A_more` (B, C도 같음, 1~5) |
| `act2s2` | `a2s2_A_marked`(a1~a4 등), `a2s2_A_clue1`~`clue5`, `a2s2_A_noclue`, `a2s2_A_change`(1=달라지지 않음, 2=조금, 3=많이), `a2s2_A_change_text` |
| `act2s3` | `a2s3_pick`(A/B/C), `a2s3_rewrite`, `a2s3_felt`(1=있다, 2=없다, 3=모르겠다), `a2s3_felt_text` |
| `my_change` | `change_pick`(1~3 예시, 4 직접), `change_text` |

**문장 번호**

- 활동 1-A: A1 의미 이해 / A2 의도·감정 파악 / A3 진실된 공감 / A4 스스로 사실 판단 / A5 자연스러우면 정확
- 활동 1-B: B1 부정적 영향 / B2 많이 쓸수록 우울·불안 증가 / B3 긍정적 모습 반복 노출 / B4 최대한 줄이기
- 활동 2: 대화 A a1~a4, 대화 B b1~b4, 대화 C c1~c6 (화면에 나오는 순서대로)

## 참고

- 참가자가 중간에 새로고침하거나 창을 닫으면 처음부터 다시 시작합니다. 시작 안내에서 이 점을 알리고, 나가려 하면 브라우저가 경고를 띄웁니다.
- 영상 3의 자기점검(O/X)은 내레이션대로 마음속으로 답하게 두었고, 따로 저장하지 않습니다. '오늘의 작은 변화'는 영상 3이 끝난 뒤 별도 화면에서 적고 저장합니다.
- 영상은 원본(1080p)을 웹용으로 다시 압축한 것입니다. 영상을 수정하면 `videos/video1.mp4` 같은 이름 그대로 바꿔 넣으세요.
