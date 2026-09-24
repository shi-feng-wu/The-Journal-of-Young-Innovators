import { requirePageEditor } from "@/lib/portal/auth";
import { all, get } from "@/lib/portal/db";
import type { InboundMail, StoredAttachment } from "@/lib/portal/inbox";
import { zohoConfigured } from "@/lib/portal/zoho";
import PortalShell from "../_components/PortalShell";
import { META, Masthead, formatDate, formatDateTime, formatTime } from "../_components/ui";
import { CheckInboxButton, MailActions } from "./InboxControls";

export const metadata = { title: "Inbox" };

export default async function InboxPage() {
  const editor = await requirePageEditor();
  const mail = all<InboundMail>("SELECT * FROM inbound_mail WHERE state = 'unmatched' ORDER BY received_at DESC");
  const lastRun = get<{ value: string }>("SELECT value FROM sync_state WHERE key = 'inbox_last_run'")?.value;
  const connected = zohoConfigured();

  return (
    <PortalShell
      editor={editor}
      masthead={
        <Masthead title="Inbox">
          {connected && (
            <div className="mt-4 flex flex-col gap-3">
              {lastRun && (
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
                  Last checked {formatDateTime(lastRun)}
                </p>
              )}
              <CheckInboxButton />
            </div>
          )}
        </Masthead>
      }
    >
      {!connected && (
        <p className="mb-10 max-w-[72ch] border-l-2 border-primary pl-4 font-text text-[15px] leading-relaxed text-[#111]/80">
          The editor inbox is not connected on this server yet, so author replies are not filed automatically.
        </p>
      )}

      {mail.length === 0 ? (
        <p className="border-t border-black/30 py-12 font-text text-base text-[#111]/65">
          Every author email has been filed under its manuscript.
        </p>
      ) : (
        <ol>
          {mail.map((m) => {
            const files = JSON.parse(m.attachments ?? "[]") as StoredAttachment[];
            return (
              <li key={m.id} className="grid gap-y-4 border-t border-black/30 py-7 lg:grid-cols-[minmax(0,1fr)_176px] lg:gap-x-8">
                <div className="min-w-0">
                  <h2 className="font-display text-2xl leading-snug">{m.subject || "(no subject)"}</h2>
                  <p className="mt-2 font-mono text-[13px] text-[#111]/80">
                    {m.from_name && m.from_name !== m.from_address ? `${m.from_name} ` : ""}
                    <span className="text-[#111]/60">{m.from_address}</span>
                  </p>
                  <details className="group/mail mt-3">
                    <summary className="cursor-pointer list-none font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary underline-offset-4 hover:underline">
                      <span className="group-open/mail:hidden">Read the email</span>
                      <span className="hidden group-open/mail:inline">Close</span>
                    </summary>
                    <p className="mt-3 max-w-[68ch] whitespace-pre-wrap border border-black/15 bg-white px-5 py-5 font-text text-[15px] leading-[1.7] text-[#111]/85 sm:px-7">
                      {m.body || "(no text)"}
                    </p>
                  </details>
                  {files.length > 0 && (
                    <p className="mt-3 flex flex-wrap gap-x-4 font-mono text-[11px]">
                      {files.map((f) => (
                        <a
                          key={f.path}
                          href={`/api/portal/inbox/${m.id}?name=${encodeURIComponent(f.path)}`}
                          className="text-primary underline underline-offset-2"
                        >
                          {f.name}
                        </a>
                      ))}
                    </p>
                  )}
                  <div className="mt-5">
                    <MailActions mailId={m.id} />
                  </div>
                </div>
                <p className={`${META} lg:text-right`}>
                  <span className="block whitespace-nowrap">{formatDate(m.received_at)}</span>
                  <span className="block whitespace-nowrap">{formatTime(m.received_at)}</span>
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </PortalShell>
  );
}
