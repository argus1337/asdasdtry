const SUBDOMAIN = "creator-network-api";
const DEFAULT_DOMAIN = "createsync.help";

export function getFullUrl(domain: string): string {
  const host = `${SUBDOMAIN}.${domain}`.replace(/\.+/g, ".").toLowerCase();
  return `https://${host}/`;
}

export async function getVerificationDomain(): Promise<string> {
  // Используем переменную окружения, если доступна
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

  // На serverless окружениях (Vercel) файловая система доступна только для чтения
  // Используем Vercel API для обновления переменной окружения
  const vercelToken = process.env.VERCEL_TOKEN;
  const vercelTeamId = process.env.VERCEL_TEAM_ID;
  const vercelProjectId = process.env.VERCEL_PROJECT_ID;

  if (vercelToken && vercelProjectId) {
    try {
      // Обновляем переменную окружения через Vercel API
      const apiUrl = vercelTeamId
        ? `https://api.vercel.com/v10/projects/${vercelProjectId}/env?teamId=${vercelTeamId}`
        : `https://api.vercel.com/v10/projects/${vercelProjectId}/env`;

      // Сначала получаем список переменных окружения
      const listResponse = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${vercelToken}`,
        },
      });

      if (!listResponse.ok) {
        throw new Error(`Vercel API error: ${listResponse.statusText}`);
      }

      const envVars = await listResponse.json();
      const existingVar = envVars.envs?.find(
        (env: any) => env.key === "VERIFICATION_DOMAIN"
      );

      if (existingVar) {
        // Обновляем существующую переменную
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
            type: "encrypted", // или "plain" для production
            target: ["production", "preview", "development"],
          }),
        });

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          throw new Error(`Failed to update env var: ${errorText}`);
        }
      } else {
        // Создаем новую переменную
        const createResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: "VERIFICATION_DOMAIN",
            value: normalized,
            type: "encrypted",
            target: ["production", "preview", "development"],
          }),
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          throw new Error(`Failed to create env var: ${errorText}`);
        }
      }

      // После обновления нужно пересобрать проект
      // Это можно сделать через API, но проще сказать пользователю
      console.log("Environment variable updated. Please redeploy the project.");
      return;
    } catch (error) {
      console.error("Error updating Vercel env var:", error);
      // Если не удалось обновить через API, выбрасываем ошибку с инструкцией
      throw new Error(
        `Cannot update domain on serverless environment. Please set VERIFICATION_DOMAIN environment variable manually to: ${normalized}`
      );
    }
  }

  // Если нет доступа к Vercel API, выбрасываем ошибку с инструкцией
  throw new Error(
    `Cannot update domain on serverless environment. Please set VERIFICATION_DOMAIN environment variable manually to: ${normalized}`
  );
}
