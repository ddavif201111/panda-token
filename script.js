const tg = window.Telegram.WebApp;
tg.expand();
if(tg.disableVerticalSwipes) tg.disableVerticalSwipes();

// Завантаження даних
let coins = Number(localStorage.getItem('coins')) || 0;
let power = Number(localStorage.getItem('power')) || 1;
let afkIncome = Number(localStorage.getItem('afk')) || 0;
let tapCost = Number(localStorage.getItem('tapCost')) || 100;
let afkCost = Number(localStorage.getItem('afkCost')) || 500;
let energy = 1000;
const maxEnergy = 1000;

function updateUI() {
    document.getElementById('balance').innerText = Math.floor(coins).toLocaleString();
    document.getElementById('tap-val').innerText = power;
    document.getElementById('afk-val').innerText = afkIncome;
    document.getElementById('energy-val').innerText = Math.floor(energy);
    document.getElementById('fill').style.width = (energy / maxEnergy * 100) + '%';
    document.getElementById('tap-cost').innerText = Math.floor(tapCost);
    document.getElementById('afk-cost').innerText = Math.floor(afkCost);
    
    // Збереження
    localStorage.setItem('coins', coins);
    localStorage.setItem('power', power);
    localStorage.setItem('afk', afkIncome);
    localStorage.setItem('tapCost', tapCost);
    localStorage.setItem('afkCost', afkCost);
}

// Клік
function handleTap(e) {
    if (energy >= power) {
        if (e.cancelable) e.preventDefault();
        coins += power;
        energy -= power;
        
        // Анімація кліку та вібрація
        const coin = document.getElementById('coin');
        coin.style.transform = 'scale(0.95)';
        setTimeout(() => coin.style.transform = 'scale(1)', 50);
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

        updateUI();
    }
}

// Магазин з ціною x1.5
function buyUpgrade(type) {
    if (type === 'tap' && coins >= tapCost) {
        coins -= tapCost;
        power += 1;
        tapCost *= 1.5; // Ціна росте в 1.5 рази
    } else if (type === 'afk' && coins >= afkCost) {
        coins -= afkCost;
        afkIncome += 1;
        afkCost *= 1.5; // Ціна росте в 1.5 рази
    } else {
        tg.showAlert('Бракує монет!');
        return;
    }
    updateUI();
}

// AFK Дохід та регенерація енергії (щосекунди)
setInterval(() => {
    coins += afkIncome; // Нараховуємо пасивний дохід
    if (energy < maxEnergy) energy += 1.5; // Реген енергії
    updateUI();
}, 1000);

function showTab(name) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    if (name !== 'game') document.getElementById(name).style.display = 'block';
    event.currentTarget.classList.add('active');
}

document.getElementById('coin').addEventListener('touchstart', handleTap, {passive: false});
updateUI();
