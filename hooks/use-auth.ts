"use client";

import { useState } from "react";
import { Role } from "@prisma/client";

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export function useAuth() {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(false);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "SUPER_ADMIN" || user?.role === "ORGANIZER",
    isStaff: user?.role === "STAFF" || user?.role === "ORGANIZER" || user?.role === "SUPER_ADMIN",
    loading,
    setUser,
  };
}
