"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRegistration } from "@/actions/registration";
import { sendEmailOtp, verifyEmailOtp } from "@/actions/otp";
import { useSession } from "@/lib/auth-client";
import {
  CheckIcon,
  CopyIcon,
  ShieldCheckIcon,
  Loader2Icon,
  SendIcon,
  UsersIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────
// CONSTANTS (Cleaned - No brackets)
// ─────────────────────────────────────────────────

const TEAM_SIZE_OPTIONS = [
  { value: "1", label: "Individual" },
  { value: "2", label: "2 Members" },
  { value: "3", label: "3 Members" },
];

const YEAR_OPTIONS = [
  { value: "1st Year", label: "1st Year" },
  { value: "2nd Year", label: "2nd Year" },
  { value: "3rd Year", label: "3rd Year" },
  { value: "4th Year", label: "4th Year" },
  { value: "Postgraduate", label: "Postgraduate" },
];

// ─────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────

interface Props {
  eventId: string;
  eventName: string;
  userId?: string;
  minTeamSize?: number;
  maxTeamSize?: number;
}

interface TeamMember {
  name: string;
  phone: string;
}

type OtpStatus = "idle" | "sending" | "sent" | "verifying" | "verified";

// ─────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────

export function RegistrationForm({
  eventId,
  eventName,
  userId = "user_placeholder_session_id",
  minTeamSize = 1,
  maxTeamSize = 3,
}: Props) {
  // Core form state
  const [teamSize, setTeamSize] = useState<string>(
    minTeamSize > 1 ? String(minTeamSize) : "1"
  );
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState<string>("");
  const [members, setMembers] = useState<TeamMember[]>([]);

  // Email OTP flow state
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [verificationToken, setVerificationToken] = useState("");

  // Submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    registrationNumber: string;
    qrToken: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Auth session
  const { data: session } = useSession();

  // Pre-fill user data if logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !leaderName) setLeaderName(session.user.name);
      if (session.user.email && !leaderEmail) setLeaderEmail(session.user.email);
    }
  }, [session]);

  // ───── Dynamic Members Sync ────────────────────
  useEffect(() => {
    const count = parseInt(teamSize) - 1;
    setMembers((prev) => {
      if (count === 0) return [];
      if (count > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: count - prev.length }, () => ({
            name: "",
            phone: "",
          })),
        ];
      }
      return prev.slice(0, count);
    });
  }, [teamSize]);

  // ───── Cooldown Timer ──────────────────────────
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // ───── Member Update Handler ───────────────────
  const updateMember = useCallback(
    (index: number, field: keyof TeamMember, value: string) => {
      setMembers((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    []
  );

  // ───── Email OTP: Send ────────────────────────
  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leaderEmail.trim())) {
      setOtpError("Please enter a valid email address first.");
      return;
    }

    setOtpStatus("sending");
    setOtpError(null);
    setOtpSuccessMessage(null);

    const res = await sendEmailOtp(leaderEmail, eventName);

    if (res.success) {
      setOtpStatus("sent");
      setCooldown(res.data.cooldownSeconds);
      setOtpSuccessMessage(res.message || "OTP code sent to your email.");
    } else {
      setOtpStatus("idle");
      setOtpError(res.error.message);
    }
  };

  // ───── Email OTP: Verify ──────────────────────
  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otpCode.trim())) {
      setOtpError("Enter the 6-digit OTP received in your email.");
      return;
    }

    setOtpStatus("verifying");
    setOtpError(null);

    const res = await verifyEmailOtp(leaderEmail, otpCode);

    if (res.success) {
      setOtpStatus("verified");
      setVerificationToken(res.data.verificationToken);
      setOtpError(null);
      setOtpSuccessMessage(res.message || "Email verified successfully!");
    } else {
      setOtpStatus("sent");
      setOtpError(res.error.message);
    }
  };

  // ───── Form Submit ─────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const effectiveUserId = session?.user?.id || userId;
    const res = await createRegistration(effectiveUserId, {
      eventId,
      teamSize: teamSize as "1" | "2" | "3",
      teamName: parseInt(teamSize) > 1 ? teamName : undefined,
      name: leaderName,
      email: leaderEmail,
      phone: leaderPhone,
      college,
      department,
      year: year as any,
      emailVerificationToken: verificationToken,
      members,
    });

    setLoading(false);

    if (res.success) {
      setSuccessData(res.data);
    } else {
      setError(res.error.message);
    }
  };

  // ───── Copy ID ─────────────────────────────────
  const copyId = () => {
    if (successData?.registrationNumber) {
      navigator.clipboard.writeText(successData.registrationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ─────────────────────────────────────────────────
  // SUCCESS STATE
  // ─────────────────────────────────────────────────

  if (successData) {
    return (
      <div className="rounded-none border border-blue-500/50 bg-[#060D1A] p-8 text-center space-y-5">
        <div className="inline-flex size-12 items-center justify-center rounded-none bg-blue-600/20 text-blue-400 border border-blue-500/40 text-xl font-mono font-bold">
          <CheckIcon className="size-6" />
        </div>
        <div>
          <h3 className="text-xl font-mono font-bold text-white uppercase tracking-wider">
            Registration Successful
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-1">
            {parseInt(teamSize) > 1 ? "Team" : "Individual"} registration
            confirmed for{" "}
            <span className="text-white font-semibold">{eventName}</span>.
          </p>
        </div>

        <div className="p-4 rounded-none border border-[#152A54] bg-[#03060E] space-y-2">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Registration ID
          </div>
          <div className="text-lg font-mono font-bold text-blue-400 tracking-wider">
            {successData.registrationNumber}
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            A confirmation email with your event pass and check-in QR code has been dispatched to{" "}
            <span className="text-white font-semibold">{leaderEmail}</span>.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={copyId}
            className="inline-flex items-center gap-1.5 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-300 bg-[#0B162C] border border-[#152A54] hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
          >
            <CopyIcon className="size-3 text-blue-400" />
            <span>{copied ? "COPIED" : "COPY ID"}</span>
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────
  // FORM STATE
  // ─────────────────────────────────────────────────

  const isEmailVerified = otpStatus === "verified";
  const teamSizeNum = parseInt(teamSize);

  // Filter team size options based on event constraints
  const filteredTeamSizeOptions = TEAM_SIZE_OPTIONS.filter((opt) => {
    const val = parseInt(opt.value);
    return val >= minTeamSize && val <= maxTeamSize;
  });
  const teamOptions =
    filteredTeamSizeOptions.length > 0
      ? filteredTeamSizeOptions
      : TEAM_SIZE_OPTIONS;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-none border border-red-900/50 bg-red-950/20 text-xs font-mono text-red-400">
          {error}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          SECTION 01: TEAM CONFIGURATION
          ═══════════════════════════════════════════════ */}
      <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#152A54] pb-3">
          <UsersIcon className="size-4 text-blue-400" />
          <h3 className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
            Section 01: Team Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-team-size"
              className="font-sans text-xs uppercase tracking-wider text-slate-300 font-semibold block"
            >
              Team Size
            </Label>
            <Select
              value={teamSize}
              onValueChange={(val) => {
                if (val) setTeamSize(val);
              }}
            >
              <SelectTrigger
                id="reg-team-size"
                className="h-10 w-full rounded-none border border-[#152A54] bg-[#03060E] px-3 text-white font-sans text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 data-placeholder:text-slate-600"
              >
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-[#152A54] bg-[#030712] font-sans text-sm">
                <SelectGroup>
                  {teamOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-none hover:bg-[#0B162C]"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {teamSizeNum > 1 && (
            <div className="space-y-1.5">
              <Label
                htmlFor="reg-team-name"
                className="font-sans text-xs uppercase tracking-wider text-slate-300 font-semibold block"
              >
                Team Name
              </Label>
              <Input
                id="reg-team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. CyberHive"
                className="h-10 rounded-none border border-[#152A54] bg-[#03060E] text-white font-sans text-sm placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 02: TEAM LEADER
          ═══════════════════════════════════════════════ */}
      <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#152A54] pb-3">
          <UserIcon className="size-4 text-blue-400" />
          <h3 className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
            Section 02: Team Leader
          </h3>
        </div>

        {/* Leader Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reg-leader-name"
            className="font-sans text-xs uppercase tracking-wider text-slate-300 font-semibold block"
          >
            Full Name
          </Label>
          <Input
            id="reg-leader-name"
            required
            value={leaderName}
            onChange={(e) => setLeaderName(e.target.value)}
            placeholder="Jane Doe"
            className="h-10 rounded-none border border-[#152A54] bg-[#03060E] text-white font-sans text-sm placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Email + Real-Time OTP Section */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-leader-email"
              className="font-sans text-xs uppercase tracking-wider text-slate-300 font-semibold block"
            >
              Email Address
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
                <Input
                  id="reg-leader-email"
                  type="email"
                  required
                  value={leaderEmail}
                  onChange={(e) => {
                    setLeaderEmail(e.target.value);
                    // Reset OTP state if email is changed after verification
                    if (isEmailVerified) {
                      setOtpStatus("idle");
                      setVerificationToken("");
                      setOtpCode("");
                      setOtpSuccessMessage(null);
                    }
                  }}
                  placeholder="leader@example.com"
                  disabled={isEmailVerified}
                  className="h-10 pl-9 rounded-none border border-[#152A54] bg-[#03060E] text-white font-sans text-sm placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
                />
              </div>
              {!isEmailVerified && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={
                    otpStatus === "sending" ||
                    cooldown > 0 ||
                    !leaderEmail.includes("@")
                  }
                  className="h-10 px-4 font-mono text-[11px] uppercase tracking-wider font-bold rounded-none bg-[#0B162C] hover:bg-[#102246] text-blue-400 border border-[#152A54] hover:border-blue-500/50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {otpStatus === "sending" ? (
                    <Loader2Icon className="size-3.5 animate-spin" />
                  ) : (
                    <SendIcon className="size-3.5" />
                  )}
                  <span className="ml-1.5">
                    {cooldown > 0
                      ? `RESEND (${cooldown}s)`
                      : otpStatus === "sent"
                        ? "RESEND OTP"
                        : "SEND OTP"}
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* OTP Input (Visible after code is sent) */}
          {(otpStatus === "sent" || otpStatus === "verifying") && (
            <div className="space-y-3 p-4 rounded-none border border-[#152A54] bg-[#03060E]">
              {otpSuccessMessage && (
                <p className="text-[11px] font-mono text-blue-400">
                  {otpSuccessMessage}
                </p>
              )}

              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1.5">
                  <Label className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Enter 6-Digit Email OTP
                  </Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="● ● ● ● ● ●"
                    className="h-10 rounded-none border border-[#152A54] bg-[#060D1A] text-white font-mono text-sm tracking-[0.5em] text-center placeholder:text-slate-600 placeholder:tracking-[0.3em] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpCode.length !== 6 || otpStatus === "verifying"}
                  className="h-10 px-4 font-mono text-[11px] uppercase tracking-wider font-bold rounded-none bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {otpStatus === "verifying" ? (
                    <Loader2Icon className="size-3.5 animate-spin" />
                  ) : (
                    <ShieldCheckIcon className="size-3.5" />
                  )}
                  <span className="ml-1.5">VERIFY</span>
                </Button>
              </div>
            </div>
          )}

          {/* Verified Badge */}
          {isEmailVerified && (
            <div className="flex items-center gap-2 p-2.5 rounded-none border border-emerald-700/40 bg-emerald-950/20">
              <ShieldCheckIcon className="size-4 text-emerald-400" />
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Email Authorized & Verified
              </span>
            </div>
          )}

          {/* OTP Error */}
          {otpError && (
            <p className="text-[11px] font-mono text-red-400">
              {otpError}
            </p>
          )}
        </div>

        {/* Leader Mobile Number */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reg-leader-phone"
            className="font-sans text-xs uppercase tracking-wider text-slate-300 font-semibold block"
          >
            Mobile Number
          </Label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
            <Input
              id="reg-leader-phone"
              type="tel"
              required
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              value={leaderPhone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setLeaderPhone(val);
              }}
              placeholder="+91 98765 43210"
              className="h-10 pl-9 rounded-none border border-[#152A54] bg-[#03060E] text-white font-sans text-sm placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* College + Year */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label
              htmlFor="reg-college"
              className="font-sans text-xs uppercase tracking-wider text-slate-300 font-semibold block"
            >
              College / Institution
            </Label>
            <Input
              id="reg-college"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Engineering College"
              className="h-10 rounded-none border border-[#152A54] bg-[#03060E] text-white font-sans text-sm placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="reg-year"
              className="font-sans text-xs uppercase tracking-wider text-slate-300 font-semibold block"
            >
              Year of Study
            </Label>
            <Select
              value={year}
              onValueChange={(val) => {
                if (val) setYear(val);
              }}
            >
              <SelectTrigger
                id="reg-year"
                className="h-10 w-full rounded-none border border-[#152A54] bg-[#03060E] px-3 text-white font-sans text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 data-placeholder:text-slate-600"
              >
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-[#152A54] bg-[#030712] font-sans text-sm">
                <SelectGroup>
                  {YEAR_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-none hover:bg-[#0B162C]"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Department */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reg-dept"
            className="font-sans text-xs uppercase tracking-wider text-slate-300 font-semibold block"
          >
            Department
          </Label>
          <Input
            id="reg-dept"
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Computer Science & Engineering"
            className="h-10 rounded-none border border-[#152A54] bg-[#03060E] text-white font-sans text-sm placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 03: TEAM ROSTER (Only for teamSize > 1)
          ═══════════════════════════════════════════════ */}
      {teamSizeNum > 1 && members.length > 0 && (
        <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#152A54] pb-3">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-blue-400" />
              <h3 className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                Section 03: Team Roster
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Leader is recorded as Member 01
            </span>
          </div>

          {members.map((member, index) => (
            <div
              key={index}
              className="space-y-3 p-4 rounded-none border border-[#152A54]/60 bg-[#03060E]"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center size-6 rounded-none border border-blue-500/40 bg-blue-600/15 text-[10px] font-mono font-bold text-blue-400">
                  {String(index + 2).padStart(2, "0")}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Member {String(index + 2).padStart(2, "0")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-sans text-xs uppercase tracking-wider text-slate-300 font-semibold block">
                    Full Name
                  </Label>
                  <Input
                    required
                    value={member.name}
                    onChange={(e) =>
                      updateMember(index, "name", e.target.value)
                    }
                    placeholder="Member name"
                    className="h-10 rounded-none border border-[#152A54] bg-[#060D1A] text-white font-sans text-sm placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-sans text-xs uppercase tracking-wider text-slate-300 font-semibold block">
                    Mobile Number
                  </Label>
                  <Input
                    required
                    type="tel"
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    value={member.phone}
                    onChange={(e) =>
                      updateMember(
                        index,
                        "phone",
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    placeholder="+91 98765 43210"
                    className="h-10 rounded-none border border-[#152A54] bg-[#060D1A] text-white font-sans text-sm placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          SUBMIT BUTTON
          ═══════════════════════════════════════════════ */}
      <Button
        type="submit"
        disabled={loading || !isEmailVerified || !year}
        className="h-11 w-full font-mono text-xs uppercase tracking-wider font-bold rounded-none bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 transition-colors cursor-pointer shadow-md shadow-blue-950/50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2Icon className="size-4 animate-spin mr-2" />
            Processing Registration...
          </>
        ) : !isEmailVerified ? (
          "Verify Email to Continue"
        ) : (
          `Confirm & Register ${teamSizeNum > 1 ? "Team" : ""}`
        )}
      </Button>
    </form>
  );
}

export default RegistrationForm;
