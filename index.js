import TelegramBot from 'node-telegram-bot-api';
import GoogleMapsAPI from 'googlemaps';

import { TELEGRAM_API_KEY, GOOGLE_MAPS_API_KEY } from './tokens';

const bot = new TelegramBot(TELEGRAM_API_KEY, { polling: true });
const map = new GoogleMapsAPI({
  key: GOOGLE_MAPS_API_KEY,
});

let game = {};

bot.on('message', msg => {
  const chatId = msg.chat.id;

  const location = msg.location;

  /*if (location) {
    const { latitude, longitude } = location;

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
  }*/
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

bot.onText(/\/start/, async msg => {
  const { first_name: firstName, last_name: lastName, id } = msg.from;

  const opts = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: 'Так', request_location: true }],
      ],
      one_time_keyboard: true,
    }),
  };

  const sendedMessage = await bot.sendMessage(
    id,
    `Привіт ${firstName} ${lastName}! Для того щоб почати квест ти маєш бути на вулиці Михайла Котельнікова, 5. Ти вже на місці?`,
    opts,
  );

  console.log('sendedMessage');
  console.log(sendedMessage);

  /*bot.sendMessage(
    id,
    `Привіт ${firstName} ${lastName}! Для того щоб почати квест ти маєш бути на вулиці Михайла Котельнікова, 5. Ти вже на місці?`,
    opts,
  )
    .then(message => {
      console.log(message);
      const msgId = message.message_id;

      bot.onReplyToMessage(id, msgId, reply => {

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
          bot.sendMessage(id, bestResult.formatted_address);
        });

        //console.log(reply);
      });
    });*/


  //console.log(msg.from);
  //console.log(msg.chat);
});

/*
async function onStartQuest(msg) {
  const { first_name: firstName, last_name: lastName, id } = msg.from;

  const opts = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: 'Так', request_location: true }],
      ],
      one_time_keyboard: true,
    }),
  };

  const sendedMessage = await bot.sendMessage(
    id,
    `Привіт ${firstName} ${lastName}! Для того щоб почати квест ти маєш бути на вулиці Михайла Котельнікова, 5. Ти вже на місці?`,
    opts,
  );

  console.log(sendedMessage);
}

bot.onText(/\/start/, onStartQuest);*/
