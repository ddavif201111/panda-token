const tg = window.Telegram.WebApp;
tg.expand();
if(tg.disableVerticalSwipes) tg.disableVerticalSwipes();

// Дані
let coins = Number(localStorage.getItem('coins')) || 0;
let power = Number(localStorage.getItem('power')) || 1; // Це рівень тапа
let afkLevel = Number(localStorage.getItem('afkLevel')) || 0;
let tapCost = Number(localStorage.getItem('tapCost')) || 100;
let afkCost = Number(localStorage.getItem('afkCost')) || 500;
let energy = 1000;
const maxEnergy = 1000;

function updateUI() {
    document.getElementById('balance').innerText = Math.floor(coins).toLocaleString();
    document.getElementById('afk-val').innerText = afkLevel;
    document.getElementById('energy-val').innerText = Math.floor(energy);
    document.getElementById('fill').style.width = (energy / maxEnergy * 100) + '%';
    
    // Оновлення тексту в магазині
    document.getElementById('tap-level-name').innerText = Multi-Tap (Рівень ${power});
    document.getElementById('tap-cost').innerText = Math.floor(tapCost).toLocaleString();
    document.getElementById('afk-level-name').innerText = AFK Ферма (Рівень ${afkLevel});
    document.getElementById('afk-cost').innerText = Math.floor(afkCost).toLocaleString();
    
    // Збереження
    localStorage.setItem('coins', coins);
    localStorage.setItem('power', power);
    localStorage.setItem('afkLevel', afkLevel);
    localStorage.setItem('tapCost', tapCost);
    localStorage.setItem('afkCost', afkCost);
}

function handleTap(e) {
    if (energy >= power) {
        if (e.cancelable) e.preventDefault();
        coins += power;
        energy -= power;
        
        const coin = document.getElementById('coin');
        coin.style.transform = 'scale(0.92)';
        setTimeout(() => coin.style.transform = 'scale(1)', 50);
        
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        updateUI();
    }
}

function buyUpgrade(type) {
    if (type === 'tap' && coins >= tapCost) {
        coins -= tapCost;
        power += 1; // Наступний рівень
        tapCost *= 1.5; // Ціна х1.5
    } else if (type === 'afk' && coins >= afkCost) {
        coins -= afkCost;
        afkLevel += 1;
        afkCost *= 1.5; // Ціна х1.5
    } else {
        tg.showAlert('Тобі треба більше золота! 💰');
        return;
    }
    updateUI();
}

function showTab(name) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    if (name !== 'game') document.getElementById(name).style.display = 'block';
    event.currentTarget.classList.add('active');
}

function copyRef() {
    const link = document.getElementById('ref-link');
    link.select();
    document.execCommand('copy');
    tg.showAlert('Скопійовано! Відправ другу 📲');
}

function shareGame() {
    const url = https://t.me/share/url?url=https://t.me/your_bot?start=user${tg.initDataUnsafe.user?.id || '123'}&text=Грай зі мною в Panda Coin! 🐼;
    tg.openTelegramLink(url);
}

setInterval(() => {
    coins += afkLevel; 
    if (energy < maxEnergy) energy += 1.5;
    updateUI();
}, 1000);

document.getElementById('coin').addEventListener('touchstart', handleTap, {passive: false});
updateUI();
