const tg = window.Telegram.WebApp;
tg.expand();
if(tg.disableVerticalSwipes) tg.disableVerticalSwipes();

let coins = Number(localStorage.getItem('coins')) || 0;
let power = Number(localStorage.getItem('power')) || 1;
let cost = Number(localStorage.getItem('cost')) || 100;
let energy = 1000;
const maxEnergy = 1000;

function updateUI() {
    document.getElementById('balance').innerText = Math.floor(coins);
    document.getElementById('tap-val').innerText = power;
    document.getElementById('energy-val').innerText = energy;
    document.getElementById('fill').style.width = (energy / maxEnergy * 100) + '%';
    document.getElementById('upgrade-cost').innerText = Math.floor(cost);
    
    localStorage.setItem('coins', coins);
    localStorage.setItem('power', power);
    localStorage.setItem('cost', cost);
}

// Клік
function handleTap(e) {
    if (energy >= power) {
        if (e.cancelable) e.preventDefault();
        coins += power;
        energy -= power;

        const coin = document.getElementById('coin');
        coin.style.transform = 'scale(0.95)';
        setTimeout(() => coin.style.transform = 'scale(1)', 50);

        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        const pop = document.createElement('div');
        pop.className = 'pop';
        pop.innerText = '+' + power;
        pop.style.left = x + 'px';
        pop.style.top = y + 'px';
        document.body.appendChild(pop);
        setTimeout(() => pop.remove(), 600);

        updateUI();
    }
}

// Магазин (Збільшення ціни в 1.5 рази)
function buyUpgrade() {
    if (coins >= cost) {
        coins -= cost;
        power += 1;
        cost = cost * 1.5; // Ціна росте в 1.5 рази
        updateUI();
    } else {
        tg.showAlert('Не вистачає монет!');
    }
}

// Перемикання вкладок
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    
    if (tabName !== 'game') {
        document.getElementById(tabName).style.display = 'block';
    }
    event.currentTarget.classList.add('active');
}

function copyRef() {
    const link = document.getElementById('ref-link');
    link.select();
    document.execCommand('copy');
    tg.showAlert('Посилання скопійовано!');
}

document.getElementById('coin').addEventListener('touchstart', handleTap, {passive: false});

setInterval(() => {
    if (energy < maxEnergy) {
        energy += 1;
        updateUI();
    }
}, 1000);

updateUI();
