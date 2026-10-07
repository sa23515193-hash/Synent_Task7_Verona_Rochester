const menu=document.querySelector('.hamb');const nav=document.querySelector('.navlinks');if(menu)menu.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const cat=btn.dataset.cat;document.querySelectorAll('.product').forEach(p=>p.style.display=(cat==='all'||p.dataset.cat===cat)?'block':'none')}));
const form=document.querySelector('#contactForm');if(form)form.addEventListener('submit',e=>{e.preventDefault();document.querySelector('.success').style.display='block';form.reset();});
