/* ============================================================
   Alignment Key — Level 1 cohort promo
   Desktop (>=768px): corner card, bottom-right.
   Mobile  (<768px):  compact bottom bar -> tap opens bottom sheet.
   Shows once the visitor scrolls ~50% of the page. Dismiss hides it
   for 7 days. Cohort info is read from certifications-data.js
   (window.AK_CERTIFICATIONS), so it stays in sync with the
   admin-certifications.html panel.
   Include on a page with:
     <script src="certifications-data.js"></script>
     <script src="assets/ak-cohort-promo.js" defer></script>
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'ak_cohort_promo_dismissed';
  var DAYS = 7;
  var SCROLL_TRIGGER = 0.5;
  var BOOK_URL = 'book-a-call.html';
  var COHORTS_URL = 'upcoming-certifications.html';

  try {
    var d = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (d && Date.now() - d < DAYS * 864e5) return;
  } catch (e) {}

  var MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  function parseDate(s) {
    var m = /^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec(String(s || '').trim());
    if (!m || MONTHS[m[2].toLowerCase()] === undefined) return null;
    return new Date(+m[3], MONTHS[m[2].toLowerCase()], +m[1]);
  }
  function meta(c, k) {
    var r = (c.meta || []).filter(function (x) { return x.k === k; })[0];
    return r ? r.v : '';
  }
  function pickCohort() {
    var list = window.AK_CERTIFICATIONS || [];
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var open = list.filter(function (c) {
      var dt = parseDate(meta(c, 'Starts'));
      return String(c.level) === '1' && dt && dt >= today;
    }).sort(function (a, b) { return parseDate(meta(a, 'Starts')) - parseDate(meta(b, 'Starts')); });
    return open[0] || null;
  }

  var c = pickCohort();
  var status = c && c.status && c.status.label ? c.status.label : 'Enrolling soon';
  var starts = c ? meta(c, 'Starts') : '';
  var lang = c ? meta(c, 'Language') : '';
  var fmt = c ? meta(c, 'Format') : '';
  var sched = c ? meta(c, 'Schedule') : '';
  var size = c ? meta(c, 'Cohort Size') : '';
  var sub = c
    ? 'Next cohort starts ' + starts + [fmt, lang].filter(Boolean).map(function (x) { return ' · ' + x; }).join('')
    : 'New Level 1 cohorts are opening soon';
  var barLine = c ? 'Next cohort: ' + starts : 'New cohorts opening soon';
  var infoBox = c
    ? '<b>Small live cohorts</b>' + (size ? ' · ' + size.replace(/^Max/i, 'max') + ' participants' : '') + (sched ? '<br>' + sched : '')
    : '<b>Small live cohorts</b> · see upcoming dates';

  var css = '' +
    '.akp,.akp *{box-sizing:border-box;font-family:Rubik,system-ui,-apple-system,sans-serif}' +
    '.akp a{text-decoration:none}' +
    '.akp-dot{width:7px;height:7px;border-radius:50%;background:#E01020;box-shadow:0 0 0 3px rgba(224,16,32,.22);flex:none}' +
    '.akp-pill{display:inline-flex;gap:6px;align-items:center;background:#DBB100;color:#1E1E1E;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:5px 10px;border-radius:999px}' +
    '.akp-x{position:absolute;top:12px;right:14px;width:30px;height:30px;border:0;border-radius:50%;background:rgba(255,255,255,.18);color:#fff;font-size:15px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}' +
    '.akp-x:hover{background:rgba(255,255,255,.3)}' +
    '.akp-top{background:linear-gradient(135deg,#0E6E78,#137780 60%,#1d8d96);color:#fff;padding:18px 20px 16px;position:relative}' +
    '.akp-top h4{font-size:20px;font-weight:600;line-height:1.25;margin:12px 0 0;color:#fff}' +
    '.akp-sub{font-size:13px;opacity:.9;margin-top:6px}' +
    '.akp-body{padding:16px 20px 18px;background:#fff}' +
    '.akp-li{display:flex;gap:10px;align-items:center;font-size:13.5px;color:#333;padding:5px 0;margin:0}' +
    '.akp-ck{width:20px;height:20px;border-radius:50%;background:#e7f2f3;color:#0E6E78;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none}' +
    '.akp-info{margin:12px 0 14px;background:#F3F3F3;border-radius:10px;padding:10px 12px;font-size:12.5px;line-height:1.5;color:#333}' +
    '.akp-btn{display:block;text-align:center;background:#E0A81E;color:#1E1E1E !important;font-weight:600;font-size:15px;padding:13px;border-radius:999px;transition:background .2s}' +
    '.akp-btn:hover{background:#DBB100}' +
    '.akp-btn2{display:block;text-align:center;color:#0E6E78 !important;font-weight:500;font-size:13.5px;padding:10px 0 0}' +
    '.akp-btn2:hover{text-decoration:underline}' +
    '.akp-adv{display:flex;align-items:center;gap:10px;border-top:1px solid #E3E3E1;margin-top:14px;padding-top:12px;font-size:12px;line-height:1.45;color:#777}' +
    '.akp-av{display:flex;flex:none}.akp-av span{width:30px;height:30px;border-radius:50%;border:2px solid #fff;background:#92C0C4;color:#0E6E78;font-weight:600;font-size:11px;display:flex;align-items:center;justify-content:center}' +
    '.akp-av span+span{margin-left:-9px;background:#0E6E78;color:#fff}' +
    /* desktop card */
    '.akp-card{position:fixed;right:28px;bottom:28px;width:372px;max-width:calc(100vw - 32px);border-radius:18px;overflow:hidden;z-index:9990;border:1px solid #E3E3E1;box-shadow:0 24px 60px rgba(14,110,120,.28),0 4px 14px rgba(0,0,0,.08);transform:translateY(24px);opacity:0;transition:transform .45s ease,opacity .45s ease;pointer-events:none}' +
    '.akp-card.show{transform:none;opacity:1;pointer-events:auto}' +
    /* mobile bar */
    '.akp-bar{position:fixed;left:10px;right:10px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:9990;background:#0E6E78;color:#fff;border-radius:16px;padding:10px 10px 10px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 12px 30px rgba(14,110,120,.35);transform:translateY(140%);transition:transform .4s ease;cursor:pointer}' +
    '.akp-bar.show{transform:none}' +
    '.akp-bar .t{flex:1;min-width:0}' +
    '.akp-bar .l1{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#DBB100;display:flex;align-items:center;gap:6px}' +
    '.akp-bar .l2{font-size:14px;font-weight:600;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.akp-bar .b{background:#E0A81E;color:#1E1E1E !important;font-weight:600;font-size:13.5px;padding:10px 14px;border-radius:999px;white-space:nowrap}' +
    '.akp-bar .x{position:static;width:28px;height:28px;flex:none}' +
    /* mobile sheet */
    '.akp-ov{position:fixed;inset:0;background:rgba(14,40,44,.55);z-index:9991;opacity:0;pointer-events:none;transition:opacity .3s}' +
    '.akp-ov.show{opacity:1;pointer-events:auto}' +
    '.akp-sheet{position:fixed;left:0;right:0;bottom:0;z-index:9992;border-radius:22px 22px 0 0;overflow:hidden;box-shadow:0 -10px 40px rgba(0,0,0,.25);transform:translateY(105%);transition:transform .35s ease;max-height:92vh;overflow-y:auto;background:#fff}' +
    '.akp-sheet.show{transform:none}' +
    '.akp-sheet .akp-top{padding-top:12px}' +
    '.akp-sheet .akp-x{top:22px;right:16px}' +
    '.akp-sheet .akp-body{padding-bottom:calc(22px + env(safe-area-inset-bottom,0px))}' +
    '.akp-sheet .akp-btn{font-size:16px;padding:15px}' +
    '.akp-sheet .akp-li{font-size:14px}' +
    '.akp-grab{width:44px;height:5px;border-radius:9px;background:rgba(255,255,255,.55);margin:0 auto 12px}' +
    '@media(prefers-reduced-motion:reduce){.akp-card,.akp-bar,.akp-sheet,.akp-ov{transition:none}}';

  function contentHTML(isSheet) {
    return '' +
      '<div class="akp-top">' + (isSheet ? '<div class="akp-grab" aria-hidden="true"></div>' : '') +
      '<button type="button" class="akp-x" data-akp="' + (isSheet ? 'close-sheet' : 'dismiss') + '" aria-label="Close">✕</button>' +
      '<span class="akp-pill"><span class="akp-dot"></span>Level 1 · ' + status + '</span>' +
      '<h4>Become a PathKEY Certified Coach</h4>' +
      '<div class="akp-sub">' + sub + '</div></div>' +
      '<div class="akp-body">' +
      '<p class="akp-li"><span class="akp-ck">✓</span>16 ICF CCE credits (11 CC + 5 RD)</p>' +
      '<p class="akp-li"><span class="akp-ck">✓</span>Ready-to-use reports, tools &amp; PathKEY AI</p>' +
      '<p class="akp-li"><span class="akp-ck">✓</span>Join 41+ certified coaches in 16 countries</p>' +
      '<div class="akp-info">' + infoBox + '</div>' +
      '<a class="akp-btn" href="' + BOOK_URL + '" data-akp="cta">Book a 30-min call →</a>' +
      '<a class="akp-btn2" href="' + COHORTS_URL + '" data-akp="cohorts">View cohort dates &amp; pricing</a>' +
      '<div class="akp-adv"><div class="akp-av" aria-hidden="true"><span>B</span><span>D</span></div>Talk directly with founders Banu &amp; Dinçer — no sales pressure.</div>' +
      '</div>';
  }

  function track(ev) {
    try { (window.dataLayer = window.dataLayer || []).push({ event: 'ak_cohort_promo', akp_action: ev, akp_page: location.pathname }); } catch (e) {}
  }
  function remember() { try { localStorage.setItem(KEY, JSON.stringify(Date.now())); } catch (e) {} }

  var isMobile = window.matchMedia('(max-width: 767px)').matches;
  var root, card, bar, sheet, ov, shown = false;

  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    root = document.createElement('div'); root.className = 'akp';
    if (!isMobile) {
      root.innerHTML = '<div class="akp-card" role="dialog" aria-label="Level 1 certification">' + contentHTML(false) + '</div>';
      card = root.firstChild;
    } else {
      root.innerHTML =
        '<div class="akp-bar" role="button" tabindex="0" aria-label="Level 1 certification details">' +
          '<div class="t"><div class="l1"><span class="akp-dot"></span>Level 1 · ' + status + '</div><div class="l2">' + barLine + '</div></div>' +
          '<a class="b" href="' + BOOK_URL + '" data-akp="cta">Book a call</a>' +
          '<button type="button" class="akp-x x" data-akp="dismiss" aria-label="Close">✕</button>' +
        '</div>' +
        '<div class="akp-ov" data-akp="close-sheet"></div>' +
        '<div class="akp-sheet" role="dialog" aria-modal="true" aria-label="Level 1 certification">' + contentHTML(true) + '</div>';
      bar = root.querySelector('.akp-bar'); ov = root.querySelector('.akp-ov'); sheet = root.querySelector('.akp-sheet');
    }
    document.body.appendChild(root);

    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-akp]');
      if (t) {
        var a = t.getAttribute('data-akp');
        if (a === 'dismiss') { e.stopPropagation(); dismiss(); return; }
        if (a === 'close-sheet') { closeSheet(); return; }
        if (a === 'cta' || a === 'cohorts') { track(a); remember(); return; }
      }
      if (bar && e.target.closest('.akp-bar')) openSheet();
    });
    if (bar) bar.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (sheet && sheet.classList.contains('show')) closeSheet(); else if (shown) dismiss(); } });

    if (sheet) { /* swipe down to close */
      var y0 = null;
      sheet.addEventListener('touchstart', function (e) { if (sheet.scrollTop <= 0) y0 = e.touches[0].clientY; }, { passive: true });
      sheet.addEventListener('touchmove', function (e) {
        if (y0 === null) return; var dy = e.touches[0].clientY - y0;
        if (dy > 0) sheet.style.transform = 'translateY(' + dy + 'px)';
      }, { passive: true });
      sheet.addEventListener('touchend', function (e) {
        if (y0 === null) return; var dy = e.changedTouches[0].clientY - y0; y0 = null;
        sheet.style.transform = ''; if (dy > 90) closeSheet();
      });
    }
  }

  function show() {
    if (shown) return; shown = true; build();
    requestAnimationFrame(function () { requestAnimationFrame(function () { (card || bar).classList.add('show'); }); });
    track('view');
  }
  function dismiss() {
    remember(); track('dismiss');
    if (sheet) { sheet.classList.remove('show'); ov.classList.remove('show'); document.documentElement.style.overflow = ''; }
    (card || bar).classList.remove('show');
    setTimeout(function () { if (root && root.parentNode) root.parentNode.removeChild(root); }, 500);
    removeEventListener('scroll', onScroll);
  }
  function openSheet() {
    bar.classList.remove('show'); ov.classList.add('show'); sheet.classList.add('show');
    document.documentElement.style.overflow = 'hidden'; track('open_sheet');
  }
  function closeSheet() {
    sheet.classList.remove('show'); ov.classList.remove('show'); bar.classList.add('show');
    document.documentElement.style.overflow = '';
  }

  function cookieBannerOpen() {
    var b = document.getElementById('ak-cookie-banner');
    return b && b.classList.contains('show');
  }
  function onScroll() {
    if (shown) return;
    var h = document.documentElement.scrollHeight - innerHeight;
    if (h > 0 && scrollY / h >= SCROLL_TRIGGER && !cookieBannerOpen()) show();
  }
  addEventListener('scroll', onScroll, { passive: true });
})();
