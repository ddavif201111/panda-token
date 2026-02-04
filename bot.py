import logging
from aiogram import Bot, Dispatcher, executor, types

# Твій токен від BotFather (встав його сюди!)
API_TOKEN = '8526148093:AAGahBbw2wT1TowM63fsuCtAPBupmO7F4K0'
# Твоє посилання з Vercel
WEBAPP_URL = 'https://tokem-5h1w.vercel.app/'

logging.basicConfig(level=logging.INFO)
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

@dp.message_handler(commands=['start'])
async def start(message: types.Message):
    # Отримуємо ID реферала
    args = message.get_args()
    # Додаємо параметр до посилання
    final_url = f"{WEBAPP_URL}?start={args}" if args else WEBAPP_URL
    
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton(
        text="Грати в Panda Coin 🐼", 
        web_app=types.WebAppInfo(url=final_url)
    ))

    await message.answer(
        f"Привіт! Тисни на кнопку, щоб зайти в гру:",
        reply_markup=markup
    )

if name == '__main__':
    executor.start_polling(dp, skip_updates=True)
