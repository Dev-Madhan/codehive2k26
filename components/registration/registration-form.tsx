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
  IdCardIcon,
  BusIcon,
} from "lucide-react";
import { TeamIdUploader } from "@/components/registration/team-id-uploader";
import { VelTechPickupSelector } from "@/components/registration/veltech-pickup-selector";
import { toast } from "sonner";
import { DigitalEventPass } from "@/components/tickets/digital-event-pass";
import { RegistrationSuccessPayload } from "@/types/registration";

// ─────────────────────────────────────────────────
// CONSTANTS (Cleaned - No brackets)
// ─────────────────────────────────────────────────

const TEAM_SIZE_OPTIONS = [
  { value: "3", label: "Team of 3 (Required)" },
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
  collegeIdUrl?: string;
  transportOptIn?: boolean;
  pickupRoute?: string;
  pickupStop?: string;
  pickupLandmark?: string;
}

type OtpStatus = "idle" | "sending" | "sent" | "verifying" | "verified";

// ─────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────

export function RegistrationForm({
  eventId,
  eventName,
  userId = "user_placeholder_session_id",
  minTeamSize = 3,
  maxTeamSize = 3,
}: Props) {
  // Core form state - Fixed strictly to 3 members
  const [teamSize, setTeamSize] = useState<string>("3");
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState<string>("");
  const [members, setMembers] = useState<TeamMember[]>([
    {
      name: "",
      phone: "",
      collegeIdUrl: "",
      transportOptIn: false,
      pickupRoute: "",
      pickupStop: "",
      pickupLandmark: "",
    },
    {
      name: "",
      phone: "",
      collegeIdUrl: "",
      transportOptIn: false,
      pickupRoute: "",
      pickupStop: "",
      pickupLandmark: "",
    },
  ]);
  const [idCardPdf, setIdCardPdf] = useState<File | null>(null);

  // Vel Tech Campus Transportation state
  const [transportOptIn, setTransportOptIn] = useState<boolean>(false);
  const [samePickupForTeam, setSamePickupForTeam] = useState<boolean>(true);
  const [leaderPickupRoute, setLeaderPickupRoute] = useState<string>("");
  const [leaderPickupStop, setLeaderPickupStop] = useState<string>("");
  const [leaderPickupLandmark, setLeaderPickupLandmark] = useState<string>("");

  // Email OTP flow state
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [verificationToken, setVerificationToken] = useState("");

  // Submission state
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] =
    useState<RegistrationSuccessPayload | null>(null);
  const [copied, setCopied] = useState(false);

  // Derived state
  const isEmailVerified = otpStatus === "verified";
  const teamSizeNum = parseInt(teamSize, 10) || 1;

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
            collegeIdUrl: "",
            transportOptIn: false,
            pickupRoute: "",
            pickupStop: "",
            pickupLandmark: "",
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
    (index: number, field: keyof TeamMember, value: any) => {
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
    setUploadStep(null);

    // Validate Team Name
    if (!teamName.trim()) {
      setError("Please provide a team name for your 3-member squad.");
      setLoading(false);
      return;
    }

    // Validate Member 02 and Member 03 fields
    if (
      members.length !== 2 ||
      members.some((m) => !m.name.trim() || !m.phone.trim())
    ) {
      setError(
        "Please provide full name and mobile number for both Member 02 and Member 03."
      );
      setLoading(false);
      return;
    }

    // Validate unique phones across all 3 members
    const allPhones = [leaderPhone.trim(), ...members.map((m) => m.phone.trim())];
    if (new Set(allPhones).size !== 3) {
      setError(
        "All 3 team members (Leader, Member 02, and Member 03) must have distinct mobile numbers."
      );
      setLoading(false);
      return;
    }

    // Validate that the mandatory ID cards PDF is selected
    if (!idCardPdf) {
      setError(
        "Please upload a single merged PDF containing the College ID cards of all 3 team members."
      );
      setLoading(false);
      return;
    }

    // Validate Vel Tech bus pickup details if opted in
    if (transportOptIn) {
      if (!leaderPickupRoute || !leaderPickupStop || !leaderPickupLandmark.trim()) {
        setError(
          !samePickupForTeam
            ? "Please complete the Team Leader's Vel Tech bus pickup details (Route, Stop, and Landmark)."
            : "Please complete all Vel Tech bus pickup details (Route, Stop, and Landmark)."
        );
        setLoading(false);
        return;
      }

      if (!samePickupForTeam) {
        for (let i = 0; i < members.length; i++) {
          const m = members[i];
          if (m.transportOptIn && (!m.pickupRoute || !m.pickupStop || !m.pickupLandmark?.trim())) {
            setError(`Please complete Member ${i + 2}'s Vel Tech bus pickup details (Route, Stop, and Landmark).`);
            setLoading(false);
            return;
          }
        }
      }
    }

    try {
      // ─────────────────────────────────────────────────────────────
      // STEP 1: Upload the single PDF to Tigris Storage
      // ─────────────────────────────────────────────────────────────
      setUploadStep("Uploading ID cards document...");

      const uploadRes = await fetch("/api/upload/college-id", {
        method: "POST",
        headers: {
          "Content-Type": idCardPdf.type || "application/pdf",
        },
        body: idCardPdf,
      });

      if (!uploadRes.ok) {
        let errorMsg = "Failed to upload ID cards document.";
        try {
          const errData = await uploadRes.json();
          if (errData.error) errorMsg = errData.error;
        } catch {}
        throw new Error(errorMsg);
      }

      const uploadResult = (await uploadRes.json()) as { url: string; key: string };
      const uploadedPdfUrl = uploadResult.url;

      // ─────────────────────────────────────────────────────────────
      // STEP 2: Create Registration Record with the Tigris S3 URL
      // ─────────────────────────────────────────────────────────────
      setUploadStep("Finalizing event registration record...");

      const effectiveUserId = session?.user?.id || userId;
      const res = await createRegistration(effectiveUserId, {
        eventId,
        teamSize: "3",
        teamName: teamName.trim(),
        name: leaderName,
        email: leaderEmail,
        phone: leaderPhone,
        college,
        department,
        year: year as any,
        imageUrl: uploadedPdfUrl,
        emailVerificationToken: verificationToken,
        transportOptIn,
        samePickupForTeam,
        pickupRoute: transportOptIn ? leaderPickupRoute : undefined,
        pickupStop: transportOptIn ? leaderPickupStop : undefined,
        pickupLandmark: transportOptIn ? leaderPickupLandmark : undefined,
        members: members.map((m) => ({
          name: m.name.trim(),
          phone: m.phone.trim(),
          collegeIdUrl: uploadedPdfUrl, // All team members reference the team's combined PDF
          transportOptIn: samePickupForTeam ? transportOptIn : Boolean(m.transportOptIn),
          pickupRoute: samePickupForTeam ? (transportOptIn ? leaderPickupRoute : undefined) : m.pickupRoute,
          pickupStop: samePickupForTeam ? (transportOptIn ? leaderPickupStop : undefined) : m.pickupStop,
          pickupLandmark: samePickupForTeam ? (transportOptIn ? leaderPickupLandmark : undefined) : m.pickupLandmark,
        })),
      });

      if (res.success) {
        setSuccessData(res.data);
        toast.success("Registration Confirmed!", {
          description: `Event pass generated for ${eventName}. Pass Code: ${res.data.registrationNumber}`,
        });
      } else {
        setError(res.error.message);
        toast.error("Registration Failed", {
          description: res.error.message,
        });
      }
    } catch (err: any) {
      console.error("[Registration Submit Error]", err);
      const errMsg =
        err.message ||
        "An unexpected error occurred during registration. Please verify your connection and try again.";
      setError(errMsg);
      toast.error("Submission Error", {
        description: errMsg,
      });
    } finally {
      setLoading(false);
      setUploadStep(null);
    }
  };

  // ─────────────────────────────────────────────────
  // SUCCESS STATE: RENDER CYBERPUNK DIGITAL EVENT PASS
  // ─────────────────────────────────────────────────

  if (successData) {
    return (
      <DigitalEventPass
        ticket={successData}
        onRegisterAnother={() => {
          setSuccessData(null);
          setLeaderName("");
          setLeaderPhone("");
          setLeaderEmail("");
          setOtpStatus("idle");
          setVerificationToken("");
          setCollege("");
          setDepartment("");
          setYear("");
          setTeamName("");
          setIdCardPdf(null);
          setMembers([
            {
              name: "",
              phone: "",
              collegeIdUrl: "",
              transportOptIn: false,
              pickupRoute: "",
              pickupStop: "",
              pickupLandmark: "",
            },
            {
              name: "",
              phone: "",
              collegeIdUrl: "",
              transportOptIn: false,
              pickupRoute: "",
              pickupStop: "",
              pickupLandmark: "",
            },
          ]);
          setTransportOptIn(false);
          setSamePickupForTeam(true);
          setLeaderPickupRoute("");
          setLeaderPickupStop("");
          setLeaderPickupLandmark("");
        }}
      />
    );
  }

  // ─────────────────────────────────────────────────
  // FORM STATE
  // ─────────────────────────────────────────────────

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
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {error && (
        <div className="p-3.5 rounded-none border border-red-900/50 bg-red-950/20 text-xs font-mono text-red-400 leading-relaxed">
          {error}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          SECTION 01: TEAM CONFIGURATION
          ═══════════════════════════════════════════════ */}
      <div className="rounded-none border border-[#262626] bg-[#0F0F0F] p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <UsersIcon className="size-4 text-white" />
            <h3 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
              Section 01: Team Configuration
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 border border-[#383838] bg-[#141414] text-neutral-300">
            Strictly 3 Members
          </span>
        </div>

        {/* Rule Policy Banner */}
        <div className="flex items-center gap-2 p-2.5 bg-[#121212] border border-[#262626] font-mono text-[11px] text-neutral-300">
          <span className="text-white font-bold">// ENTRY POLICY:</span>
          <span>Each team must have exactly 3 builders (1 Leader + 2 Members). Solo &amp; dual entries are disabled.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-team-size"
              className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block"
            >
              Team Size <span className="text-red-400">*</span>
            </Label>
            <Select
              value={teamSize}
              onValueChange={(val) => {
                if (val) setTeamSize(val);
              }}
            >
              <SelectTrigger
                id="reg-team-size"
                className="h-11 sm:h-10 w-full rounded-none border border-[#262626] bg-[#080808] px-3 text-white font-sans text-base sm:text-sm focus:border-white focus:ring-1 focus:ring-white data-placeholder:text-neutral-500"
              >
                <SelectValue placeholder="Team of 3 (Required)" />
              </SelectTrigger>
              <SelectContent className="border-[#262626] bg-[#0F0F0F] text-white">
                <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#737373] border-b border-[#262626] mb-1 flex items-center justify-between font-mono">
                  <span>// SQUAD SIZE</span>
                </div>
                <SelectGroup>
                  {teamOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-none hover:bg-[#161616] text-neutral-200"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="reg-team-name"
              className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block"
            >
              Team Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="reg-team-name"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. CodeHive Trio"
              className="h-11 sm:h-10 rounded-none border border-[#262626] bg-[#080808] text-white font-sans text-base sm:text-sm placeholder:text-neutral-500 focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 02: TEAM LEADER
          ═══════════════════════════════════════════════ */}
      <div className="rounded-none border border-[#262626] bg-[#0F0F0F] p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <UserIcon className="size-4 text-white" />
            <h3 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
              Section 02: Team Leader
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#737373]">
            Member 01 • Primary Contact
          </span>
        </div>

        {/* Leader Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reg-leader-name"
            className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block"
          >
            Full Name
          </Label>
          <Input
            id="reg-leader-name"
            required
            value={leaderName}
            onChange={(e) => setLeaderName(e.target.value)}
            placeholder="Jane Doe"
            className="h-11 sm:h-10 rounded-none border border-[#262626] bg-[#080808] text-white font-sans text-base sm:text-sm placeholder:text-neutral-500 focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>

        {/* Email + Real-Time OTP Section */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-leader-email"
              className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block"
            >
              Email Address
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-500 pointer-events-none" />
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
                  className="h-11 sm:h-10 pl-9 rounded-none border border-[#262626] bg-[#080808] text-white font-sans text-base sm:text-sm placeholder:text-neutral-500 focus:border-white focus:ring-1 focus:ring-white disabled:opacity-60"
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
                  className="h-11 sm:h-10 px-4 font-mono text-[11px] uppercase tracking-wider font-bold rounded-none bg-white hover:bg-neutral-200 text-black border border-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 w-full sm:w-auto justify-center"
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
            <div className="space-y-3 p-3.5 sm:p-4 rounded-none border border-[#262626] bg-[#080808]">
              {otpSuccessMessage && (
                <p className="text-[11px] font-mono text-white">
                  {otpSuccessMessage}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5 sm:items-end">
                <div className="w-full sm:flex-1 space-y-1.5">
                  <Label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
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
                    className="h-11 sm:h-10 rounded-none border border-[#262626] bg-[#0F0F0F] text-white font-mono text-base sm:text-sm tracking-[0.4em] sm:tracking-[0.5em] text-center placeholder:text-neutral-500 placeholder:tracking-[0.3em] focus:border-white focus:ring-1 focus:ring-white"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpCode.length !== 6 || otpStatus === "verifying"}
                  className="h-11 sm:h-10 px-5 font-mono text-[11px] uppercase tracking-wider font-bold rounded-none bg-white hover:bg-neutral-200 text-black border border-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 w-full sm:w-auto justify-center"
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
            <div className="flex items-center gap-2 p-2.5 rounded-none border border-white/50 bg-[#161616]">
              <ShieldCheckIcon className="size-4 text-white shrink-0" />
              <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                Email Authorized &amp; Verified
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
            className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block"
          >
            Mobile Number
          </Label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-500 pointer-events-none" />
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
              className="h-11 sm:h-10 pl-9 rounded-none border border-[#262626] bg-[#080808] text-white font-sans text-base sm:text-sm placeholder:text-neutral-500 focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>
        </div>

        {/* College + Year */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label
              htmlFor="reg-college"
              className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block"
            >
              College / Institution
            </Label>
            <Input
              id="reg-college"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Engineering College"
              className="h-11 sm:h-10 rounded-none border border-[#262626] bg-[#080808] text-white font-sans text-base sm:text-sm placeholder:text-neutral-500 focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="reg-year"
              className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block"
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
                className="h-11 sm:h-10 w-full rounded-none border border-[#262626] bg-[#080808] px-3 text-white font-sans text-base sm:text-sm focus:border-white focus:ring-1 focus:ring-white data-placeholder:text-neutral-500"
              >
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="border-[#262626] bg-[#0F0F0F] text-white">
                <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#737373] border-b border-[#262626] mb-1 flex items-center justify-between font-mono">
                  <span>// YEAR OF STUDY</span>
                </div>
                <SelectGroup>
                  {YEAR_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-none hover:bg-[#161616] text-neutral-200"
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
            className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block"
          >
            Department
          </Label>
          <Input
            id="reg-dept"
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Computer Science & Engineering"
            className="h-11 sm:h-10 rounded-none border border-[#262626] bg-[#080808] text-white font-sans text-base sm:text-sm placeholder:text-neutral-500 focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>

      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 03: TEAM ROSTER (MEMBER 02 & MEMBER 03)
          ═══════════════════════════════════════════════ */}
      {members.length > 0 && (
        <div className="rounded-none border border-[#262626] bg-[#0F0F0F] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 border-b border-[#262626] pb-3">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-white" />
              <h3 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                Section 03: Team Roster (Members 02 &amp; 03)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#737373]">
              Leader is recorded as Member 01
            </span>
          </div>

          {members.map((member, index) => (
            <div
              key={index}
              className="space-y-3 p-3.5 sm:p-4 rounded-none border border-[#262626] bg-[#080808]"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center size-6 rounded-none border border-[#404040] bg-[#161616] text-[10px] font-mono font-bold text-white">
                  {String(index + 2).padStart(2, "0")}
                </span>
                <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                  Member {String(index + 2).padStart(2, "0")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block">
                    Full Name
                  </Label>
                  <Input
                    required
                    value={member.name}
                    onChange={(e) =>
                      updateMember(index, "name", e.target.value)
                    }
                    placeholder="Member name"
                    className="h-11 sm:h-10 rounded-none border border-[#262626] bg-[#0F0F0F] text-white font-sans text-base sm:text-sm placeholder:text-neutral-500 focus:border-white focus:ring-1 focus:ring-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-sans text-xs uppercase tracking-wider text-neutral-300 font-semibold block">
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
                    className="h-11 sm:h-10 rounded-none border border-[#262626] bg-[#0F0F0F] text-white font-sans text-base sm:text-sm placeholder:text-neutral-500 focus:border-white focus:ring-1 focus:ring-white"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          SECTION: VEL TECH CAMPUS TRANSPORTATION (6:00 AM ONWARDS)
          ═══════════════════════════════════════════════ */}
      <div className="rounded-none border border-[#262626] bg-[#0F0F0F] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <BusIcon className="size-4 text-white shrink-0" />
            <h3 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
              {teamSizeNum > 1
                ? "Section 04: Vel Tech Campus Transportation Logistics"
                : "Section 03: Vel Tech Campus Transportation Logistics"}
            </h3>
          </div>
          <span className="self-start sm:self-auto text-[10px] font-mono text-[#E5E5E5] font-semibold border border-[#404040] bg-[#161616] px-2 py-0.5">
            FREE SERVICE • 6:00 AM ONWARDS
          </span>
        </div>

        <p className="text-xs font-sans text-neutral-300 leading-relaxed">
          Vel Tech provides complimentary campus bus transportation for all registered participants across major city corridors starting from{" "}
          <strong className="text-white font-mono">6:00 AM onwards</strong>.
        </p>

        {/* Transportation Mode Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setTransportOptIn(false)}
            className={`p-3.5 text-left border transition-all rounded-none cursor-pointer flex flex-col gap-1 ${
              !transportOptIn
                ? "border-white bg-[#161616] text-white shadow-sm"
                : "border-[#262626] bg-[#080808] text-neutral-400 hover:border-neutral-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-200">
                🚗 Own Transportation
              </span>
              {!transportOptIn && (
                <span className="size-2 rounded-full bg-white" />
              )}
            </div>
            <span className="text-[11px] text-neutral-400 font-sans">
              I / our team will reach the Vel Tech campus directly on our own.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTransportOptIn(true)}
            className={`p-3.5 text-left border transition-all rounded-none cursor-pointer flex flex-col gap-1 ${
              transportOptIn
                ? "border-white bg-[#161616] text-white shadow-sm"
                : "border-[#262626] bg-[#080808] text-neutral-400 hover:border-neutral-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                🚌 Vel Tech Bus Pickup
              </span>
              {transportOptIn && (
                <span className="size-2 rounded-full bg-white animate-pulse" />
              )}
            </div>
            <span className="text-[11px] text-neutral-400 font-sans">
              Avail free Vel Tech bus pickup from designated city stops from 6:00 AM onwards.
            </span>
          </button>
        </div>

        {/* Expanded Transport Configuration */}
        {transportOptIn && (
          <div className="space-y-4 pt-2">
            {teamSizeNum > 1 && (
              <div className="p-3.5 border border-[#262626] bg-[#080808] space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                  Team Boarding Preference:
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSamePickupForTeam(true)}
                    className={`p-2.5 text-left text-xs font-mono border transition-all cursor-pointer ${
                      samePickupForTeam
                        ? "border-white bg-[#161616] text-white font-bold"
                        : "border-[#262626] text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    [•] All Team Members Board Together
                  </button>
                  <button
                    type="button"
                    onClick={() => setSamePickupForTeam(false)}
                    className={`p-2.5 text-left text-xs font-mono border transition-all cursor-pointer ${
                      !samePickupForTeam
                        ? "border-white bg-[#161616] text-white font-bold"
                        : "border-[#262626] text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    [ ] Individual Member Pickup Locations
                  </button>
                </div>
              </div>
            )}

            {/* If same pickup for team (or individual participant) */}
            {(samePickupForTeam || teamSizeNum === 1) ? (
              <VelTechPickupSelector
                title={
                  teamSizeNum > 1
                    ? `Vel Tech Boarding Details (Entire Team: ${teamSizeNum} Passengers)`
                    : "Vel Tech Boarding Details (Participant)"
                }
                routeValue={leaderPickupRoute}
                stopValue={leaderPickupStop}
                landmarkValue={leaderPickupLandmark}
                onRouteChange={setLeaderPickupRoute}
                onStopChange={setLeaderPickupStop}
                onLandmarkChange={setLeaderPickupLandmark}
                passengerCount={teamSizeNum}
                showScheduleNotice={true}
              />
            ) : (
              /* Individual Pickups per member */
              <div className="space-y-4">
                {/* Leader Pickup */}
                <VelTechPickupSelector
                  title={`Member 01 (Team Leader: ${leaderName || "Leader"})`}
                  routeValue={leaderPickupRoute}
                  stopValue={leaderPickupStop}
                  landmarkValue={leaderPickupLandmark}
                  onRouteChange={setLeaderPickupRoute}
                  onStopChange={setLeaderPickupStop}
                  onLandmarkChange={setLeaderPickupLandmark}
                  passengerCount={1}
                  showScheduleNotice={true}
                />

                {/* Additional Members Pickups */}
                {members.map((member, idx) => (
                  <div key={idx} className="space-y-3 p-3.5 border border-[#262626] bg-[#080808]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-neutral-300 uppercase">
                        Member {String(idx + 2).padStart(2, "0")}: {member.name || `Member ${idx + 2}`}
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-white">
                        <input
                          type="checkbox"
                          checked={Boolean(member.transportOptIn)}
                          onChange={(e) =>
                            updateMember(idx, "transportOptIn", e.target.checked)
                          }
                          className="size-3.5 rounded-none border border-[#262626] bg-[#0F0F0F] accent-white"
                        />
                        <span>Needs Vel Tech Bus</span>
                      </label>
                    </div>

                    {member.transportOptIn && (
                      <VelTechPickupSelector
                        routeValue={member.pickupRoute || ""}
                        stopValue={member.pickupStop || ""}
                        landmarkValue={member.pickupLandmark || ""}
                        onRouteChange={(val) => updateMember(idx, "pickupRoute", val)}
                        onStopChange={(val) => updateMember(idx, "pickupStop", val)}
                        onLandmarkChange={(val) => updateMember(idx, "pickupLandmark", val)}
                        passengerCount={1}
                        showScheduleNotice={false}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 05: COLLEGE ID CARDS (SINGLE PDF)
          ═══════════════════════════════════════════════ */}
      <div className="rounded-none border border-[#262626] bg-[#0F0F0F] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <IdCardIcon className="size-4 text-white shrink-0" />
            <h3 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
              Section 05: Team College ID Cards (Single PDF)
            </h3>
          </div>
          <span className="self-start sm:self-auto text-[10px] font-mono text-[#E5E5E5] font-semibold border border-[#404040] bg-[#161616] px-2 py-0.5">
            MANDATORY • SINGLE PDF
          </span>
        </div>

        <p className="text-xs font-mono text-neutral-300 leading-relaxed">
          The team leader must upload a single merged PDF containing the College ID cards of all 3 team members (Leader + Member 02 + Member 03).
        </p>

        <TeamIdUploader
          id="team-ids-pdf"
          teamSize={3}
          onFileChange={setIdCardPdf}
          disabled={loading}
        />
      </div>

      {/* ═══════════════════════════════════════════════
          SUBMIT BUTTON
          ═══════════════════════════════════════════════ */}
      {(() => {
        const isTransportComplete =
          !transportOptIn ||
          (Boolean(leaderPickupRoute) &&
            Boolean(leaderPickupStop) &&
            Boolean(leaderPickupLandmark && leaderPickupLandmark.trim().length >= 3) &&
            (samePickupForTeam ||
              members.every(
                (m) =>
                  !m.transportOptIn ||
                  (Boolean(m.pickupRoute) &&
                    Boolean(m.pickupStop) &&
                    Boolean(m.pickupLandmark && m.pickupLandmark.trim().length >= 3))
              )));

        return (
          <Button
            type="submit"
            disabled={loading || !isEmailVerified || !year || !idCardPdf || !isTransportComplete}
            className="h-12 sm:h-11 w-full font-mono text-xs sm:text-sm uppercase tracking-wider font-bold rounded-none bg-white hover:bg-neutral-200 active:scale-[0.99] text-black border border-white transition-all cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed justify-center"
          >
            {loading ? (
              <>
                <Loader2Icon className="size-4 animate-spin mr-2" />
                {uploadStep || "Processing Registration..."}
              </>
            ) : !isEmailVerified ? (
              "Verify Email to Continue"
            ) : !idCardPdf ? (
              "Upload College ID PDF to Continue"
            ) : !isTransportComplete ? (
              "Complete Vel Tech Bus Details to Continue"
            ) : (
              `Confirm & Register ${teamSizeNum > 1 ? "Team" : ""}`
            )}
          </Button>
        );
      })()}
    </form>
  );
}

export default RegistrationForm;
