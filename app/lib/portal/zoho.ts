// Read-only Zoho Mail API client for the inbox sync.
//
// Needs a Zoho "Self Client" (api-console.zoho.com) with the scopes
// ZohoMail.messages.READ and ZohoMail.folders.READ, and these env vars:
//   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID
// Optional: ZOHO_ACCOUNTS_URL (default https://accounts.zoho.com) and
// ZOHO_MAIL_API_URL (default https://mail.zoho.com) for other data centers.

const ACCOUNTS_URL = () => process.env.ZOHO_ACCOUNTS_URL ?? "https://accounts.zoho.com";
const MAIL_URL = () => process.env.ZOHO_MAIL_API_URL ?? "https://mail.zoho.com";

export const zohoConfigured = () =>
  !!(
    process.env.ZOHO_CLIENT_ID &&
    process.env.ZOHO_CLIENT_SECRET &&
    process.env.ZOHO_REFRESH_TOKEN &&
    process.env.ZOHO_ACCOUNT_ID
  );

let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });
  const response = await fetch(`${ACCOUNTS_URL()}/oauth/v2/token?${params}`, { method: "POST" });
  const body = (await response.json().catch(() => null)) as
    | { access_token?: string; expires_in?: number; error?: string }
    | null;
  if (!response.ok || !body?.access_token) {
    throw new Error(`Zoho token refresh failed: ${body?.error ?? response.status}`);
  }
  cachedToken = { value: body.access_token, expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000 };
  return cachedToken.value;
}

async function call(path: string): Promise<Response> {
  const response = await fetch(`${MAIL_URL()}/api/accounts/${process.env.ZOHO_ACCOUNT_ID}${path}`, {
    headers: { Authorization: `Zoho-oauthtoken ${await accessToken()}` },
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Zoho ${path.split("?")[0]} returned ${response.status}: ${text.slice(0, 200)}`);
  }
  return response;
}

async function json<T>(path: string): Promise<T> {
  const body = (await (await call(path)).json()) as { data: T };
  return body.data;
}

export interface ZohoFolder {
  folderId: string;
  folderName: string;
  folderType: string;
}

export interface ZohoMessage {
  messageId: string;
  folderId: string;
  threadId?: string;
  subject: string;
  fromAddress: string;
  sender?: string;
  receivedTime: string;
  hasAttachment: string;
}

export interface ZohoAttachment {
  attachmentId: string;
  attachmentName: string;
  attachmentSize: number;
}

export const listFolders = () => json<ZohoFolder[]>("/folders");

/** Newest first. */
export const listMessages = (folderId: string, start: number, limit: number) =>
  json<ZohoMessage[]>(
    `/messages/view?${new URLSearchParams({
      folderId,
      start: String(start),
      limit: String(limit),
      sortorder: "false",
    })}`,
  );

export const messageContent = async (folderId: string, messageId: string) =>
  (await json<{ content: string }>(`/folders/${folderId}/messages/${messageId}/content`)).content ?? "";

export const attachmentInfo = async (folderId: string, messageId: string) =>
  (await json<{ attachments?: ZohoAttachment[] }>(`/folders/${folderId}/messages/${messageId}/attachmentinfo`))
    .attachments ?? [];

export const downloadAttachment = async (folderId: string, messageId: string, attachmentId: string) =>
  Buffer.from(
    await (await call(`/folders/${folderId}/messages/${messageId}/attachments/${attachmentId}`)).arrayBuffer(),
  );
