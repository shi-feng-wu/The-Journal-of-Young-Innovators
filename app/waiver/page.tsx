"use client";

import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";
import { Form, Input, Textarea } from "@heroui/react";
import { useState } from "react";
import { FaChevronCircleRight } from "react-icons/fa";

const STATEMENT_MAX = 1500;

export default function WaiverRequest() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [statement, setStatement] = useState<string>("");
  const isDisabled = status === "sending" || status === "success";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setErrorMessage("");

    try {
      const formData = new FormData(form);
      const payload = {
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        school: String(formData.get("school") ?? "").trim(),
        statement: String(formData.get("statement") ?? "").trim(),
      };

      const response = await fetch("/api/waiver/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        form?.reset();
        setStatement("");
        setStatus("success");
        return;
      }

      const contentType = response.headers.get("content-type") ?? "";
      let serverMessage = "Failed to send request. Please try again.";
      if (contentType.includes("application/json")) {
        const responsePayload = await response.json().catch(() => null);
        if (responsePayload?.error) {
          serverMessage = String(responsePayload.error);
        }
      } else {
        const text = await response.text().catch(() => "");
        if (text) {
          serverMessage = text;
        }
      }

      setErrorMessage(serverMessage);
      setStatus("error");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send request. Please try again.";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <Hero
        title="Fee Waiver Request"
        subtitle="JYI charges a one-time $55 submission fee. Need-based waivers are
              available to any student for whom that fee is a barrier to
              submitting — this form takes a few minutes. Requests are kept
              confidential and reviewed independently of editorial
              decisions; approving your request has no effect on how your
              manuscript is evaluated."
        sectionClassName="text-left h-auto pb-0!"
        contentClassName="text-left items-start justify-start mt-20!"
        additionalContent={
          <Form
            className="w-full max-w-2xl items-stretch font-mono text-black space-y-6 sm:space-y-8 relative"
            onSubmit={handleSubmit}
          >
            <div className="w-full space-y-4">
              <Input
                className="w-full"
                label="Full Name"
                name="name"
                classNames={{ base: "w-full", label: "font-serif" }}
                isRequired
                isDisabled={isDisabled}
              />
              <Input
                className="w-full"
                label="Email Address"
                name="email"
                type="email"
                classNames={{ base: "w-full", label: "font-serif" }}
                isRequired
                isDisabled={isDisabled}
              />
              <Input
                className="w-full"
                label="School"
                name="school"
                classNames={{ base: "w-full", label: "font-serif" }}
                isRequired
                isDisabled={isDisabled}
              />
              <Textarea
                className="w-full"
                label="Tell us why the submission fee is a barrier for you"
                name="statement"
                classNames={{ base: "w-full", label: "font-serif" }}
                isRequired
                isDisabled={isDisabled}
                minRows={5}
                maxLength={STATEMENT_MAX}
                value={statement}
                onValueChange={setStatement}
                description={
                  <span className="text-white/50">
                    {statement.length}/{STATEMENT_MAX}
                  </span>
                }
              />
            </div>

            <div className="pt-2 relative">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <SiteButton
                  color="primary"
                  variant="ghost"
                  size="lg"
                  type="submit"
                  variantStyle="whiteHover"
                  isDisabled={isDisabled}
                  className="w-[90vw] sm:w-120 justify-center border-white text-white"
                  endContent={
                    <FaChevronCircleRight className="ml-2 text-base text-current" />
                  }
                >
                  {status === "sending" && "Sending..."}
                  {status === "idle" && "Request a Waiver"}
                  {status === "error" && "Request a Waiver"}
                  {status === "success" && (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="checkmark"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="black"
                          strokeWidth="2"
                        />
                        <path
                          className="checkmark__path"
                          d="M7 12.5l3 3 7-7"
                          stroke="black"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Sent</span>
                    </span>
                  )}
                </SiteButton>
              </div>

              {(status === "success" || status === "error") && (
                <div className="absolute left-0 top-full mt-2 max-w-lg pr-4">
                  {status === "success" && (
                    <p className="text-green-200 text-sm">
                      Request received — we&apos;ll review it and email you
                      within a few days.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-red-200 text-sm">{errorMessage}</p>
                  )}
                </div>
              )}
            </div>
          </Form>
        }
      />
    </div>
  );
}
