import { createPasswordToken } from "./auth";
import type { Editor } from "./db";
import { getTransport } from "./mailer";

/** Emails an editor a link to set their password. Returns the link too. */
export async function sendInvite(editor: Editor, origin: string, invitedBy: string) {
  const token = createPasswordToken(editor.id);
  const link = `${origin}/portal/set-password?token=${token}`;
  const { transporter, from } = getTransport();
  await transporter.sendMail({
    from,
    to: editor.email,
    subject: "Your JYI editor portal account",
    text: [
      `Hi ${editor.name},`,
      "",
      `${invitedBy} has set up an account for you on the JYI editor portal, where the team tracks submissions, decisions, and publication fees.`,
      "",
      "Choose a password here (the link works once and expires in 72 hours):",
      link,
      "",
      `After that, sign in at ${origin}/portal with this email address.`,
    ].join("\n"),
  });
  return link;
}
