const tg = window.Telegram.WebApp;

// Чекаємо повної готовності
tg.ready();
tg.expand();

// Блокуємо свайпи, щоб не "плив" екран
if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();

// Функція тапу
function handleTap(e) {
    // Цей рядок КРИТИЧНИЙ для кліку в ТГ
    if (e.cancelable) e.preventDefault();
    
    console.log("Клік пішов!"); // Для перевірки в консолі
    
    if (energy >= power) {
        coins += power;
        energy -= power;
        
        // Вібрація
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        
        updateUI();
    }
}

// Переконайся, що ця назва 'coin' така сама, як в index.html!
const coinBtn = document.getElementById('coin');
if (coinBtn) {
    coinBtn.addEventListener('touchstart', handleTap, {passive: false});
    coinBtn.addEventListener('mousedown', handleTap);
}
