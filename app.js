const questions = {
    "قرآن": [{q:"أطول سورة؟",a:"البقرة",v:100},{q:"سورة فيها بسملتين؟",a:"النمل",v:200},{q:"أطول آية؟",a:"الدين",v:300},{q:"صحابي ذكر اسمه؟",a:"زيد",v:400},{q:"أخت الطويلتين؟",a:"الأعراف",v:500}],
    "تاريخ": [{q:"أول خليفة؟",a:"أبو بكر",v:100},{q:"فتح مكة؟",a:"8 هـ",v:200},{q:"الثورة الفرنسية؟",a:"1789",v:300},{q:"توحيد المملكة؟",a:"1351",v:400},{q:"عاصمة العباسيين؟",a:"الكوفة",v:500}],
    "علوم": [{q:"رمز الماء؟",a:"H2O",v:100},{q:"أصلب مادة؟",a:"الألماس",v:200},{q:"عظام البالغ؟",a:"206",v:300},{q:"غاز التنفس؟",a:"أكسجين",v:400},{q:"المعطي العام؟",a:"O-",v:500}],
    "رياضة": [{q:"لاعبين القدم؟",a:"11",v:100},{q:"أول مونديال؟",a:"الأوروغواي",v:200},{q:"مسافة الماراثون؟",a:"42",v:300},{q:"لقب ميسي؟",a:"البرغوث",v:400},{q:"حلقات الأولمبياد؟",a:"5",v:500}],
    "عامة": [{q:"لون الزمرد؟",a:"أخضر",v:100},{q:"صوت الأسد؟",a:"زئير",v:200},{q:"عملة بريطانيا؟",a:"جنيه",v:300},{q:"أقرب كوكب؟",a:"الزهرة",v:400},{q:"أكبر محيط؟",a:"الهادي",v:500}]
};

let scores = [0, 0], turn = 0, selected = [], usedCats = [];
let activeP = null, activeV = 0, activeCard = null, qLeft = 0, delCount = 0;

function navigate(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showCats() {
    document.getElementById('display-n1').innerText = document.getElementById('name1').value || "فريق 1";
    document.getElementById('display-n2').innerText = document.getElementById('name2').value || "فريق 2";
    navigate('screen-cats');
    const list = document.getElementById('cats-list'); list.innerHTML = ''; selected = [];
    Object.keys(questions).forEach(cat => {
        const b = document.createElement('button'); b.innerText = cat; b.className = 'btn-primary'; b.style.margin = '5px';
        b.onclick = () => {
            if(selected.includes(cat)) { selected = selected.filter(c=>c!==cat); b.style.background = ""; }
            else if(selected.length < 5) { selected.push(cat); b.style.background = "#3b82f6"; }
            document.getElementById('start-round-btn').disabled = selected.length !== 5;
        };
        list.appendChild(b);
    });
}

function startGame() {
    usedCats.push(...selected); qLeft = 25;
    if(usedCats.length > 5) delCount = 3;
    navigate('screen-game'); renderBoard(); updateUI();
}

function renderBoard() {
    const b = document.getElementById('board'); b.innerHTML = '';
    selected.forEach(cat => {
        const col = document.createElement('div'); col.className = 'cat-column';
        col.innerHTML = `<div class="cat-name">${cat}</div>`;
        [100, 200, 300, 400, 500].forEach(v => {
            const card = document.createElement('div'); card.className = 'q-card'; card.innerText = v;
            if(v === 500 && delCount > 0) { card.className = 'q-card done'; card.innerText = '🗑️'; delCount--; qLeft--; }
            else card.onclick = () => { activeCard=card; activeV=v; openModal(cat, v); };
            col.appendChild(card);
        });
        b.appendChild(col);
    });
}

function openModal(cat, v) {
    const qData = questions[cat].find(x => x.v === v);
    document.getElementById('q-text').innerText = qData.q;
    document.getElementById('a-text').innerText = "الإجابة: " + qData.a;
    document.getElementById('a-text').style.display = 'none';
    document.getElementById('ans-btns').style.display = 'block';
    document.getElementById('q-modal').style.display = 'flex';
}

function usePerk(p) {
    activeP = p;
    document.querySelectorAll('.perk').forEach(b => b.classList.remove('active-p'));
    document.getElementById(p + (turn + 1)).classList.add('active-p');
}

function submitAns(correct) {
    let val = activeV;
    if(activeP === 'double') val *= 2;
    if(activeP === 'half') val *= 0.5;
    if(activeP === 'wheel') val = Math.random() > 0.5 ? val * 2 : 0;

    if(correct) scores[turn] += val; else scores[turn] -= val;

    if(activeP) {
        const b = document.getElementById(activeP + (turn + 1));
        b.classList.add('used'); b.classList.remove('active-p'); activeP = null;
    }

    document.getElementById('ans-btns').style.display = 'none';
    document.getElementById('a-text').style.display = 'block';
    setTimeout(() => {
        document.getElementById('q-modal').style.display = 'none';
        activeCard.classList.add('done'); qLeft--;
        if(qLeft <= 0) { alert("انتهت الجولة!"); navigate('screen-cats'); showCats(); }
        else { turn = turn === 0 ? 1 : 0; updateUI(); }
    }, 2000);
}

function updateUI() {
    document.getElementById('score1').innerText = scores[0];
    document.getElementById('score2').innerText = scores[1];
    document.getElementById('team1-box').classList.toggle('active-turn', turn === 0);
    document.getElementById('team2-box').classList.toggle('active-turn', turn === 1);
}