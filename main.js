/* Inflorax — Main JavaScript */
/* ================================ */

/* ══ CURSOR ══ */
/* Custom cursor — pointer devices only */
var cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
if(cur && ring && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  var mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;
  document.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    cur.style.left=mx+'px';cur.style.top=my+'px';
  },{passive:true});
  (function animRing(){
    rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  })();
} else {
  if(cur)cur.style.display='none';
  if(ring)ring.style.display='none';
}

/* ══ RIPPLE on buttons ══ */
function addRipple(e,btn){
  var r=document.createElement('span');r.className='ripple';
  var rect=btn.getBoundingClientRect(),size=Math.max(rect.width,rect.height);
  var cx=e.clientX||e.touches&&e.touches[0].clientX||rect.left+rect.width/2;
  var cy=e.clientY||e.touches&&e.touches[0].clientY||rect.top+rect.height/2;
  r.style.cssText='width:'+size+'px;height:'+size+'px;left:'+(cx-rect.left-size/2)+'px;top:'+(cy-rect.top-size/2)+'px';
  btn.appendChild(r);setTimeout(function(){r.remove()},600);
}
document.addEventListener('click',function(e){
  var btn=e.target.closest('.bg,.bo,.pct,.mgo');
  if(btn)addRipple(e,btn);
});

/* ══ SCROLL PROGRESS ══ */
var prog=document.getElementById('scroll-prog');
function updateProg(){
  var s=document.documentElement.scrollTop||document.body.scrollTop;
  var h=document.documentElement.scrollHeight-document.documentElement.clientHeight;
  if(prog)prog.style.width=(h>0?(s/h*100):0)+'%';
}
window.addEventListener('scroll',updateProg,{passive:true});

/* ══ NAV SCROLL ══ */
var navEl=document.querySelector('nav');
window.addEventListener('scroll',function(){
  if(navEl)navEl.classList.toggle('scrolled',window.scrollY>60);
},{passive:true});

/* ══ PARALLAX on hero background — desktop only ══ */
var shb=document.querySelector('.shb');
if(window.innerWidth>768){
  window.addEventListener('scroll',function(){
    if(!shb)return;
    var s=window.scrollY;
    shb.style.transform='scale(1.12) translateY('+(s*0.22)+'px)';
  },{passive:true});
}

/* ══ MAGNETIC CARDS ══ */
/* Magnetic cards — mouse only (not touch) */
if(window.matchMedia('(hover:hover)').matches){
  document.querySelectorAll('.mag').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var rect=card.getBoundingClientRect();
      var cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
      var dx=(e.clientX-cx)/rect.width*14;
      var dy=(e.clientY-cy)/rect.height*10;
      card.style.transform='translateY(-4px) rotateX('+(-dy)+'deg) rotateY('+(dx)+'deg)';
      card.style.perspective='800px';
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='';
      card.style.perspective='';
    });
  });
}

/* ══ COUNTER ANIMATION ══ */
function animCount(el,target,duration){
  var start=0,step=target/60,frame=duration/60;
  var t=setInterval(function(){
    start+=step;
    if(start>=target){start=target;clearInterval(t);}
    el.textContent=(start<10?Math.round(start):Math.round(start))+(target>=100?'+':target===2?'':'+');
  },frame);
}

/* ══ INTERSECTION OBSERVER — unified ══ */
function initAnim(){
  /* scroll progress */
  updateProg();

  /* reveal animations */
  var revObs=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        en.target.classList.add('in');
        en.target.classList.add('vis');
        revObs.unobserve(en.target);
      }
    });
  },{threshold:0.05,rootMargin:'0px 0px -20px 0px'});

  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.fu').forEach(function(el){
    revObs.observe(el);
  });

  /* counters */
  var cntObs=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        var el=en.target;
        var target=parseInt(el.dataset.target);
        animCount(el,target,1400);
        cntObs.unobserve(el);
      }
    });
  },{threshold:0.5});
  document.querySelectorAll('[data-target]').forEach(function(el){cntObs.observe(el);});

  /* Hero metric live counters */
  function heroCount(id, end, suffix, prefix, dur){
    var el=document.getElementById(id);if(!el)return;
    var start=0,steps=60,inc=end/steps,i=0;
    var t=setInterval(function(){
      i++;start+=inc;
      if(i>=steps){start=end;clearInterval(t);}
      el.textContent=Math.round(start)+(suffix||'');
    },dur/steps);
  }
  function heroCountFloat(id, end, decimals, dur){
    var el=document.getElementById(id);if(!el)return;
    var start=0,steps=60,inc=end/steps,i=0;
    var t=setInterval(function(){
      i++;start+=inc;
      if(i>=steps){start=end;clearInterval(t);}
      el.textContent=start.toFixed(decimals||1);
    },dur/steps);
  }
  setTimeout(function(){
    heroCount('hero-fol',1247,'','+',2000);
    heroCount('hero-reach',142,'','' ,1800);
    heroCount('hero-views',380,'','',2200);
    heroCountFloat('hero-eng',8.4,1,1600);
    heroCount('likes-cnt',24,'K','',1400);
    heroCount('views-cnt',180,'K','',1600);
    heroCount('comm-cnt',432,'','',1200);
    heroCount('reach-cnt',48200,'','',1800);
    heroCount('imp-cnt',94500,'','',2000);
    heroCount('sav-cnt',3812,'','',1600);
  },600);

  /* Cycle the metric cards with new numbers */
  var heroMetrics=[
    {fol:[847,1247,2103,634],reach:[94,142,218,76],eng:[6.2,8.4,11.1,5.7],views:[210,380,520,140]},
  ];
  var metricCycle=0;
  setInterval(function(){
    metricCycle++;
    var f=[847,1247,2103,634,921];
    var r=[94,142,218,76,188];
    var e=[6.2,8.4,11.1,5.7,9.3];
    var v=[210,380,520,140,445];
    var idx=metricCycle%5;
    heroCount('hero-fol',f[idx],'','',800);
    heroCount('hero-reach',r[idx],'','',800);
    heroCountFloat('hero-eng',e[idx],1,800);
    heroCount('hero-views',v[idx],'','',800);
  },3500);


  /* word split on h1 */
  var h1=document.querySelector('#sh .h1');
  if(h1){
    var words=h1.innerHTML.split(/(<br>|<em[^>]*>.*?<\/em>)/);
    h1.innerHTML=words.map(function(w){
      if(!w||w==='<br>')return w||'<br>';
      if(w.startsWith('<em'))return '<span class="word"><span class="word-inner">'+w+'</span></span>';
      return w.split(' ').map(function(wd){
        return wd?'<span class="word"><span class="word-inner">'+wd+'</span></span> ':'';
      }).join('');
    }).join('');
    setTimeout(function(){
      document.querySelectorAll('#sh .word-inner').forEach(function(w,i){
        setTimeout(function(){w.classList.add('in')},i*80+200);
      });
    },300);
  }
}

/* ══ AUTO-INIT on non-intro pages ══ */
if(!document.getElementById('intro')){
  document.addEventListener('DOMContentLoaded', function(){
    document.body.style.overflow='auto';
    document.documentElement.style.overflow='auto';
    initAnim();
  });
}

/* ══ SCROLL-DRIVEN SECTION BACKGROUNDS ══ */
var sections={
  'sh':'#0d1a10','how':'#111e14','pkgs':'#162b1c',
  'stats':'#0d1a10','faqsec':'#111e14','ctasec':'#0a1410'
};
var secObs=new IntersectionObserver(function(entries){
  entries.forEach(function(en){
    if(en.isIntersecting&&en.intersectionRatio>0.3){
      var col=sections[en.target.id];
      if(col)document.getElementById('site').style.backgroundColor=col;
    }
  });
},{threshold:[0.3]});

/* (function(){
  // Particles
*/

(function(){
  /* Intro particles */
  var el=document.getElementById('intro');
  for(var i=0;i<20;i++){
    var p=document.createElement('div');p.className='particle';
    var s=Math.random()*4+2,x=Math.random()*100,d=Math.random()*7,dur=Math.random()*9+7,dx=(Math.random()-.5)*200+'px';
    p.style.cssText='width:'+s+'px;height:'+s+'px;left:'+x+'%;bottom:0px;animation-duration:'+dur+'s;animation-delay:'+d+'s;--dx:'+dx;
    el.appendChild(p);
  }
  /* Auto-enter */
  var t=setTimeout(enter,3000);
  window._introTimer=t;
})();

function enter(){
  clearTimeout(window._introTimer);
  var i=document.getElementById('intro'),s=document.getElementById('site');
  i.classList.add('exiting');
  setTimeout(function(){
    i.style.display='none';
    s.style.position='relative';
    s.style.inset='auto';
    s.style.overflowY='visible';
    s.style.overflowX='hidden';
    s.classList.add('on');
    document.documentElement.style.overflow='auto';
    document.documentElement.style.height='auto';
    document.body.style.overflow='auto';
    document.body.style.height='auto';
    document.body.style.overflowX='hidden';
    window.scrollTo(0,0);
    /* start section observer */
    Object.keys(sections).forEach(function(id){
      var el=document.getElementById(id);
      if(el)secObs.observe(el);
    });
    initAnim();
  },1100);
}

function go(id){var e=document.getElementById(id);if(e)e.scrollIntoView({behavior:'smooth'})}

var mo=false;
function tmenu(){mo=!mo;document.getElementById('mn').classList.toggle('open',mo)}
function cmenu(){mo=false;document.getElementById('mn').classList.remove('open')}

function setP(p,btn){
  document.querySelectorAll('.pt').forEach(function(b){b.classList.remove('on')});btn.classList.add('on');
  document.getElementById('ig').style.display=p==='ig'?'grid':'none';
  document.getElementById('yt').style.display=p==='yt'?'grid':'none';
  /* re-apply magnetic */
  document.querySelectorAll('.mag').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var rect=card.getBoundingClientRect();
      var cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
      card.style.transform='translateY(-4px) rotateX('+(-((e.clientY-cy)/rect.height*10))+'deg) rotateY('+((e.clientX-cx)/rect.width*14)+'deg)';
    });
    card.addEventListener('mouseleave',function(){card.style.transform='';});
  });
}

function tFaq(el){var w=el.classList.contains('open');document.querySelectorAll('.fi').forEach(function(i){i.classList.remove('open')});if(!w)el.classList.add('open')}

var legal={
  terms:{t:'Terms & Conditions',b:'<h3>1. Overview</h3><p>These terms govern your use of Inflorax services. By purchasing, you agree to these terms.</p><h3>2. Results & expectations</h3><p>We do not guarantee specific follower counts, view numbers, or engagement rates. Results vary by account.</p><h3>3. Payments & refunds</h3><p>All payments are final once services have been initiated. Contact us within 7 days of completion for genuine issues.</p><h3>4. Account safety</h3><p>We never require passwords or login credentials.</p><h3>5. Contact</h3><p>hello@inflorax.com</p>'},
  privacy:{t:'Privacy Policy',b:'<h3>1. What we collect</h3><p>Name, email, social media username, and payment details processed via Stripe. We never store card info.</p><h3>2. How we use it</h3><p>To deliver services and communicate about your order. We do not sell your information for marketing.</p><h3>3. Contact</h3><p>hello@inflorax.com</p>'},
  contact:{t:'Contact Us',b:'<h3>Email</h3><p>hello@inflorax.com</p><h3>Response time</h3><p>Within 24 hours, Monday to Friday. For order issues, include your email and package name.</p>'}
};
function oL(k){var d=legal[k];document.getElementById('mt').textContent=d.t;document.getElementById('mb2').innerHTML='<div class="lb">'+d.b+'</div>';document.getElementById('mo').classList.add('open')}

/* ═══════════════════════════════════════════════════════
   STRIPE PAYMENT LINKS
   Replace YOUR_xxx_LINK with your actual Stripe URLs
   from dashboard.stripe.com > Payment Links
═══════════════════════════════════════════════════════ */
var STRIPE_LINKS = {
  'Instagram - Spark':     'https://buy.stripe.com/YOUR_IG_SPARK_LINK',
  'Instagram - Ignite':    'https://buy.stripe.com/YOUR_IG_IGNITE_LINK',
  'Instagram - Momentum':  'https://buy.stripe.com/YOUR_IG_MOMENTUM_LINK',
  'Instagram - Influence': 'https://buy.stripe.com/YOUR_IG_INFLUENCE_LINK',
  'YouTube - Spark':       'https://buy.stripe.com/YOUR_YT_SPARK_LINK',
  'YouTube - Momentum':    'https://buy.stripe.com/YOUR_YT_MOMENTUM_LINK',
  'YouTube - Authority':   'https://buy.stripe.com/YOUR_YT_AUTHORITY_LINK'
};

/* Map full package names to link keys */
function getStripeLink(pkg) {
  var map = {
    'Instagram \u2014 Spark ($79)':       'Instagram - Spark',
    'Instagram \u2014 Ignite ($199)':     'Instagram - Ignite',
    'Instagram \u2014 Momentum ($399)':   'Instagram - Momentum',
    'Instagram \u2014 Influence ($799)':  'Instagram - Influence',
    'YouTube \u2014 Spark ($399)':        'YouTube - Spark',
    'YouTube \u2014 Momentum ($799)':     'YouTube - Momentum',
    'YouTube \u2014 Authority ($1,299)':  'YouTube - Authority'
  };
  var key = map[pkg] || pkg;
  return STRIPE_LINKS[key] || null;
}

function oOB(pkg) {
  var link = getStripeLink(pkg);

  /* Reset modal content */
  document.getElementById('mt').textContent = 'Get started';
  var mb = document.getElementById('mb2');
  mb.innerHTML = '';

  /* Package badge */
  var badge = document.createElement('div');
  badge.className = 'sf-pkg-badge';
  badge.innerHTML = '<span class="sf-pkg-name">' + pkg + '</span>';
  mb.appendChild(badge);

  /* Step indicator */
  var steps = document.createElement('div');
  steps.className = 'sf-steps';
  steps.innerHTML =
    '<div class="sf-step sf-step-active" id="sf-s1"><div class="sf-step-num">1</div><div class="sf-step-label">Your info</div></div>' +
    '<div class="sf-step-line"></div>' +
    '<div class="sf-step" id="sf-s2"><div class="sf-step-num">2</div><div class="sf-step-label">Payment</div></div>';
  mb.appendChild(steps);

  /* Form container */
  var fw = document.createElement('div');
  fw.id = 'sf-form-wrap';

  var p = document.createElement('p');
  p.className = 'msu';
  p.textContent = 'Quick details before checkout \u2014 takes 60 seconds.';
  fw.appendChild(p);

  var form = document.createElement('div');
  form.className = 'mfo';
  form.innerHTML =
    '<div class="mr2">' +
      '<div class="mf2"><label>Full name</label><input type="text" id="mn2" placeholder="Your name" autocomplete="name"></div>' +
      '<div class="mf2"><label>Email</label><input type="email" id="me2" placeholder="you@email.com" autocomplete="email"></div>' +
    '</div>' +
    '<div class="mr2">' +
      '<div class="mf2"><label>Username / link</label><input type="text" id="mu2" placeholder="@handle or URL"></div>' +
      '<div class="mf2"><label>Platform</label><select id="mpl2"><option value="">Select</option><option>Instagram</option><option>YouTube</option></select></div>' +
    '</div>' +
    '<div class="msl">Optional \u2014 helps us tailor your strategy</div>' +
    '<div class="mf2"><label>Content type</label><select><option value="">Select</option><option>Reels / Shorts</option><option>Talking / Educational</option><option>Lifestyle / Daily</option><option>Fashion / Beauty</option><option>Other</option></select></div>' +
    '<div class="mf2"><label>Biggest challenge right now</label><textarea rows="2" placeholder="Be honest \u2014 this helps us help you most."></textarea></div>';

  /* Stripe button */
  var btn = document.createElement('button');
  btn.className = 'mgo stripe-btn';
  btn.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0"><path d="M10 3L14 8L10 13M2 8H14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    'Continue to secure payment';
  btn.addEventListener('click', function() { sOB(pkg, link); });
  form.appendChild(btn);

  /* Trust badges */
  var trust = document.createElement('div');
  trust.className = 'stripe-trust';
  trust.innerHTML =
    '<div class="st-badge"><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 5H13L9.5 7.5L11 12L7 9.5L3 12L4.5 7.5L1 5H5.5L7 1Z" fill="#c9a84c" opacity="0.7"/></svg>Secure checkout via Stripe</div>' +
    '<div class="st-badge"><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="2" y="5" width="10" height="8" rx="1.5" stroke="#c9a84c" stroke-width="1.2" opacity="0.7"/><path d="M4.5 5V3.5a2.5 2.5 0 015 0V5" stroke="#c9a84c" stroke-width="1.2" opacity="0.7"/></svg>256-bit SSL encryption</div>' +
    '<div class="st-badge"><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#c9a84c" stroke-width="1.2" opacity="0.7"/><path d="M5 7l1.5 1.5L9.5 5.5" stroke="#c9a84c" stroke-width="1.3" stroke-linecap="round" opacity="0.7"/></svg>No passwords needed</div>';
  form.appendChild(trust);

  fw.appendChild(form);
  mb.appendChild(fw);

  document.getElementById('mo').classList.add('open');
}

function sOB(pkg, link) {
  var n = document.getElementById('mn2');
  var e = document.getElementById('me2');
  var u = document.getElementById('mu2');
  if (!n || !n.value.trim() || !e || !e.value.trim() || !u || !u.value.trim()) {
    alert('Please fill in your name, email, and username to continue.');
    return;
  }

  /* Advance step indicator */
  var s1 = document.getElementById('sf-s1');
  var s2 = document.getElementById('sf-s2');
  if (s1) { s1.classList.remove('sf-step-active'); s1.classList.add('sf-step-done'); }
  if (s2) { s2.classList.add('sf-step-active'); }

  /* Show spinner */
  var fw = document.getElementById('sf-form-wrap');
  if (fw) {
    fw.innerHTML =
      '<div class="sf-redirecting">' +
        '<div class="sf-spinner"></div>' +
        '<p class="sf-redir-title">Taking you to secure checkout\u2026</p>' +
        '<p class="sf-redir-sub">Powered by Stripe \u00b7 Your card details are never stored</p>' +
        '<div class="sf-pkg-summary">' + pkg + '</div>' +
      '</div>';
  }

  /* Redirect after brief delay */
  setTimeout(function() {
    if (link && link.indexOf('YOUR_') === -1) {
      /* Real link — redirect with prefilled email */
      window.location.href = link +
        '?prefilled_email=' + encodeURIComponent(e.value.trim()) +
        '&client_reference_id=' + encodeURIComponent(u.value.trim());
    } else {
      /* Placeholder — show setup notice */
      if (fw) {
        fw.innerHTML =
          '<div class="ty">' +
            '<div class="tyi" style="font-size:36px">\u2699\ufe0f</div>' +
            '<h3>Almost there!</h3>' +
            '<p>Stripe payment links are not configured yet.</p>' +
            '<p style="margin-top:10px;font-size:12px;color:var(--fa)">Open the HTML file, find <code style="background:rgba(201,168,76,0.1);padding:2px 6px;border-radius:3px">STRIPE_LINKS</code> near the top of the script, and replace each <code style="background:rgba(201,168,76,0.1);padding:2px 6px;border-radius:3px">YOUR_xxx_LINK</code> with your actual Stripe Payment Link URL.</p>' +
            '<p style="margin-top:12px;font-size:11px;color:var(--fa)">Questions? hello@inflorax.com</p>' +
          '</div>';
      }
    }
  }, 1200);
}
function submitAudit(){
  var n=document.getElementById('audit-name'),e=document.getElementById('audit-email'),u=document.getElementById('audit-user');
  if(!n||!n.value.trim()||!e||!e.value.trim()||!u||!u.value.trim()){alert('Please fill in your name, email, and username.');return;}
  document.getElementById('audit-form-wrap').style.display='none';
  document.getElementById('audit-thanks').style.display='block';
}
function cM(){document.getElementById('mo').classList.remove('open')}
document.addEventListener('click',function(e){if(e.target&&e.target.id==='mo')cM()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')cM()});
