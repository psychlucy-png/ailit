/* 본실험 페이지 전용 디버그 도우미. 주소에 debug=1이 있을 때만 동작한다.
   - 모든 설문 화면에서 응답하지 않아도 '다음'으로 넘어갈 수 있게 함 (필수 입력 검사를 끔)
   - 화면 아래에 디버그 표시를 띄움
   참여자에게 보내는 주소에는 debug=1을 붙이지 않는다. 디버그로 저장된 응답에는 debug = true가 기록된다. */
(function () {
  if (typeof DEBUG === "undefined" || !DEBUG) return;
  const relax = () => document.querySelectorAll("form").forEach(f => { f.noValidate = true; });
  new MutationObserver(relax).observe(document.documentElement, { childList: true, subtree: true });
  relax();
  const tag = document.createElement("div");
  tag.textContent = "디버그 모드: 응답하지 않아도 넘어갈 수 있어요";
  tag.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:9999;background:#23284A;color:#fff;font-size:12px;padding:5px 10px;border-radius:8px;opacity:.85;pointer-events:none";
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(tag));
  if (document.body) document.body.appendChild(tag);
})();
