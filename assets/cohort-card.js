/* Alignment Key — shared cohort card renderer.
   Used by upcoming-certifications.html (public) and admin-certifications.html (preview). */
(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function initials(name) {
    var p = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!p.length) return '?';
    return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  }
  var CCE_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" stroke="#137780" stroke-width="2" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="#DBB100" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function cardHTML(c, opts) {
    opts = opts || {};
    var t = c.trainer || {};
    var lvl = String(c.level || '1');
    var lang = String(c.language || '').toLowerCase();
    var tone = (c.status && c.status.tone) || 'open';
    var avatar = t.photo
      ? '<span class="t-avatar"><img src="' + esc(t.photo) + '" alt="' + esc(t.name) + '"></span>'
      : '<span class="t-avatar">' + esc(t.initials || initials(t.name)) + '</span>';
    var tname = t.profileUrl
      ? '<a href="' + esc(t.profileUrl) + '">' + esc(t.name) + '</a>'
      : (t.name ? esc(t.name) : 'Trainer to be announced');

    var meta = (c.meta || []).filter(function (m) { return (m.k || '').trim() || (m.v || '').trim(); })
      .map(function (m) {
        var v = esc(m.v);
        if (t.profileUrl && (m.k || '').trim().toLowerCase() === 'trainer' && (m.v || '').trim() === (t.name || '').trim()) {
          v = '<a class="t-link" href="' + esc(t.profileUrl) + '">' + v + '</a>';
        }
        return '<div class="m"><div class="k">' + esc(m.k) + '</div><div class="v">' + v + '</div></div>';
      }).join('');

    var isExt = function (u) { return /^https?:\/\//i.test(u || ''); };
    var ctas = '';
    var p = c.primaryCta || {};
    if (p.label && p.url) {
      ctas += '<a class="btn btn-' + (p.style === 'out' ? 'out' : 'gold') + '" href="' + esc(p.url) + '"' +
        (isExt(p.url) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(p.label) + ' <span class="arrow">\u2192</span></a>';
    }
    var s = c.secondaryCta || {};
    if (s.label && s.url) {
      ctas += '<a class="btn btn-out" href="' + esc(s.url) + '"' +
        (isExt(s.url) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(s.label) + '</a>';
    }

    return '<article class="cohort' + (c.featured ? ' featured' : '') + (opts.noReveal ? '' : ' reveal') +
      '" data-level="' + esc(lvl) + '" data-lang="' + esc(lang) + '">' +
      '<div class="cohort-media">' +
      '<span class="lvl-tag' + (lvl === '2' ? ' l2' : '') + '">Level ' + esc(lvl) + '</span>' +
      '<div class="trainer">' + avatar +
      '<div class="t-info"><div class="tn">' + tname + '</div><div class="tr">' + esc(t.role || 'PathKEY Trainer') + '</div></div>' +
      '</div></div>' +
      '<div class="cohort-body">' +
      '<div class="cohort-head"><div><h3>' + esc(c.title) + '</h3>' +
      (c.outcome ? '<div class="outcome">' + esc(c.outcome) + '</div>' : '') + '</div>' +
      (c.status && c.status.label ? '<span class="status ' + esc(tone) + '">' + esc(c.status.label) + '</span>' : '') +
      '</div>' +
      (c.description ? '<p class="cohort-desc">' + esc(c.description) + '</p>' : '') +
      (meta ? '<div class="cohort-meta">' + meta + '</div>' : '') +
      '<div class="cohort-foot">' +
      '<div class="cohort-price"><div class="pv">' + esc((c.price || {}).value) + '</div>' +
      '<div class="pn">' + esc((c.price || {}).note) + '</div></div>' + ctas +
      '</div>' +
      (c.smallprint ? '<div class="smallprint">' + esc(c.smallprint) + '</div>' : '') +
      (c.icfBadge ? '<div class="cce-badge">' + CCE_SVG + 'ICF CCE Eligible</div>' : '') +
      '</div></article>';
  }

  window.akCohortCardHTML = cardHTML;
  window.akCohortInitials = initials;
})();
