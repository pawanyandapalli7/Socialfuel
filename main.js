(function(){
'use strict';

var menuOpen=false;
function toggleMenu(){menuOpen=!menuOpen;var m=document.getElementById('mobile-nav');if(m)m.classList.toggle('open',menuOpen);}
function closeMenu(){menuOpen=false;var m=document.getElementById('mobile-nav');if(m)m.classList.remove('open');}
function go(id){var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth'});}
function setPlatform(p,btn){document.querySelectorAll('.ptab').forEach(function(b){b.classList.remove('active')});btn.classList.add('active');var ig=document.getElementById('ig-grid'),yt=document.getElementById('yt-grid');if(ig)ig.style.display=p==='ig'?'grid':'none';if(yt)yt.style.display=p==='yt'?'grid':'none';}
function toggleFaq(el){var was=el.classList.contains('open');document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open')});if(!was)el.classList.add('open');}

var legal={
  terms:{title:'Terms & Conditions',body:'<h3>1. Overview</h3><p>These terms govern your use of Social Fuel\'s services. By purchasing, you agree to these terms.</p><h3>2. Our services</h3><p>We provide strategic content promotion, visibility support, and growth consulting for Instagram and YouTube creators. We do not claim affiliation with any social media platform.</p><h3>3. Results & expectations</h3><p>We do not guarantee specific follower counts, view numbers, engagement rates, or any measurable outcome. Results vary by account and depend on content quality, consistency, and platform algorithms.</p><h3>4. Platform independence</h3><p>Social media platforms operate independently and may update algorithms or policies at any time. We are not responsible for platform-level changes that affect account performance.</p><h3>5. Payments & refunds</h3><p>All payments are final once services have been initiated. If you experience a genuine service issue, contact us within 7 days of completion and we will review it directly.</p><h3>6. Account safety</h3><p>We never require your passwords or login credentials. We use external strategic promotion methods only.</p><h3>7. Contact</h3><p>hello@socialfuel.com</p>'},
  privacy:{title:'Privacy Policy',body:'<h3>1. Overview</h3><p>We respect your privacy and are committed to protecting your personal information.</p><h3>2. What we collect</h3><p>Name, email address, social media username or profile link, and payment details (processed securely via Stripe — we never store card info).</p><h3>3. How we use it</h3><p>To deliver our services, process payments, and communicate about your order. We do not sell or share your information for marketing.</p><h3>4. Payment security</h3><p>All payments processed through Stripe (PCI-compliant). We store no credit card or banking data.</p><h3>5. California residents (CCPA)</h3><p>You have the right to request access to, deletion of, or information about your personal data. Contact us at hello@socialfuel.com.</p><h3>6. Contact</h3><p>hello@socialfuel.com</p>'},
  contact:{title:'Contact Us',body:'<h3>Email</h3><p>hello@socialfuel.com</p><h3>Response time</h3><p>We respond to all enquiries within 24 hours, Monday to Friday.</p><h3>For order issues</h3><p>Please include your order email and package name so we can help you quickly.</p>'}
};

function openLegal(k){
  var d=legal[k];if(!d)return;
  document.getElementById('modal-title').textContent=d.title;
  document.getElementById('modal-body').innerHTML=d.body;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function openOnboarding(pkg){
  document.getElementById('modal-title').textContent='Get started';
  document.getElementById('modal-body').innerHTML=
    '<p class="modal-sub">Complete this form and we\'ll begin within 24–72 hours.</p>'+
    '<div class="audit-form" id="onboard-form">'+
    '<div class="form-row"><div class="form-field"><label>Full name</label><input type="text" id="o-name" placeholder="Your name"/></div><div class="form-field"><label>Email</label><input type="email" id="o-email" placeholder="you@email.com"/></div></div>'+
    '<div class="form-row"><div class="form-field"><label>Username / link</label><input type="text" id="o-user" placeholder="@handle or URL"/></div><div class="form-field"><label>Platform</label><select id="o-plat"><option value="">Select</option><option>Instagram</option><option>YouTube</option></select></div></div>'+
    '<div class="form-field"><label>Package selected</label><input type="text" value="'+pkg+'" readonly style="color:var(--gold)"/></div>'+
    '<div class="form-section-label">Optional — helps us tailor your strategy</div>'+
    '<div class="form-field"><label>Content type</label><select><option value="">Select type</option><option>Reels / Shorts</option><option>Talking / Educational</option><option>Lifestyle / Daily</option><option>Fashion / Beauty</option><option>Other</option></select></div>'+
    '<div class="form-field"><label>Posting frequency</label><select><option value="">Select</option><option>Daily</option><option>3–5 times a week</option><option>1–2 times a week</option><option>Rarely</option></select></div>'+
    '<div class="form-field"><label>Biggest challenge right now</label><textarea rows="2" placeholder="Be honest — this helps us help you most."></textarea></div>'+
    '<button class="form-submit" onclick="submitOnboarding()">Submit &amp; proceed to payment →</button>'+
    '<p class="form-safe">🔒 We never require your password or login access</p>'+
    '</div>';
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function submitOnboarding(){
  var n=document.getElementById('o-name'),e=document.getElementById('o-email'),u=document.getElementById('o-user');
  if(!n||!n.value.trim()||!e||!e.value.trim()||!u||!u.value.trim()){alert('Please fill in your name, email, and username.');return;}
  document.getElementById('modal-body').innerHTML=
    '<div class="thankyou"><div class="thankyou-icon">✓</div><h3>You\'re all set.</h3>'+
    '<p>We received your information. Your growth phase is now queued.</p>'+
    '<p style="margin-top:10px">You\'ll hear from us within 24 hours when we start.</p>'+
    '<p style="margin-top:14px"><strong style="color:var(--white)">In the meantime:</strong> keep posting consistently — this is the single biggest factor in your results.</p>'+
    '<p style="margin-top:16px;font-size:11px;color:var(--faint)">Questions? hello@socialfuel.com</p></div>';
}

function closeModal(){var o=document.getElementById('modal-overlay');if(o)o.classList.remove('open');document.body.style.overflow='';}

function submitAudit(){
  var n=document.getElementById('audit-name'),e=document.getElementById('audit-email'),u=document.getElementById('audit-user');
  if(!n||!n.value.trim()||!e||!e.value.trim()||!u||!u.value.trim()){alert('Please fill in your name, email, and username.');return;}
  var fw=document.getElementById('audit-form-wrap'),th=document.getElementById('audit-thanks');
  if(fw)fw.style.display='none';if(th)th.style.display='block';
}

function initAnimations(){
  var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('visible')})},{threshold:0.07});
  document.querySelectorAll('.fade-up').forEach(function(el){obs.observe(el)});
}

document.addEventListener('click',function(e){if(e.target&&e.target.id==='modal-overlay')closeModal();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initAnimations);}else{initAnimations();}

window.go=go;window.toggleMenu=toggleMenu;window.closeMenu=closeMenu;
window.setPlatform=setPlatform;window.toggleFaq=toggleFaq;
window.openLegal=openLegal;window.openOnboarding=openOnboarding;
window.closeModal=closeModal;window.submitOnboarding=submitOnboarding;
window.submitAudit=submitAudit;
})();
