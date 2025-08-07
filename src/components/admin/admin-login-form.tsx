"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { clientLogin as login } from "@/lib/auth-client";

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

const MOCK_ADMIN_EMAIL = "admin@astralcore.io";

export function AdminLoginForm({ onLoginSuccess }: { onLoginSuccess: (email: string) => void }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: MOCK_ADMIN_EMAIL,
      password: "admin", // Pre-fill for demo purposes
    },
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setIsLoading(true);
    
    const { error } = await login(values);

    if (error) {
       toast({
        title: "Login Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      sessionStorage.setItem('loggedInEmail', values.email);
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the AstralCore AI panel.",
      });
      onLoginSuccess(values.email);
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>AstralCore AI Access</CardTitle>
        <CardDescription>
          Please provide administrator credentials to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Authorize
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
