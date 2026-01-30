import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const SUBDOMAIN = "creator-network-api";
const DEFAULT_DOMAIN = "createsync.help";

function getFilePath(): string {
  return path.join(process.cwd(), "data", "verification-domain.json");
}

export type VerificationDomainData = { domain: string };

export function getFullUrl(domain: string): string {
  const host = `${SUBDOMAIN}.${domain}`.replace(/\.+/g, ".").toLowerCase();
  return `https://${host}/`;
}

export async function getVerificationDomain(): Promise<string> {
  try {
    const filePath = getFilePath();
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as VerificationDomainData;
    const domain = (data?.domain || DEFAULT_DOMAIN).trim().toLowerCase();
    return domain;
  } catch {
    return DEFAULT_DOMAIN;
  }
}

export async function setVerificationDomain(domain: string): Promise<void> {
  const normalized = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  if (!normalized || !/^[a-z0-9.-]+$/.test(normalized)) {
    throw new Error("Invalid domain");
  }
  const dataDir = path.join(process.cwd(), "data");
  await mkdir(dataDir, { recursive: true });
  const filePath = getFilePath();
  await writeFile(filePath, JSON.stringify({ domain: normalized }, null, 2), "utf-8");
}
