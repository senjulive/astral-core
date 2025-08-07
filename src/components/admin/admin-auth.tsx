"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminProvider } from "@/contexts/AdminContext";
import { AdminLoginForm } from "./admin-login-form";
import { UserProvider } from "@/contexts/UserContext";

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = React.useState<"loading" | "authed" | "unauthed">("loading");
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    // Check session storage to see if admin was logged in
    const loggedInEmail = sessionStorage.getItem('loggedInEmail');
    if (loggedInEmail === 'admin@astralcore.io') {
      setAuthStatus("authed");
      setUser({ id: 'mock-admin-id', email: loggedInEmail });
    } else {
      setAuthStatus("unauthed");
    }
  }, []);


  const handleLoginSuccess = (email: string) => {
    setUser({ id: 'mock-admin-id', email });
    setAuthStatus("authed");
  };

  if (authStatus === "loading") {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <CardTitle>Verifying Access</CardTitle>
                <CardDescription>
                Please wait while we check your credentials.
                </CardDescription>
            </CardHeader>
        </Card>
    );
  }

  if (authStatus === "authed") {
    return (
      <UserProvider value={{ user }}>
        <AdminProvider>{children}</AdminProvider>
      </UserProvider>
    );
  }

  return <AdminLoginForm onLoginSuccess={handleLoginSuccess} />;
}
