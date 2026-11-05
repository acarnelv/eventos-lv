/* Versión AMP (cuando se entra al artículo desde Google): AMP no entiende
   iframeResizer, así que además le enviamos la altura en su propio formato. */
(function(){
  if (window.parent === window) return;
  var last = 0;
  function send(){
    var h = Math.ceil(document.documentElement.scrollHeight);
    if (h === last) return; last = h;
    window.parent.postMessage({sentinel:'amp', type:'embed-size', height:h}, '*');
  }
  window.addEventListener('load', send);
  window.addEventListener('resize', send);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(send);
  setTimeout(send, 1500);
})();
