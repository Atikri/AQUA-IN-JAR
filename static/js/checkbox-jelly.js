(function(){
  'use strict';
  function enhanceLiCheckbox(li){
    const input = li.querySelector('input[type="checkbox"]');
    if(!input || input.classList.contains('jelly')) return;
    input.classList.add('jelly');
    // 插入视觉复选框
    const cbx = document.createElement('span');
    cbx.className = 'cbx';
    input.insertAdjacentElement('afterend', cbx);
    // 将紧随其后的文本节点包裹成 .lbl（若存在）
    const next = cbx.nextSibling;
    if(next && next.nodeType === 3){
      const lbl = document.createElement('span');
      lbl.className = 'lbl';
      lbl.textContent = next.textContent;
      li.replaceChild(lbl, next);
      bindToggle(input, cbx, lbl);
    } else {
      bindToggle(input, cbx, null);
    }
  }

  function bindToggle(input, cbx, lbl){
    function toggle(){
      if (input.disabled) return;
      input.checked = !input.checked;
      // 触发 change 事件，便于现有持久化脚本保存状态
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    cbx.setAttribute('tabindex', '0');
    cbx.addEventListener('click', toggle);
    cbx.addEventListener('keydown', function(e){
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
    });
    if (lbl) {
      lbl.setAttribute('tabindex', '0');
      lbl.addEventListener('click', toggle);
      lbl.addEventListener('keydown', function(e){
        if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
      });
    }
  }

  function init(){
    // 列表型（Markdown 常见）
    document.querySelectorAll('li').forEach(function(li){
      if(li.querySelector('input[type="checkbox"]')){
        enhanceLiCheckbox(li);
      }
    });
    // 非列表场景：文章或页面内任意 checkbox（避免重复增强）
    document.querySelectorAll('article input[type="checkbox"], main input[type="checkbox"]').forEach(function(input){
      if (!input.classList.contains('jelly')) {
        // 构造一个临时 li 包裹逻辑以复用函数
        const tempLi = document.createElement('li');
        input.parentNode.insertBefore(tempLi, input);
        tempLi.appendChild(input);
        enhanceLiCheckbox(tempLi);
        // 展开：把子节点放回原父元素
        while (tempLi.firstChild) {
          tempLi.parentNode.insertBefore(tempLi.firstChild, tempLi);
        }
        tempLi.parentNode.removeChild(tempLi);
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


