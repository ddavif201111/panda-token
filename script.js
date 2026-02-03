const tg = window.Telegram.WebApp;

// 1. Примусова ініціалізація
tg.ready();
tg.expand();
if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();

// Дані (додав перевірку на помилки)
let coins = Number(localStorage.getItem('coins')) || 0;
let power = Number(localStorage.getItem('power')) || 1;
let afkLevel = Number(localStorage.getItem('afkLevel')) || 0;
let tapCost = Number(localStorage.getItem('tapCost')) || 100;
let afkCost = Number(localStorage.getItem('afkCost')) || 500;
let energy = 1000;
const maxEnergy = 1000;

const balanceEl = document.getElementById('balance');
const coinBtn = document.getElementById('coin');

function updateUI() {
    if (balanceEl) balanceEl.innerText = Math.floor(coins).toLocaleString();
    
    const enVal = document.getElementById('energy-val');
    if (enVal) enVal.innerText = Math.floor(energy);
    
    const fill = document.getElementById('fill');
    if (fill) fill.style.width = (energy / maxEnergy * 100) + '%';

    // Оновлення магазину (якщо вкладка відкрита)
    const tLvl = document.getElementById('tap-level-name');
    if (tLvl) tLvl.innerText = Multi-Tap (Рівень ${power});
    
    const tCst = document.getElementById('tap-cost');
    if (tCst) tCst.innerText = Math.floor(tapCost).toLocaleString();

    localStorage.setItem('coins', coins);
    localStorage.setItem('power', power);
    localStorage.setItem('afkLevel', afkLevel);
    localStorage.setItem('tapCost', tapCost);
    localStorage.setItem('afkCost', afkCost);
}

// ГОЛОВНА ФУНКЦІЯ КЛІКУ
function handleTap(e) {
    // Зупиняємо все, що може заважати кліку
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();

    if (energy >= power) {
        coins += power;
        energy -= power;

        // Візуальний ефект
        if (coinBtn) {
            coinBtn.style.transform = 'scale(0.92)';
            setTimeout(() => { coinBtn.style.transform = 'scale(1)'; }, 50);
        }

        // Вібрація (Haptic Feedback)
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('medium');
        }

        updateUI();
    }
}

// ПРИВ'ЯЗКА ПОДІЙ (важливо для всіх типів екранів)
if (coinBtn) {
    // Для телефонів
    coinBtn.addEventListener('touchstart', handleTap, { passive: false });
    // Для комп'ютерів
    coinBtn.addEventListener('mousedown', handleTap);
}

// AFK та регенерація
setInterval(() => {
    coins += afkLevel;
    if (energy < maxEnergy) energy += 1.5;
    updateUI();
}, 1000);

// Перемикання вкладок
window.showTab = function(name) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    if (name !== 'game') {
        const target = document.getElementById(name);
        if (target) target.style.display = 'block';
    }
    event.currentTarget.classList.add('active');
};

updateUI();
