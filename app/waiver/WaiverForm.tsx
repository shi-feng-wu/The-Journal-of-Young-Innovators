"use client";

import { useState } from "react";
import WaiverRequest from "../form/WaiverRequest";

const FIELD =
  "w-full rounded-xl bg-[#F8F5F1] px-3 py-2.5 font-mono text-base text-black sm:text-sm";
const LABEL = "font-mono text-xs uppercase tracking-[0.16em] text-white/80";

export default function WaiverForm({
  initialRef,
  initialEmail,
}: {
  initialRef: string;
  initialEmail: string;
}) {
  const [ref, setRef] = useState(initialRef);
  const [email, setEmail] = useState(initialEmail);
  const [sent, setSent] = useState(false);

  return (
    <div className="w-full max-w-4xl space-y-6">
      {!sent && (
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className={LABEL}>Submission reference</span>
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="JYI-2026-0001"
              className={FIELD}
            />
          </label>
          <label className="block space-y-2">
            <span className={LABEL}>Email used to submit</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={FIELD}
            />
          </label>
        </div>
      )}
      <WaiverRequest
        submissionRef={ref}
        email={email}
        onSent={() => setSent(true)}
      />
    </div>
  );
}
