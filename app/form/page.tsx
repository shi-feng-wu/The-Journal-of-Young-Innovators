"use client";

import Hero from "@/components/Hero";
import SiteButton from "@/components/SiteButton";
import { Checkbox, Form, Input, Select, SelectItem } from "@heroui/react";
import { useRef, useState } from "react";
import { FaChevronCircleRight, FaFileAlt } from "react-icons/fa";

// HeroUI paints the required marker with `after:text-danger` (pink), which is
// off-brand on navy; both forms of the rule are needed because Select scopes
// its marker under `group-data-[required=true]`.
const LABEL_CLASS =
  "font-mono text-xs uppercase tracking-[0.16em] text-white/80 [&>span]:text-white/70 after:text-white/70 group-data-[required=true]:after:text-white/70";

const CREAM_WRAPPER =
  "bg-[#F4EFEB] data-[hover=true]:bg-[#F4EFEB] group-data-[focus=true]:bg-[#F4EFEB]";

const INPUT_CLASS_NAMES = {
  base: "w-full",
  label: LABEL_CLASS,
  input: "text-base sm:text-sm",
  inputWrapper: CREAM_WRAPPER,
};

const SELECT_CLASS_NAMES = {
  base: "w-full",
  label: LABEL_CLASS,
  mainWrapper: "w-full",
  trigger: `${CREAM_WRAPPER} font-mono`,
  value: "font-mono text-base sm:text-sm",
  listbox: "font-mono",
  popoverContent: "font-mono",
};

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
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [hasConsented, setHasConsented] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const isDocx = (file: File) => file.name.toLowerCase().endsWith(".docx");

  const failWith = (message: string) => {
    setErrorMessage(message);
    setStatus("error");
  };

  const acceptFile = (file: File | null) => {
    if (!file) return;
    if (!isDocx(file)) {
      setManuscriptFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      failWith("Manuscripts must be Microsoft Word (.docx) files.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setManuscriptFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      failWith("Manuscript must be 25MB or less.");
      return;
    }
    setManuscriptFile(file);
    setErrorMessage("");
    setStatus("idle");
  };

  const startAnotherSubmission = () => {
    setStatus("idle");
    setErrorMessage("");
    setManuscriptFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const manuscript =
      manuscriptFile ?? fileInputRef.current?.files?.[0] ?? null;

    if (!manuscript) {
      failWith("Attach your manuscript before submitting.");
      return;
    }
    if (!isDocx(manuscript)) {
      failWith("Manuscripts must be Microsoft Word (.docx) files.");
      return;
    }
    if (manuscript.size > MAX_FILE_BYTES) {
      failWith("Manuscript must be 25MB or less.");
      return;
    }
    if (!hasConsented) {
      failWith(
        "Confirm the originality and license statement before submitting.",
      );
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const formData = new FormData(form);
      formData.set("manuscript", manuscript);
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
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

      failWith(serverMessage);
    } catch (error) {
      failWith(
        error instanceof Error
          ? error.message
          : "Failed to submit. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <Hero
        title="Submit a Manuscript"
        subtitle="Submissions from high school and college students are open for the 2025-2026 academic year. Submission and publication are free."
      />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-20 pt-10 pb-24">
        <Form
          className="w-full max-w-4xl items-stretch font-mono text-black space-y-6 sm:space-y-8"
          onSubmit={handleSubmit}
        >
          <div className="w-full space-y-4">
            <h3 className="text-2xl font-normal text-white font-display">
              Author Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                className="w-full"
                label="First Name"
                name="firstName"
                radius="sm"
                labelPlacement="outside-top"
                classNames={INPUT_CLASS_NAMES}
                isRequired
                isDisabled={isDisabled}
                defaultValue={USE_DEFAULT_VALUES ? "Jane" : undefined}
              />
              <Input
                className="w-full"
                label="Last Name"
                name="lastName"
                radius="sm"
                labelPlacement="outside-top"
                classNames={INPUT_CLASS_NAMES}
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
                radius="sm"
                labelPlacement="outside-top"
                classNames={INPUT_CLASS_NAMES}
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
                radius="sm"
                labelPlacement="outside-top"
                classNames={INPUT_CLASS_NAMES}
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
                radius="sm"
                labelPlacement="outside-top"
                classNames={INPUT_CLASS_NAMES}
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
                radius="sm"
                labelPlacement="outside-top"
                isRequired
                isDisabled={isDisabled}
                defaultSelectedKeys={USE_DEFAULT_VALUES ? ["hs-11"] : undefined}
                classNames={SELECT_CLASS_NAMES}
                listboxProps={
                  {
                    className: "max-h-64 overscroll-contain overflow-y-auto",
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
            <h3 className="text-2xl font-normal text-white font-display">
              Manuscript Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                className="w-full sm:col-span-2"
                label="Manuscript Title"
                name="manuscriptTitle"
                radius="sm"
                labelPlacement="outside-top"
                classNames={INPUT_CLASS_NAMES}
                isRequired
                isDisabled={isDisabled}
                defaultValue={
                  USE_DEFAULT_VALUES
                    ? "AI and Innovation in Education"
                    : undefined
                }
              />
              <Select
                className="w-full"
                label="Submission Type"
                name="submissionType"
                radius="sm"
                labelPlacement="outside-top"
                isRequired
                isDisabled={isDisabled}
                classNames={SELECT_CLASS_NAMES}
              >
                <SelectItem key="research-article">Research Article</SelectItem>
                <SelectItem key="literature-review">
                  Literature Review
                </SelectItem>
                <SelectItem key="opinion-piece">Opinion Piece</SelectItem>
              </Select>
            </div>
            <div>
              <p className="mb-1.5 ml-0.5 font-mono text-xs uppercase tracking-[0.16em] text-white/80">
                Manuscript<span className="ml-0.5 text-white/70">*</span>
              </p>
              <div
                role="button"
                tabIndex={isDisabled ? -1 : 0}
                aria-label="Upload manuscript"
                onClick={() => !isDisabled && fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!isDisabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (isDisabled) return;
                  acceptFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`w-full rounded-lg border-2 border-dashed px-5 py-6 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer select-none ${
                  isDisabled
                    ? "opacity-40 cursor-not-allowed border-white/20"
                    : isDragging
                      ? "border-white bg-white/10"
                      : "border-white/30 hover:border-white/60 hover:bg-white/5"
                }`}
              >
                <FaFileAlt className="text-white/60 text-2xl" />
                {manuscriptFile ? (
                  <p className="text-white text-sm font-mono text-center break-all">
                    {manuscriptFile.name}
                  </p>
                ) : (
                  <>
                    <p className="text-white/80 text-sm font-text">
                      Click or drag &amp; drop to upload
                    </p>
                    <p className="text-white/40 text-xs font-mono">
                      .docx · max 25 MB
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                name="manuscript"
                accept=".docx"
                disabled={isDisabled}
                className="hidden"
                onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {/* flex gap rather than space-y: HeroUI's checkbox base carries a
                `-m-2` hit-area margin that outranks Tailwind's space-y rule. */}
          <div className="w-full flex flex-col items-start gap-6 pt-2">
            <Checkbox
              name="consent"
              value="yes"
              isSelected={hasConsented}
              onValueChange={setHasConsented}
              isDisabled={isDisabled}
              radius="sm"
              classNames={{
                base: "items-start max-w-3xl",
                wrapper:
                  "mt-0.5 before:border-white/50 after:bg-[#F4EFEB] group-data-[hover=true]:before:border-white",
                icon: "text-primary",
                label: "font-text text-sm text-white/85",
              }}
            >
              I confirm this work is original, is not under review elsewhere,
              and may be published under the CC BY 4.0 license.
            </Checkbox>

            {status === "success" && (
              <div
                role="status"
                aria-live="polite"
                className="max-w-2xl space-y-2 border-l-2 border-white/50 pl-4"
              >
                <p className="font-text text-sm text-white">
                  Submission received. We sent a confirmation summary to the
                  email address you entered.
                </p>
                <button
                  type="button"
                  onClick={startAnotherSubmission}
                  className="font-mono text-xs uppercase tracking-[0.16em] text-white/70 underline underline-offset-4 hover:text-white cursor-pointer"
                >
                  Submit another manuscript
                </button>
              </div>
            )}

            {status === "error" && (
              <p
                role="alert"
                className="max-w-2xl border-l-2 border-white/50 pl-4 font-text text-sm text-[#F4EFEB]"
              >
                {errorMessage}
              </p>
            )}

            <SiteButton
              color="primary"
              variant="ghost"
              size="lg"
              type="submit"
              variantStyle="whiteHover"
              isDisabled={isDisabled}
              className="w-full sm:w-auto sm:min-w-64 justify-center border-white text-white"
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
        </Form>
      </div>
    </div>
  );
}
