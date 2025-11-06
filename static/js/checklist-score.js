(function(){
  'use strict';

  function parseRanges(text){
    // 支持形如 "0-5：描述" / "6-10：描述" / "11+：描述"
    if(!text) return null;
    const mRange = text.match(/(\d+)\s*-\s*(\d+)/);
    const mPlus = text.match(/(\d+)\s*\+/);
    return {
      text,
      min: mRange ? parseInt(mRange[1],10) : (mPlus ? parseInt(mPlus[1],10) : 0),
      max: mRange ? parseInt(mRange[2],10) : (mPlus ? Infinity : Infinity),
      isPlus: !!mPlus
    };
  }

  function pickResult(count, ok, mid, bad){
    const r1 = parseRanges(ok);
    const r2 = parseRanges(mid);
    const r3 = parseRanges(bad);
    const inRange = (r)=> count >= r.min && count <= r.max;
    if(r1 && inRange(r1)) return r1.text;
    if(r2 && inRange(r2)) return r2.text;
    if(r3 && inRange(r3)) return r3.text;
    // 兜底：选最接近的
    if(r3 && count >= r3.min) return r3.text;
    if(r2) return r2.text; 
    return ok || '';
  }

  function initOne(wrapper){
    if(!wrapper) return;
    const btn = wrapper.querySelector('.checklist-score__btn');
    const out = wrapper.querySelector('.checklist-score__result');
    if(!btn || !out) return;

    const ok = wrapper.getAttribute('data-ok') || '';
    const mid = wrapper.getAttribute('data-mid') || '';
    const bad = wrapper.getAttribute('data-bad') || '';

    btn.addEventListener('click', function(){
      // 统计 wrapper 内部的任务清单勾选数量
      const checked = wrapper.querySelectorAll('input[type="checkbox"]:checked').length;
      const title = wrapper.getAttribute('data-title') || '结果';
      const resultText = pickResult(checked, ok, mid, bad);
      out.textContent = title + '：' + resultText + `（勾选数：${checked}）`;
      out.classList.add('show');
    });
  }

  function init(){
    document.querySelectorAll('.checklist-score').forEach(initOne);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


