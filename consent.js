/* Melenja — çerez/rıza bandı. TEK KAYNAK: dört sayfa da bunu yükler.
 *
 * Neden ayrı dosya: bant önce yalnızca index.html'e satır içi konmuştu. Gizlilik,
 * Koşullar ve KVKK sayfalarına doğrudan gelen ziyaretçi (e-postadaki link, arama
 * sonucu) bandı hiç görmüyordu — oysa GA4 kurulumunda Google'a "kullanıcılarımdan
 * izin aldım" beyanı verildi; beyanın doğru kalması için rıza HER giriş sayfasından
 * alınabilmeli. Dört kopya markup senkron tutulamaz (bu depoda sabitin sınır ötesi
 * kopyalanması defalarca sessiz arızaya yol açtı), bu yüzden tek dosya.
 *
 * Sözleşme: window.melenjaConsent = { necessary, analytics, marketing }
 *   · necessary  her zaman true (oturum/güvenlik çerezi)
 *   · analytics/marketing YALNIZCA açık kabulle true olur
 * Karar değişince `melenja:consent` olayı yayılır.
 *
 * ⛔ GA4 ya da herhangi bir ölçüm etiketi eklenirken: etiketi DOĞRUDAN yükleme.
 *    window.melenjaConsent.analytics true olana kadar bekle, ya da
 *    document.addEventListener('melenja:consent', ...) ile dinle.
 *    Şu an sitede hiç ölçüm etiketi YOK; bu bant ileriye dönük kilittir.
 */
(function () {
  var KEY = 'melenja_cookie_consent';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (_) {}

  window.melenjaConsent = {
    necessary: true,
    analytics: saved === 'accepted',
    marketing: saved === 'accepted'
  };

  function setConsent(choice) {
    var accepted = choice === 'accepted';
    window.melenjaConsent.analytics = accepted;
    window.melenjaConsent.marketing = accepted;
    try { localStorage.setItem(KEY, choice); } catch (_) {}
    var box = document.getElementById('cookieConsent');
    if (box) box.hidden = true;
    document.dispatchEvent(new CustomEvent('melenja:consent', { detail: window.melenjaConsent }));
  }

  function kur() {
    if (document.getElementById('cookieConsent')) return;   // iki kez kurulmasın
    var box = document.createElement('div');
    box.className = 'cookie-consent';
    box.id = 'cookieConsent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-label', 'Çerez tercihi');
    box.hidden = !!saved;                                    // karar verilmişse gösterme
    box.innerHTML =
      '<div>' +
        '<b>Çerez tercihi</b>' +
        '<p>Zorunlu çerezler siteyi çalıştırır. Analitik ve pazarlama çerezleri yalnızca ' +
        'izin verirsen kullanılır. Detaylar için <a href="/gizlilik.html">Gizlilik</a> ve ' +
        '<a href="/kvkk.html">KVKK</a>.</p>' +
      '</div>' +
      '<div class="cookie-actions">' +
        '<button class="btn btn-line" type="button" data-cookie-choice="reject">Reddet</button>' +
        '<button class="btn btn-dark" type="button" data-cookie-choice="accept">Kabul et</button>' +
      '</div>';
    document.body.appendChild(box);
    box.querySelectorAll('[data-cookie-choice]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setConsent(btn.getAttribute('data-cookie-choice') === 'accept' ? 'accepted' : 'rejected');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', kur);
  } else {
    kur();
  }
})();
