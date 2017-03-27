import TelegramBot from 'node-telegram-bot-api';
import GoogleMapsAPI from 'googlemaps';

import { TELEGRAM_API_KEY, GOOGLE_MAPS_API_KEY } from './tokens';

const bot = new TelegramBot(TELEGRAM_API_KEY, { polling: true });
const map = new GoogleMapsAPI({
  key: GOOGLE_MAPS_API_KEY,
});

// bot.on('message', msg => {});

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

bot.onText(/\/start/, async msg => {
  const { first_name: firstName, last_name: lastName, id: chatId } = msg.from;

  const opts = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: 'Так', request_location: true }],
      ],
      one_time_keyboard: true,
    }),
  };

  const sendedMessage = await bot.sendMessage(
    chatId,
    `Привіт ${firstName} ${lastName}! Для того щоб почати квест ти маєш бути на вулиці Михайла Котельнікова, 5. Ти вже на місці?`,
    opts,
  );

  const { message_id: msgId } = sendedMessage;

  bot.onReplyToMessage(chatId, msgId, reply => {

    const { latitude, longitude } = reply.location;

    const reverseGeocodeParams = {
      latlng: `${latitude},${longitude}`,
      language: 'uk',
    };

    map.reverseGeocode(reverseGeocodeParams, (err, result) => {

      if (err) {
        console.log(err);
        return;
      }

      if (result.status !== 'OK') {
        return;
      }

      const bestResult = result.results[0];

      console.log(bestResult.address_components);
      bot.sendMessage(chatId, bestResult.formatted_address);
    });
  });
});
