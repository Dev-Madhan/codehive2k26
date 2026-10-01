"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
} from "react-icons/md";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export interface Auth3SocialProvider {
  /** Unique key for the provider */
  id: string;
  /** Display label */
  label: string;
  /** Filled icon node */
  icon: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
}

export interface Auth3Props {
  /** Brand / product name */
  brandName?: string;
  /** One-line brand descriptor */
  brandDescriptor?: string;
  /** Social OAuth providers shown above the form */
  socialProviders?: Auth3SocialProvider[];
  /** Divider text between social and email form */
  dividerText?: string;
  /** Label for the sign-in submit button */
  signInLabel?: string;
  /** Label for the sign-up submit button */
  signUpLabel?: string;
  /** Forgot-password link text */
  forgotPasswordText?: string;
  /** Callback when forgot-password is clicked */
  onForgotPassword?: () => void;
  /** Callback when sign-in form is submitted */
  onSignIn?: (email: string, password: string) => void;
  /** Callback when sign-up form is submitted */
  onSignUp?: (name: string, email: string, password: string) => void;
  /** Terms of service link href */
  termsHref?: string;
  /** Privacy policy link href */
  privacyHref?: string;
}

const DEFAULT_SOCIAL_PROVIDERS: Auth3SocialProvider[] = [
  {
    id: "google",
    label: "Google",
    icon: <FaGoogle className="h-4 w-4" />,
  },
  {
    id: "github",
    label: "GitHub",
    icon: <FaGithub className="h-4 w-4" />,
  },
];

interface PasswordInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}

function PasswordInput({
  id,
  placeholder,
  value,
  onChange,
  autoComplete,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <MdLock className="text-slate-500 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 pointer-events-none" />
      <Input
        id={id}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-none border border-[#152A54] bg-[#03060E] dark:bg-[#03060E] pl-10 pr-10 text-xs font-mono text-white placeholder:text-slate-600 shadow-none outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-colors"
        required
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-slate-500 hover:text-white absolute top-1/2 right-3 -translate-y-1/2 transition-colors cursor-pointer"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <MdVisibilityOff className="h-4 w-4" />
        ) : (
          <MdVisibility className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export function Auth3({
  socialProviders = DEFAULT_SOCIAL_PROVIDERS,
  dividerText = "or continue with email",
  signInLabel = "Authenticate & Enter",
  signUpLabel = "Create Account & Register",
  forgotPasswordText = "Forgot password?",
  onForgotPassword,
  onSignIn,
  onSignUp,
  termsHref = "#",
  privacyHref = "#",
}: Auth3Props) {
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");

  const handleSocialSignIn = async (providerId: string) => {
    if (providerId === "google" || providerId === "github") {
      try {
        const callbackURL =
          typeof window !== "undefined"
            ? `${window.location.origin}/dashboard`
            : "/dashboard";

        await authClient.signIn.social({
          provider: providerId,
          callbackURL,
        });
      } catch (err) {
        console.error(`${providerId} sign in error:`, err);
      }
    }
  };

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSignIn?.(siEmail, siPassword);
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSignUp?.(suName, suEmail, suPassword);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        {/* Terminal Title Pill (Reference Image 2 Layout) */}
        <div className="flex flex-col items-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold text-white bg-blue-600 rounded-none border border-blue-500 shadow-sm">
            &gt; access_portal
          </div>
          <p className="text-xs font-mono text-slate-400 mt-2 text-center">
            A secure, unified entry point for CodeHive 2K26.
          </p>
        </div>

        {/* Centered Precision Terminal Card (Reference Image 2 Layout) */}
        <div className="bg-[#060D1A] border border-[#152A54] rounded-none shadow-2xl overflow-hidden">
          <Tabs defaultValue="signin" className="w-full">
            {/* Header Tab List */}
            <TabsList className="bg-[#030712] border-b border-[#152A54] grid h-12 w-full grid-cols-2 rounded-none p-1 gap-1 border-x-0 border-t-0">
              <TabsTrigger
                value="signin"
                className="h-full rounded-none border border-transparent font-mono text-xs uppercase tracking-wider font-semibold text-slate-400 hover:text-white transition-all shadow-none data-[state=active]:border-[#152A54] data-[state=active]:bg-[#0B162C] data-[state=active]:text-white"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="h-full rounded-none border border-transparent font-mono text-xs uppercase tracking-wider font-semibold text-slate-400 hover:text-white transition-all shadow-none data-[state=active]:border-[#152A54] data-[state=active]:bg-[#0B162C] data-[state=active]:text-white"
              >
                Create Account
              </TabsTrigger>
            </TabsList>

            {/* Sign In Content */}
            <TabsContent value="signin" className="p-6 space-y-5 outline-none">
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Social Auth Providers */}
                <div className="grid grid-cols-2 gap-3">
                  {socialProviders.map((provider) => (
                    <Button
                      key={provider.id}
                      variant="ghost"
                      type="button"
                      className="h-10 w-full gap-2.5 rounded-none border border-[#152A54] bg-[#030712] hover:bg-[#0B162C] hover:border-blue-500/50 text-white text-xs font-mono font-medium shadow-none transition-colors cursor-pointer"
                      onClick={provider.onClick || (() => handleSocialSignIn(provider.id))}
                    >
                      {provider.icon}
                      <span>{provider.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-[#152A54]" />
                  <span className="text-slate-500 shrink-0 font-mono text-[11px] uppercase tracking-wider">
                    {dividerText}
                  </span>
                  <div className="flex-1 h-px bg-[#152A54]" />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="auth3-si-email"
                    className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold block"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <MdEmail className="text-slate-500 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="auth3-si-email"
                      type="email"
                      placeholder="participant@domain.edu"
                      value={siEmail}
                      onChange={(e) => setSiEmail(e.target.value)}
                      autoComplete="email"
                      className="h-10 w-full rounded-none border border-[#152A54] bg-[#03060E] dark:bg-[#03060E] pl-10 pr-3 text-xs font-mono text-white placeholder:text-slate-600 shadow-none outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password & Forgot link */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="auth3-si-password"
                      className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold"
                    >
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-blue-400 hover:text-blue-300 font-mono text-xs hover:underline transition-colors cursor-pointer font-normal"
                    >
                      {forgotPasswordText}
                    </button>
                  </div>
                  <PasswordInput
                    id="auth3-si-password"
                    placeholder="••••••••••"
                    value={siPassword}
                    onChange={setSiPassword}
                    autoComplete="current-password"
                  />
                </div>

                {/* High-Contrast CTA Button (Reference Image 2 layout) */}
                <Button
                  type="submit"
                  className="h-11 w-full gap-2 rounded-none font-mono text-xs uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-950/50 transition-colors cursor-pointer border border-blue-500 mt-2"
                >
                  {signInLabel}
                  <MdArrowForward className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            {/* Create Account Content */}
            <TabsContent value="signup" className="p-6 space-y-5 outline-none">
              {/* Social Auth Providers */}
              <div className="grid grid-cols-2 gap-3">
                {socialProviders.map((provider) => (
                  <Button
                    key={provider.id}
                    variant="ghost"
                    type="button"
                    className="h-10 w-full gap-2.5 rounded-none border border-[#152A54] bg-[#030712] hover:bg-[#0B162C] hover:border-blue-500/50 text-white text-xs font-mono font-medium shadow-none transition-colors cursor-pointer"
                    onClick={provider.onClick}
                  >
                    {provider.icon}
                    <span>{provider.label}</span>
                  </Button>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-[#152A54]" />
                <span className="text-slate-500 shrink-0 font-mono text-[11px] uppercase tracking-wider">
                  {dividerText}
                </span>
                <div className="flex-1 h-px bg-[#152A54]" />
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Full name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="auth3-su-name"
                    className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold block"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <MdPerson className="text-slate-500 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="auth3-su-name"
                      type="text"
                      placeholder="Alex Mercer"
                      value={suName}
                      onChange={(e) => setSuName(e.target.value)}
                      autoComplete="name"
                      className="h-10 w-full rounded-none border border-[#152A54] bg-[#03060E] dark:bg-[#03060E] pl-10 pr-3 text-xs font-mono text-white placeholder:text-slate-600 shadow-none outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Work email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="auth3-su-email"
                    className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold block"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <MdEmail className="text-slate-500 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="auth3-su-email"
                      type="email"
                      placeholder="alex@college.edu"
                      value={suEmail}
                      onChange={(e) => setSuEmail(e.target.value)}
                      autoComplete="email"
                      className="h-10 w-full rounded-none border border-[#152A54] bg-[#03060E] dark:bg-[#03060E] pl-10 pr-3 text-xs font-mono text-white placeholder:text-slate-600 shadow-none outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="auth3-su-password"
                    className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold block"
                  >
                    Password
                  </Label>
                  <PasswordInput
                    id="auth3-su-password"
                    placeholder="Min 8 characters"
                    value={suPassword}
                    onChange={setSuPassword}
                    autoComplete="new-password"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="h-11 w-full gap-2 rounded-none font-mono text-xs uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-950/50 transition-colors cursor-pointer border border-blue-500 mt-2"
                >
                  {signUpLabel}
                  <MdArrowForward className="h-4 w-4" />
                </Button>

                <p className="text-slate-500 text-center font-mono text-[11px] leading-relaxed pt-1">
                  By registering you agree to the{" "}
                  <a
                    href={termsHref}
                    className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href={privacyHref}
                    className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Auth3;
