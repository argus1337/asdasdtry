# Исправление проблемы с 307 Redirect

## Проблема

Telegram получает ошибку `307 Temporary Redirect` вместо ответа от webhook. Это происходит потому что:

1. **Редирект с www на non-www или наоборот** - если webhook установлен на `createsync.io`, а сервер редиректит на `www.createsync.io` (или наоборот)
2. **Редирект с trailing slash** - если URL заканчивается на `/` и сервер редиректит

## Решение

### Шаг 1: Определите правильный домен

Проверьте, какой домен работает без редиректов:

1. Откройте в браузере: `https://createsync.io/api/telegram-webhook`
   - Если видите `{"ok":true,"message":"Telegram webhook is working"}` - используйте `createsync.io`
   - Если происходит редирект - используйте тот домен, на который редиректит

2. Откройте в браузере: `https://www.createsync.io/api/telegram-webhook`
   - Если видите `{"ok":true,"message":"Telegram webhook is working"}` - используйте `www.createsync.io`
   - Если происходит редирект - используйте тот домен, на который редиректит

### Шаг 2: Установите webhook на правильный домен

Используйте тот домен, который **НЕ редиректит**:

**Если работает `createsync.io` (без www):**
```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://createsync.io/api/telegram-webhook
```

**Если работает `www.createsync.io` (с www):**
```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://www.createsync.io/api/telegram-webhook
```

### Шаг 3: Проверьте webhook

```
https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo
```

Должно быть:
- `"pending_update_count": 0` (или уменьшилось)
- Нет `"last_error_message"` или ошибка исчезла

### Шаг 4: Очистите pending updates

Если есть pending updates, Telegram попробует их отправить снова. Или можно очистить вручную:

```
https://api.telegram.org/bot<BOT_TOKEN>/deleteWebhook?drop_pending_updates=true
```

Затем установите webhook заново.

## Настройка на Vercel

Если используете Vercel, убедитесь что:

1. **Домен настроен правильно:**
   - Зайдите в проект → Settings → Domains
   - Убедитесь, что `createsync.io` и `www.createsync.io` настроены правильно
   - Выберите один как основной (без редиректа)

2. **Переменные окружения установлены:**
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

3. **После изменений:**
   - Пересоберите проект
   - Задеплойте заново

## Проверка работы

После исправления:

1. Отправьте боту `/domain`
2. Бот должен ответить с текущим доменом
3. Проверьте `getWebhookInfo` - не должно быть ошибок
