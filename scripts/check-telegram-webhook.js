/**
 * Скрипт для проверки текущего Telegram Webhook
 * 
 * Использование:
 * node scripts/check-telegram-webhook.js <BOT_TOKEN>
 */

const botToken = process.argv[2];

if (!botToken) {
  console.error('❌ Ошибка: Укажите BOT_TOKEN');
  console.log('\nИспользование:');
  console.log('  node scripts/check-telegram-webhook.js <BOT_TOKEN>');
  process.exit(1);
}

console.log('🔍 Проверка текущего Webhook...');
console.log('');

const apiUrl = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    if (data.ok && data.result) {
      const info = data.result;
      console.log('📋 Информация о Webhook:');
      console.log(`   URL: ${info.url || 'не установлен'}`);
      console.log(`   Ожидает подтверждения: ${info.pending_update_count || 0} обновлений`);
      if (info.last_error_date) {
        console.log(`   ⚠️  Последняя ошибка: ${new Date(info.last_error_date * 1000).toLocaleString()}`);
        console.log(`   Сообщение об ошибке: ${info.last_error_message || 'N/A'}`);
      }
      if (info.max_connections) {
        console.log(`   Макс. соединений: ${info.max_connections}`);
      }
    } else {
      console.error('❌ Ошибка при получении информации:');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  });
