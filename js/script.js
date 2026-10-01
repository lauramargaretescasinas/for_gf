/* ============ EDIT THIS PART ============ */
const CFG={
 start:'2025-05-27T00:00:00',
 attempts:3,
 ambient:'',   // optional: your own ambient mp3, e.g. 'music/ambient.mp3' (leave empty to use the built-in soft synth)
 Q:[
  {q:'what adjective do we always call each other?',clue:'clue: synonym of stinky',a:['funky']},          // accepted answers (lowercase ok)
  {q:'whats my favorite indian food?',clue:'clue: 2 words',a:['chicken masala']},
  {q:'exact date of when we met',clue:'ex format: october 31, 2002',a:['may 27, 2025'],date:1}
 ],
 cheer:[['you can do it!','mn'],['cmon this is easy for you','pk'],['think hard baby','lb'],['i believe in you','lv'],['hurry hurry hurry!','cr']],
 letter:'happy monthsary my love!\n\n"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
 songs:[{t:'song title 1',a:'artist',src:'music/song1.mp3',img:'',why:'why this song reminds me of you...'},{t:'song title 2',a:'artist',src:'music/song2.mp3',img:'',why:'why this song reminds me of you...'},{t:'song title 3',a:'artist',src:'music/song3.mp3',img:'',why:'why this song reminds me of you...'}],
  pics:['images/p1.jpg','images/p2.jpg','images/p3.jpg','images/p4.jpg','images/p5.jpg','images/p6.jpg'],
 reasons:['your laugh','the way you care about people','your art','you make boring days fun','add your own reasons here']
};
/* ============ END ============ */
const $=id=>document.getElementById(id);
if(location.hash=='#reset')localStorage.removeItem('att');
let att=localStorage.att==null?CFG.attempts:+localStorage.att, winOK=false;
const show=id=>{document.querySelectorAll('.scr,#home').forEach(e=>e.classList.remove('on'));$(id).classList.add('on');scrollTo(0,0)};
function go(id,m){closeNP();cancelAnimationFrame(raf);show(id);if(m)scrollTo(0,innerHeight)}

/* story screens */
const ST=[['click to get in','cr'],['no no no','pk'],['not that easy silly','pk'],['let me test you first :)','pk']];let si=0;
let sty;function story(){const[t,c]=ST[si];clearInterval(sty);$('story').innerHTML=`<div class="big ${c} ${si?'':'fl'}"><span id="stx"></span></div><div class="sm" id="scl" style="opacity:0">${si?'(click)':''}</div>`;let i=0;
 sty=setInterval(()=>{$('stx').textContent=t.slice(0,++i);if(i%2)blip(900);if(i>=t.length){clearInterval(sty);$('scl').style.opacity=1}},55)}
function adv(){si++;si<ST.length?story():start()}
story();

/* sound + cheer */
let ac;function tick(){try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain();o.type='square';o.frequency.value=900;g.gain.value=.03;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.04)}catch(e){}}
let bg;function bgOn(){bgOff();bg=setInterval(()=>{const[t,c]=CFG.cheer[Math.random()*CFG.cheer.length|0],d=document.createElement('div');d.className='bgt '+c;d.textContent=t;
 const l=Math.random()<.5?3+Math.random()*20:68+Math.random()*18;d.style.left=l+'%';d.style.top=8+Math.random()*80+'%';document.body.appendChild(d);setTimeout(()=>d.remove(),4000)},1600)}
function bgOff(){clearInterval(bg)}

/* quiz */
let qi,sc,left,tmr;
const N=s=>s.toLowerCase().replace(/[.,!?'"]/g,'').replace(/\s+/g,' ').trim();
const MO=['january','february','march','april','may','june','july','august','september','october','november','december'];
function nd(s){s=N(s);MO.forEach(m=>{s=s.replace(new RegExp('\\b'+m.slice(0,3)+'[a-z]*\\b'),m)});return s.replace(/(\d+)(st|nd|rd|th)\b/,'$1')}
const ok=(v,q)=>q.a.some(x=>q.date||q.d?nd(v)==nd(x):N(v)==N(x));
function start(){if(att<=0)return show('shoo');qi=0;sc=0;show('quiz');bgOn();showQ()}
function showQ(){const q=CFG.Q[qi];left=20;
 $('qs').innerHTML=`<div class="card"><div class="hd"><span>question ${qi+1}</span><span class="tm" id="tm">timer: 20</span></div>
 <div class="bd"><div class="q">${q.q}</div><div class="cl">${q.clue}</div><input class="in" id="ans" autocomplete="off"></div>
 <div style="display:flex;justify-content:flex-end"><button class="nx" onclick="nxt()">next -></button></div></div>`;
 $('ans').focus();$('ans').onkeydown=e=>{if(e.key=='Enter')nxt()};
 clearInterval(tmr);tmr=setInterval(()=>{left--;$('tm').textContent='timer: '+left;tick();if(left<=0)nxt()},1000)}
function nxt(){clearInterval(tmr);if(ok($('ans').value,CFG.Q[qi]))sc++;qi++;qi<CFG.Q.length?showQ():done()}
function done(){bgOff();if(sc==CFG.Q.length)return win();
 att--;localStorage.att=att;$('at').textContent='attempts left: '+att;$('rt').style.display=att>0?'block':'none';show('res');if(att<=0)setTimeout(()=>show('shoo'),2200)}
function again(){$('story').innerHTML='<div class="big cr">you can do this!</div><div class="sm">(click)</div>';show('story');si=ST.length-1;
 $('story').onclick=()=>{$('story').onclick=adv;si=ST.length-1;start()}}

/* win: hi baby -> letter splits out from behind */
function win(){winOK=false;$('lt').textContent=CFG.letter;$('pair').classList.remove('split');show('win');sndSparkle();ambOK=1;amb(1);
 setTimeout(()=>{$('pair').classList.add('split');sndWhoosh();setTimeout(()=>winOK=true,1500)},3500)}

/* home */
let ty;function type(){const t='happy monthsary :)';let i=0;$('h1').textContent='';clearInterval(ty);ty=setInterval(()=>{$('h1').textContent=t.slice(0,++i);if(i>=t.length)clearInterval(ty)},90)}
const _go=go;go=function(id,m){_go(id,m);if(id=='home'&&!m){type();fanfare()}if(window.ambOK)amb(id!='songs')};
function cnt(){const d=Math.max(0,Date.now()-new Date(CFG.start)),p=n=>String(n).padStart(2,'0');
 $('cd').textContent=p(Math.floor(d/864e5));$('ch').textContent=p(Math.floor(d/36e5)%24);$('cm').textContent=p(Math.floor(d/6e4)%60);$('cs').textContent=p(Math.floor(d/1e3)%60)}
setInterval(cnt,1000);cnt();

/* subpages */
$('sl').innerHTML=CFG.songs.map((s,i)=>`<div class="song" onclick="op(${i})"><div class="sim" style="${s.img?`background-image:url(${s.img})`:''}">${s.img?'':'♪'}</div><div><b>${s.t}</b><br><small>${s.a}</small></div><span class="pi">▶</span></div>`).join('');
let A=null,ci=0;const fm=t=>isFinite(t)?(t/60|0)+':'+String(t%60|0).padStart(2,'0'):'0:00';
function op(i){ci=(i+CFG.songs.length)%CFG.songs.length;const s=CFG.songs[ci];if(A)A.pause();A=new Audio(s.src);
 $('zi').style.backgroundImage=s.img?`url(${s.img})`:'';$('zi').textContent=s.img?'':'♪';$('zt').textContent=s.t;$('za').textContent=s.a;$('zw').textContent=s.why||'';$('zw').style.display='none';$('zb').textContent='why this song? ♥';$('znp').style.display='flex';
 const u=()=>{$('zsb').max=A.duration||0;$('zsb').value=A.currentTime;$('ztc').textContent=fm(A.currentTime);$('ztd').textContent=fm(A.duration)};
 A.ontimeupdate=A.onloadedmetadata=u;A.onplay=A.onpause=()=>{$('zpp').textContent=A.paused?'>':'||';$('zi').style.animation=''};A.onended=()=>op(ci+1);A.play().catch(()=>{})}
function pp(){A&&(A.paused?A.play():A.pause())}
function jump(d){A&&(A.currentTime=Math.max(0,Math.min(A.duration||0,A.currentTime+d)))}
function tw(){const w=$('zw'),o=w.style.display=='none';w.style.display=o?'block':'none';$('zb').textContent=o?'hide ♥':'why this song? ♥'}
function closeNP(){if(A){A.pause();A=null}$('znp').style.display='none'}
$('pl').innerHTML=CFG.pics.map(p=>`<div class="pic" onclick="zm('${p}')">photo<img src="${p}" alt="" style="position:absolute;opacity:0" onload="this.style.cssText='';this.parentNode.firstChild.textContent=''" onerror="this.remove()"></div>`).join('');
function zm(s){$('li').src=s;$('lb').style.display='grid'}
let ro=[],rc=0;function nr(){if(!ro.length)ro=CFG.reasons.map((_,i)=>i).sort(()=>Math.random()-.5);const t=$('rt2');t.textContent=CFG.reasons[ro.pop()];t.style.animation='none';t.offsetWidth;t.style.animation='';$('rn').textContent='reason #'+(++rc);
 for(let i=0;i<6;i++){const h=document.createElement('i');h.className='fh';h.textContent='♥';h.style.cssText=`left:${Math.random()*100}%;color:${cs[Math.random()*5|0]};animation-delay:${Math.random()*.5}s`;$('rsn').appendChild(h);setTimeout(()=>h.remove(),4000)}}
let raf;
function play(){cancelAnimationFrame(raf);const g=$('gm');g.innerHTML='<canvas width="420" height="520"></canvas>';const cv=g.firstChild,x=cv.getContext('2d');
 const H=['.XX.XX.','XXXXXXX','XXXXXXX','.XXXXX.','..XXX..','...X...'],S=['...X...','...X...','XXXXXXX','.XXXXX.','..XXX..','.XX.XX.','.X...X.'],B=['X............X','XX..........XX','.XXXXXXXXXXXX.','..XXXXXXXXXX..','...XXXXXXXX...'];
 const dr=(m,px,py,z,c)=>{x.fillStyle=c;m.forEach((r,j)=>[...r].forEach((v,i)=>v=='X'&&x.fillRect(px+i*z,py+j*z,z,z)))};
 const cols=['#ffa6b8','#d4b0ff','#b6f7c8','#a8d8ff'];let it=[],px=210,sc=0,t=30,last=performance.now(),sp=0,sec=0,fx=[];
 const mv=e=>{const r=cv.getBoundingClientRect();px=(e.clientX-r.left)/r.width*420};cv.onpointermove=cv.onpointerdown=mv;
 const kd=e=>{if(e.key=='ArrowLeft')px-=30;if(e.key=='ArrowRight')px+=30};addEventListener('keydown',kd);
 const end=()=>{removeEventListener('keydown',kd);$('gs').innerHTML=`you caught ${sc} love points! you already had my whole heart ♥<br><br><button class="b" onclick="play()">play again</button>`};
 for(let i=0;i<40;i++)fx.push([Math.random()*420,Math.random()*520,Math.random()*2+1]);
 (function f(n){const d=Math.min(.05,(n-last)/1e3);last=n;sp-=d;sec+=d;
  if(sec>=1){sec=0;t--}$('gs').textContent=`love points: ${sc} | time: ${Math.max(t,0)}`;
  if(t<=0)return end();
  if(sp<=0){sp=.45+Math.random()*.3;it.push({x:30+Math.random()*360,y:-30,s:Math.random()<.12,c:cols[Math.random()*4|0],v:150+Math.random()*90})}
  x.clearRect(0,0,420,520);x.fillStyle='#fff6cc';fx.forEach(s=>x.fillRect(s[0],(s[1]+=s[2]*d*10)%520,s[2],s[2]));
  px=Math.max(28,Math.min(392,px));const by=470;dr(B,px-28,by,4,'#fff6cc');
  it=it.filter(o=>{o.y+=o.v*d;const z=o.s?5:5,w=7*z;
   if(o.y+6*z>=by&&o.y<=by+10&&Math.abs(o.x-px)<34){sc+=o.s?5:1;o.s?sndSparkle():blip(880);return false}
   dr(o.s?S:H,o.x-w/2,o.y,z,o.s?'#fff6cc':o.c);return o.y<540});
  raf=requestAnimationFrame(f)})(performance.now())}
new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('rv')),{threshold:.2}).observe($('menu').firstChild);
document.querySelectorAll('.box').forEach((b,i)=>{b.style.animationDelay=i*.15+'s'});

/* cursor effect: pixel sparkles + click burst */
const cs=['#ffa6b8','#b6f7c8','#d4b0ff','#a8d8ff','#fff6cc'];let lt=0;
function spk(x,y,n){for(let i=0;i<n;i++){const d=document.createElement('i');d.className='sp';const r=n>1?90:26;
 d.style.cssText=`left:${x}px;top:${y}px;background:${cs[Math.random()*5|0]};--dx:${(Math.random()-.5)*r}px;--dy:${(Math.random()-.3)*r+8}px`;document.body.appendChild(d);setTimeout(()=>d.remove(),700)}}
addEventListener('pointermove',e=>{if(Date.now()-lt>40){lt=Date.now();spk(e.clientX,e.clientY,1)}});
addEventListener('pointerdown',e=>spk(e.clientX,e.clientY,10));
function nt(f,t,d,ty,v){try{ac=ac||new AudioContext();ac.resume();const o=ac.createOscillator(),g=ac.createGain(),s=ac.currentTime+t;o.type=ty||'triangle';o.frequency.setValueAtTime(f,s);g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(v||.06,s+.02);g.gain.exponentialRampToValueAtTime(.0001,s+d);o.connect(g);g.connect(ac.destination);o.start(s);o.stop(s+d+.05)}catch(e){}}
const arp=(a,gap,ty)=>a.forEach((f,i)=>nt(f,i*gap,.5,ty,ty=='square'?.03:.06));
function sndSparkle(){arp([523,659,784,1047,1319],.11)}
function sndWhoosh(){try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain(),s=ac.currentTime;o.type='sawtooth';o.frequency.setValueAtTime(150,s);o.frequency.exponentialRampToValueAtTime(900,s+1);g.gain.setValueAtTime(.0001,s);g.gain.linearRampToValueAtTime(.04,s+.4);g.gain.exponentialRampToValueAtTime(.0001,s+1.2);o.connect(g);g.connect(ac.destination);o.start(s);o.stop(s+1.3)}catch(e){}arp([784,988,1175],.12)}
function fanfare(){arp([523,659,784,1047],.09,'square');setTimeout(()=>arp([784,1047,1319,1568],.11),500)}
let ambN,ambA;
/* peaceful ambient: slow warm pad chords + soft music-box bells with a gentle echo */
function amb(on){try{if(CFG.ambient){if(!ambA){ambA=new Audio(CFG.ambient);ambA.loop=true;ambA.volume=.3}on?ambA.play().catch(()=>{}):ambA.pause();return}
 ac=ac||new AudioContext();ac.resume();
 if(on&&!ambN){
  const t0=ac.currentTime,m=ac.createGain();m.gain.value=0;m.gain.linearRampToValueAtTime(1,t0+4);
  const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1400;
  const dl=ac.createDelay(1),fb=ac.createGain(),wet=ac.createGain();dl.delayTime.value=.45;fb.gain.value=.4;wet.gain.value=.5;
  dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(lp);
  m.connect(lp);lp.connect(ac.destination);
  const ch=[[174.6,261.6,329.6,392],[220,261.6,329.6,392],[174.6,220,261.6,349.2],[196,246.9,293.7,392]];
  const pad=ac.createGain();pad.gain.value=.05;pad.connect(m);
  const os=[0,1,2,3].map(i=>{const o=ac.createOscillator();o.type='sine';o.frequency.value=ch[0][i];o.connect(pad);o.start();return o});
  const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=.12;lg.gain.value=.012;l.connect(lg);lg.connect(pad.gain);l.start();
  let ci=0;const cy=setInterval(()=>{ci=(ci+1)%ch.length;os.forEach((o,i)=>o.frequency.linearRampToValueAtTime(ch[ci][i],ac.currentTime+3))},8000);
  const sc=[523.25,587.33,659.25,783.99,880,1046.5];
  function bell(){const f=sc[Math.random()*sc.length|0],s=ac.currentTime,o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain();
   o.type='sine';o2.type='sine';o.frequency.value=f;o2.frequency.value=f*2;const g2=ac.createGain();g2.gain.value=.15;
   g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(.045,s+.03);g.gain.exponentialRampToValueAtTime(.0001,s+2.4);
   o.connect(g);o2.connect(g2);g2.connect(g);g.connect(m);g.connect(dl);o.start(s);o2.start(s);o.stop(s+2.5);o2.stop(s+2.5)}
  let bt;const loop=()=>{bell();bt=setTimeout(loop,1800+Math.random()*2600)};bt=setTimeout(loop,1500);
  ambN={m,os,l,cy,stopBt:()=>clearTimeout(bt),get bt(){return bt}}}
 else if(!on&&ambN){const a=ambN;ambN=null;clearTimeout(a.bt);clearInterval(a.cy);a.m.gain.cancelScheduledValues(ac.currentTime);a.m.gain.setValueAtTime(a.m.gain.value,ac.currentTime);a.m.gain.linearRampToValueAtTime(0,ac.currentTime+1.5);setTimeout(()=>{a.os.forEach(o=>o.stop());a.l.stop()},1700)}}catch(e){}}
function blip(f){try{ac=ac||new AudioContext();ac.resume();const o=ac.createOscillator(),g=ac.createGain();o.type='square';o.frequency.value=f||520;g.gain.value=.025;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.06)}catch(e){}}
addEventListener('pointerdown',()=>blip());
document.querySelectorAll('.box').forEach(b=>b.addEventListener('mouseenter',()=>blip(760)));
for(let i=0;i<50;i++){const d=document.createElement('i');d.className='star';d.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s;width:${2+Math.random()*4|0}px;height:${2+Math.random()*4|0}px`;document.body.appendChild(d)}
if(att<=0)show('shoo');
