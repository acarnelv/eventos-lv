/* Altura del iframe = altura REAL del contenido.
   - Para iframeResizer (web): le damos nuestro propio cálculo, porque el suyo
     puede contar la altura del iframe en vez del contenido y no encoger nunca
     (eso dejaba un hueco blanco grande debajo).
   - Para AMP (cuando se entra desde Google): le enviamos la altura en su formato.
   Este script tiene que cargarse ANTES que iframeResizer.contentWindow.js. */
(function(){
  function contentHeight(){
    var b = document.body, max = 0;
    if (!b) return 0;
    for (var i = 0; i < b.children.length; i++){
      var el = b.children[i];
      if (el.tagName === 'SCRIPT') continue;
      var r = el.getBoundingClientRect();
      var mb = parseFloat(getComputedStyle(el).marginBottom) || 0;
      max = Math.max(max, r.bottom + window.pageYOffset + mb);
    }
    var pb = parseFloat(getComputedStyle(b).paddingBottom) || 0;
    return Math.ceil(max + pb);
  }
  window.iFrameResizer = window.iFrameResizer || {};
  window.iFrameResizer.heightCalculationMethod = contentHeight;

  if (window.parent === window) return;
  var last = 0;
  function send(){
    var h = contentHeight();
    if (!h || h === last) return; last = h;
    window.parent.postMessage({sentinel:'amp', type:'embed-size', height:h}, '*');
  }
  window.addEventListener('load', send);
  window.addEventListener('resize', send);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(send);
  document.addEventListener('load', function(e){ if (e.target.tagName === 'IMG') send(); }, true);
  setTimeout(send, 1500);
})();
