import Redis from "ioredis";

const SUBDOMAIN = "creator-network-api";
const DEFAULT_DOMAIN = "createsync.help";
const REDIS_KEY = "verification_domain";

// Singleton для Redis клиента
let redisClient: Redis | null = null;

// Создаем подключение к Redis (singleton)
async function getRedisClientAsync(): Promise<Redis | null> {
  // Если клиент уже создан и подключен, возвращаем его
  if (redisClient) {
    const status = redisClient.status;
    if (status === "ready" || status === "connecting") {
      return redisClient;
    }
    // Если соединение разорвано, создаем новое
    if (status === "end" || status === "close") {
      try {
        redisClient.disconnect();
      } catch (e) {
        // Игнорируем ошибки при закрытии
      }
      redisClient = null;
    }
  }

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

    if (!redisUrl && !redisHost) {
      return null;
    }

    // Создаем новый клиент
    if (redisUrl) {
      // Формат: redis://[:password@]host[:port][/db-number]
      redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) return null; // Прекратить попытки после 3 раз
          return Math.min(times * 200, 2000);
        },
        enableReadyCheck: true,
        connectTimeout: 10000, // 10 секунд таймаут
      });
    } else if (redisHost) {
      // Используем отдельные параметры
      redisClient = new Redis({
        host: redisHost,
        port: redisPort ? parseInt(redisPort) : 6379,
        password: redisPassword,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) return null;
          return Math.min(times * 200, 2000);
        },
        enableReadyCheck: true,
        connectTimeout: 10000, // 10 секунд таймаут
      });
    }

    if (!redisClient) {
      return null;
    }

    // Обработка ошибок подключения
    redisClient.on("error", (error) => {
      console.error("Redis connection error:", error);
      // Не сбрасываем клиент сразу, может восстановиться
    });

    redisClient.on("connect", () => {
      console.log("Redis connecting...");
    });

    redisClient.on("ready", () => {
      console.log("Redis connected and ready");
    });

    redisClient.on("close", () => {
      console.log("Redis connection closed");
    });

    redisClient.on("end", () => {
      console.log("Redis connection ended");
      redisClient = null;
    });

    // Ждем подключения с таймаутом
    try {
      await Promise.race([
        new Promise<void>((resolve) => {
          if (redisClient?.status === "ready") {
            resolve();
            return;
          }
          redisClient?.once("ready", () => resolve());
        }),
        new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error("Redis connection timeout")), 5000);
        }),
      ]);
    } catch (error) {
      // Если не удалось подключиться за 5 секунд, все равно возвращаем клиент
      // Он может подключиться позже
      console.warn("Redis connection timeout, but client created:", error);
    }

    return redisClient;
  } catch (error) {
    console.error("Error creating Redis client:", error);
    redisClient = null;
    return null;
  }
}

export function getFullUrl(domain: string): string {
  const host = `${SUBDOMAIN}.${domain}`.replace(/\.+/g, ".").toLowerCase();
  return `https://${host}/`;
}

export async function getVerificationDomain(): Promise<string> {
  try {
    const redis = await getRedisClientAsync();
    
    if (redis) {
      try {
        // Пытаемся получить из Redis (быстрое хранилище)
        const redisDomain = await redis.get(REDIS_KEY);
        if (redisDomain) {
          return redisDomain.trim().toLowerCase();
        }
      } catch (error) {
        console.error("Error reading from Redis:", error);
        // Продолжаем с fallback
      }
    }
  } catch (error) {
    console.error("Error getting Redis client:", error);
    // Продолжаем с fallback
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

  let redis: Redis | null = null;
  try {
    redis = await getRedisClientAsync();
    
    if (!redis) {
      throw new Error(
        "Redis not configured. Please set REDIS_URL or REDIS_HOST environment variables."
      );
    }

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

            const updateResponse = await fetch(updateUrl, {
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

            if (!updateResponse.ok) {
              console.warn("Failed to update Vercel env var, but Redis was updated successfully");
            }
          }
        }
      } catch (error) {
        // Игнорируем ошибки обновления env var, главное что Redis обновлен
        console.error("Failed to update env var (non-critical):", error);
      }
    }
  } catch (error) {
    console.error("Error updating domain in Redis:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Проверяем, была ли это ошибка Redis или что-то другое
    if (errorMessage.includes("Redis not configured") || errorMessage.includes("ECONNREFUSED")) {
      throw new Error(
        `Redis not configured or unavailable. Please check REDIS_URL or REDIS_HOST environment variables. Error: ${errorMessage}`
      );
    }
    
    throw new Error(`Failed to update domain: ${errorMessage}`);
  }
}
