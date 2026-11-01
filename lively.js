(()=>{
const $=s=>document.querySelector(s),M=window.BinaryMath;
const COLORS=['#ffb3d1','#ffd6a5','#fdf2a0','#b8f0d0','#b5dcff','#d4c2ff'];
const rnd=n=>Math.floor(Math.random()*n);

/* coriandoli (solo esercizio corretto e sfida) */
function rain(){for(let i=0;i<40;i++){const s=document.createElement('span');s.className='conf';s.style.cssText=`left:${Math.random()*100}vw;background:${COLORS[i%6]};animation-delay:${Math.random()*.5}s`;document.body.append(s);setTimeout(()=>s.remove(),2600)}}
new MutationObserver(()=>{const f=$('#feedback .feedback:not(.wrong)');if(f&&f.textContent.startsWith('Risposta corretta'))rain()}).observe($('#feedback'),{childList:true});


/* animazione del riquadro nell'intestazione */
{let n=6;const bs=[...document.querySelectorAll('.hero-art>div b')],p=$('.hero-art p');
 const draw=()=>{bs.forEach((b,i)=>b.classList.toggle('on',!!(n&(8>>i))));p.innerHTML=[8,4,2,1].map(w=>n&w?w:0).join(' + ')+` <strong>= ${n}</strong>`};
 if(bs.length){draw();setInterval(()=>{n=(n+1)%16;draw()},1400)}}

/* numerazione posizionale */
let base=10,v=0,timer=null,target=0;
const nm10=['unità','decine','centinaia','migliaia'],N=()=>base===10?4:6,MAX=()=>base**N()-1;
const msg=t=>$('#placeMsg').textContent=t;
const digits=()=>Array.from({length:N()},(_,i)=>Math.floor(v/base**(N()-1-i))%base);
function render(changed=[],carry=[]){
 const d=digits(),n=N();
 $('#cols').innerHTML=d.map((x,i)=>{const p=n-1-i,w=base**p;return `<div class="col c${i%6}${changed.includes(i)?' flip':''}${carry.includes(i)?' carry':''}"><button class="up" data-i="${i}" aria-label="Aumenta la cifra">▲</button><div class="digit">${x}</div><button class="down" data-i="${i}" aria-label="Diminuisci la cifra">▼</button><div class="w">peso ${w}</div><div class="v">${x} × ${w} = <b>${x*w}</b></div><div class="nm">${base===10?nm10[p]:'posizione '+p}</div></div>`}).join('');
 $('#placeSum').textContent=d.map((x,i)=>x*base**(n-1-i)).filter(Boolean).join(' + ')||'0';
 $('#placeValue').innerHTML=base===10?`= ${v}<sub>10</sub>`:`${d.join('')}<sub>2</sub> = ${v}<sub>10</sub>`;
 $('#placeStory').textContent=base===10?'Base 10: hai 10 simboli (0–9). Ogni colonna vale 10 volte quella alla sua destra: 1, 10, 100, 1000…':'Base 2: hai solo 2 simboli (0 e 1). Ogni colonna vale il doppio di quella alla sua destra: 1, 2, 4, 8, 16, 32…'}
function stop(){clearInterval(timer);timer=null;$('#pAuto').textContent='▶ Conta da solo'}
function newTarget(){target=1+rnd(base===10?500:31);$('#challenge').textContent=`🎯 Sfida: costruisci il numero ${target} con le frecce ▲▼`}
function checkWin(){if(target>0&&v===target){rain();$('#challenge').textContent=`🎉 Bravo! ${$('#placeSum').textContent} = ${v}`;target=0;setTimeout(newTarget,2800)}}
function inc(){const o=digits();v=v>=MAX()?0:v+1;const d=digits(),ch=d.map((x,i)=>x!==o[i]?i:-1).filter(i=>i>=0),ca=d.map((x,i)=>x===0&&o[i]===base-1?i:-1).filter(i=>i>=0);
 msg(ca.length?(base===2?'1 + 1 = 10 in binario! La colonna si svuota e il «1» passa a sinistra (riporto).':`Dopo ${base-1} la colonna è piena: si azzera e scatta il riporto a sinistra!`):'');render(ch,ca)}
$('#cols').onclick=e=>{const b=e.target.closest('button');if(!b)return;stop();const i=+b.dataset.i,p=N()-1-i,w=base**p,d=digits()[i];
 if(b.classList.contains('up')){if(d===base-1){msg(`La colonna è piena: in base ${base} la cifra più grande è ${base-1}. Per andare avanti serve la colonna a sinistra!`);return}v+=w}
 else{if(d===0){msg('Più giù di 0 non si può scendere.');return}v-=w}
 msg('');render([i]);checkWin()};
$('#pPlus').onclick=()=>{stop();inc();checkWin()};
$('#pAuto').onclick=()=>{if(timer)return stop();timer=setInterval(inc,1100);$('#pAuto').textContent='⏸ Pausa'};
$('#pReset').onclick=()=>{stop();v=0;msg('');render()};
document.querySelectorAll('#baseSwitch button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#baseSwitch button').forEach(x=>x.classList.toggle('active',x===b));base=+b.dataset.base;v=0;stop();msg('');newTarget();render()});
document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',stop));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>document.querySelector(`nav button[data-page=${b.dataset.go}]`).click());
newTarget();render();

/* calcolatore */
const cd=$('#cDec'),cb=$('#cBin'),cm=$('#calcMsg'),cs=$('#calcSteps'),LIM=4294967295;
function show(n,dir,bits){
 if(dir==='bin'){const rows=M.divisions(n);
  cs.innerHTML=`<h3>Come ci arriviamo: dividi per 2 e segna i resti</h3><ol>${rows.map((r,i)=>`<li style="--d:${i*.12}s">${r.n} ÷ 2 = ${r.q}, resto <span class="r r${r.r}">${r.r}</span></li>`).join('')}</ol><p>Ora leggi i resti <b>dal basso verso l’alto</b> ↑</p><div class="readout">${rows.slice().reverse().map((r,i)=>`<span class="tile r${r.r}" style="--d:${(rows.length+i)*.12}s">${r.r}</span>`).join('')}<sub>2</sub></div>`}
 else{const p=M.positional(bits),sum=p.filter(x=>x.bit).map(x=>x.contribution);
  cs.innerHTML=`<h3>Come ci arriviamo: ogni bit × il suo peso, poi somma</h3><div class="wts">${p.map((x,i)=>`<div class="wt ${x.bit?'on c'+(i%6):'off'}" style="--d:${i*.08}s"><span class="b">${x.bit}</span><small>peso ${x.weight}</small><em>${x.contribution}</em></div>`).join('')}</div><p class="sumline">${sum.length?sum.join(' + '):'0'} = <b>${n}</b></p>`}}
const clear=()=>{cs.innerHTML='';cb.value='';cd.value=''};
cd.oninput=()=>{const s=cd.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'');cd.value=s;if(!s){clear();cm.textContent='';return}
 const n=+s;if(n>LIM){cm.textContent='Numero troppo grande: il calcolatore arriva a 4 294 967 295 (32 bit).';cb.value='';cs.innerHTML='';return}
 cm.textContent='';cb.value=n.toString(2);show(n,'bin')};
cb.oninput=()=>{const raw=cb.value;let s=raw.replace(/[^01]/g,'');cm.textContent=s!==raw?'In binario esistono solo le cifre 0 e 1!':'';
 if(s.length>32){s=s.slice(0,32);cm.textContent='Massimo 32 bit.'}cb.value=s;if(!s){cd.value='';cs.innerHTML='';return}
 const n=parseInt(s,2);cd.value=n;show(n,'dec',s)};
const setDec=n=>{cd.value=n;cd.oninput()};
$('#calcEx').innerHTML='Prova con: '+[5,13,42,100,255,1000].map(n=>`<button class="example" data-n="${n}">${n}</button>`).join('');
$('#calcEx').onclick=e=>{const b=e.target.closest('button');if(b)setDec(b.dataset.n)};
$('#cRand').onclick=()=>setDec(rnd(256));
$('#cClear').onclick=()=>{clear();cm.textContent=''};
setDec(13);
})();
