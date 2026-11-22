const S = window.SITE, $ = s => document.querySelector(s);
const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// nav
const nav = $('#nav'), menu = $('#menu'), burger = $('#burger');
addEventListener('scroll', () => nav.classList.toggle('s', scrollY > 30), {passive:true});
burger.onclick = () => burger.setAttribute('aria-expanded', menu.classList.toggle('on'));
menu.onclick = e => { if (e.target.tagName === 'A') { menu.classList.remove('on'); burger.setAttribute('aria-expanded', 'false'); } };
// social + footer
[['#fbDoc','doctor'],['#fbDoc2','doctor'],['#fbClinic','clinic'],['#fbClinic2','clinic']].forEach(([s,k]) => $(s).href = S.social[k]);
$('#yr').textContent = new Date().getFullYear();
$('#fBr').textContent = S.branches.map(b => b.name).join(' – ');
// branches + selects
$('#branches').innerHTML = S.branches.map(b => `<div class="br"><h3>${esc(b.name)}</h3>
<p>العنوان: ${esc(b.address || 'يُضاف قريبًا')}</p><p>الهاتف: ${b.phone ? `<a href="tel:${esc(b.phone)}">${esc(b.phone)}</a>` : 'يُضاف قريبًا'}</p>
<p>المواعيد: ${esc(b.hours || 'تُضاف قريبًا')}</p>${b.map ? `<p><a href="${esc(b.map)}" target="_blank" rel="noopener">الموقع على الخريطة</a></p>` : ''}
<a class="btn sm" href="#book" data-br="${esc(b.name)}">احجز في هذا الفرع</a></div>`).join('');
$('#selBranch').innerHTML = S.branches.map(b => `<option>${esc(b.name)}</option>`).join('');
$('#selSvc').innerHTML = S.services.map(s => `<option>${esc(s)}</option>`).join('');
document.addEventListener('click', e => {
  const a = e.target.closest('[data-svc],[data-br]'); if (!a) return;
  if (a.dataset.svc) $('#selSvc').value = a.dataset.svc;
  if (a.dataset.br) $('#selBranch').value = a.dataset.br;
});
// faq
$('#faqList').innerHTML = S.faq.map(([q,a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
// services accordion
document.querySelectorAll('#svc button').forEach(b => b.onclick = () => {
  document.querySelectorAll('#svc article').forEach(x => x.classList.remove('open')); b.parentElement.classList.add('open');
});
// results gallery (استبدل العناصر بصور حقيقية ومصرّح بها: before/after)
const cases = [['derm','جلدية'],['hair','شعر'],['aes','تجميل'],['derm','جلدية'],['hair','شعر'],['aes','تجميل']];
$('#gallery').innerHTML = cases.map(([c,l]) => `<div class="ba" data-c="${c}"><div class="b">قبل (صورة مؤقتة – ${l})</div><div class="a">بعد (صورة مؤقتة – ${l})</div><input type="range" min="0" max="100" value="50" aria-label="مقارنة قبل وبعد"></div>`).join('');
document.querySelectorAll('.ba input').forEach(i => i.oninput = () => i.parentElement.style.setProperty('--p', i.value + '%'));
$('#filters').onclick = e => { const f = e.target.dataset.f; if (!f) return;
  document.querySelectorAll('#filters button').forEach(b => b.classList.toggle('on', b === e.target));
  document.querySelectorAll('.ba').forEach(x => x.classList.toggle('hide', f !== 'all' && x.dataset.c !== f)); };
// booking -> WhatsApp
$('#form').onsubmit = e => { e.preventDefault();
  const f = new FormData(e.target), st = $('#status');
  if (!f.get('name').trim() || !f.get('phone').trim()) { st.textContent = 'من فضلك اكتب الاسم ورقم الهاتف.'; return; }
  if (!S.whatsapp) { st.textContent = 'رقم واتساب غير مُعدّ بعد. أضِفه في ملف config.js.'; return; }
  const m = `مرحبًا، أرغب في حجز استشارة:\nالاسم: ${f.get('name')}\nالهاتف: ${f.get('phone')}\nالفرع: ${f.get('branch')}\nالخدمة: ${f.get('service')}\nالتاريخ المفضل: ${f.get('date') || 'غير محدد'}\nرسالة: ${f.get('msg') || '-'}`;
  window.open(`https://wa.me/${S.whatsapp}?text=${encodeURIComponent(m)}`, '_blank', 'noopener');
  st.textContent = 'تم فتح واتساب. أرسل الرسالة لإتمام طلب الحجز.'; };
// reveal
const io = new IntersectionObserver(es => es.forEach(x => x.isIntersecting && (x.target.classList.add('in'), io.unobserve(x.target))), {threshold:.12});
document.querySelectorAll('.sec h2,.br,.ba,details').forEach(el => { el.classList.add('rv'); io.observe(el); });
// subtle mouse parallax on hero 3D (desktop only)
if (!matchMedia('(prefers-reduced-motion:reduce)').matches && matchMedia('(hover:hover)').matches) {
  const v = $('#vis'); $('#home').addEventListener('mousemove', e => {
    const r = v.getBoundingClientRect();
    v.style.setProperty('--rx', ((e.clientX - r.left) / r.width - .5) * 14 + 'deg');
    v.style.setProperty('--ry', ((e.clientY - r.top) / r.height - .5) * -10 + 'deg'); });
}
