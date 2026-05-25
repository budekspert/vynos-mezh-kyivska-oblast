/* ════════════════════════════════════════
   ВИНОС МЕЖ — JavaScript
   Canvas + UTM + FAQ + кадастр + форма
════════════════════════════════════════ */

/* ═══ CANVAS — частинки на фоні ═══ */
(function(){
  const c = document.getElementById('cvs');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, pts = [];

  function resize(){
    W = c.width  = window.innerWidth;
    H = c.height = window.innerHeight;
  }

  function init(){
    pts = [];
    const n = Math.max(25, Math.floor(W * H / 22000));
    for(let i=0;i<n;i++){
      pts.push({
        x: Math.random()*W, y: Math.random()*H,
        vx:(Math.random()-.5)*.2, vy:(Math.random()-.5)*.2,
        r: Math.random()*1.2+.4,
        a: Math.random()*.5+.2
      });
    }
  }

  function frame(){
    ctx.fillStyle = '#07090F';
    ctx.fillRect(0,0,W,H);

    /* сітка */
    ctx.strokeStyle='rgba(212,168,67,0.04)';
    ctx.lineWidth=1;
    for(let x=0;x<W;x+=60){ ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke(); }
    for(let y=0;y<H;y+=60){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke(); }

    /* з'єднання між точками */
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          ctx.strokeStyle='rgba(212,168,67,'+((1-d/120)*.10)+')';
          ctx.lineWidth=.7;
          ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();
        }
      }
    }

    /* точки */
    pts.forEach(function(p){
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(212,168,67,'+p.a+')'; ctx.fill();
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
    });

    requestAnimationFrame(frame);
  }

  resize(); init(); frame();
  window.addEventListener('resize',function(){resize();init();});
})();

/* ═══ UTM city — БЕЗПЕЧНО з білим списком ═══ */
document.addEventListener('DOMContentLoaded', function() {
  /* Білий список — тільки ці міста можуть з'явитись на сайті */
  var ALLOWED_CITIES = {
    'kyiv':            'Києві',
    'kyivska':         'Київській області',
    'vasylkiv':        'Василькові',
    'bila-cerkva':     'Білій Церкві',
    'boryspil':        'Борисполі',
    'fastiv':          'Фастові',
    'obukhiv':         'Обухові',
    'bucha':           'Бучі',
    'brovary':         'Броварах',
    'vyshhorod':       'Вишгороді',
    'irpin':           'Ірпені'
  };

  var urlParams = new URLSearchParams(window.location.search);
  var cityParam = urlParams.get('utm_city');

  if (cityParam && ALLOWED_CITIES[cityParam.toLowerCase()]) {
    var cityName = ALLOWED_CITIES[cityParam.toLowerCase()];
    var h1 = document.querySelector('h1[data-utm]');
    if (h1) {
      h1.innerHTML = 'Винос меж<br><em>земельної ділянки</em><br>в ' + cityName;
    }
    document.title = 'Винос меж в ' + cityName + ' | ВиносМеж';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute('content',
        'Винос меж земельної ділянки в ' + cityName +
        '. Сертифіковані інженери з GPS RTK. Офіційний акт. ☎ 096 121 09 06'
      );
    }
  }
});

/* ═══ FAQ — розгортання ═══ */
function toggleFaq(el){
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

/* ═══ Submit форми (Web3Forms) ═══ */
function doSubmit(){
  var name = document.getElementById('fname').value.trim();
  var phone = document.getElementById('fphone').value.trim();
  var service = document.getElementById('fservice').value.trim();
  var city = document.getElementById('fcity').value.trim();
  var cad = document.getElementById('fcadnum').value.trim();
  var comment = document.getElementById('fcomment').value.trim();

  if(!name || !phone){
    alert("Будь ласка, вкажіть ім'я та телефон");
    return;
  }

  /* Перевірка кадастру — або повний, або порожній */
  if(cad && cad.replace(/\D/g,'').length !== 19){
    alert("Кадастровий номер має містити 19 цифр у форматі 1234567890:12:345:6789");
    document.getElementById('fcadnum').focus();
    return;
  }

  var formData = {
    access_key: "7a7c94a8-8935-4659-88d0-1e900cb9460b",
    subject: "Нова заявка з сайту ВиносМеж",
    from_name: "ВиносМеж (vynosmezh.com.ua)",
    name: name,
    phone: phone,
    service: service || "не вибрано",
    city: city || "не вказано",
    cadastral: cad || "не вказано",
    message: comment || "без коментаря",
    page: window.location.pathname || "/"
  };

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(formData)
  }).then(function(r){ return r.json(); })
    .then(function(d){ console.log("Web3Forms:", d); })
    .catch(function(e){ console.log("Web3Forms error:", e); });

  document.getElementById('formBlock').style.display = 'none';
  document.getElementById('successBlock').style.display = 'block';
  document.getElementById('successBlock').scrollIntoView({behavior:'smooth', block:'center'});
}
