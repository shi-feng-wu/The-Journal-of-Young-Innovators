"use client";

import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";
import { Form, Input, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { FaChevronCircleRight } from "react-icons/fa";

export default function Submit() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const isDisabled = status === "sending" || status === "success";
  const USE_DEFAULT_VALUES = false;
  const defaultPhone = USE_DEFAULT_VALUES ? "(555) 123-4567" : "";
  const [phone, setPhone] = useState<string>(defaultPhone);
  const MAX_FILE_BYTES = 25 * 1024 * 1024;

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setErrorMessage("");

    try {
      const manuscript = form.querySelector<HTMLInputElement>(
        "input[name='manuscript']",
      )?.files?.[0];
      if (manuscript && manuscript.size > MAX_FILE_BYTES) {
        setErrorMessage("Manuscript must be 25MB or less.");
        setStatus("error");
        return;
      }

      const formData = new FormData(form);
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        form?.reset();
        setPhone(defaultPhone);
        setStatus("success");
        return;
      }

      const contentType = response.headers.get("content-type") ?? "";
      let serverMessage = "Failed to submit. Please try again.";
      if (contentType.includes("application/json")) {
        const payload = await response.json().catch(() => null);
        if (payload?.error) {
          serverMessage = String(payload.error);
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
          : "Failed to submit. Please try again.";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <Hero
        title="Submit a Manuscript"
        subtitle="We welcome submissions from high school and college students who are
              passionate about academic inquiry and eager to contribute to
              meaningful scholarship. Our editorial board includes experienced
              researchers, educators, and editors dedicated to helping young
              scholars grow through rigorous feedback and mentorship."
        sectionClassName="text-left h-auto pb-0!"
        contentClassName="text-left items-start justify-start mt-20!"
        additionalContent={
          <Form
            className="w-full max-w-4xl items-stretch font-mono text-black space-y-6 sm:space-y-8 relative"
            onSubmit={handleSubmit}
          >
            <div className="w-full space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white font-display">
                Author Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  className="w-full"
                  label="First Name"
                  name="firstName"
                  classNames={{ base: "w-full", label: "font-serif" }}
                  isRequired
                  isDisabled={isDisabled}
                  defaultValue={USE_DEFAULT_VALUES ? "Jane" : undefined}
                />
                <Input
                  className="w-full"
                  label="Last Name"
                  name="lastName"
                  classNames={{ base: "w-full", label: "font-serif" }}
                  isRequired
                  isDisabled={isDisabled}
                  defaultValue={USE_DEFAULT_VALUES ? "Doe" : undefined}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  className="w-full"
                  label="Email Address"
                  name="email"
                  type="email"
                  classNames={{ base: "w-full", label: "font-serif" }}
                  isRequired
                  isDisabled={isDisabled}
                  defaultValue={
                    USE_DEFAULT_VALUES ? "jane.doe@example.com" : undefined
                  }
                />
                <Input
                  className="w-full"
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  classNames={{ base: "w-full", label: "font-serif" }}
                  isDisabled={isDisabled}
                  value={phone}
                  onValueChange={(value) => setPhone(formatPhone(value))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  className="w-full"
                  label="School Name"
                  name="school"
                  classNames={{ base: "w-full", label: "font-serif" }}
                  isRequired
                  isDisabled={isDisabled}
                  defaultValue={
                    USE_DEFAULT_VALUES ? "Example High School" : undefined
                  }
                />
                <Select
                  className="w-full"
                  label="Grade Level"
                  name="gradeLevel"
                  isRequired
                  isDisabled={isDisabled}
                  defaultSelectedKeys={
                    USE_DEFAULT_VALUES ? ["hs-11"] : undefined
                  }
                  classNames={{
                    base: "w-full",
                    label: "font-serif",
                    mainWrapper: "w-full",
                    trigger: "font-mono",
                    value: "font-mono",
                    listbox: "font-mono",
                    popoverContent: "font-mono",
                  }}
                  listboxProps={
                    {
                      className: "max-h-64 overscroll-contain overflow-y-auto",
                      onWheelCapture: (event: React.WheelEvent) => {
                        event.stopPropagation();
                        event.preventDefault();
                      },
                      onTouchMoveCapture: (event: React.TouchEvent) => {
                        event.stopPropagation();
                      },
                      "data-lenis-prevent": "true",
                      "data-lenis-prevent-wheel": "true",
                      "data-lenis-prevent-touch": "true",
                    } as any
                  }
                >
                  <SelectItem key="hs-9">Grade 9</SelectItem>
                  <SelectItem key="hs-10">Grade 10</SelectItem>
                  <SelectItem key="hs-11">Grade 11</SelectItem>
                  <SelectItem key="hs-12">Grade 12</SelectItem>
                  <SelectItem key="college-1">College Year 1</SelectItem>
                  <SelectItem key="college-2">College Year 2</SelectItem>
                  <SelectItem key="college-3">College Year 3</SelectItem>
                  <SelectItem key="college-4">College Year 4</SelectItem>
                  <SelectItem key="college-grad">Graduate</SelectItem>
                </Select>
              </div>
            </div>

            <div className="w-full space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white font-display">
                Manuscript Details
              </h3>
              <Input
                className="w-full"
                label="Manuscript Title"
                name="manuscriptTitle"
                classNames={{ label: "font-serif" }}
                isRequired
                isDisabled={isDisabled}
                defaultValue={
                  USE_DEFAULT_VALUES
                    ? "AI and Innovation in Education"
                    : undefined
                }
              />
              <Input
                className="w-full"
                label="Manuscript"
                name="manuscript"
                type="file"
                classNames={{ label: "font-serif" }}
                isRequired
                isDisabled={isDisabled}
                accept=".docx,.doc"
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
                  {status === "sending" && "Submitting..."}
                  {status === "idle" && "Submit Manuscript"}
                  {status === "error" && "Submit Manuscript"}
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
                      <span>Submitted</span>
                    </span>
                  )}
                </SiteButton>
              </div>

              {(status === "success" || status === "error") && (
                <div className="absolute left-0 top-full mt-2 max-w-lg pr-4">
                  {status === "success" && (
                    <p className="text-green-200 text-sm">
                      Submission sent successfully.
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
