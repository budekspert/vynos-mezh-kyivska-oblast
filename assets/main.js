/* ════════════════════════════════════════
   ВИНОС МЕЖ — JavaScript (виправлено, Команда-1)
   ─────────────────────────────────────────
   [К-1] Виправлено синтаксичну помилку CAD_PARTS
   [К-1] Видалено мертвий/невикористовуваний код (модальні вікна)
   [К-1] Додано canvas-анімацію, doSubmit(), formatCadNum(), toggleFaq()
         відповідно до реальної розмітки всіх сторінок сайту
   [К-2] Пауза canvas на прихованій вкладці
   [К-2] Debounce resize → менше перерахунків
   [К-3] Адаптивна щільність частинок для мобільних
════════════════════════════════════════ */

/* ═══ CANVAS — частинки на фоні ═══ */
(function () {
  var c = document.getElementById('cvs');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H, pts = [];
  var animId = null;
  var paused = false;

  function getParticleDensity() {
    return window.innerWidth < 768 ? 32000 : 22000;
  }

  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  }

  function init() {
    pts = [];
    var n = Math.max(20, Math.floor((W * H) / getParticleDensity()));
    if (window.innerWidth < 768) n = Math.min(n, 30);
    for (var i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.2 + 0.4,
        a: Math.random() * 0.5 + 0.2
      });
    }
  }

  function getConnectionDist() {
    return window.innerWidth < 768 ? 80 : 120;
  }

  function frame() {
    if (paused) return;
    animId = requestAnimationFrame(frame);

    ctx.fillStyle = '#07090F';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(212,168,67,0.04)';
    ctx.lineWidth = 1;
    for (var x = 0; x < W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (var y = 0; y < H; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    var dist = getConnectionDist();
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < dist) {
          ctx.strokeStyle = 'rgba(212,168,67,' + ((1 - d / dist) * 0.10) + ')';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    pts.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,168,67,' + p.a + ')';
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
  }

  function startAnim() {
    if (!paused && !animId) animId = requestAnimationFrame(frame);
  }

  function stopAnim() {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { paused = true; stopAnim(); }
    else { paused = false; startAnim(); }
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { resize(); init(); }, 200);
  });

  resize();
  init();
  frame();
})();

/* ═══ UTM city — безпечно, з білим списком ═══ */
document.addEventListener('DOMContentLoaded', function () {
  var ALLOWED_CITIES = {
    'kyiv': 'Києві',
    'kyivska': 'Київській області',
    'vasylkiv': 'Василькові',
    'bila-cerkva': 'Білій Церкві',
    'fastiv': 'Фастові',
    'obukhiv': 'Обухові'
  };

  var urlParams = new URLSearchParams(window.location.search);
  var cityParam = urlParams.get('utm_city');

  if (cityParam && ALLOWED_CITIES[cityParam.toLowerCase()]) {
    var cityName = ALLOWED_CITIES[cityParam.toLowerCase()];
    var h1 = document.querySelector('h1[data-utm]');
    if (h1) {
      h1.innerHTML = 'Винесення меж<br><em>земельної ділянки</em><br>в ' + cityName;
    }
    document.title = 'Винесення меж в ' + cityName + ' | ВиносМеж';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        'content',
        'Винесення меж земельної ділянки в ' + cityName +
        '. Сертифіковані інженери з GPS RTK. Офіційний акт. ☎ 096 121 09 06'
      );
    }
  }
});

/* ═══ FAQ — розгортання ═══ */
function toggleFaq(el) {
  el.classList.toggle('open');
}

/* ═══ Кадастровий номер — автоформат 10:2:3:4 ═══ */
var CAD_PARTS = [10, 2, 3, 4];
function formatCadNum(input) {
  var digits = input.value.replace(/\D/g, '');
  if (digits.length > 19) digits = digits.slice(0, 19);
  var result = '';
  var pos = 0;
  for (var i = 0; i < CAD_PARTS.length; i++) {
    var chunk = digits.slice(pos, pos + CAD_PARTS[i]);
    if (!chunk) break;
    result += (i > 0 ? ':' : '') + chunk;
    pos += CAD_PARTS[i];
  }
  input.value = result;
}

/* ═══ Inline-помилки валідації ═══ */
function showFieldError(fieldId, msg) {
  clearFieldError(fieldId);
  var field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = 'rgba(235,87,87,0.7)';
  field.style.boxShadow = '0 0 0 3px rgba(235,87,87,0.12)';
  var err = document.createElement('div');
  err.className = 'field-error';
  err.id = fieldId + '-error';
  err.setAttribute('role', 'alert');
  err.textContent = msg;
  err.style.cssText = [
    "font-family:'JetBrains Mono',monospace",
    'font-size:10px',
    'color:rgba(235,87,87,0.9)',
    'margin-top:5px',
    'letter-spacing:0.3px'
  ].join(';');
  field.parentNode.appendChild(err);
  field.focus();
}

function clearFieldError(fieldId) {
  var field = document.getElementById(fieldId);
  if (field) { field.style.borderColor = ''; field.style.boxShadow = ''; }
  var errEl = document.getElementById(fieldId + '-error');
  if (errEl) errEl.remove();
}

function clearAllErrors() {
  ['fname', 'fphone', 'fcadnum'].forEach(clearFieldError);
}

/* ═══ Submit форми (Web3Forms) ═══ */
function doSubmit() {
  clearAllErrors();

  var nameEl = document.getElementById('fname');
  var phoneEl = document.getElementById('fphone');
  var serviceEl = document.getElementById('fservice');
  var cityEl = document.getElementById('fcity');
  var cadEl = document.getElementById('fcadnum');
  var commentEl = document.getElementById('fcomment');

  var name = nameEl ? nameEl.value.trim() : '';
  var phone = phoneEl ? phoneEl.value.trim() : '';
  var service = serviceEl ? serviceEl.value.trim() : '';
  var city = cityEl ? cityEl.value.trim() : '';
  var cad = cadEl ? cadEl.value.trim() : '';
  var comment = commentEl ? commentEl.value.trim() : '';

  var hasErrors = false;

  if (!name) {
    showFieldError('fname', "⚠ Вкажіть ваше ім'я");
    hasErrors = true;
  }
  if (!phone) {
    showFieldError('fphone', '⚠ Вкажіть номер телефону');
    hasErrors = true;
  } else if (phone.replace(/\D/g, '').length < 10) {
    showFieldError('fphone', '⚠ Перевірте номер телефону');
    hasErrors = true;
  }
  if (cad && cad.replace(/\D/g, '').length !== 19) {
    showFieldError('fcadnum', '⚠ Кадастровий номер — 19 цифр: 1234567890:12:345:6789');
    hasErrors = true;
  }

  if (hasErrors) return;

  var formData = {
    access_key: '7a7c94a8-8935-4659-88d0-1e900cb9460b',
    subject: 'Нова заявка з сайту ВиносМеж',
    from_name: 'ВиносМеж (vynosmezh.com.ua)',
    name: name,
    phone: phone,
    service: service || 'не вибрано',
    city: city || 'не вказано',
    cadastral: cad || 'не вказано',
    message: comment || 'без коментаря',
    page: window.location.pathname || '/'
  };

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
    .then(function (r) { return r.json(); })
    .then(function (d) { console.log('Web3Forms:', d); })
    .catch(function (e) { console.log('Web3Forms error:', e); });

  var formBlock = document.getElementById('formBlock');
  var successBlock = document.getElementById('successBlock');
  if (formBlock) formBlock.style.display = 'none';
  if (successBlock) {
    successBlock.style.display = 'block';
    successBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
