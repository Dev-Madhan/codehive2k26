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
      <MdLock className="text-[#666666] absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 pointer-events-none" />
      <Input
        id={id}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-none border-2 border-[#333] bg-[#1e1e1e] dark:bg-[#1e1e1e] pl-10 pr-10 text-sm text-white placeholder:text-[#555555] shadow-none outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 transition-colors"
        required
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-[#777777] hover:text-white absolute top-1/2 right-3 -translate-y-1/2 transition-colors cursor-pointer"
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
  dividerText = "or",
  signInLabel = "Sign in",
  signUpLabel = "Create account",
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

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSignIn?.(siEmail, siPassword);
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSignUp?.(suName, suEmail, suPassword);
  };

  return (
    <div className="bg-black min-h-screen w-full flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        {/* Exact Auth Card container matching Image 1 */}
        <div className="bg-[#141414] border-2 border-[#262626] rounded-none shadow-2xl overflow-hidden">
          <Tabs defaultValue="signin" className="w-full">
            {/* Header tab list */}
            <TabsList className="bg-[#1a1a1a] border-b border-[#262626] grid h-12 w-full grid-cols-2 rounded-none p-1 gap-1 border-x-0 border-t-0">
              <TabsTrigger
                value="signin"
                className="h-full rounded-none border border-transparent text-sm font-medium text-[#737373] hover:text-[#a3a3a3] transition-all shadow-none data-active:border-[#444444] data-active:bg-[#242424] data-active:text-white dark:data-active:border-[#444444] dark:data-active:bg-[#242424] dark:data-active:text-white data-[state=active]:border-[#444444] data-[state=active]:bg-[#242424] data-[state=active]:text-white dark:data-[state=active]:border-[#444444] dark:data-[state=active]:bg-[#242424] dark:data-[state=active]:text-white"
              >
                Sign in
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="h-full rounded-none border border-transparent text-sm font-medium text-[#737373] hover:text-[#a3a3a3] transition-all shadow-none data-active:border-[#444444] data-active:bg-[#242424] data-active:text-white dark:data-active:border-[#444444] dark:data-active:bg-[#242424] dark:data-active:text-white data-[state=active]:border-[#444444] data-[state=active]:bg-[#242424] data-[state=active]:text-white dark:data-[state=active]:border-[#444444] dark:data-[state=active]:bg-[#242424] dark:data-[state=active]:text-white"
              >
                Create account
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
                      className="h-10 w-full gap-2.5 rounded-none border-2 border-[#333] bg-[#1e1e1e] hover:bg-[#262626] text-white hover:text-white text-sm font-medium shadow-none transition-colors cursor-pointer"
                      onClick={provider.onClick}
                    >
                      {provider.icon}
                      {provider.label}
                    </Button>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-[#262626]" />
                  <span className="text-[#666666] shrink-0 text-xs font-normal">
                    {dividerText}
                  </span>
                  <div className="flex-1 h-px bg-[#262626]" />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="auth3-si-email"
                    className="text-sm font-medium text-white block"
                  >
                    Email address
                  </Label>
                  <div className="relative">
                    <MdEmail className="text-[#666666] absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="auth3-si-email"
                      type="email"
                      placeholder="you@company.com"
                      value={siEmail}
                      onChange={(e) => setSiEmail(e.target.value)}
                      autoComplete="email"
                      className="h-10 w-full rounded-none border-2 border-[#333] bg-[#1e1e1e] dark:bg-[#1e1e1e] pl-10 pr-3 text-sm text-white placeholder:text-[#555555] shadow-none outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password & Forgot link */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="auth3-si-password"
                      className="text-sm font-medium text-white"
                    >
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-primary hover:text-primary-hover text-sm hover:underline transition-colors cursor-pointer font-normal"
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="h-10 w-full gap-2 rounded-none font-semibold text-primary-foreground bg-primary hover:bg-primary-hover shadow-none transition-colors cursor-pointer border-2 border-primary mt-2"
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
                    className="h-10 w-full gap-2.5 rounded-none border-0 border-transparent bg-[#1e1e1e] hover:bg-[#262626] text-white hover:text-white text-sm font-medium shadow-none transition-colors cursor-pointer"
                    onClick={provider.onClick}
                  >
                    {provider.icon}
                    {provider.label}
                  </Button>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-[#262626]" />
                <span className="text-[#666666] shrink-0 text-xs font-normal">
                  {dividerText}
                </span>
                <div className="flex-1 h-px bg-[#262626]" />
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Full name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="auth3-su-name"
                    className="text-sm font-medium text-white block"
                  >
                    Full name
                  </Label>
                  <div className="relative">
                    <MdPerson className="text-[#666666] absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="auth3-su-name"
                      type="text"
                      placeholder="Jane Smith"
                      value={suName}
                      onChange={(e) => setSuName(e.target.value)}
                      autoComplete="name"
                      className="h-10 w-full rounded-none border-2 border-[#333] bg-[#1e1e1e] dark:bg-[#1e1e1e] pl-10 pr-3 text-sm text-white placeholder:text-[#555555] shadow-none outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Work email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="auth3-su-email"
                    className="text-sm font-medium text-white block"
                  >
                    Email address
                  </Label>
                  <div className="relative">
                    <MdEmail className="text-[#666666] absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="auth3-su-email"
                      type="email"
                      placeholder="you@company.com"
                      value={suEmail}
                      onChange={(e) => setSuEmail(e.target.value)}
                      autoComplete="email"
                      className="h-10 w-full rounded-none border-2 border-[#333] bg-[#1e1e1e] dark:bg-[#1e1e1e] pl-10 pr-3 text-sm text-white placeholder:text-[#555555] shadow-none outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="auth3-su-password"
                    className="text-sm font-medium text-white block"
                  >
                    Password
                  </Label>
                  <PasswordInput
                    id="auth3-su-password"
                    placeholder="At least 8 characters"
                    value={suPassword}
                    onChange={setSuPassword}
                    autoComplete="new-password"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="h-10 w-full gap-2 rounded-none font-semibold text-primary-foreground bg-primary hover:bg-primary-hover shadow-none transition-colors cursor-pointer border-2 border-primary mt-2"
                >
                  {signUpLabel}
                  <MdArrowForward className="h-4 w-4" />
                </Button>

                <p className="text-[#737373] text-center text-xs leading-relaxed pt-1">
                  By creating an account you agree to our{" "}
                  <a
                    href={termsHref}
                    className="text-primary hover:text-primary-hover hover:underline transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href={privacyHref}
                    className="text-primary hover:text-primary-hover hover:underline transition-colors"
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
