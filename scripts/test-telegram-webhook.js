/**
 * Скрипт для тестирования Telegram Webhook
 * Симулирует запрос от Telegram к вашему webhook
 * 
 * Использование:
 * node scripts/test-telegram-webhook.js <SITE_URL> <CHAT_ID>
 */

const [siteUrl, chatId] = process.argv.slice(2);

if (!siteUrl || !chatId) {
  console.error('❌ Ошибка: Укажите SITE_URL и CHAT_ID');
  console.log('\nИспользование:');
  console.log('  node scripts/test-telegram-webhook.js <SITE_URL> <CHAT_ID>');
  console.log('\nПример:');
  console.log('  node scripts/test-telegram-webhook.js https://createsync.io 123456789');
  process.exit(1);
}

const cleanSiteUrl = siteUrl.replace(/\/$/, '');
const webhookUrl = `${cleanSiteUrl}/api/telegram-webhook`;

console.log('🧪 Тестирование Telegram Webhook...');
console.log(`📡 URL: ${webhookUrl}`);
console.log(`💬 Chat ID: ${chatId}`);
console.log('');

// Симулируем запрос от Telegram
const testUpdate = {
  update_id: 123456789,
  message: {
    message_id: 1,
    from: {
      id: parseInt(chatId),
      first_name: "Test",
      is_bot: false
    },
    chat: {
      id: parseInt(chatId),
      type: "private"
    },
    date: Math.floor(Date.now() / 1000),
    text: "/domain"
  }
};

fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testUpdate),
})
  .then(async response => {
    const text = await response.text();
    console.log(`✅ Статус ответа: ${response.status} ${response.statusText}`);
    console.log(`📄 Ответ сервера:`, text);
    
    if (response.ok) {
      console.log('\n✅ Webhook работает! Проверьте, получили ли вы сообщение в Telegram.');
    } else {
      console.log('\n❌ Webhook вернул ошибку. Проверьте логи сервера.');
    }
  })
  .catch(error => {
    console.error('❌ Ошибка при отправке запроса:', error.message);
    console.log('\nВозможные причины:');
    console.log('  - Webhook URL недоступен');
    console.log('  - Сайт не развернут или недоступен');
    console.log('  - Проблемы с сетью');
  });
