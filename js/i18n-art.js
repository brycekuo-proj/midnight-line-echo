/* Readable English evidence without editing the source image bytes. */
(function () {
  'use strict';
  if (ECHO_I18N.language !== 'en') return;
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lb-img');
  const reader = document.createElement('article');
  reader.className = 'english-evidence-reader';
  reader.hidden = true;
  // The lightbox still closes anywhere, exactly as before.
  image.after(reader);
  function update() {
    const basename = image.getAttribute('src')?.split('/').pop().split('?')[0];
    const entry = window.ECHO_EN_ART[basename];
    reader.replaceChildren();
    reader.hidden = !entry;
    image.classList.toggle('has-english-reading', !!entry);
    if (!entry) return;
    const title = document.createElement('h2'); title.textContent = entry.title; reader.append(title);
    if (entry.photo) {
      const crop = document.createElement('div');
      crop.className = 'english-news-photo';
      crop.style.backgroundImage = 'url("' + image.src + '")';
      crop.setAttribute('role', 'img');
      crop.setAttribute('aria-label', 'Lin Yuqing and the final underpass CCTV image');
      reader.append(crop);
    }
    entry.paragraphs.forEach(text => { const p = document.createElement('p'); p.textContent = text; reader.append(p); });
  }
  new MutationObserver(update).observe(image, {attributes:true, attributeFilter:['src']});
  update();
})();
