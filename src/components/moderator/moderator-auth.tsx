"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeratorProvider } from "@/contexts/ModeratorContext";
import { ModeratorLoginForm } from "./moderator-login-form";
import { UserProvider } from "@/contexts/UserContext";

export function ModeratorAuth({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = React.useState<"loading" | "authed" | "unauthed">("loading");
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const loggedInEmail = sessionStorage.getItem('loggedInEmail');
    if (loggedInEmail === 'moderator@astralcore.io') {
      setAuthStatus("authed");
      setUser({ id: 'mock-moderator-id', email: loggedInEmail });
    } else {
      setAuthStatus("unauthed");
    }
  }, []);

  const handleLoginSuccess = (email: string) => {
    setUser({ id: 'mock-moderator-id', email });
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
            Please wait while we check your moderator permissions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (authStatus === "authed") {
    // For the mock app, moderators have all permissions
    return (
      <UserProvider value={{ user }}>
        <ModeratorProvider permissions={{ customer_support: true, user_verification: true, deposit_approval: true }}>
          {children}
        </ModeratorProvider>
      </UserProvider>
    );
  }

  return <ModeratorLoginForm onLoginSuccess={handleLoginSuccess} />;
}
