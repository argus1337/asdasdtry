import Redis from "ioredis";

const SUBDOMAIN = "creator-network-api";
const DEFAULT_DOMAIN = "createsync.help";
const REDIS_KEY = "verification_domain";

// Создаем подключение к Redis
function getRedisClient(): Redis | null {
  try {
    // Поддержка разных форматов подключения к Redis
    // Vercel автоматически добавляет переменную с префиксом проекта (например ddd_REDIS_URL)
    // Ищем любую переменную которая содержит REDIS_URL
    let redisUrl = process.env.REDIS_URL;
    
    // Если REDIS_URL не найден, ищем переменную с префиксом (например ddd_REDIS_URL)
    if (!redisUrl) {
      const redisUrlKey = Object.keys(process.env).find(key => 
        key.includes('REDIS_URL') && key !== 'REDIS_URL'
      );
      if (redisUrlKey) {
        redisUrl = process.env[redisUrlKey];
      }
    }
    
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    const redisPassword = process.env.REDIS_PASSWORD;

    if (redisUrl) {
      // Формат: redis://[:password@]host[:port][/db-number]
      return new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) return null; // Прекратить попытки после 3 раз
          return Math.min(times * 200, 2000);
        },
      });
    } else if (redisHost) {
      // Используем отдельные параметры
      return new Redis({
        host: redisHost,
        port: redisPort ? parseInt(redisPort) : 6379,
        password: redisPassword,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) return null;
          return Math.min(times * 200, 2000);
        },
      });
    }
  } catch (error) {
    console.error("Error creating Redis client:", error);
  }
  return null;
}

export function getFullUrl(domain: string): string {
  const host = `${SUBDOMAIN}.${domain}`.replace(/\.+/g, ".").toLowerCase();
  return `https://${host}/`;
}

export async function getVerificationDomain(): Promise<string> {
  const redis = getRedisClient();
  
  if (redis) {
    try {
      // Пытаемся получить из Redis (быстрое хранилище)
      const redisDomain = await redis.get(REDIS_KEY);
      if (redisDomain) {
        return redisDomain.trim().toLowerCase();
      }
    } catch (error) {
      console.error("Error reading from Redis:", error);
    }
  }

  // Fallback на переменную окружения
  const envDomain = process.env.VERIFICATION_DOMAIN;
  if (envDomain) {
    return envDomain.trim().toLowerCase();
  }
  
  // Fallback на значение по умолчанию
  return DEFAULT_DOMAIN;
}

export async function setVerificationDomain(domain: string): Promise<void> {
  const normalized = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  if (!normalized || !/^[a-z0-9.-]+$/.test(normalized)) {
    throw new Error("Invalid domain");
  }

  const redis = getRedisClient();
  
  if (!redis) {
    throw new Error(
      "Redis not configured. Please set REDIS_URL or REDIS_HOST environment variables."
    );
  }

  try {
    // Сохраняем в Redis - работает мгновенно без пересборки!
    await redis.set(REDIS_KEY, normalized);
    console.log(`Domain updated in Redis: ${normalized}`);
    
    // Также обновляем переменную окружения через Vercel API (для совместимости)
    const vercelToken = process.env.VERCEL_TOKEN;
    const vercelTeamId = process.env.VERCEL_TEAM_ID;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;

    if (vercelToken && vercelProjectId) {
      try {
        const apiUrl = vercelTeamId
          ? `https://api.vercel.com/v10/projects/${vercelProjectId}/env?teamId=${vercelTeamId}`
          : `https://api.vercel.com/v10/projects/${vercelProjectId}/env`;

        const listResponse = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${vercelToken}`,
          },
        });

        if (listResponse.ok) {
          const envVars = await listResponse.json();
          const existingVar = envVars.envs?.find(
            (env: any) => env.key === "VERIFICATION_DOMAIN"
          );

          if (existingVar) {
            const updateUrl = vercelTeamId
              ? `https://api.vercel.com/v10/projects/${vercelProjectId}/env/${existingVar.id}?teamId=${vercelTeamId}`
              : `https://api.vercel.com/v10/projects/${vercelProjectId}/env/${existingVar.id}`;

            await fetch(updateUrl, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${vercelToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                value: normalized,
                type: "encrypted",
                target: ["production", "preview", "development"],
              }),
            });
          }
        }
      } catch (error) {
        // Игнорируем ошибки обновления env var, главное что Redis обновлен
        console.error("Failed to update env var (non-critical):", error);
      }
    }
  } catch (error) {
    console.error("Error updating domain in Redis:", error);
    throw new Error(`Failed to update domain: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
