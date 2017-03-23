import TelegramBot from 'node-telegram-bot-api';
import token from './token';

const bot = new TelegramBot(token, { polling: true });

bot.on('message', msg => {
  const chatId = msg.chat.id;

  const location = msg.location;

  if (location) {
    console.log(location);
  }

  //bot.sendMessage(chatId, 'Received your message');
});

bot.onText(/\/loc/, msg => {
  const { id } = msg.chat;

  const opts = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: 'Send Location', request_location: true }],
        [{ text: 'Send Contact', request_contact: true }],
      ],
      one_time_keyboard: true,
    }),
  };

  bot.sendMessage(id, 'Need you location', opts);
});
