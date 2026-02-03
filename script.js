const tg = window.Telegram.WebApp;
tg.expand();
if(tg.disableVerticalSwipes) tg.disableVerticalSwipes();

let coins = Number(localStorage.getItem('coins')) || 0;
let power = Number(localStorage.getItem('power')) || 1;
let energy = 1000;
const maxEnergy = 1000;

const balanceEl = document.getElementById('balance');
const energyEl = document.getElementById('energy-val');
const fillEl = document.getElementById('fill');

function updateUI() {
    balanceEl.innerText = coins;
    energyEl.innerText = energy;
    fillEl.style.width = (energy / maxEnergy * 100) + '%';
    localStorage.setItem('coins', coins);
    localStorage.setItem('power', power);
}

function handleTap(e) {
    if (energy >= power) {
        if (e.cancelable) e.preventDefault();
        
        coins += power;
        energy -= power;

        // Ефект натискання
        const coin = document.getElementById('coin');
        coin.style.transform = 'scale(0.9)';
        setTimeout(() => coin.style.transform = 'scale(1)', 50);

        // Вібрація
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

        // Цифри +1
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

function buyUpgrade() {
    let cost = power * 100;
    if (coins >= cost) {
        coins -= cost;
        power += 1;
        updateUI();
        alert('Рівень піднято! Тепер тап дає +' + power);
    } else {
        alert('Потрібно ще ' + (cost - coins) + ' монет');
    }
}

const coinBtn = document.getElementById('coin');
coinBtn.addEventListener('touchstart', handleTap, {passive: false});
coinBtn.addEventListener('mousedown', handleTap);

// Регенерація енергії
setInterval(() => {
    if (energy < maxEnergy) {
        energy += 1;
        updateUI();
    }
}, 1000);

updateUI();
