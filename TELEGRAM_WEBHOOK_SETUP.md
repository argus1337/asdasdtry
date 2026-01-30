# Настройка Telegram Webhook

## Способ 1: Через скрипт (рекомендуется)

### Установка webhook:

```bash
node scripts/set-telegram-webhook.js <BOT_TOKEN> <SITE_URL>
```

**Пример:**
```bash
node scripts/set-telegram-webhook.js 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11 https://your-site.vercel.app
```

### Проверка webhook:

```bash
node scripts/check-telegram-webhook.js <BOT_TOKEN>
```

---

## Способ 2: Через curl (в терминале)

### Установка webhook:

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-site.vercel.app/api/telegram-webhook"}'
```

**Пример:**
```bash
curl -X POST "https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://my-site.vercel.app/api/telegram-webhook"}'
```

### Проверка webhook:

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

---

## Способ 3: Через браузер

Просто откройте в браузере (замените `<BOT_TOKEN>` и `<SITE_URL>`):

```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://your-site.vercel.app/api/telegram-webhook
```

**Пример:**
```
https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/setWebhook?url=https://my-site.vercel.app/api/telegram-webhook
```

---

## Способ 4: Удаление webhook (если нужно)

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/deleteWebhook"
```

Или через браузер:
```
https://api.telegram.org/bot<BOT_TOKEN>/deleteWebhook
```

---

## Где взять BOT_TOKEN?

1. Откройте Telegram
2. Найдите бота **@BotFather**
3. Отправьте команду `/mybots`
4. Выберите вашего бота
5. Перейдите в **API Token** - там будет ваш токен

---

## Где взять SITE_URL?

Если сайт развернут на **Vercel**:
- Зайдите в проект на Vercel
- Скопируйте URL проекта (например: `https://my-project.vercel.app`)

Если сайт развернут на другом хостинге:
- Используйте полный URL вашего сайта (например: `https://yourdomain.com`)

---

## Проверка работы

После установки webhook:

1. Отправьте боту команду `/changedomain` или `/domain`
2. Бот должен ответить с текущим доменом
3. Отправьте `/changedomain createsync.click` для теста
4. Бот должен подтвердить изменение домена

---

## Тестирование webhook

Если бот не отвечает, можно протестировать webhook вручную:

```bash
npm run telegram:test-webhook <SITE_URL> <CHAT_ID>
```

**Пример:**
```bash
npm run telegram:test-webhook https://createsync.io 123456789
```

Это отправит тестовый запрос на ваш webhook и покажет ответ сервера.

---

## Диагностика проблем

### Бот не отвечает на команды

1. **Проверьте webhook:**
   ```bash
   npm run telegram:check-webhook <BOT_TOKEN>
   ```
   Убедитесь, что URL правильный: `https://createsync.io/api/telegram-webhook`

2. **Проверьте переменные окружения:**
   - `TELEGRAM_BOT_TOKEN` - должен быть установлен
   - `TELEGRAM_CHAT_ID` - должен совпадать с вашим Chat ID
   
   **Как узнать Chat ID:**
   - Найдите бота @userinfobot в Telegram
   - Отправьте ему любое сообщение
   - Он ответит с вашим Chat ID

3. **Проверьте логи сервера:**
   - На Vercel: зайдите в проект → Deployments → выберите последний деплой → Logs
   - Ищите сообщения "Telegram webhook received" - это значит запросы приходят
   - Если видите "Chat ID mismatch" - проверьте `TELEGRAM_CHAT_ID`

4. **Проверьте команду:**
   - Используйте `/domain` или `/changedomain` (без @botname)
   - Команды с @botname тоже работают, но лучше без них

5. **Тест webhook:**
   ```bash
   npm run telegram:test-webhook https://createsync.io <YOUR_CHAT_ID>
   ```

### Команда с @botname не работает

Код теперь автоматически убирает @botname из команд, так что `/domain@botname` будет работать как `/domain`.

---

## Важно!

- ✅ Webhook URL должен быть доступен по HTTPS (не HTTP)
- ✅ Убедитесь, что сайт развернут и доступен
- ✅ Проверьте, что переменные окружения `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` установлены на сервере
- ✅ Webhook должен указывать на `/api/telegram-webhook` (этот путь уже настроен в проекте)
- ✅ После изменения кода нужно пересобрать и задеплоить сайт
