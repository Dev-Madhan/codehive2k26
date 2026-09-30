"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRegistration } from "@/actions/registration";

interface RegistrationFormProps {
  eventId: string;
  eventName: string;
  userId?: string;
  defaultEmail?: string;
  defaultName?: string;
}

export function RegistrationForm({
  eventId,
  eventName,
  userId = "user_placeholder_session_id",
  defaultEmail = "",
  defaultName = "",
}: RegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    registrationNumber: string;
    qrToken: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: defaultName,
    email: defaultEmail,
    phone: "",
    college: "",
    department: "",
    year: "3",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await createRegistration(userId, {
      eventId,
      ...formData,
      isTeam: false,
    });

    setLoading(false);

    if (res.success) {
      setSuccessData(res.data);
    } else {
      setError(res.error.message);
    }
  };

  if (successData) {
    return (
      <div className="rounded-xl border border-cyan/40 bg-surface p-8 text-center space-y-4">
        <div className="inline-flex size-14 items-center justify-center rounded-full bg-cyan/10 text-cyan text-2xl font-bold">
          ✓
        </div>
        <h3 className="text-2xl font-bold text-foreground">Registration Successful!</h3>
        <p className="text-sm text-muted">
          You are registered for <strong>{eventName}</strong>. A confirmation email with your QR code has been dispatched.
        </p>
        <div className="inline-block rounded-lg border border-border bg-background p-4 text-center">
          <span className="text-xs text-muted">Registration ID</span>
          <p className="text-xl font-mono font-bold text-cyan mt-1">
            {successData.registrationNumber}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      {error && (
        <div className="p-3 rounded-lg border border-error/40 bg-error/10 text-xs text-error">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="reg-name" className="text-sm font-medium text-foreground">
          Full Name
        </Label>
        <Input
          id="reg-name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Jane Doe"
          className="border-2 border-border focus-visible:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="reg-email" className="text-sm font-medium text-foreground">
            Email Address
          </Label>
          <Input
            id="reg-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@example.com"
            className="border-2 border-border focus-visible:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-phone" className="text-sm font-medium text-foreground">
            Mobile Number
          </Label>
          <Input
            id="reg-phone"
            type="tel"
            required
            pattern="[6-9][0-9]{9}"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="9876543210"
            className="border-2 border-border focus-visible:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="reg-college" className="text-sm font-medium text-foreground">
            College / Institution
          </Label>
          <Input
            id="reg-college"
            required
            value={formData.college}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            placeholder="Engineering College"
            className="border-2 border-border focus-visible:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-year" className="text-sm font-medium text-foreground">
            Year of Study
          </Label>
          <Input
            id="reg-year"
            required
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="1st / 2nd / 3rd / 4th"
            className="border-2 border-border focus-visible:border-primary"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-dept" className="text-sm font-medium text-foreground">
          Department
        </Label>
        <Input
          id="reg-dept"
          required
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          placeholder="Computer Science & Engineering"
          className="border-2 border-border focus-visible:border-primary"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-4 border-2 border-primary bg-primary hover:bg-primary-hover text-white cursor-pointer font-semibold"
      >
        {loading ? "Processing Registration..." : "Confirm & Register"}
      </Button>
    </form>
  );
}

export default RegistrationForm;
