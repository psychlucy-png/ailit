// ===================== 사전·사후 측정 문항 =====================
// 아래 [예시] 문항을 실제 척도로 바꿔 넣으세요.
// - id: 데이터 열 이름 (영문·숫자·_ 만, 겹치지 않게)
// - scale: 보기 라벨 배열. 저장되는 값은 1부터 시작하는 번호입니다.
// - reverse: 역채점 문항 표시용 메모 (분석 때 참고, 화면에는 영향 없음)

const LIKERT5 = ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"];

const DEMOGRAPHICS = [
  { id: "age", text: "나이(만)", type: "number", min: 17, max: 60 },
  { id: "gender", text: "성별", type: "choice", options: ["여성", "남성", "응답하지 않음"] },
  { id: "year", text: "학년", type: "choice", options: ["1학년", "2학년", "3학년", "4학년", "5학년 이상"] },
  { id: "ai_freq", text: "생성형 AI(챗봇) 사용 빈도", type: "choice",
    options: ["거의 매일", "주 2~3회", "주 1회", "월 1~3회", "거의 사용하지 않음"] },
];

const PRE_MEASURES = {
  title: "사전 설문",
  instruction: "평소 AI를 사용하는 모습을 떠올리며 각 문장에 얼마나 동의하는지 골라 주세요.",
  items: [
    { id: "pre_ex1", text: "[예시 문항] AI의 답변이 맞는지 다른 자료로 확인하는 편이다.", scale: LIKERT5 },
    { id: "pre_ex2", text: "[예시 문항] 과제를 할 때 스스로 생각하기 전에 AI부터 찾는다.", scale: LIKERT5, reverse: true },
    { id: "pre_ex3", text: "[예시 문항] 힘들 때 사람보다 AI에게 먼저 이야기한다.", scale: LIKERT5, reverse: true },
  ],
};

const POST_MEASURES = {
  title: "사후 설문",
  instruction: "프로그램을 마친 지금, 각 문장에 얼마나 동의하는지 골라 주세요.",
  items: [
    { id: "post_ex1", text: "[예시 문항] AI의 답변이 맞는지 다른 자료로 확인할 것이다.", scale: LIKERT5 },
    { id: "post_ex2", text: "[예시 문항] 과제를 할 때 스스로 먼저 생각한 뒤 AI를 쓸 것이다.", scale: LIKERT5 },
    { id: "post_ex3", text: "[예시 문항] AI의 다정한 말이 나에게 도움이 되는지 살펴볼 것이다.", scale: LIKERT5 },
  ],
};

// 프로그램 자체에 대한 평가 (파일럿용, 필요 없으면 items를 빈 배열로)
const PROGRAM_FEEDBACK = {
  title: "프로그램에 대한 의견",
  instruction: "영상과 활동에 대해 솔직하게 답해 주세요.",
  items: [
    { id: "fb_text_time", text: "화면의 글자를 읽을 시간이 충분했다.", scale: LIKERT5 },
    { id: "fb_distract", text: "화면 움직임이 산만하게 느껴졌다.", scale: LIKERT5 },
    { id: "fb_useful", text: "프로그램이 나의 AI 사용을 돌아보는 데 도움이 되었다.", scale: LIKERT5 },
  ],
  open: { id: "fb_open", text: "더 하고 싶은 말이 있다면 적어 주세요. (선택)" },
};
