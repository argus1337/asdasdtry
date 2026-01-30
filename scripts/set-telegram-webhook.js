/**
 * Скрипт для настройки Telegram Webhook
 * 
 * Использование:
 * node scripts/set-telegram-webhook.js <BOT_TOKEN> <SITE_URL>
 * 
 * Пример:
 * node scripts/set-telegram-webhook.js 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11 https://your-site.vercel.app
 */

const [botToken, siteUrl] = process.argv.slice(2);

if (!botToken || !siteUrl) {
  console.error('❌ Ошибка: Укажите BOT_TOKEN и SITE_URL');
  console.log('\nИспользование:');
  console.log('  node scripts/set-telegram-webhook.js <BOT_TOKEN> <SITE_URL>');
  console.log('\nПример:');
  console.log('  node scripts/set-telegram-webhook.js 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11 https://your-site.vercel.app');
  process.exit(1);
}

// Убеждаемся, что URL не заканчивается на /
const cleanSiteUrl = siteUrl.replace(/\/$/, '');
const webhookUrl = `${cleanSiteUrl}/api/telegram-webhook`;

console.log('🔧 Настройка Telegram Webhook...');
console.log(`📡 URL: ${webhookUrl}`);
console.log('');

const apiUrl = `https://api.telegram.org/bot${botToken}/setWebhook`;

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: webhookUrl,
  }),
})
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      console.log('✅ Webhook успешно установлен!');
      console.log(`📌 URL: ${webhookUrl}`);
      if (data.result) {
        console.log(`📝 Описание: ${data.result.description || 'N/A'}`);
      }
    } else {
      console.error('❌ Ошибка при установке webhook:');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  });
