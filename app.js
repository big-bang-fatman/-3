const questionBank = {
    "قرآن": [{q:"أطول سورة؟",a:"البقرة",v:100},{q:"سورة فيها بسملتين؟",a:"النمل",v:200},{q:"أطول آية؟",a:"الدين",v:300},{q:"صحابي ذكر اسمه؟",a:"زيد",v:400},{q:"أخت الطويلتين؟",a:"الأعراف",v:500}],
    "تاريخ": [{q:"أول خليفة؟",a:"أبو بكر",v:100},{q:"فتح مكة؟",a:"8 هـ",v:200},{q:"الثورة الفرنسية؟",a:"1789",v:300},{q:"توحيد المملكة؟",a:"1351",v:400},{q:"عاصمة العباسيين؟",a:"الكوفة",v:500}],
    "علوم": [{q:"رمز الماء؟",a:"H2O",v:100},{q:"أصلب مادة؟",a:"الألماس",v:200},{q:"عظام البالغ؟",a:"206",v:300},{q:"غاز التنفس؟",a:"أكسجين",v:400},{q:"المعطي العام؟",a:"O-",v:500}],
    "رياضة": [{q:"لاعبين القدم؟",a:"11",v:100},{q:"أول مونديال؟",a:"الأوروغواي",v:200},{q:"مسافة الماراثون؟",a:"42",v:300},{q:"لقب ميسي؟",a:"البرغوث",v:400},{q:"حلقات الأولمبياد؟",a:"5",v:500}],
    "عامة": [{q:"لون الزمرد؟",a:"أخضر",v:100},{q:"صوت الأسد؟",a:"زئير",v:200},{q:"عملة بريطانيا؟",a:"جنيه",v:300},{q:"أقرب كوكب؟",a:"الزهرة",v:400},{q:"أكبر محيط؟",a:"الهادي",v:500}]
};

let scores = [0, 0], turn = 0, usedCats = [], currentCats = [];
let perks = [ {double:true, wheel:true, half:true}, {double:true, wheel:true, half:true} ];
let activeP = null, activeV = 0, activeCard = null, qLeft = 0, delLeft = 0;

function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function startToCats() {
    document.getElementById('name-0').innerText = document.getElementById('t1-input').value || "الفريق 1";
    document.getElementById('name-1').innerText = document.getElementById('t2-input').value || "الفريق 2";
    switchScreen('screen-cats');
    renderCatSelection();
}

function renderCatSelection() {
    const list = document.getElementById('cats-list'); list.innerHTML = ''; currentCats = [];
    Object.keys(questionBank).forEach(cat => {
        const played = usedCats.includes(cat);
        const btn = document.createElement('button');
        btn.innerText = cat; btn.className = 'btn-main'; btn.style.margin = '5px';
        if(played) btn.style.opacity = '0.3';
        else btn.onclick = () => {
            if(currentCats.includes(cat)) { currentCats = currentCats.filter(c=>c!==cat); btn.style.background = ""; }
            else if(currentCats.length < 5) { currentCats.push(cat); btn.style.background = "#3b82f6"; }
            document.getElementById('btn-confirm-cats').disabled = currentCats.length !== 5;
        };
        list.appendChild(btn);
    });
}

function confirmAndPlay() {
    usedCats.push(...currentCats); qLeft = 25;
    if(usedCats.length > 5) delLeft = 3;
    switchScreen('screen-game');
    renderBoard(); updateUI();
}

function renderBoard() {
    const board = document.getElementById('game-board'); board.innerHTML = '';
    currentCats.forEach(cat => {
        const col = document.createElement('div'); col.className = 'column';
        col.innerHTML = `<div style="background:#3b82f6; padding:10px; border-radius:5px; margin-bottom:10px;">${cat}</div>`;
        [100, 200, 300, 400, 500].forEach(v => {
            const card = document.createElement('div'); card.className = 'card'; card.innerText = v;
            if(v === 500 && delLeft > 0) { card.className = 'card disabled'; card.innerText = '🗑️'; delLeft--; qLeft--; }
            else card.onclick = () => openQ(cat, v, card);
            col.appendChild(card);
        });
        board.appendChild(col);
    });
}

function openQ(cat, v, card) {
    activeCard = card; activeV = v;
    const qData = questionBank[cat].find(x => x.v === v);
    document.getElementById('q-display').innerText = qData.q;
    document.getElementById('a-display').innerText = "الإجابة: " + qData.a;
    document.getElementById('a-display').style.display = 'none';
    document.getElementById('ans-controls').style.display = 'block';
    document.getElementById('q-modal').style.display = 'flex';
}

function activatePerk(p) {
    if(!perks[turn][p]) return;
    activeP = p;
    document.querySelectorAll('.perk-btn').forEach(b => b.classList.remove('active-perk'));
    document.getElementById(p + turn).classList.add('active-perk');
}

function handleAnswer(correct) {
    let finalVal = activeV;
    if(activeP === 'double') finalVal *= 2;
    if(activeP === 'half') finalVal *= 0.5;
    if(activeP === 'wheel') finalVal = Math.random() > 0.5 ? finalVal * 2 : 0;

    if(correct) scores[turn] += finalVal; else scores[turn] -= finalVal;

    if(activeP) {
        const btn = document.getElementById(activeP + turn);
        btn.classList.add('used'); btn.classList.remove('active-perk'); activeP = null;
    }

    document.getElementById('ans-controls').style.display = 'none';
    document.getElementById('a-display').style.display = 'block';
    setTimeout(() => {
        document.getElementById('q-modal').style.display = 'none';
        activeCard.classList.add('disabled'); qLeft--;
        if(qLeft <= 0) { alert("انتهت الجولة!"); switchScreen('screen-cats'); renderCatSelection(); }
        else { turn = turn === 0 ? 1 : 0; updateUI(); }
    }, 2000);
}

function updateUI() {
    document.getElementById('score-0').innerText = scores[0];
    document.getElementById('score-1').innerText = scores[1];
    document.getElementById('team-box-0').classList.toggle('active-turn', turn === 0);
    document.getElementById('team-box-1').classList.toggle('active-turn', turn === 1);
}

function toggleMenu() { document.getElementById('side-menu').classList.toggle('open'); }
function showInstructions() { alert("تحدي المعلومات: اختر 5 أقسام، استخدم المزايا لتغيير نقاطك. الفائز بالجولة الأولى يحذف 3 أسئلة في الجولة الثانية."); }